import React from 'react';
import styles from './MangaReader.module.css';
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton'; // Giả định component gốc

const MangaReaderSkeleton: React.FC = () => {
  // Tạo mảng dummy cho danh sách settings
  const dummySettings = Array.from({ length: 6 });

  return (
    <div className={styles.container}>
      {/* Main Area Skeleton */}
      <div className={styles.readerArea}>
        <Skeleton 
            width="60%" 
            height="90%" 
            borderRadius="8px" 
            style={{ marginTop: '20px' }} 
        />
      </div>

      {/* Sidebar Skeleton - Tái sử dụng cấu trúc của Sidebar thật */}
      <aside className={styles.sidebar}>
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.mangaInfo} style={{ width: '100%' }}>
            <Skeleton width="60%" height="1rem" style={{ marginBottom: '8px' }} />
            <Skeleton width="80%" height="1.5rem" />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className={styles.navControls}>
          <div className={styles.navRow}>
            <Skeleton width="32px" height="32px" borderRadius="4px" />
            <Skeleton width="100%" height="32px" borderRadius="4px" />
            <Skeleton width="32px" height="32px" borderRadius="4px" />
          </div>
          <div className={styles.navRow}>
            <Skeleton width="32px" height="32px" borderRadius="4px" />
            <Skeleton width="100%" height="32px" borderRadius="4px" />
            <Skeleton width="32px" height="32px" borderRadius="4px" />
          </div>
          <Skeleton width="100%" height="32px" borderRadius="4px" />
        </div>

        {/* Comments */}
        <div className={styles.commentSection}>
            <Skeleton width="100px" height="1rem" />
        </div>

        {/* Uploader */}
        <div className={styles.uploaderInfo}>
          <Skeleton width="60px" height="0.75rem" style={{ marginBottom: '4px' }} />
          <Skeleton width="150px" height="1rem" />
        </div>

        {/* Settings List */}
        <div className={styles.settingsList}>
          {dummySettings.map((_, i) => (
            <div key={i} className={styles.settingItem} style={{ border: 'none', background: 'transparent', padding: 0 }}>
              <Skeleton width="100%" height="40px" borderRadius="4px" />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default MangaReaderSkeleton;