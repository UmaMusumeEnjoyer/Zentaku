import React from 'react';
import { 
  Pin, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  Maximize, 
  ArrowRight, 
} from 'lucide-react';
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
    toggleFullScreen: () => void;
  };
}

export const ReaderSettingsSidebar: React.FC<ReaderSettingsSidebarProps> = ({
  isOpen,
  chapterInfo,
  pages,
  settings,
  actions
}) => {
  return (
    <aside className={`${styles.rightSidebar} ${!isOpen ? styles.hidden : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.mangaInfo}>
          <h2>{chapterInfo.mangaTitle}</h2>
          <h3>{chapterInfo.title}</h3>
        </div>
        <span className={styles.pinIcon}>
          <Pin size={18} />
        </span>
      </div>

      <div className={styles.navControls}>
        <div className={styles.navRow}>
          <button className={styles.navButton} onClick={() => actions.goToPage(1)}>
            <ChevronLeft size={16} />
          </button>
          <select className={styles.navSelect} defaultValue="1">
            {pages.map(p => <option key={p.id} value={p.pageNumber}>Page {p.pageNumber}</option>)}
          </select>
          <button className={styles.navButton} onClick={() => actions.goToPage(pages.length)}>
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className={styles.navRow}>
          <button className={styles.navButton} onClick={actions.prevChapter}>
            <ChevronLeft size={16} />
          </button>
          <select className={styles.navSelect} defaultValue={chapterInfo.id}>
            <option value={chapterInfo.id}>{chapterInfo.chapterNumber}</option>
          </select>
          <button className={styles.navButton} onClick={actions.nextChapter}>
            <ChevronRight size={16} />
          </button>
        </div>


      </div>

      <div className={styles.settingsList}>
        <div className={styles.settingItem}>
          <span>Long Strip</span>
          <ArrowUpDown size={18} />
        </div>
        <div 
          className={`${styles.settingItem} ${settings.isFullScreen ? styles.active : ''}`}
          onClick={actions.toggleFullScreen}
        >
          <span>Full Screen</span>
          <Maximize size={18} />
        </div>
        <div className={styles.settingItem}>
          <span>Left To Right</span>
          <ArrowRight size={18} />
        </div>

      </div>
    </aside>
  );
};