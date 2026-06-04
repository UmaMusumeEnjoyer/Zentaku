import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService, socketService } from '@umamusumeenjoyer/shared-logic';
import type { UseChatMessengerReturn, ChatRoom, Message, User } from './ChatApp.types';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';

const removeZ = (dateInput: any) => typeof dateInput === 'string' ? dateInput.replace(/Z$/, '') : dateInput;

const formatMessageTime = (dateInput: string | number | Date | undefined) => {
  if (!dateInput) return moment().format('DD/MM/YYYY HH:mm');
  const date = moment(removeZ(dateInput));
  const today = moment().startOf('day');

  if (date.isSame(today, 'd')) {
    return `Today at ${date.format('HH:mm')}`;
  } else {
    return date.format('DD/MM/YYYY HH:mm');
  }
};

export const useChatMessenger = (): UseChatMessengerReturn => {
  const { user } = useAuth();
  
  const currentUser: User = {
    id: user?.id ? String(user.id) : 'unknown',
    name: user?.displayName || user?.username || 'Guest',
    avatar: user?.avatar || 'https://i.pravatar.cc/150',
    status: 'online'
  };

  const [chatRooms, setChatRooms] = useState<ChatRoom[] | null>(null);
  const [privateRooms, setPrivateRooms] = useState<ChatRoom[] | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialChannelId = queryParams.get('channelId');

  // Rate Limiting for Send Message (5 msgs/sec)
  const messageTimestamps = useRef<number[]>([]);

  // 1. Connect Socket and Fetch Rooms
  useEffect(() => {
    // Connect socket if not already connected (shared with FloatingChat)
    if (!socketService.isConnected) {
      socketService.connect();
    }

    const fetchRooms = async () => {
      try {
        setLoading(true);
        // Fetch Community Channels
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
              members: [], 
              messages: [],
            });
          });
        }
        setChatRooms(allChannels);

        // Fetch Private Channels (DMs)
        const privateRes = await chatService.getPrivateChannels();
        const privateData = Array.isArray(privateRes.data) ? privateRes.data : privateRes.data?.data || [];
        const allPrivate: ChatRoom[] = [];

        privateData.forEach((ch: any) => {
          // Identify the other participant
          const otherParticipant = ch.participants?.find((p: any) => p.user?.id !== currentUser.id)?.user;
          const roomName = otherParticipant?.displayName || otherParticipant?.username || `DM ${ch.id}`;
          const avatar = otherParticipant?.avatar || 'https://i.pravatar.cc/150';

          allPrivate.push({
            id: String(ch.id),
            type: 'dm',
            name: roomName,
            avatar,
            members: [], 
            messages: [],
          });
        });
        setPrivateRooms(allPrivate);

        // Set initial active room if not set
        if (initialChannelId) {
          setActiveRoomId(initialChannelId);
        } else if (allPrivate.length > 0) {
          setActiveRoomId(allPrivate[0].id);
        } else if (allChannels.length > 0) {
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

    // No disconnect on unmount – socket is shared with FloatingChat
  }, [initialChannelId]);

  // Ref to track which rooms have fetched their initial messages
  const loadedRoomsRef = useRef<Set<string>>(new Set());

  // 2. Fetch Messages for Active Room
  useEffect(() => {
    if (!activeRoomId) return;

    const isCommunity = chatRooms?.some(r => r.id === activeRoomId);
    
    // Prevent infinite loop if the room has 0 messages
    if (loadedRoomsRef.current.has(activeRoomId)) return;

    const fetchMessages = async () => {
      try {
        const msgRes = await chatService.getChannelMessages(activeRoomId, { limit: 20 });
        const messagesData = Array.isArray(msgRes.data) ? msgRes.data : msgRes.data?.items || msgRes.data?.data || [];
        const nextCursor = msgRes.data?.nextCursor || null;
        const hasMore = !!msgRes.data?.hasMore;
        
        const mappedMessages: Message[] = messagesData.reverse().map((m: any) => ({
          id: String(m.id),
          sender: {
            id: String(m.sender?.id || m.senderId || 'unknown'),
            name: m.sender?.displayName || m.sender?.username || 'Unknown User',
            avatar: m.sender?.avatar || 'https://i.pravatar.cc/150',
            status: 'online'
          },
          content: m.content || '',
          timestamp: formatMessageTime(m.createdAt || Date.now())
        }));

        if (isCommunity) {
          setChatRooms(prev => prev?.map(room => room.id === activeRoomId ? { ...room, messages: mappedMessages, nextCursor, hasMore } : room) || null);
        } else {
          setPrivateRooms(prev => prev?.map(room => room.id === activeRoomId ? { ...room, messages: mappedMessages, nextCursor, hasMore } : room) || null);
        }
        
        // Mark as loaded successfully
        loadedRoomsRef.current.add(activeRoomId);

      } catch (err) {
        console.error('Failed to fetch messages for room', activeRoomId, err);
      }
    };

    fetchMessages();
  }, [activeRoomId, chatRooms, privateRooms]);

  // Join and Leave Room via Socket
  useEffect(() => {
    if (!activeRoomId) return;
    
    // Join new room
    socketService.emit('room.join', { channelId: activeRoomId });

    return () => {
      // Leave room on unmount or activeRoomId change
      socketService.emit('room.leave', { channelId: activeRoomId });
    };
  }, [activeRoomId]);

  // 3. Socket Event Listeners
  useEffect(() => {
    const unsubMessageCreated = socketService.on('message.created', (data: any) => {
      const channelId = String(data.channelId);
      
      const incomingMsg: Message = {
        id: String(data.id),
        sender: {
          id: String(data.sender?.id || data.senderId),
          name: data.sender?.displayName || data.sender?.username || 'User',
          avatar: data.sender?.avatar || 'https://i.pravatar.cc/150',
          status: 'online'
        },
        content: data.content,
        timestamp: formatMessageTime(data.createdAt || Date.now())
      };

      // Update the correct room
      const updateRoom = (rooms: ChatRoom[] | null) => {
        if (!rooms) return null;
        return rooms.map(room => {
          if (room.id === channelId) {
            // 1. Remove temp optimistic message if it matches this incoming socket message
            let newMessages = room.messages.filter(m => {
              const isTempMatch = m.id.startsWith('temp-') && m.content === incomingMsg.content && m.sender.id === incomingMsg.sender.id;
              return !isTempMatch;
            });

            // 2. Add the real incoming message
            newMessages.push(incomingMsg);

            // 3. Absolute Unique Filter (prevent React "same key" error)
            const uniqueIds = new Set();
            newMessages = newMessages.filter(m => {
              if (uniqueIds.has(m.id)) return false;
              uniqueIds.add(m.id);
              return true;
            });

            return { ...room, messages: newMessages };
          }
          return room;
        });
      };

      setChatRooms(prev => updateRoom(prev));
      setPrivateRooms(prev => updateRoom(prev));
      
      if (channelId === activeRoomId) {
        // Mark as read
        socketService.emit('read.cursor.update', { channelId, lastReadMessageId: data.id });
      }
    });

    const unsubTypingStarted = socketService.on('typing.started', (data: any) => {
      if (String(data.channelId) === activeRoomId && String(data.userId) !== currentUser.id) {
        setTypingUsers(prev => [...new Set([...prev, String(data.userId)])]);
      }
    });

    const unsubTypingStopped = socketService.on('typing.stopped', (data: any) => {
      if (String(data.channelId) === activeRoomId) {
        setTypingUsers(prev => prev.filter(id => id !== String(data.userId)));
      }
    });

    return () => {
      unsubMessageCreated();
      unsubTypingStarted();
      unsubTypingStopped();
    };
  }, [activeRoomId]);

  // Helper to find the active room from either list
  const activeRoom = chatRooms?.find(r => r.id === activeRoomId) || privateRooms?.find(r => r.id === activeRoomId) || null;

  const sendMessage = useCallback(async (content: string) => {
    if (!activeRoomId || !content.trim()) return;

    // Rate Limit Check
    const now = Date.now();
    messageTimestamps.current = messageTimestamps.current.filter(t => now - t < 1000);
    if (messageTimestamps.current.length >= 5) {
      alert("Rate limit exceeded: You can only send 5 messages per second.");
      return;
    }
    messageTimestamps.current.push(now);
    
    const tempId = `temp-${Date.now()}`;
    const newMessage: Message = {
      id: tempId,
      sender: currentUser,
      content,
      timestamp: formatMessageTime(Date.now())
    };

    // Optimistic UI Update
    const updateOptimistic = (rooms: ChatRoom[] | null) => {
      return rooms?.map(room => 
        room.id === activeRoomId 
          ? { ...room, messages: [...room.messages, newMessage] } 
          : room
      ) || null;
    };

    if (chatRooms?.some(r => r.id === activeRoomId)) {
      setChatRooms(updateOptimistic);
    } else {
      setPrivateRooms(updateOptimistic);
    }

    try {
      // Send via REST API
      const response = await chatService.sendMessage(activeRoomId, { content });
      
      // Update temp id to real id if possible
      const realData = response.data?.data || response.data;
      if (realData?.id) {
        const updateRealId = (rooms: ChatRoom[] | null) => {
          return rooms?.map(r => r.id === activeRoomId ? {
            ...r,
            messages: r.messages.map(m => m.id === tempId ? { ...m, id: String(realData.id) } : m)
          } : r) || null;
        };
        
        if (chatRooms?.some(r => r.id === activeRoomId)) {
          setChatRooms(updateRealId);
        } else {
          setPrivateRooms(updateRealId);
        }
      }
      socketService.emit('read.cursor.update', { channelId: activeRoomId, lastReadMessageId: realData?.id || tempId });
    } catch (err: any) {
      console.error('Failed to send message', err);
      alert(err.response?.data?.error?.message || 'Failed to send message');
    }
  }, [activeRoomId, chatRooms, privateRooms]);

  const loadMoreMessages = useCallback(async () => {
    if (!activeRoom || !activeRoom.hasMore || !activeRoom.nextCursor || isLoadingMore) return;
    
    try {
      setIsLoadingMore(true);
      const msgRes = await chatService.getChannelMessages(activeRoom.id, { cursor: activeRoom.nextCursor, limit: 20 });
      const messagesData = Array.isArray(msgRes.data) ? msgRes.data : msgRes.data?.items || msgRes.data?.data || [];
      
      const mappedMessages: Message[] = messagesData.reverse().map((m: any) => ({
        id: String(m.id),
        sender: {
          id: String(m.sender?.id || m.senderId || 'unknown'),
          name: m.sender?.displayName || m.sender?.username || 'Unknown User',
          avatar: m.sender?.avatar || 'https://i.pravatar.cc/150',
          status: 'online'
        },
        content: m.content || '',
        timestamp: formatMessageTime(m.createdAt || Date.now())
      }));

      const nextCursor = msgRes.data?.nextCursor || null;
      const hasMore = !!msgRes.data?.hasMore;

      const updateRoom = (rooms: ChatRoom[] | null) => {
        return rooms?.map(room => 
          room.id === activeRoom.id 
            ? { ...room, messages: [...mappedMessages, ...room.messages], nextCursor, hasMore } 
            : room
        ) || null;
      };

      if (chatRooms?.some(r => r.id === activeRoom.id)) {
        setChatRooms(updateRoom);
      } else {
        setPrivateRooms(updateRoom);
      }
    } catch (err) {
      console.error('Failed to load more messages', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeRoom, chatRooms, privateRooms, isLoadingMore]);

  return { chatRooms, privateRooms, activeRoom, loading, error, setActiveRoomId, sendMessage, typingUsers, loadMoreMessages, isLoadingMore };
};