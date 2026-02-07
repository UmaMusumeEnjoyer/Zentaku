import React from 'react';
import type { AnimeInfo } from '../WatchPage.types';
import styles from '../WatchPage.module.css';

interface SidebarProps {
  data: AnimeInfo;
}

export const Sidebar: React.FC<SidebarProps> = ({ data }) => {
  const mockInfo = {
    season: 'Winter 2024',
    studio: 'MAPPA',
    totalEpisodes: 12,
    releasedEpisodes: 6,
    watchedEpisodes: 3,
  };

  const releasedPercent = (mockInfo.releasedEpisodes / mockInfo.totalEpisodes) * 100;
  const watchedPercent = (mockInfo.watchedEpisodes / mockInfo.totalEpisodes) * 100;

  return (
    <aside className={styles.sidebarColumn}>
      <div className={styles.sidebarCard}>
        <div className={styles.posterWrapper}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw5KvitHQou2tpnp1SqULjQERMrXI95mAZsA&s"
            alt={data.title}
            className={styles.posterImg}
          />
        </div>

        <h2 className={styles.animeTitleSidebar}>{data.title}</h2>

        <div className={styles.metaInfo}>
            <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Season:</span>
                <span className={styles.metaValue}>{mockInfo.season}</span>
            </div>
            <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Studio:</span>
                <span className={styles.metaValue}>{mockInfo.studio}</span>
            </div>
        </div>

        <div className={styles.progressContainer}>
            <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>Progress</span>
                <span className={styles.progressValue}>
                    Ep {mockInfo.watchedEpisodes} <span style={{opacity: 0.5}}>/ {mockInfo.releasedEpisodes} ({mockInfo.totalEpisodes})</span>
                </span>
            </div>
            <div className={styles.track}>
                <div
                    className={styles.barReleased}
                    style={{ width: `${releasedPercent}%` }}
                    title={`Released: ${mockInfo.releasedEpisodes}/${mockInfo.totalEpisodes}`}
                ></div>

                <div
                    className={styles.barWatched}
                    style={{ width: `${watchedPercent}%` }}
                    title={`Watched: ${mockInfo.watchedEpisodes}`}
                ></div>
            </div>
            <div className={styles.progressLegend}>
                <div className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotWatched}`}></span> Watched
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotReleased}`}></span> Released
                </div>
            </div>
        </div>

        <div className={styles.tags}>
          {data.tags.slice(0, 5).map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.synopsis}>
            <h3 className={styles.synopsisTitle}>Synopsis</h3>
            <p className={styles.synopsisText}>{data.synopsis}</p>
        </div>
      </div>

      <button className={styles.modalBtn}>
        (AnimeModal)
      </button>
    </aside>
  );
};