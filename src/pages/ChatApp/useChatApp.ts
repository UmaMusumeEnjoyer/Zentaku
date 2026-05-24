import { useState, useEffect } from 'react';
import { chatService } from '@umamusumeenjoyer/shared-logic';
import type { UseChatMessengerReturn, ChatRoom, Message, User } from './ChatApp.types';

const currentUser: User = { 
  id: 'u0', 
  name: 'You', 
  avatar: 'https://i.pravatar.cc/150?u=u0', 
  status: 'online', 
  activity: 'Coding React' 
};

export const useChatMessenger = (): UseChatMessengerReturn => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[] | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch communities and channels
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const commRes = await chatService.getCommunities();
        const communities = Array.isArray(commRes.data) ? commRes.data : commRes.data?.data || [];

        const allChannels: ChatRoom[] = [];
        
        for (const comm of communities) {
          const chanRes = await chatService.getCommunityChannels(comm.id);
          const channels = Array.isArray(chanRes.data) ? chanRes.data : chanRes.data?.data || [];
          
          channels.forEach((ch: any) => {
            allChannels.push({
              id: String(ch.id),
              type: ch.type || 'server',
              name: ch.name || `Channel ${ch.id}`,
              description: ch.description || '',
              members: [currentUser], // In a real app, you'd map members from the channel/community
              messages: [], // Messages will be loaded when active
            });
          });
        }

        setChatRooms(allChannels);
        if (allChannels.length > 0) {
          setActiveRoomId(allChannels[0].id);
        }
      } catch (err: any) {
        console.error('Failed to load chat channels:', err);
        setError(new Error(err.message || 'Failed to load chats'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, []);

  // Fetch messages for active room
  useEffect(() => {
    if (!activeRoomId || !chatRooms) return;

    // Check if we already have messages loaded for this room
    const currentRoom = chatRooms.find(r => r.id === activeRoomId);
    if (currentRoom && currentRoom.messages.length > 0) return;

    const fetchMessages = async () => {
      try {
        const msgRes = await chatService.getChannelMessages(activeRoomId);
        const messagesData = Array.isArray(msgRes.data) ? msgRes.data : msgRes.data?.data || [];
        
        const mappedMessages: Message[] = messagesData.map((m: any) => ({
          id: String(m.id),
          sender: {
            id: String(m.sender?.id || m.userId || 'unknown'),
            name: m.sender?.username || m.sender?.name || 'Unknown User',
            avatar: m.sender?.avatarUrl || 'https://i.pravatar.cc/150',
            status: 'online'
          },
          content: m.content || '',
          timestamp: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        setChatRooms(prev => prev?.map(room => 
          room.id === activeRoomId 
            ? { ...room, messages: mappedMessages } 
            : room
        ) || null);

      } catch (err) {
        console.error('Failed to fetch messages for room', activeRoomId, err);
      }
    };

    fetchMessages();
  }, [activeRoomId, chatRooms]);

  const activeRoom = chatRooms?.find(room => room.id === activeRoomId) || null;

  const sendMessage = async (content: string) => {
    if (!chatRooms || !activeRoomId || !content.trim()) return;
    
    const tempId = `temp-${Date.now()}`;
    const newMessage: Message = {
      id: tempId,
      sender: currentUser,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Optimistic UI Update
    setChatRooms(prev => prev?.map(room => 
      room.id === activeRoomId 
        ? { ...room, messages: [...room.messages, newMessage] } 
        : room
    ) || null);

    try {
      // API call to actually send
      await chatService.sendMessage(activeRoomId, { content });
      
      // Optionally notify backend we've read up to this point
      chatService.updateReadCursor(activeRoomId, { messageId: tempId }).catch(() => {});
    } catch (err) {
      console.error('Failed to send message', err);
      // Could handle rolling back the optimistic update here if desired
    }
  };

  return { chatRooms, activeRoom, loading, error, setActiveRoomId, sendMessage };
};