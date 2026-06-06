import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService, socketService } from '@umamusumeenjoyer/shared-logic';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';

// ─── Types ───
export interface FloatingUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

export interface FloatingMessage {
  id: string;
  sender: FloatingUser;
  content: string;
  timestamp: string;
  rawTimestamp?: number; // epoch ms for sorting
}

export interface FloatingRoom {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageRawTime?: number;
  messages: FloatingMessage[];
  hasMore?: boolean;
  nextCursor?: string | null;
  isLoadingMessages?: boolean;
}

export interface ChatWindowState {
  roomId: string;
  isMinimized: boolean;
}

// ─── Helpers ───
const removeZ = (dateInput: any) => typeof dateInput === 'string' ? dateInput.replace(/Z$/, '') : dateInput;

const formatMessageTime = (dateInput: string | number | Date | undefined) => {
  if (!dateInput) return moment().format('HH:mm');
  const date = moment(removeZ(dateInput));
  const today = moment().startOf('day');
  if (date.isSame(today, 'd')) {
    return `Today at ${date.format('HH:mm')}`;
  }
  return date.format('DD/MM/YYYY HH:mm');
};

const formatRelativeTime = (dateInput: string | number | Date | undefined) => {
  if (!dateInput) return '';
  const parsed = removeZ(dateInput);
  const now = Date.now();
  const time = new Date(parsed).getTime();
  const diffMs = now - time;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h`;
  return moment(parsed).format('DD/MM');
};

// ─── Hook ───
export const useFloatingChat = () => {
  const { user } = useAuth();

  const currentUser: FloatingUser = {
    id: user?.id ? String(user.id) : 'unknown',
    name: user?.displayName || user?.username || 'Guest',
    avatar: user?.avatar || 'https://i.pravatar.cc/150',
    status: 'online',
  };

  const [rooms, setRooms] = useState<FloatingRoom[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map());
  const [openWindow, setOpenWindow] = useState<ChatWindowState | null>(null);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isPulse, setIsPulse] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  // Refs
  const loadedRoomsRef = useRef<Set<string>>(new Set());
  const messageTimestamps = useRef<number[]>([]);
  const joinedRoomRef = useRef<string | null>(null);
  const roomsRef = useRef<FloatingRoom[]>([]);

  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);

  const isAuthenticated = !!user;
  const totalUnread = Array.from(unreadCounts.values()).reduce((sum, c) => sum + c, 0);

  // ─── Fetch Rooms ───
  const fetchRooms = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoadingRooms(true);
      const privateRes = await chatService.getPrivateChannels();
      const privateData = Array.isArray(privateRes.data) ? privateRes.data : privateRes.data?.data || [];

      const mapped: FloatingRoom[] = privateData.map((ch: any) => {
        const otherParticipant = ch.participants?.find((p: any) => p.user?.id !== currentUser.id)?.user;
        const roomName = otherParticipant?.displayName || otherParticipant?.username || `DM ${ch.id}`;
        const avatar = otherParticipant?.avatar || 'https://i.pravatar.cc/150';

        // Get last message info if available
        const lastMsg = ch.lastMessage;
        return {
          id: String(ch.id),
          name: roomName,
          avatar,
          lastMessage: lastMsg?.content || '',
          lastMessageTime: formatRelativeTime(lastMsg?.createdAt),
          lastMessageRawTime: lastMsg?.createdAt ? new Date(lastMsg.createdAt).getTime() : 0,
          messages: [],
        };
      });

      // Sort by last message time (newest first)
      mapped.sort((a, b) => (b.lastMessageRawTime || 0) - (a.lastMessageRawTime || 0));
      setRooms(mapped);
    } catch (err) {
      console.error('[FloatingChat] Failed to fetch rooms:', err);
    } finally {
      setIsLoadingRooms(false);
    }
  }, [isAuthenticated]);

  // ─── Fetch Messages for a Room ───
  const fetchMessagesForRoom = useCallback(async (roomId: string) => {
    if (loadedRoomsRef.current.has(roomId)) return;

    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, isLoadingMessages: true } : r));

    try {
      const msgRes = await chatService.getChannelMessages(roomId, { limit: 20 });
      // API response: { success, data: { items, nextCursor, hasMore } }
      // After apiClient: msgRes.data = { success, data: { items, ... } } OR { items, ... } depending on interceptor
      const resPayload = msgRes.data;
      const innerData = resPayload?.data || resPayload; // unwrap { success, data } wrapper if present
      const messagesData = Array.isArray(innerData) ? innerData : innerData?.items || innerData?.data || [];
      const nextCursor = innerData?.nextCursor || null;
      const hasMore = !!innerData?.hasMore;

      const mappedMessages: FloatingMessage[] = (Array.isArray(messagesData) ? messagesData : []).reverse().map((m: any) => ({
        id: String(m.id),
        sender: {
          id: String(m.sender?.id || m.senderId || 'unknown'),
          name: m.sender?.displayName || m.sender?.username || 'Unknown User',
          avatar: m.sender?.avatar || 'https://i.pravatar.cc/150',
          status: 'online' as const,
        },
        content: m.content || '',
        timestamp: formatMessageTime(m.createdAt || Date.now()),
        rawTimestamp: m.createdAt ? new Date(m.createdAt).getTime() : Date.now(),
      }));

      setRooms(prev => prev.map(r =>
        r.id === roomId
          ? { ...r, messages: mappedMessages, nextCursor, hasMore, isLoadingMessages: false }
          : r
      ));

      loadedRoomsRef.current.add(roomId);
    } catch (err) {
      console.error('[FloatingChat] Failed to fetch messages:', err);
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, isLoadingMessages: false } : r));
    }
  }, []);

  // ─── Connect Socket ───
  useEffect(() => {
    if (!isAuthenticated) return;

    // Connect socket if not already connected
    if (!socketService.isConnected) {
      socketService.connect();
    }

    fetchRooms();
  }, [isAuthenticated, fetchRooms]);

  // ─── Socket Listeners (global – listens to all rooms) ───
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubMessageCreated = socketService.on('message.created', (data: any) => {
      const channelId = String(data.channelId);

      // Validate if this message belongs to one of our private rooms
      const hasRoom = roomsRef.current.some(r => r.id === channelId);
      if (!hasRoom) return; // Ignore messages from WatchAlong or other community channels

      const incomingMsg: FloatingMessage = {
        id: String(data.id),
        sender: {
          id: String(data.sender?.id || data.senderId),
          name: data.sender?.displayName || data.sender?.username || 'User',
          avatar: data.sender?.avatar || 'https://i.pravatar.cc/150',
          status: 'online',
        },
        content: data.content,
        timestamp: formatMessageTime(data.createdAt || Date.now()),
        rawTimestamp: data.createdAt ? new Date(data.createdAt).getTime() : Date.now(),
      };

      // Update room messages if loaded
      setRooms(prev => {
        return prev.map(room => {
          if (room.id !== channelId) return room;

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

          return {
            ...room,
            messages: newMessages,
            lastMessage: incomingMsg.content,
            lastMessageTime: formatRelativeTime(Date.now()),
            lastMessageRawTime: Date.now(),
          };
        });
      });

      // Update unread count (only if this room is not the active open window, and sender is not current user)
      const isActiveWindow = openWindow?.roomId === channelId && !openWindow?.isMinimized;
      const isSelf = String(data.sender?.id || data.senderId) === currentUser.id;

      if (!isActiveWindow && !isSelf) {
        setUnreadCounts(prev => {
          const next = new Map(prev);
          next.set(channelId, (next.get(channelId) || 0) + 1);
          return next;
        });

        // Trigger pulse animation
        setIsPulse(true);
        setTimeout(() => setIsPulse(false), 1500);
      }

      // If this is the active window, mark as read
      if (isActiveWindow && !isSelf) {
        socketService.emit('read.cursor.update', { channelId, lastReadMessageId: data.id });
      }
    });

    const unsubTypingStarted = socketService.on('typing.started', (data: any) => {
      if (openWindow?.roomId === String(data.channelId) && String(data.userId) !== currentUser.id) {
        setTypingUsers(prev => [...new Set([...prev, String(data.userId)])]);
      }
    });

    const unsubTypingStopped = socketService.on('typing.stopped', (data: any) => {
      if (openWindow?.roomId === String(data.channelId)) {
        setTypingUsers(prev => prev.filter(id => id !== String(data.userId)));
      }
    });

    return () => {
      unsubMessageCreated();
      unsubTypingStarted();
      unsubTypingStopped();
    };
  }, [isAuthenticated, openWindow?.roomId, openWindow?.isMinimized, currentUser.id]);

  // ─── Join/Leave Room ───
  useEffect(() => {
    const roomId = openWindow?.roomId;
    if (!roomId) return;

    // Leave previous room
    if (joinedRoomRef.current && joinedRoomRef.current !== roomId) {
      socketService.emit('room.leave', { channelId: joinedRoomRef.current });
    }

    // Join new room
    socketService.emit('room.join', { channelId: roomId });
    joinedRoomRef.current = roomId;

    return () => {
      if (joinedRoomRef.current) {
        socketService.emit('room.leave', { channelId: joinedRoomRef.current });
        joinedRoomRef.current = null;
      }
    };
  }, [openWindow?.roomId]);

  // ─── Actions ───
  const toggleNotificationPanel = useCallback(() => {
    setIsNotificationPanelOpen(prev => !prev);
  }, []);

  const closeNotificationPanel = useCallback(() => {
    setIsNotificationPanelOpen(false);
  }, []);

  const openChatWindow = useCallback(async (roomId: string) => {
    setOpenWindow({ roomId, isMinimized: false });
    setIsNotificationPanelOpen(false);
    setTypingUsers([]);

    // Clear unread for this room
    setUnreadCounts(prev => {
      const next = new Map(prev);
      next.delete(roomId);
      return next;
    });

    // Fetch messages if not loaded
    await fetchMessagesForRoom(roomId);
  }, [fetchMessagesForRoom]);

  const closeChatWindow = useCallback(() => {
    setOpenWindow(null);
    setTypingUsers([]);
  }, []);

  const toggleMinimize = useCallback(() => {
    setOpenWindow(prev => {
      if (!prev) return null;
      return { ...prev, isMinimized: !prev.isMinimized };
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!openWindow?.roomId || !content.trim()) return;

    // Rate limit
    const now = Date.now();
    messageTimestamps.current = messageTimestamps.current.filter(t => now - t < 1000);
    if (messageTimestamps.current.length >= 5) return;
    messageTimestamps.current.push(now);

    const tempId = `temp-${Date.now()}`;
    const newMessage: FloatingMessage = {
      id: tempId,
      sender: currentUser,
      content,
      timestamp: formatMessageTime(Date.now()),
      rawTimestamp: Date.now(),
    };

    // Optimistic UI
    const roomId = openWindow.roomId;
    setRooms(prev => prev.map(r =>
      r.id === roomId
        ? {
          ...r,
          messages: [...r.messages, newMessage],
          lastMessage: content,
          lastMessageTime: formatRelativeTime(Date.now()),
          lastMessageRawTime: Date.now(),
        }
        : r
    ));

    try {
      const response = await chatService.sendMessage(roomId, { content });
      const realData = response.data?.data || response.data;
      if (realData?.id) {
        // Replace temp message id with real id to prevent socket duplicate
        setRooms(prev => prev.map(r => {
          if (r.id !== roomId) return r;

          let newMessages = r.messages.map(m =>
            m.id === tempId ? { ...m, id: String(realData.id) } : m
          );

          // Unique filter again to be 100% safe
          const uniqueIds = new Set();
          newMessages = newMessages.filter(m => {
            if (uniqueIds.has(m.id)) return false;
            uniqueIds.add(m.id);
            return true;
          });

          return { ...r, messages: newMessages };
        }));
        socketService.emit('read.cursor.update', { channelId: roomId, lastReadMessageId: realData.id });
      }
    } catch (err: any) {
      console.error('[FloatingChat] Failed to send message:', err);
    }
  }, [openWindow?.roomId, currentUser]);

  const emitTyping = useCallback((isTyping: boolean) => {
    if (!openWindow?.roomId) return;
    socketService.emit(isTyping ? 'typing.started' : 'typing.stopped', {
      channelId: openWindow.roomId,
    });
  }, [openWindow?.roomId]);

  // ─── Computed ───
  const activeRoom = rooms.find(r => r.id === openWindow?.roomId) || null;

  return {
    // State
    rooms,
    unreadCounts,
    totalUnread,
    openWindow,
    isNotificationPanelOpen,
    typingUsers,
    isPulse,
    isLoadingRooms,
    activeRoom,
    currentUser,
    isAuthenticated,

    // Actions
    toggleNotificationPanel,
    closeNotificationPanel,
    openChatWindow,
    closeChatWindow,
    toggleMinimize,
    sendMessage,
    emitTyping,
  };
};
