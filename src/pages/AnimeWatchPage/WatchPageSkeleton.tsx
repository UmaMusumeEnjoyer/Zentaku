// WatchPageSkeleton.tsx
import React from 'react';
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton'; // Import giả định
import styles from './WatchPage.module.css';

const WatchPageSkeleton: React.FC = () => {
  return (
    <div className={styles.container}>
      <main className={styles.mainLayout}>
        
        {/* --- Video Player Skeleton --- */}
        <section className={styles.videoWrapper}>
          {/* Player Screen */}
          <div style={{ aspectRatio: '16/9', marginBottom: '0' }}>
            <Skeleton 
              width="100%" 
              height="100%" 
              borderRadius="0.5rem 0.5rem 0 0" 
              className={styles.playerContainer} // Re-use class for border styling
            />
          </div>

          {/* Controls Bar */}
          <div className={styles.episodeControlsBar}>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <Skeleton width="80px" height="20px" />
               <Skeleton width="80px" height="20px" />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <Skeleton width="60px" height="30px" />
               <Skeleton width="60px" height="30px" />
            </div>
          </div>

          {/* Server Selector */}
          <div className={styles.serverSelector}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Skeleton width="200px" height="20px" />
                <Skeleton width="300px" height="15px" />
             </div>
             <div className={styles.serverList}>
                <Skeleton width="80px" height="35px" borderRadius="0.25rem" />
                <Skeleton width="80px" height="35px" borderRadius="0.25rem" />
                <Skeleton width="80px" height="35px" borderRadius="0.25rem" />
             </div>
          </div>
        </section>

        {/* --- Sidebar Skeleton --- */}
        <aside>
          <div className={styles.sidebarCard}>
            {/* Poster */}
            <div className={styles.posterWrapper} style={{ backgroundColor: 'transparent' }}>
               <Skeleton width="100%" height="100%" borderRadius="0.375rem" />
            </div>

            {/* Title & Rating */}
            <div style={{ marginBottom: '1rem' }}>
              <Skeleton width="80%" height="24px" style={{ marginBottom: '0.5rem' }} />
              <Skeleton width="40%" height="16px" />
            </div>

            {/* Tags */}
            <div className={styles.tags}>
               {[1, 2, 3, 4].map((i) => (
                 <Skeleton key={i} width="60px" height="24px" borderRadius="999px" />
               ))}
            </div>

            {/* Synopsis */}
            <div className={styles.synopsis}>
                <Skeleton width="30%" height="14px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="100%" height="14px" style={{ marginBottom: '0.25rem' }} />
                <Skeleton width="95%" height="14px" style={{ marginBottom: '0.25rem' }} />
                <Skeleton width="90%" height="14px" />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <Skeleton width="100%" height="40px" borderRadius="0.25rem" />
              <Skeleton width="100%" height="40px" borderRadius="0.25rem" />
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default WatchPageSkeleton;