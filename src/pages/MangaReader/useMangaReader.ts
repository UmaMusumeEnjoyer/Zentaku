import { useState, useEffect, useCallback } from 'react';
import type{ UseMangaReaderReturn, ChapterInfo, MangaPage, ReaderSettings, MangaDetailsPlaceholder } from './MangaReader.types';

const MOCK_MANGA_DETAILS: MangaDetailsPlaceholder = {
  id: 'manga-1',
  title: 'Chưa tày đâu em',
  coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmrwTvm7P0VehBV9Dwe0rAAtugA90C8r3x_g&s',
  season: 'Winter 2025',
  studio: 'MAPPA',
  status: 'Releasing',
  format: 'Manga',
  genres: ['Action', 'Fantasy', 'Supernatural', 'Historical'],
  description: 'In a world where "talents" can be derived from past lives...',
  totalChapters: 120,
  readChapters: 116,
};

// SỬA ĐỔI TẠI ĐÂY: Logic chẵn/lẻ cho URL
const MOCK_PAGES: MangaPage[] = Array.from({ length: 10 }).map((_, index) => {
  const pageNumber = index + 1;
  const isOdd = pageNumber % 2 !== 0;

  return {
    id: `page-${index}`,
    // Nếu là trang lẻ -> dùng link cũ
    // Nếu là trang chẵn -> dùng link placeholder mới (màu xám)
    url: isOdd 
      ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmrwTvm7P0VehBV9Dwe0rAAtugA90C8r3x_g&s'
      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLei_ChHG0-sbNfee7zrultlliVp5DMcRf6A&s', 
    pageNumber: pageNumber,
  };
});

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  
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
        setCurrentPage(1);
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

  const goToPage = useCallback((pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pages.length) {
      setCurrentPage(pageNumber);
    }
  }, [pages.length]);

  const nextChapter = useCallback(() => {
    console.log('Next chapter');
  }, []);

  const prevChapter = useCallback(() => {
    console.log('Previous chapter');
  }, []);

  return {
    isLoading,
    error,
    chapterInfo,
    mangaDetails: MOCK_MANGA_DETAILS,
    pages,
    settings,
    currentPage,
    actions: {
      toggleRightSidebar,
      toggleLeftSidebar,
      updateSetting,
      nextChapter,
      prevChapter,
      goToPage,
    },
  };
};