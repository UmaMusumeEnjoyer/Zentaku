import React from 'react';
import { 
  X, 
  Pin, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  Maximize2, 
  ArrowRight, 
  Settings,
  Flag,
  SlidersHorizontal
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
      <button className={styles.closeButton} onClick={onClose}>
        <X size={24} />
      </button>
      
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

        <button className={styles.actionButton}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Flag size={14} />
            Report Chapter
          </div>
        </button>
      </div>

      <div className={styles.settingsList}>
        <div className={styles.settingItem}>
          <span>Long Strip</span>
          <ArrowUpDown size={18} />
        </div>
        <div className={`${styles.settingItem} ${settings.fitMode === 'fit-both' ? styles.active : ''}`}>
          <span>Fit Both</span>
          <Maximize2 size={18} />
        </div>
        <div className={styles.settingItem}>
          <span>Left To Right</span>
          <ArrowRight size={18} />
        </div>
        <div className={styles.settingItem}>
          <span>Header Hidden</span>
          <input 
            type="checkbox" 
            checked={settings.isHeaderHidden} 
            onChange={() => actions.updateSetting('isHeaderHidden', !settings.isHeaderHidden)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
        </div>
        <div className={styles.settingItem}>
          <span>Progress Lightbar</span>
          <SlidersHorizontal size={18} />
        </div>
        <div className={styles.settingItem}>
          <span>Reader Settings</span>
          <Settings size={18} />
        </div>
      </div>
    </aside>
  );
};