import React from 'react';
import styles from './NovelReader.module.css';
import { useLightNovelReader } from './useNovelReader';
// Giả định import Skeleton từ bước 3
import LightNovelReaderSkeleton from './NovelReaderSkeleton';
// Icons (Sử dụng lucid-react hoặc fontawesome giả định)
import { BookOpen, Settings, ChevronLeft, ChevronRight, Type, Home, MessageSquare } from 'lucide-react';

export const LightNovelReader: React.FC = () => {
  const {
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
  } = useLightNovelReader();

  if (isLoading) return <LightNovelReaderSkeleton />;
  if (error) return <div className={styles.error}>{error}</div>;

  // Inline styles for dynamic view settings
  const dynamicStyles = {
    fontSize: `${viewSettings.fontSize}px`,
    fontFamily: viewSettings.fontFamily === 'serif' ? '"Merriweather", serif' : '"Inter", sans-serif',
    lineHeight: viewSettings.lineHeight,
  } as React.CSSProperties;

  return (
    <div className={styles.container}>
      {/* --- Left Sidebar (Novel Info) --- */}
      <aside className={`${styles.leftSidebar} ${!isLeftSidebarOpen ? styles.hidden : ''}`}>
         {novelData && (
           <div className={styles.sidebarContent}>
             <button onClick={toggleLeftSidebar} style={{marginBottom: '10px'}}>×</button>
             <img src={novelData.coverImage} alt={novelData.title} className={styles.coverImage} />
             <h2 className={styles.novelTitle}>{novelData.title}</h2>
             <div className={styles.metaList}>
               <p>Author: {novelData.author}</p>
               <p>Vol: {novelData.currentVolume}/{novelData.totalVolumes}</p>
               <p>Status: {novelData.status}</p>
             </div>
             <p style={{fontSize: '0.9rem', marginTop: '1rem', color: 'var(--text-secondary)'}}>
               {novelData.synopsis}
             </p>
           </div>
         )}
      </aside>

      {/* --- Toggle Button for Left Sidebar --- */}
      {!isLeftSidebarOpen && (
        <button className={styles.toggleLeftBtn} onClick={toggleLeftSidebar}>
          <BookOpen size={20} />
        </button>
      )}

      {/* --- Main Reader Area --- */}
      <main className={styles.readerArea}>
        <div className={styles.contentWrapper} style={dynamicStyles}>
          {chapterData && (
            <>
              <header className={styles.chapterHeader}>
                <div className={styles.volumeTitle}>{chapterData.volumeTitle}</div>
                <h1 className={styles.chapterTitle}>{chapterData.chapterTitle}</h1>
                <div className={styles.metaInfo}>
                  <span>{chapterData.commentCount} Bình luận</span>
                  <span>Độ dài: {chapterData.wordCount} từ</span>
                  <span>Cập nhật: {chapterData.lastUpdated}</span>
                </div>
              </header>

              <article>
                {chapterData.paragraphs.map((para) => (
                  <p 
                    key={para.id} 
                    className={`${styles.paragraph} ${para.isHighlighted ? styles.highlightedText : ''}`}
                  >
                    {para.text}
                  </p>
                ))}
              </article>
            </>
          )}
        </div>
      </main>

      {/* --- Right Sidebar (Settings & Tools) --- */}
      <aside className={`${styles.rightSidebar} ${isRightSidebarOpen ? styles.expanded : ''}`}>
        <button className={styles.iconButton} onClick={toggleRightSidebar}>
          {isRightSidebarOpen ? '×' : <Settings size={20} />}
        </button>

        {isRightSidebarOpen ? (
          <div style={{width: '100%'}}>
             {/* Navigation Controls */}
             <div className={styles.settingGroup}>
               <div className={styles.settingLabel}>Navigation</div>
               <div style={{display: 'flex', gap: '10px'}}>
                 <button className={styles.iconButton} style={{flex:1, border: '1px solid var(--border-subtle)'}}>
                    <ChevronLeft size={16}/> Prev
                 </button>
                 <button className={styles.iconButton} style={{flex:1, border: '1px solid var(--border-subtle)'}}>
                    Next <ChevronRight size={16}/>
                 </button>
               </div>
             </div>

             {/* Font Controls */}
             <div className={styles.settingGroup}>
                <div className={styles.settingLabel}>Appearance</div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                   <button onClick={() => updateSettings({fontSize: viewSettings.fontSize - 1})}>A-</button>
                   <span>{viewSettings.fontSize}px</span>
                   <button onClick={() => updateSettings({fontSize: viewSettings.fontSize + 1})}>A+</button>
                </div>
                <div className={styles.themeGrid}>
                   <button 
                    className={styles.themeBtn} 
                    style={{background: '#ffffff'}} 
                    onClick={() => updateSettings({theme: 'light'})}
                   />
                   <button 
                    className={styles.themeBtn} 
                    style={{background: '#f4ecd8'}} // Sepia/Beige
                    onClick={() => updateSettings({theme: 'sepia'})}
                   />
                   <button 
                    className={styles.themeBtn} 
                    style={{background: '#1a1a1a'}} 
                    onClick={() => updateSettings({theme: 'dark'})}
                   />
                </div>
             </div>
          </div>
        ) : (
          /* Collapsed Icons Mode (Simulating the floating buttons in image) */
          <>
            <button className={styles.iconButton}><Home size={20} /></button>
            <button className={styles.iconButton}><Type size={20} /></button>
            <button className={styles.iconButton}><MessageSquare size={20} /></button>
          </>
        )}
      </aside>
    </div>
  );
};