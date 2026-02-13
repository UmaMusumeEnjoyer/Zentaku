import React from 'react';
import styles from './MangaReader.module.css';
import { useMangaReader } from './useMangaReader';
import { MangaInfoSidebar } from './MangaInfoSidebar';
import { ReaderSettingsSidebar } from './ReaderSettingsSidebar';
import MangaReaderSkeleton from './MangaReaderSkeleton'; 

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

      <div className={styles.readerArea}>
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
        actions={actions}
      />
    </div>
  );
};

export default MangaReader;