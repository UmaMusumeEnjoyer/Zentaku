import React, { useState } from 'react';
import styles from './MangaReader.module.css';
import type { MangaDetailsPlaceholder } from './MangaReader.types';
import { useTranslation } from 'react-i18next';

interface MangaInfoSidebarProps {
  data: MangaDetailsPlaceholder;
  isOpen: boolean;
  onClose: () => void;
}

export const MangaInfoSidebar: React.FC<MangaInfoSidebarProps> = ({ data, isOpen }) => {
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const { t } = useTranslation(['MangaReader']);

  const releasedPercent = 100;
  const watchedPercent = (data.readChapters / data.totalChapters) * 100;

  return (
    <aside className={`${styles.leftSidebar} ${!isOpen ? styles.hidden : ''}`}>
      <div className={styles.posterWrapper}>
        <img src={data.coverImage} alt={data.title} className={styles.posterImg} />
      </div>

      <h2 className={styles.animeTitleSidebar}>{data.title}</h2>

      <div className={styles.metaInfo}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{t('MangaReader:season')}:</span>
          <span className={styles.metaValue}>{data.season}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{t('MangaReader:studio')}:</span>
          <span className={styles.metaValue}>{data.studio}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{t('MangaReader:status')}:</span>
          <span className={styles.metaValue}>{data.status}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{t('MangaReader:format')}:</span>
          <span className={styles.metaValue}>{data.format}</span>
        </div>
      </div>

      <button className={styles.modalBtn}>{t('MangaReader:reading')}</button>

      <div className={styles.progressContainer}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>{t('MangaReader:progress')}</span>
          <span className={styles.metaValue}>
             {data.readChapters} / {data.totalChapters}
          </span>
        </div>
        <div className={styles.track}>
          <div className={styles.barReleased} style={{ width: `${releasedPercent}%` }}></div>
          <div className={styles.barWatched} style={{ width: `${watchedPercent}%` }}></div>
        </div>
      </div>

      <div className={styles.tags}>
        {data.genres.map((genre, index) => (
          <span key={index} className={styles.tag}>{genre}</span>
        ))}
      </div>

      <div className={styles.synopsis}>
        <h3 className={styles.synopsisTitle}>{t('MangaReader:synopsis')}</h3>
        <p className={`${styles.synopsisText} ${!isSynopsisExpanded ? styles.synopsisCollapsed : ''}`}>
          {data.description}
        </p>
        <button 
          className={styles.seeMoreBtn}
          onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
        >
          {isSynopsisExpanded ? t('MangaReader:seeLess') : t('MangaReader:seeMore')}
        </button>
      </div>
    </aside>
  );
};