export interface NovelMetadata {
  id: string;
  title: string;
  coverImage: string;
  author: string;
  illustrator: string;
  synopsis: string;
  tags: string[];
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  totalVolumes: number;
  currentVolume: number;
}

export interface ChapterContent {
  id: string;
  volumeTitle: string; // Vol 1
  chapterTitle: string; // Chương 01 (Phần 2)
  commentCount: number;
  wordCount: number;
  lastUpdated: string; // e.g., "3 năm"
  paragraphs: Array<{
    id: string;
    text: string;
    type: 'text' | 'dialogue' | 'thought';
    isHighlighted?: boolean; // Cho dòng màu xanh trong hình
  }>;
}

export interface ViewSettings {
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif';
  lineHeight: number;
  theme: 'light' | 'dark' | 'sepia';
}

export interface UseLightNovelReaderReturn {
  novelData: NovelMetadata | null;
  chapterData: ChapterContent | null;
  isLoading: boolean;
  error: string | null;
  // UI States
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  viewSettings: ViewSettings;
  // Actions
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  updateSettings: (newSettings: Partial<ViewSettings>) => void;
  navigateChapter: (direction: 'next' | 'prev') => void;
}