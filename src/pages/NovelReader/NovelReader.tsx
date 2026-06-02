import React from 'react';
import styles from './NovelReader.module.css';
import { useLightNovelReader } from './useNovelReader';
import LightNovelReaderSkeleton from './NovelReaderSkeleton';
import { 
  BookOpen, ChevronLeft, ChevronRight, Type, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Danh sách màu nền theo hình
const THEME_COLORS = [
  { id: 'white' as const, hex: '#ffffff' },
  { id: 'mint' as const, hex: '#e8f5e9' },
  { id: 'blue' as const, hex: '#e3f2fd' },
  { id: 'cream' as const, hex: '#fff8e1' },
  { id: 'beige' as const, hex: '#f5f5dc' },
  { id: 'pink' as const, hex: '#fce4ec' },
  { id: 'dark' as const, hex: '#212121' },
  { id: 'black' as const, hex: '#000000' },
] as const;

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
  const { t } = useTranslation(['NovelReader']);

  if (isLoading) return <LightNovelReaderSkeleton />;
  if (error) return <div className={styles.error}>{error}</div>;

  // Xử lý background color riêng vì container bao trùm
  const activeThemeColor = THEME_COLORS.find(c => c.id === viewSettings.theme)?.hex || '#ffffff';
  const isDarkMode = viewSettings.theme === 'dark' || viewSettings.theme === 'black';

  const dynamicStyles = {
    fontSize: `${viewSettings.fontSize}px`,
    fontFamily: viewSettings.fontFamily,
    // Bản lề (Margin) -> Padding trái/phải
    paddingLeft: `${viewSettings.paddingX || 0}px`,
    paddingRight: `${viewSettings.paddingX || 0}px`,
    // Kiểu căn chỉnh
    textAlign: viewSettings.textAlign || 'justify',
    lineHeight: viewSettings.lineHeight || 1.6,
  } as React.CSSProperties;

  const containerStyle = {
    backgroundColor: activeThemeColor,
    color: isDarkMode ? '#e0e0e0' : '#2d2d2d',
    '--bg-panel': isDarkMode ? '#333' : '#f5f5f5',
    '--border-subtle': isDarkMode ? '#555' : '#ddd',
    '--text-secondary': isDarkMode ? '#aaa' : '#666',
  } as React.CSSProperties;

  return (
    <div className={styles.container} style={containerStyle}>
      {/* Left Sidebar */}
      <aside className={`${styles.leftSidebar} ${!isLeftSidebarOpen ? styles.hidden : ''}`}>
         {novelData && (
           <div className={styles.sidebarContent}>
             <img src={novelData.coverImage} alt={novelData.title} className={styles.coverImage} />
             <h2 className={styles.novelTitle}>{novelData.title}</h2>
             <div className={styles.metaList}>
               <p>{t('NovelReader:author')}: {novelData.author}</p>
               <p>{t('NovelReader:volume')}: {novelData.currentVolume}/{novelData.totalVolumes}</p>
               <p>{t('NovelReader:status')}: {novelData.status}</p>
             </div>
             <p style={{fontSize: '0.9rem', marginTop: '1rem', color: 'var(--text-secondary)'}}>
               {novelData.synopsis}
             </p>
           </div>
         )}
      </aside>

      <button 
        className={`${styles.toggleLeftBtn} ${isLeftSidebarOpen ? styles.open : ''}`} 
        onClick={toggleLeftSidebar}
      >
        {isLeftSidebarOpen ? <ChevronLeft size={20} /> : <BookOpen size={20} />}
      </button>

      {/* Main Reader */}
      <main className={styles.readerArea}>
        <div className={styles.contentWrapper} style={dynamicStyles}>
          {chapterData && (
            <>
              <header className={styles.chapterHeader}>
                <div className={styles.volumeTitle}>{chapterData.volumeTitle}</div>
                <h1 className={styles.chapterTitle}>{chapterData.chapterTitle}</h1>
                <div className={styles.metaInfo}>
                  <span>{chapterData.commentCount} {t('NovelReader:comments')}</span>
                  <span>{t('NovelReader:length')}: {chapterData.wordCount} {t('NovelReader:words')}</span>
                  <span>{t('NovelReader:lastUpdated')}: {chapterData.lastUpdated}</span>
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

      {/* Right Sidebar */}
      <aside className={`${styles.rightSidebar} ${isRightSidebarOpen ? styles.expanded : ''}`}>
        
        <div className={styles.rightSidebarHeader}>
            <button 
              className={styles.iconButton} 
              onClick={toggleRightSidebar}
              title={isRightSidebarOpen ? t('NovelReader:closeSettings') : t('NovelReader:openSettings')}
              style={isRightSidebarOpen ? {backgroundColor: '#ddd', color: '#000'} : {}}
            >
              {isRightSidebarOpen ? '×' : <Type size={20} />}
            </button>
        </div>

        {!isRightSidebarOpen && (
          <div className={styles.navigationGroup}>
              <button className={styles.iconButton} title={t('NovelReader:previousChapter')}>
                  <ChevronLeft size={20} />
              </button>
              <button className={styles.iconButton} title={t('NovelReader:nextChapter')}>
                  <ChevronRight size={20} />
              </button>
          </div>
        )}

        {isRightSidebarOpen && (
          <div className={styles.settingsPanel}>
             
             {/* 1. Màu nền */}
             <div className={styles.settingGroup}>
                <label className={styles.settingLabel}>{t('NovelReader:backgroundColor')}</label>
                <div className={styles.colorGrid}>
                  {THEME_COLORS.map((color) => (
                    <div 
                      key={color.id}
                      className={`${styles.colorSwatch} ${viewSettings.theme === color.id ? styles.active : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => updateSettings({ theme: color.id })}
                    />
                  ))}
                </div>
             </div>

             {/* 2. Font chữ */}
             <div className={styles.settingGroup}>
                <label className={styles.settingLabel}>{t('NovelReader:fontFamily')}</label>
                <select 
                  className={styles.fontSelect} 
                  value={viewSettings.fontFamily}
                  onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                >
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Arial">Arial</option>
                  <option value="Inter">Inter</option>
                  <option value="Merriweather">Merriweather</option>
                </select>
             </div>

             {/* 3. Kích cỡ chữ */}
             <div className={styles.settingGroup}>
                <label className={styles.settingLabel}>{t('NovelReader:fontSize')}</label>
                <div className={styles.stepperControl}>
                  <button 
                    className={styles.stepperBtn} 
                    onClick={() => updateSettings({ fontSize: Math.max(12, viewSettings.fontSize - 1) })}
                  >‹</button>
                  <div className={styles.stepperValue}>{viewSettings.fontSize}px</div>
                  <button 
                    className={styles.stepperBtn} 
                    onClick={() => updateSettings({ fontSize: Math.min(32, viewSettings.fontSize + 1) })}
                  >›</button>
                </div>
             </div>

             {/* 4. Bản lề (Margin/Padding) */}
             <div className={styles.settingGroup}>
                <label className={styles.settingLabel}>{t('NovelReader:margin')}</label>
                <div className={styles.stepperControl}>
                  <button 
                    className={styles.stepperBtn} 
                    onClick={() => updateSettings({ paddingX: Math.max(0, (viewSettings.paddingX || 0) - 10) })}
                  >‹</button>
                  <div className={styles.stepperValue}>{viewSettings.paddingX || 0}px</div>
                  <button 
                    className={styles.stepperBtn} 
                    onClick={() => updateSettings({ paddingX: Math.min(200, (viewSettings.paddingX || 0) + 10) })}
                  >›</button>
                </div>
             </div>

             {/* 5. Kiểu căn chỉnh */}
             <div className={styles.settingGroup}>
                <label className={styles.settingLabel}>{t('NovelReader:textAlign')}</label>
                <div className={styles.alignGrid}>
                   <button 
                     className={`${styles.alignBtn} ${(viewSettings.textAlign === 'left') ? styles.active : ''}`}
                     onClick={() => updateSettings({ textAlign: 'left' })}
                   >
                     <AlignLeft size={20} />
                   </button>
                   <button 
                     className={`${styles.alignBtn} ${(viewSettings.textAlign === 'center') ? styles.active : ''}`}
                     onClick={() => updateSettings({ textAlign: 'center' })}
                   >
                     <AlignCenter size={20} />
                   </button>
                   <button 
                     className={`${styles.alignBtn} ${(viewSettings.textAlign === 'right') ? styles.active : ''}`}
                     onClick={() => updateSettings({ textAlign: 'right' })}
                   >
                     <AlignRight size={20} />
                   </button>
                   <button 
                     className={`${styles.alignBtn} ${(viewSettings.textAlign === 'justify' || !viewSettings.textAlign) ? styles.active : ''}`}
                     onClick={() => updateSettings({ textAlign: 'justify' })}
                   >
                     <AlignJustify size={20} />
                   </button>
                </div>
             </div>

          </div>
        )}
      </aside>
    </div>
  );
};