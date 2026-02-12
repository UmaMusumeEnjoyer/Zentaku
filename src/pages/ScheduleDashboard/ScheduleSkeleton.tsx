import React from 'react';
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton';
import styles from './Schedule.module.css';

const AnimeScheduleSkeleton: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Skeleton Left Sidebar */}
      <aside className={styles.sidebarLeft}>
        <div className={styles.sidebarGroup}>
          <div>
            <Skeleton width="40%" height="10px" className="mb-4" />
            <div className={styles.navLinks}>
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.skeletonRow}>
                  <Skeleton width="20px" height="20px" borderRadius="4px" />
                  <Skeleton width="60%" height="14px" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Skeleton width="40%" height="10px" className="mb-4" />
            <div className={styles.navLinks}>
              {[1, 2].map(i => (
                <div key={i} className={styles.skeletonRow}>
                  <Skeleton width="32px" height="32px" borderRadius="6px" />
                  <Skeleton width="50%" height="14px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Skeleton Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.headerControls}>
          <div className={styles.skeletonContent}>
            <Skeleton width="200px" height="32px" />
            <Skeleton width="120px" height="14px" />
          </div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
             <Skeleton width="80px" height="32px" borderRadius="8px" />
          </div>
        </div>

        <div className={styles.calendarContainer}>
          <div className={styles.calendarCard}>
            <div className={styles.weekGrid}>
              {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} className={styles.weekDay}>
                  <Skeleton width="30px" height="10px" />
                </div>
              ))}
            </div>
            <div className={styles.daysGrid}>
              {Array.from({ length: 35 }).map((_, idx) => (
                <div key={idx} className={styles.dayCell}>
                  <Skeleton width="20px" height="20px" className="mb-2" />
                  {idx % 4 === 0 && <Skeleton width="80%" height="8px" borderRadius="2px" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Skeleton Right Sidebar */}
      <aside className={styles.sidebarRight}>
        <div className={styles.skeletonHeader}>
           <Skeleton width="100px" height="20px" />
           <Skeleton width="40px" height="16px" />
        </div>
        <div className={styles.sidebarGroup}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{display: 'flex', gap: '1rem'}}>
              <Skeleton width="4rem" height="6rem" borderRadius="0.5rem" />
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem'}}>
                <Skeleton width="60%" height="10px" />
                <Skeleton width="90%" height="16px" />
                <Skeleton width="40%" height="10px" />
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default AnimeScheduleSkeleton;