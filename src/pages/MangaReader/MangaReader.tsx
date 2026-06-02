import React, { useRef, useState, useEffect } from 'react';
import styles from './MangaReader.module.css';
import { useMangaReader } from './useMangaReader';
import { MangaInfoSidebar } from './MangaInfoSidebar';
import { ReaderSettingsSidebar } from './ReaderSettingsSidebar';
import MangaReaderSkeleton from './MangaReaderSkeleton'; 
import { Minimize, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MangaReader: React.FC = () => {
  const { 
    isLoading, 
    error, 
    chapterInfo, 
    mangaDetails,
    pages, 
    settings,
    currentPage,
    actions 
  } = useMangaReader();

  const { t } = useTranslation(['MangaReader']);

  const readerAreaRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLImageElement | null>>([]);
  const [showFsToast, setShowFsToast] = useState(false);

  // Tính toán trang "hiệu lực" cho logic double-page
  // Nếu double-page: luôn đưa về số lẻ (1, 3, 5...)
  const isDouble = settings.readingMode === 'double-page';
  const effectivePage = isDouble 
    ? (currentPage % 2 === 0 ? currentPage - 1 : currentPage)
    : currentPage;

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      if (settings.isFullScreen !== isFs) {
        actions.updateSetting('isFullScreen', isFs);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [settings.isFullScreen, actions]);

  useEffect(() => {
    // Reset scroll khi chuyển mode hoặc chuyển cặp trang
    if (settings.readingMode === 'single-page' || settings.readingMode === 'double-page') {
      if (readerAreaRef.current) {
        readerAreaRef.current.scrollTop = 0;
        readerAreaRef.current.scrollLeft = 0;
      }
      return;
    }

    // Logic scroll cũ cho long-strip/wide-strip
    const pageIndex = currentPage - 1;
    const targetElement = itemsRef.current[pageIndex];
    if (targetElement) {
      if (settings.readingMode === 'wide-strip') {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else if (settings.readingMode === 'long-strip') {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [effectivePage, currentPage, settings.readingMode]); // Dùng effectivePage để trigger scroll reset đúng lúc

  // Xử lý scroll ngang cho wide-strip
  useEffect(() => {
    const reader = readerAreaRef.current;
    if (!reader) return;

    const handleWheel = (e: WheelEvent) => {
      if (settings.readingMode === 'wide-strip') {
        if (e.deltaY !== 0) {
          if (reader.scrollWidth > reader.clientWidth) {
            e.preventDefault();
            reader.scrollLeft += e.deltaY;
          }
        }
      }
    };

    reader.addEventListener('wheel', handleWheel, { passive: false });
    return () => reader.removeEventListener('wheel', handleWheel);
  }, [settings.readingMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      const isLeft = e.key === 'ArrowLeft';
      const isRight = e.key === 'ArrowRight';

      if (isLeft) {
        if (effectivePage > 1) {
          if (isDouble) {
            // Lùi 1 cặp (từ 3 -> 1)
            actions.goToPage(Math.max(1, effectivePage - 2));
          } else {
            actions.goToPage(effectivePage - 1);
          }
        }
      } else if (isRight) {
        if (isDouble) {
          // Tiến 1 cặp (từ 1 -> 3)
          if (effectivePage + 2 <= pages.length) {
            actions.goToPage(effectivePage + 2);
          } else if (effectivePage < pages.length) {
            // Trường hợp trang lẻ cuối cùng
             actions.goToPage(pages.length);
          }
        } else {
          if (effectivePage < pages.length) {
             actions.goToPage(effectivePage + 1);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [effectivePage, pages.length, actions, isDouble]);

  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (readerAreaRef.current) {
        readerAreaRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
        setShowFsToast(true);
        setTimeout(() => setShowFsToast(false), 3500);
      }
    } else {
      document.exitFullscreen();
    }
  };

  const extendedActions = {
    ...actions,
    toggleFullScreen: handleToggleFullScreen
  };

  const renderContent = () => {
    const mode = settings.readingMode;

    if (mode === 'single-page') {
      const page = pages[currentPage - 1];
      if (!page) return null;
      return (
        <div className={styles.singlePageWrapper}>
          <img
            key={page.id}
            src={page.url}
            alt={`Page ${page.pageNumber}`}
            className={styles.modeSingle} 
          />
        </div>
      );
    }

    if (mode === 'double-page') {
      // Logic mới: Luôn dùng effectivePage (số lẻ) để render cặp
      // effectivePage = 1 -> render [Page 1, Page 2]
      // effectivePage = 3 -> render [Page 3, Page 4]
      
      const firstPage = pages[effectivePage - 1]; // index 0 (Page 1)
      const secondPage = pages[effectivePage];     // index 1 (Page 2)
      
      return (
        <div key={`pair-${effectivePage}`} className={styles.doublePageWrapper}>
          {firstPage && (
            <img
              src={firstPage.url}
              alt={`Page ${firstPage.pageNumber}`}
              className={styles.modeDouble}
            />
          )}
          {secondPage && (
            <img
              src={secondPage.url}
              alt={`Page ${secondPage.pageNumber}`}
              className={styles.modeDouble}
            />
          )}
        </div>
      );
    }

    if (mode === 'wide-strip') {
      return (
        <div className={styles.wideStripContainer}>
          {pages.map((page, index) => (
            <img
              key={page.id}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              src={page.url}
              alt={`Page ${page.pageNumber}`}
              className={`${styles.pageImage} ${styles.modeWide}`}
            />
          ))}
        </div>
      );
    }

    return pages.map((page, index) => (
      <img
        key={page.id}
        ref={(el) => {
          itemsRef.current[index] = el;
        }}
        src={page.url}
        alt={`Page ${page.pageNumber}`}
        className={`${styles.pageImage} ${styles.modeLong}`}
      />
    ));
  };

  if (isLoading) return <MangaReaderSkeleton />;
  if (error || !chapterInfo) return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      
      <MangaInfoSidebar 
        data={mangaDetails} 
        isOpen={settings.isLeftSidebarOpen}
        onClose={actions.toggleLeftSidebar} 
      />
      
      <button 
          className={`${styles.toggleBtn} ${settings.isLeftSidebarOpen ? styles.leftToggleOpen : styles.leftToggle}`} 
          onClick={actions.toggleLeftSidebar}
      >
          {settings.isLeftSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className={styles.readerArea} ref={readerAreaRef}>
        {settings.isFullScreen && (
          <>
            <button className={styles.exitFullscreenBtn} onClick={handleToggleFullScreen}>
              <Minimize size={18} />
              {t('MangaReader:exitFullScreen')}
            </button>
            {showFsToast && (
              <div className={styles.fullscreenToast}>
                <span dangerouslySetInnerHTML={{ __html: t('MangaReader:pressEsc') }}></span>
              </div>
            )}

          </>
        )}

        {renderContent()}

      </div>

      <button 
          className={`${styles.toggleBtn} ${settings.isRightSidebarOpen ? styles.rightToggleOpen : styles.rightToggle}`} 
          onClick={actions.toggleRightSidebar}
      >
          {settings.isRightSidebarOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <ReaderSettingsSidebar 
        isOpen={settings.isRightSidebarOpen}
        onClose={actions.toggleRightSidebar}
        chapterInfo={chapterInfo}
        pages={pages}
        settings={settings}
        currentPage={currentPage}
        actions={extendedActions} 
      />
    </div>
  );
};

export default MangaReader;