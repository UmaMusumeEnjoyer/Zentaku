export interface MangaPage {
  id: string;
  url: string;
  pageNumber: number;
}

export interface ChapterInfo {
  id: string;
  title: string;
  mangaTitle: string;
  chapterNumber: string;
  uploader: string;
  groupName: string;
  commentCount: number;
}

export interface MangaDetailsPlaceholder {
  id: string;
  title: string;
  coverImage: string;
  season: string;
  studio: string;
  status: string;
  format: string;
  genres: string[];
  description: string;
  totalChapters: number;
  readChapters: number;
}

export type ReadingMode = 'long-strip' | 'wide-strip' | 'single-page' | 'double-page';

export interface ReaderSettings {
  readingMode: ReadingMode;
  fitMode: 'fit-width' | 'fit-height' | 'fit-both';
  direction: 'ltr' | 'rtl' | 'vertical';
  isHeaderHidden: boolean;
  isProgressBarVisible: boolean;
  isRightSidebarOpen: boolean;
  isLeftSidebarOpen: boolean;
  isFullScreen: boolean;
}

export interface UseMangaReaderReturn {
  isLoading: boolean;
  error: string | null;
  chapterInfo: ChapterInfo | null;
  mangaDetails: MangaDetailsPlaceholder;
  pages: MangaPage[];
  settings: ReaderSettings;
  currentPage: number;
  actions: {
    toggleRightSidebar: () => void;
    toggleLeftSidebar: () => void;
    updateSetting: (key: keyof ReaderSettings, value: any) => void;
    nextChapter: () => void;
    prevChapter: () => void;
    goToPage: (pageNumber: number) => void;
  };
}