import { useState, useEffect, useCallback } from 'react';
import type{ UseMangaReaderReturn, ChapterInfo, MangaPage, ReaderSettings, MangaDetailsPlaceholder } from './MangaReader.types';

const MOCK_MANGA_DETAILS: MangaDetailsPlaceholder = {
  id: 'manga-1',
  title: 'Chưa tày đâu em',
  coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmrwTvm7P0VehBV9Dwe0rAAtugA90C8r3x_g&s', // Placeholder
  season: 'Winter 2025',
  studio: 'MAPPA',
  status: 'Releasing',
  format: 'Manga',
  genres: ['Action', 'Fantasy', 'Supernatural', 'Historical'],
  description: 'In a world where "talents" can be derived from past lives...',
  totalChapters: 120,
  readChapters: 116,
};

const MOCK_PAGES: MangaPage[] = Array.from({ length: 10 }).map((_, index) => ({
  id: `page-${index}`,
  url: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmrwTvm7P0VehBV9Dwe0rAAtugA90C8r3x_g&s`,
  pageNumber: index + 1,
}));

const MOCK_CHAPTER: ChapterInfo = {
  id: 'ch-116',
  title: 'Tày',
  mangaTitle: 'Chưa tày đâu em',
  chapterNumber: 'Chapter 116',
  uploader: 'PeppaMaster',
  groupName: 'Fandom of the Greats',
  commentCount: 10,
};

export const useMangaReader = (chapterId: string): UseMangaReaderReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterInfo, setChapterInfo] = useState<ChapterInfo | null>(null);
  const [pages, setPages] = useState<MangaPage[]>([]);
  
  const [settings, setSettings] = useState<ReaderSettings>({
    readingMode: 'long-strip',
    fitMode: 'fit-both',
    direction: 'vertical',
    isHeaderHidden: false,
    isProgressBarVisible: true,
    isRightSidebarOpen: true,
    isLeftSidebarOpen: true,
    isFullScreen: false, 
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setChapterInfo(MOCK_CHAPTER);
        setPages(MOCK_PAGES);
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [chapterId]);

  const toggleRightSidebar = useCallback(() => {
    setSettings(prev => ({ ...prev, isRightSidebarOpen: !prev.isRightSidebarOpen }));
  }, []);

  const toggleLeftSidebar = useCallback(() => {
    setSettings(prev => ({ ...prev, isLeftSidebarOpen: !prev.isLeftSidebarOpen }));
  }, []);

  const updateSetting = useCallback((key: keyof ReaderSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);



  return {
    isLoading,
    error,
    chapterInfo,
    mangaDetails: MOCK_MANGA_DETAILS,
    pages,
    settings,
    actions: {
      toggleRightSidebar,
      toggleLeftSidebar,
      updateSetting,
      nextChapter: () => {},
      prevChapter: () => {},
      goToPage: () => {},
    },
  };
};