import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mediaService } from '@umamusumeenjoyer/shared-logic';
import type { UseMangaReaderReturn, ChapterInfo, MangaPage, ReaderSettings, MangaDetailsPlaceholder } from './MangaReader.types';

export const useMangaReader = (): UseMangaReaderReturn => {
  const { id: paramId, chapterId: paramChapterId } = useParams<{ id: string; chapterId?: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [mangaDetails, setMangaDetails] = useState<MangaDetailsPlaceholder | null>(null);
  const [chapterList, setChapterList] = useState<any[]>([]);
  
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

  // 1. Fetch Manga Details and Chapters
  useEffect(() => {
    if (!paramId) {
      setError('Manga ID is missing');
      setIsLoading(false);
      return;
    }

    const fetchMangaInfo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [detailsRes, chaptersRes] = await Promise.all([
          mediaService.getMangaDetails(paramId),
          mediaService.getMangaChapters(paramId)
        ]);

        const data = detailsRes.data;
        const mappedDetails: MangaDetailsPlaceholder = {
          id: data.id || paramId,
          title: data.title?.romaji || data.title?.english || 'Unknown Title',
          coverImage: data.coverImage?.extraLarge || data.coverImage?.large || '',
          season: data.season || 'Unknown',
          studio: data.studios?.edges?.[0]?.node?.name || 'Unknown',
          status: data.status || 'Unknown',
          format: data.format || 'Manga',
          genres: data.genres || [],
          description: data.description || 'No description available.',
          totalChapters: data.chapters || 0,
          readChapters: 0,
        };
        setMangaDetails(mappedDetails);

        const chaps = Array.isArray(chaptersRes.data) ? chaptersRes.data : chaptersRes.data?.chapters || [];
        setChapterList(chaps);

        // If no chapterId is specified in the URL, and there are chapters, auto-navigate to the first one
        if (!paramChapterId && chaps.length > 0) {
          const firstChapter = chaps[0];
          navigate(`/manga/${paramId}/read/${firstChapter.id || firstChapter.number}`, { replace: true });
        }

      } catch (err: any) {
        console.error('Failed to load manga info:', err);
        setError(err.message || 'Failed to load manga info');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMangaInfo();
  }, [paramId, paramChapterId, navigate]);

  // 2. Fetch Chapter Pages when paramChapterId changes
  useEffect(() => {
    if (!paramId || !paramChapterId || chapterList.length === 0) return;

    const fetchPages = async () => {
      setIsLoading(true);
      try {
        const pagesRes = await mediaService.getMangaChapterPages(paramId, paramChapterId);
        
        // Find chapter info from the list
        const chInfo = chapterList.find((c: any) => String(c.id) === paramChapterId || String(c.number) === paramChapterId);
        if (chInfo) {
          setChapterInfo({
            id: String(chInfo.id || paramChapterId),
            title: chInfo.title || `Chapter ${chInfo.number}`,
            mangaTitle: mangaDetails?.title || '',
            chapterNumber: `Chapter ${chInfo.number}`,
            uploader: 'Zentaku',
            groupName: 'Unknown',
            commentCount: 0,
          });
        }

        const rawPages = Array.isArray(pagesRes.data) ? pagesRes.data : pagesRes.data?.pages || pagesRes.data?.images || [];
        
        const mappedPages: MangaPage[] = rawPages.map((p: any, index: number) => ({
          id: p.id || `page-${index}`,
          url: p.url || p.image || p.link || (typeof p === 'string' ? p : ''),
          pageNumber: index + 1,
        }));
        
        setPages(mappedPages);
        setCurrentPage(1);

      } catch (err: any) {
        console.error('Failed to load pages:', err);
        setError('Failed to load chapter pages.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPages();
  }, [paramId, paramChapterId, chapterList, mangaDetails]);

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
    if (!chapterList.length || !paramChapterId) return;
    const currentIndex = chapterList.findIndex(c => String(c.id) === paramChapterId || String(c.number) === paramChapterId);
    if (currentIndex >= 0 && currentIndex < chapterList.length - 1) {
      const nextCh = chapterList[currentIndex + 1];
      navigate(`/manga/${paramId}/read/${nextCh.id || nextCh.number}`);
    } else {
      console.log('Already at the last chapter');
    }
  }, [chapterList, paramChapterId, paramId, navigate]);

  const prevChapter = useCallback(() => {
    if (!chapterList.length || !paramChapterId) return;
    const currentIndex = chapterList.findIndex(c => String(c.id) === paramChapterId || String(c.number) === paramChapterId);
    if (currentIndex > 0) {
      const prevCh = chapterList[currentIndex - 1];
      navigate(`/manga/${paramId}/read/${prevCh.id || prevCh.number}`);
    } else {
      console.log('Already at the first chapter');
    }
  }, [chapterList, paramChapterId, paramId, navigate]);

  return {
    isLoading,
    error,
    chapterInfo,
    mangaDetails: mangaDetails || ({} as MangaDetailsPlaceholder),
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