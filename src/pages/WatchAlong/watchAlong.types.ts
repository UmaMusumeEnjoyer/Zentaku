export type UserRole = 'owner' | 'viewer';

export interface ChatMessage {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  color?: string;
  isSystem?: boolean;
}

export interface StreamStats {
  viewers: number;
  uptime: string;
  bitrate?: string; // Owner specific
  fps?: number;    // Owner specific
}

export interface StreamInfo {
  title: string;
  hostName: string;
  category: string;
  tags: string[];
  isLive: boolean;
  avatarUrl: string; // Placeholder URL
  thumbnailUrl: string; // Placeholder URL
}

export interface SidebarItem {
  id: string;
  name: string; // Tên channel (viewer) hoặc tên setting (owner)
  icon: string; // Material icon code
  status?: 'live' | 'offline'; // Viewer specific
  detail?: string; // Owner specific (ví dụ: 'Active')
}

export interface WatchAlongData {
  streamInfo: StreamInfo;
  stats: StreamStats;
  chatMessages: ChatMessage[];
  sidebarItems: SidebarItem[]; // Dữ liệu sidebar thay đổi tùy role
}

export interface UseWatchAlongReturn {
  role: UserRole;
  data: WatchAlongData | null;
  isLoading: boolean;
  error: string | null;
  actions: {
    toggleRole: () => void;
    sendMessage: (content: string) => void;
    togglePlay: () => void;
  };
}