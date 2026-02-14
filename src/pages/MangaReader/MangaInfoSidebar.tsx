import React, { useState } from 'react';
import styles from './MangaReader.module.css';
import type { MangaDetailsPlaceholder } from './MangaReader.types';

interface MangaInfoSidebarProps {
  data: MangaDetailsPlaceholder;
  isOpen: boolean;
  onClose: () => void;
}

export const MangaInfoSidebar: React.FC<MangaInfoSidebarProps> = ({ data, isOpen }) => {
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);

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
          <span className={styles.metaLabel}>Season:</span>
          <span className={styles.metaValue}>{data.season}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Studio:</span>
          <span className={styles.metaValue}>{data.studio}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Status:</span>
          <span className={styles.metaValue}>{data.status}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Format:</span>
          <span className={styles.metaValue}>{data.format}</span>
        </div>
      </div>

      <button className={styles.modalBtn}>Reading</button>

      <div className={styles.progressContainer}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progress</span>
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
        <h3 className={styles.synopsisTitle}>Synopsis</h3>
        <p className={`${styles.synopsisText} ${!isSynopsisExpanded ? styles.synopsisCollapsed : ''}`}>
          {data.description}
        </p>
        <button 
          className={styles.seeMoreBtn}
          onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
        >
          {isSynopsisExpanded ? 'See less' : 'See more'}
        </button>
      </div>
    </aside>
  );
};