import { useState, useEffect, useCallback } from 'react';
import type { ChapterContent, NovelMetadata, UseLightNovelReaderReturn, ViewSettings } from './NovelReader.types';

// Mock Data để hiển thị giống hình ảnh
const MOCK_NOVEL: NovelMetadata = {
  id: '1',
  title: 'Gimai Seikatsu',
  coverImage: 'https://placehold.co/400x600/png', 
  author: 'Mikawa Ghost',
  illustrator: 'Hiten',
  synopsis: 'Sau khi bố tái hôn, Asamura Yuuta có thêm một cô em gái mới...',
  tags: ['Romance', 'School Life', 'Slice of Life'],
  status: 'Ongoing',
  totalVolumes: 10,
  currentVolume: 1
};

const MOCK_CHAPTER: ChapterContent = {
  id: 'c1',
  volumeTitle: 'Vol 1',
  chapterTitle: 'Chương 01 (Phần 2)',
  commentCount: 53,
  wordCount: 3935,
  lastUpdated: '3 năm',
  paragraphs: [
    { id: 'p1', text: '“C-Cậu đang nói cái quái gì thế!?” Tôi vô thức hét lên.', type: 'dialogue' },
    { id: 'p2', text: 'Mặt khác, Airi lại nở nụ cười đắc thắng.', type: 'text' },
    { id: 'p3', text: '“...Chúng ta cứ thử hôn xem. Nếu cậu không xem tớ là một người phụ nữ thì... sẽ không sao đâu ha?”', type: 'dialogue', isHighlighted: true },
    { id: 'p4', text: '“...Cái logic quái gì thế?”', type: 'dialogue' },
    { id: 'p5', text: 'Chẳng phải là hôn ai đó vì thích người đó sao? Lí do của Airi thì hoàn toàn trái ngược với điều đó.', type: 'thought' },
    { id: 'p6', text: '“Tớ nói là ‘hôn’, nhưng cũng chỉ là chạm môi nhau thôi mà, phải chứ? Nếu không có tình cảm với người kia, thì cậu có thể làm vậy một cách máy móc mà chẳng hề xấu hổ, đúng chứ?”', type: 'dialogue' },
    { id: 'p7', text: '“K-Không, tớ không bảo chính xác là cậu sai... nhưng chắc chắn đó không phải việc cậu có thể làm một cách bình thường đâu... Cậu không nghĩ vậy sao?”', type: 'dialogue' },
    { id: 'p8', text: 'Tôi chưa bao giờ hôn môi người khác.', type: 'thought' },
    { id: 'p9', text: 'Theo như tôi biết thì Airi cũng thế.', type: 'thought' },
    { id: 'p10', text: 'Quên tôi đi, với Airi, một cô gái, nụ hôn đầu sẽ là điều gì đó đặc biệt.', type: 'text' },
  ]
};

export const useLightNovelReader = (): UseLightNovelReaderReturn => {
  const [novelData, setNovelData] = useState<NovelMetadata | null>(null);
  const [chapterData, setChapterData] = useState<ChapterContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(true); // Mặc định mở setting như yêu cầu "thanh setting bên phải"

  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    fontSize: 18,
    fontFamily: 'serif',
    lineHeight: 1.8,
    theme: 'sepia' // Theme giống hình
  });

  useEffect(() => {
    // Giả lập fetch data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Mock delay
        setNovelData(MOCK_NOVEL);
        setChapterData(MOCK_CHAPTER);
      } catch (err) {
        setError('Failed to load chapter');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleLeftSidebar = useCallback(() => setIsLeftSidebarOpen(prev => !prev), []);
  const toggleRightSidebar = useCallback(() => setIsRightSidebarOpen(prev => !prev), []);

  const updateSettings = useCallback((newSettings: Partial<ViewSettings>) => {
    setViewSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const navigateChapter = useCallback((direction: 'next' | 'prev') => {
    console.log(`Navigating ${direction}`);
    // Logic fetch chapter mới sẽ ở đây
  }, []);

  return {
    novelData,
    chapterData,
    isLoading,
    error,
    isLeftSidebarOpen,
    isRightSidebarOpen,
    viewSettings,
    toggleLeftSidebar,
    toggleRightSidebar,
    updateSettings,
    navigateChapter
  };
};