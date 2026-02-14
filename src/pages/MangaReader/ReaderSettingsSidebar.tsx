import React from 'react';
import { 
  Pin, 
  ChevronLeft, 
  ChevronRight, 
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
  currentPage: number;
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
  currentPage,
  actions
}) => {
  const isDouble = settings.readingMode === 'double-page';

  // Tính toán trang hiện tại (nếu double: luôn là số lẻ)
  // Ví dụ: Page 2 -> 1, Page 3 -> 3, Page 4 -> 3
  const effectivePage = isDouble 
    ? (currentPage % 2 === 0 ? currentPage - 1 : currentPage)
    : currentPage;

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pageNumber = parseInt(e.target.value, 10);
    actions.goToPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (isDouble) {
      // Giảm 2 trang
      const target = effectivePage - 2;
      actions.goToPage(Math.max(1, target));
    } else {
      actions.goToPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (isDouble) {
      // Tăng 2 trang
      const target = effectivePage + 2;
      if (target <= pages.length) {
        actions.goToPage(target);
      }
    } else {
      if (currentPage < pages.length) {
        actions.goToPage(currentPage + 1);
      }
    }
  };

  // Tạo danh sách options cho dropdown
  const renderPageOptions = () => {
    if (!isDouble) {
      return pages.map(p => (
        <option key={p.id} value={p.pageNumber}>Page {p.pageNumber}</option>
      ));
    }

    // Logic nhóm cho double-page: 1-2, 3-4, ...
    const options = [];
    for (let i = 1; i <= pages.length; i += 2) {
      const hasNext = i + 1 <= pages.length;
      const label = hasNext ? `Page ${i} - ${i + 1}` : `Page ${i}`;
      options.push(
        <option key={`pair-${i}`} value={i}>{label}</option>
      );
    }
    return options;
  };

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
          <button 
            className={styles.navButton} 
            onClick={handlePrevPage}
            disabled={effectivePage <= 1}
          >
            <ChevronLeft size={16} />
          </button>
          
          <select 
            className={styles.navSelect} 
            value={effectivePage}
            onChange={handlePageChange}
          >
            {renderPageOptions()}
          </select>

          <button 
            className={styles.navButton} 
            onClick={handleNextPage}
            disabled={
              isDouble 
                ? effectivePage + 1 >= pages.length 
                : currentPage >= pages.length
            }
          >
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
        <div className={`${styles.settingItem} ${styles.hasControl}`}>
          <span>Reading Mode</span>
          <select 
            className={styles.settingSelect}
            value={settings.readingMode}
            onChange={(e) => actions.updateSetting('readingMode', e.target.value)}
          >
            <option value="long-strip">Long Strip</option>
            <option value="wide-strip">Wide Strip</option>
            <option value="single-page">Single Page</option>
            <option value="double-page">Double Page</option>
          </select>
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