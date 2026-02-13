import { useState, useEffect, useCallback } from 'react';
import type{ UseWatchAlongReturn, WatchAlongData, UserRole, ChatMessage, SidebarItem } from './watchAlong.types';

// Placeholder Mock Data Service
const mockService = {
  getData: (role: UserRole): Promise<WatchAlongData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const commonChat: ChatMessage[] = [
          { id: '1', user: 'renzin64', content: 'Wait, did he just use Domain Expansion??', timestamp: '18:21', color: '#FF4500' },
          { id: '2', user: 'jafar_vii', content: 'The animation quality is insane', timestamp: '18:21', color: '#008000' },
          { id: '3', user: 'System', content: 'User AnimeLover99 subscribed!', timestamp: '18:22', isSystem: true },
        ];

        const viewerSidebar: SidebarItem[] = [
          { id: '1', name: 'Channel A', icon: 'videocam', status: 'live' },
          { id: '2', name: 'Channel B', icon: 'sports_esports', status: 'offline' },
          { id: '3', name: 'Channel C', icon: 'music_note', status: 'live' },
        ];

        const ownerSidebar: SidebarItem[] = [
          { id: 'ctrl1', name: 'Video Source', icon: 'videocam', detail: 'OBS Virtual Cam' },
          { id: 'ctrl2', name: 'Microphone', icon: 'mic', detail: 'Yeti X (85%)' },
          { id: 'ctrl3', name: 'Scene', icon: 'monitor', detail: 'Anime Watch Mode' },
          { id: 'ctrl4', name: 'Polls', icon: 'poll', detail: 'Inactive' },
        ];

        resolve({
          streamInfo: {
            title: role === 'owner' ? 'Anime Night: Jujutsu Kaisen Ep 24' : 'RERUN: Astralis vs. FURIA',
            hostName: role === 'owner' ? 'Me (Host)' : 'ESLCS',
            category: 'Anime / Action',
            tags: ['English Sub', '1080p', 'Live'],
            isLive: true,
            avatarUrl: 'https://via.placeholder.com/50',
            thumbnailUrl: 'https://via.placeholder.com/320x180',
          },
          stats: {
            viewers: 12403,
            uptime: '1:42:05',
            bitrate: '6000 kbps',
          },
          chatMessages: commonChat,
          sidebarItems: role === 'owner' ? ownerSidebar : viewerSidebar,
        });
      }, 1000); // Simulate network delay
    });
  }
};

export const useWatchAlong = (): UseWatchAlongReturn => {
  const [role, setRole] = useState<UserRole>('viewer');
  const [data, setData] = useState<WatchAlongData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mockService.getData(role);
      setData(result);
    } catch (err) {
      setError('Failed to load stream data.');
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleRole = () => {
    setRole((prev) => (prev === 'viewer' ? 'owner' : 'viewer'));
  };

  const sendMessage = (content: string) => {
    if (!data) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: role === 'owner' ? 'Host' : 'You',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: '#a970ff'
    };
    setData({ ...data, chatMessages: [...data.chatMessages, newMessage] });
  };

  const togglePlay = () => {
    console.log('Toggle play/pause placeholder');
  };

  return {
    role,
    data,
    isLoading,
    error,
    actions: {
      toggleRole,
      sendMessage,
      togglePlay,
    },
  };
};