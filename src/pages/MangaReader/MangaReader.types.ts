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

// Thêm Type cho Mock Info Sidebar
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

export interface ReaderSettings {
  readingMode: 'long-strip' | 'single-page';
  fitMode: 'fit-width' | 'fit-height' | 'fit-both';
  direction: 'ltr' | 'rtl' | 'vertical';
  isHeaderHidden: boolean;
  isProgressBarVisible: boolean;
  isRightSidebarOpen: boolean; // Đổi tên cho rõ nghĩa
  isLeftSidebarOpen: boolean;  // State mới
}

export interface UseMangaReaderReturn {
  isLoading: boolean;
  error: string | null;
  chapterInfo: ChapterInfo | null;
  mangaDetails: MangaDetailsPlaceholder; // Data mới
  pages: MangaPage[];
  settings: ReaderSettings;
  actions: {
    toggleRightSidebar: () => void;
    toggleLeftSidebar: () => void; // Action mới
    updateSetting: (key: keyof ReaderSettings, value: any) => void;
    nextChapter: () => void;
    prevChapter: () => void;
    goToPage: (pageNumber: number) => void;
  };
}