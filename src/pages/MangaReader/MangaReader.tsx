import React, { useRef, useState, useEffect } from 'react';
import styles from './MangaReader.module.css';
import { useMangaReader } from './useMangaReader';
import { MangaInfoSidebar } from './MangaInfoSidebar';
import { ReaderSettingsSidebar } from './ReaderSettingsSidebar';
import MangaReaderSkeleton from './MangaReaderSkeleton'; 
import { Minimize } from 'lucide-react';

const MangaReader: React.FC = () => {
  const { 
    isLoading, 
    error, 
    chapterInfo, 
    mangaDetails,
    pages, 
    settings, 
    actions 
  } = useMangaReader('ch-116');

  const readerAreaRef = useRef<HTMLDivElement>(null);
  const [showFsToast, setShowFsToast] = useState(false);

  
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

  if (isLoading) return <MangaReaderSkeleton />;
  if (error || !chapterInfo) return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      
      <MangaInfoSidebar 
        data={mangaDetails} 
        isOpen={settings.isLeftSidebarOpen}
        onClose={actions.toggleLeftSidebar} 
      />
      
      {!settings.isLeftSidebarOpen && (
        <button 
            className={`${styles.toggleBtn} ${styles.leftToggle}`} 
            onClick={actions.toggleLeftSidebar}
        >
            ❯
        </button>
      )}

      <div className={styles.readerArea} ref={readerAreaRef}>
        {settings.isFullScreen && (
          <>
            <button className={styles.exitFullscreenBtn} onClick={handleToggleFullScreen}>
              <Minimize size={18} />
              Exit Full Screen
            </button>
            {showFsToast && (
              <div >
                
              </div>
            )}
          </>
        )}

        {pages.map((page) => (
          <img
            key={page.id}
            src={page.url}
            alt={`Page ${page.pageNumber}`}
            className={styles.pageImage}
            style={{
              width: settings.fitMode === 'fit-width' ? '100%' : 'auto',
              height: settings.fitMode === 'fit-height' ? '100vh' : 'auto',
              maxWidth: settings.fitMode === 'fit-both' ? '100vh' : '100%',
            }}
          />
        ))}
      </div>

      {!settings.isRightSidebarOpen && (
        <button 
            className={`${styles.toggleBtn} ${styles.rightToggle}`} 
            onClick={actions.toggleRightSidebar}
        >
            ❮
        </button>
      )}

      <ReaderSettingsSidebar 
        isOpen={settings.isRightSidebarOpen}
        onClose={actions.toggleRightSidebar}
        chapterInfo={chapterInfo}
        pages={pages}
        settings={settings}
        actions={extendedActions} 
      />
    </div>
  );
};

export default MangaReader;