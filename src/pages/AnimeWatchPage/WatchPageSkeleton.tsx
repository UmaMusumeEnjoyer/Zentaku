import React from 'react';
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton';
import styles from './WatchPage.module.css';
import playerStyles from './components/VideoPlayer.module.css';

const WatchPageSkeleton: React.FC = () => {
  return (
    <div className={styles.container}>
      <main className={styles.mainLayout}>
        
        <div className={styles.videoWrapper}>
          <div className={playerStyles.playerContainer} style={{ backgroundColor: 'var(--bg-panel)' }}>
             <Skeleton width="100%" height="100%" />
          </div>

          <div className={playerStyles.controlsGroup}>
            <div className={playerStyles.controlPanel}>
               <Skeleton width="100px" height="20px" style={{ marginBottom: '1rem' }} />
               <div style={{ display: 'flex', gap: '1rem' }}>
                  <Skeleton width="100%" height="40px" borderRadius="0.5rem" />
                  <Skeleton width="100%" height="40px" borderRadius="0.5rem" />
               </div>
            </div>

            <div className={playerStyles.controlPanel}>
               <Skeleton width="120px" height="20px" style={{ marginBottom: '1rem' }} />
               <div className={playerStyles.serverGrid}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} width="100%" height="32px" borderRadius="0.5rem" />
                  ))}
               </div>
            </div>
          </div>

          <div className={styles.episodeListContainer}>
             <Skeleton width="150px" height="24px" style={{ marginBottom: '1rem' }} />
             <div className={styles.episodeGrid}>
                {[...Array(15)].map((_, i) => (
                  <Skeleton key={i} width="45px" height="35px" borderRadius="4px" />
                ))}
             </div>
          </div>
        </div>

        <aside>
          <div className={styles.sidebarCard}>
            <div className={styles.posterWrapper}>
               <Skeleton width="100%" height="100%" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <Skeleton width="80%" height="24px" style={{ marginBottom: '0.5rem' }} />
              <Skeleton width="40%" height="16px" />
            </div>

            <div className={styles.tags}>
               {[1, 2, 3].map((i) => (
                 <Skeleton key={i} width="60px" height="24px" borderRadius="999px" />
               ))}
            </div>

            <div className={styles.synopsis}>
                <Skeleton width="30%" height="16px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="100%" height="14px" style={{ marginBottom: '0.25rem' }} />
                <Skeleton width="95%" height="14px" style={{ marginBottom: '0.25rem' }} />
                <Skeleton width="90%" height="14px" />
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default WatchPageSkeleton;