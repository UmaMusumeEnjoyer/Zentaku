import React from 'react';
import styles from './MangaReader.module.css';
import type { ChapterInfo, MangaPage, ReaderSettings } from './MangaReader.types';

interface ReaderSettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chapterInfo: ChapterInfo;
  pages: MangaPage[];
  settings: ReaderSettings;
  actions: {
    updateSetting: (key: keyof ReaderSettings, value: any) => void;
    nextChapter: () => void;
    prevChapter: () => void;
    goToPage: (pageNumber: number) => void;
  };
}

export const ReaderSettingsSidebar: React.FC<ReaderSettingsSidebarProps> = ({
  isOpen,
  onClose,
  chapterInfo,
  pages,
  settings,
  actions
}) => {
  return (
    <aside className={`${styles.rightSidebar} ${!isOpen ? styles.hidden : ''}`}>
      <button className={styles.closeButton} onClick={onClose}>×</button>
      
      <div className={styles.sidebarHeader}>
        <div className={styles.mangaInfo}>
          <h2>{chapterInfo.mangaTitle}</h2>
          <h3>{chapterInfo.title}</h3>
        </div>
        <span className={styles.pinIcon}>📌</span>
      </div>

      <div className={styles.navControls}>
        <div className={styles.navRow}>
          <button className={styles.navButton} onClick={() => actions.goToPage(1)}>&lt;</button>
          <select className={styles.navSelect} defaultValue="1">
            {pages.map(p => <option key={p.id} value={p.pageNumber}>Page {p.pageNumber}</option>)}
          </select>
          <button className={styles.navButton} onClick={() => actions.goToPage(pages.length)}>&gt;</button>
        </div>
        
        <div className={styles.navRow}>
          <button className={styles.navButton} onClick={actions.prevChapter}>&lt;</button>
          <select className={styles.navSelect} defaultValue={chapterInfo.id}>
            <option value={chapterInfo.id}>{chapterInfo.chapterNumber}</option>
          </select>
          <button className={styles.navButton} onClick={actions.nextChapter}>&gt;</button>
        </div>

        <button className={styles.actionButton}>Report Chapter</button>
      </div>

      <div className={styles.commentSection}>
        💬 {chapterInfo.commentCount} comments
      </div>

      <div className={styles.uploaderInfo}>
        <div className={styles.uploaderLabel}>Uploaded By</div>
        <div className={styles.uploaderName}>
            👥 {chapterInfo.groupName} <br/> 
            👤 {chapterInfo.uploader}
        </div>
      </div>

      <div className={styles.settingsList}>
        <div className={styles.settingItem}>
          <span>Long Strip</span>
          <span>↕️</span>
        </div>
        <div className={`${styles.settingItem} ${settings.fitMode === 'fit-both' ? styles.active : ''}`}>
          <span>Fit Both</span>
          <span>⛶</span>
        </div>
        <div className={styles.settingItem}>
          <span>Left To Right</span>
          <span>➡️</span>
        </div>
        <div className={styles.settingItem}>
          <span>Header Hidden</span>
          <input 
            type="checkbox" 
            checked={settings.isHeaderHidden} 
            onChange={() => actions.updateSetting('isHeaderHidden', !settings.isHeaderHidden)}
          />
        </div>
        <div className={styles.settingItem}>
          <span>Progress Lightbar</span>
          <span>⚙️</span>
        </div>
        <div className={styles.settingItem}>
          <span>Reader Settings</span>
          <span>⚙️</span>
        </div>
      </div>
    </aside>
  );
};