export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  activity?: string;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: string;
  attachment?: string;
}

export interface ChatRoom {
  id: string;
  type: 'dm' | 'server';
  name: string;
  description?: string;
  avatar?: string;
  members: User[];
  messages: Message[];
  communityId?: string;
  roles?: Record<string, string>;
  unreadCount?: number;
  nextCursor?: string | null;
  hasMore?: boolean;
  isMuted?: boolean;
}

export interface UseChatMessengerReturn {
  chatRooms: ChatRoom[] | null;
  privateRooms: ChatRoom[] | null;
  activeRoom: ChatRoom | null;
  loading: boolean;
  error: Error | null;
  setActiveRoomId: (id: string) => void;
  sendMessage: (content: string) => void;
  typingUsers: string[];
  loadMoreMessages: () => Promise<void>;
  isLoadingMore: boolean;
  toggleMuteCommunity: (communityId: string, isMuted: boolean) => Promise<void>;
}