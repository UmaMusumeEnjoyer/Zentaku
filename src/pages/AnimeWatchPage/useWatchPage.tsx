// useWatchPage.ts
import { useState, useEffect } from 'react';
import type { PageData, UseWatchPageReturn } from './WatchPage.types';

// Mock Fetch function (Giả định import từ service)
const fetchWatchPageData = async (): Promise<PageData> => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
  return {
    anime: {
      id: '1',
      title: 'Watching Journal with Witch',
      rating: 8.5,
      posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzsBf6oAsKl7r02ZkfTyhKc1GcqaAMs05O6E92r05ZM-STVCU7_zjDnM6K4Zalg6zr4Y8ZYY0Bf4BgsboAPtcpRXh2hAbEj1m3orhrzchiq87Ev1-dywEQWPtYWGzMXm1qlzwxOZGXLnE6wBsxjAIuX4ZU3jTRufZrvbOlFYRckxwAEAs34fOilj4WTWV7Ngln5WQGNn8QuoRy9hum7vamL12GPHwAYgtUfvVWxLvJRDAoiCGTO8o2fokCc2yo-XdDPIex0Pc8tHc',
      tags: ['Slice of Life', 'Magic', 'Relaxing', 'Fantasy'],
      synopsis: 'In a world where magic is woven into everyday life, a young witch named Elara journals her daily discoveries...'
    },
    currentEpisode: {
      id: 'ep3',
      number: 3,
      title: 'Coffee and Levitation',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgfCB5p-mLCh-9PwIrwRDBc5itK_wC2LBnl4t1tVnJ1BzBlGc6etZUN2m2MaQnUTFYhas3fNGzUZrLTXBg1_Rpfv-S5ksszivRm67ChVKGhF-I3pS23SpZFrfykrJusGjmFgPmAmXviZs7kV-N8GVr99rrcaoJp4b3xNpz2H7lJCwFovnf0rnfgjONxvXyrcXGs6mPDuWSy5_4yzRJ_b_ojPc8Rb6e2UfGDdcE__phUXQg3f8lWV4aWW_LLFnAz6P705E2jfvDmD8',
      videoUrl: ''
    },
    servers: [
      { id: 'vidstreaming', name: 'Vidstreaming', type: 'sub' },
      { id: 'douvideo', name: 'DouVideo', type: 'sub' },
      { id: 'vidcloud', name: 'Vidcloud', type: 'sub' }
    ],
    relatedEpisodes: []
  };
};

export const useWatchPage = (): UseWatchPageReturn => {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeServerId, setActiveServerId] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const initData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWatchPageData();
        if (isMounted) {
          setData(response);
          // Set default active server
          if (response.servers.length > 0) {
            setActiveServerId(response.servers[0].id);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load anime data. Please try again later.');
          console.error(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleServerChange = (serverId: string) => {
    setActiveServerId(serverId);
  };

  return {
    loading,
    error,
    data,
    activeServerId,
    handleServerChange
  };
};