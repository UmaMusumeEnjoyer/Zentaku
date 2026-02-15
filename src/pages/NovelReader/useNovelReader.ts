import { useState, useEffect, useCallback } from 'react';
import type { ChapterContent, NovelMetadata, UseLightNovelReaderReturn, ViewSettings } from './NovelReader.types';

// Mock Data để hiển thị giống hình ảnh
const MOCK_NOVEL: NovelMetadata = {
  id: '1',
  title: 'Chưa thấy quan tày là chưa nể độ',
  coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw5KvitHQou2tpnp1SqULjQERMrXI95mAZsA&s', 
  author: 'Unknown',
  illustrator: 'N/A',
  synopsis: 'Demo hiển thị văn bản dài...',
  tags: ['Drama', 'Psychological', 'Slice of Life'],
  status: 'Ongoing',
  totalVolumes: 1,
  currentVolume: 1
};

const MOCK_CHAPTER: ChapterContent = {
  id: 'c1',
  volumeTitle: 'Vol 1',
  chapterTitle: 'Chương 01: Cuộc gọi định mệnh',
  commentCount: 99,
  wordCount: 1500,
  lastUpdated: 'Vừa xong',
  paragraphs: [
    { 
      id: 'p1', 
      text: 'Alo em có phải X... không? Ui X... ơi em đừng có chối, thông tin về tên địa chỉ nhà, học trường gì, ở đâu, bố mẹ tên là gì anh có cả ở đây rồi.', 
      type: 'dialogue' 
    },
    { 
      id: 'p2', 
      text: 'X... có cần anh đọc cho nghe một số thông tin không?... X ơi em còn trẻ quá, hơn con anh có mấy tuổi à, sao X... lại làm thế, còn cả tương lai đằng trước.', 
      type: 'dialogue' 
    },
    { 
      id: 'p3', 
      text: 'X... thích anh cho người đến tận nhà nói chuyện với bố mẹ em đấy.', 
      type: 'dialogue' 
    },
    { 
      id: 'p4', 
      text: 'Alo em có phải X... không? Ui X... ơi em đừng có chối, thông tin về tên địa chỉ nhà, học trường gì, ở đâu, bố mẹ tên là gì anh có cả ở đây rồi. X... có cần anh đọc cho nghe một số thông tin không?...', 
      type: 'text' 
    },
    { 
      id: 'p5', 
      text: 'X ơi em còn trẻ quá, hơn con anh có mấy tuổi à, sao X... lại làm thế, còn cả tương lai đằng trước, X... thích anh cho người đến tận nhà nói chuyện với bố mẹ em đấy.', 
      type: 'text' 
    },
    { 
      id: 'p6', 
      text: 'Alo em có phải X... không? Ui X... ơi em đừng có chối, thông tin về tên địa chỉ nhà, học trường gì, ở đâu, bố mẹ tên là gì anh có cả ở đây rồi.', 
      type: 'dialogue' 
    },
    { 
      id: 'p7', 
      text: 'X... có cần anh đọc cho nghe một số thông tin không?... X ơi em còn trẻ quá, hơn con anh có mấy tuổi à, sao X... lại làm thế, còn cả tương lai đằng trước.', 
      type: 'dialogue' 
    },
    { 
      id: 'p8', 
      text: 'X... thích anh cho người đến tận nhà nói chuyện với bố mẹ em đấy.', 
      type: 'dialogue' 
    },
    { 
      id: 'p9', 
      text: 'Thật sự đấy X... à, đừng để mọi chuyện đi quá xa. Anh chỉ muốn tốt cho em thôi.', 
      type: 'thought' 
    },
    { 
      id: 'p10', 
      text: 'Alo em có phải X... không? Ui X... ơi em đừng có chối, thông tin về tên địa chỉ nhà, học trường gì, ở đâu, bố mẹ tên là gì anh có cả ở đây rồi. X... có cần anh đọc cho nghe một số thông tin không?...X ơi em còn trẻ quá, hơn con anh có mấy tuổi à, sao X... lại làm thế, còn cả tương lai đằng trước, X... thích anh cho người đến tận nhà nói chuyện với bố mẹ em đấy.', 
      type: 'text' 
    },
  ]
};

export const useLightNovelReader = (): UseLightNovelReaderReturn => {
  const [novelData, setNovelData] = useState<NovelMetadata | null>(null);
  const [chapterData, setChapterData] = useState<ChapterContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false); // Mặc định mở setting

  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    fontSize: 18,
    fontFamily: 'Times New Roman',
    lineHeight: 1.8,
    theme: 'cream', 
    paddingX: 0,
    textAlign: 'justify'
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