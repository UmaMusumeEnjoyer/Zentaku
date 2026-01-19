import React from 'react';
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton'; // Đường dẫn giả định
import styles from './AnimeListSearchPage.module.css';

// Component con: Skeleton cho từng Card (dùng chung)
const ListCardSkeleton = () => {
  return (
    <div className={`${styles['.animeListCard']} ${styles['skeleton']}`}>
      {/* Preview Area - height matches .alcPreview (160px) */}
      <div className={styles.alcPreview}>
        <Skeleton width="100%" height="100%" borderRadius="8px 8px 0 0" />
      </div>
      
      {/* Info Area */}
      <div className={styles.alcInfo}>
        {/* Title */}
        <Skeleton width="85%" height={20} style={{ marginBottom: 10 }} />
        <Skeleton width="60%" height={20} />
        
        {/* Meta (User + Likes) */}
        <div className={styles.alcMeta} style={{ marginTop: 15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Skeleton width={24} height={24} borderRadius="50%" />
            <Skeleton width={60} height={14} />
          </div>
          <Skeleton width={40} height={14} />
        </div>
      </div>
    </div>
  );
};

// 1. Skeleton cho trạng thái đang Search (chỉ phần kết quả)
export const SearchResultsSkeleton: React.FC = () => {
  // Dummy array for grid
  const skeletonItems = Array.from({ length: 8 });

  return (
    <section className={styles.searchResultsSection}>
      {/* Section Title */}
      <div className={styles.sectionTitle}>
        <Skeleton width={200} height={24} />
      </div>

      {/* Grid Layout */}
      <div className={styles.listsGrid}>
        {skeletonItems.map((_, index) => (
          <ListCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
};

// 2. Skeleton cho toàn bộ Page (Initial Load)
const AnimeListSearchPageSkeleton: React.FC = () => {
  const { theme } = { theme: 'light' }; // Giả định theme default hoặc lấy từ context nếu cần
  const skeletonItems = Array.from({ length: 8 });

  return (
    <div className={styles.animeListSearchPage} data-theme={theme}>
      {/* Header */}
      <div className={`${styles.listPageHeader} ${styles.container}`}>
        <Skeleton width={300} height={40} style={{ marginBottom: 10 }} /> {/* h1 */}
        
      </div>

      {/* Search Bar Layout */}
      <div className={`${styles.listSearchBar} ${styles.container}`} style={{ paddingBottom: 0 }}>
        <div className={styles.lsSearchGroup} style={{ width: '100%' }}>
           {/* Label */}
           <Skeleton width={100} height={16} style={{ marginBottom: 8 }} />
           {/* Input Box - height matches .lsSearchBox input (44px) */}
           <Skeleton width="100%" height={44} borderRadius={6} />
        </div>
        {/* Placeholder for potential filters/buttons aligned end */}
         <Skeleton width={120} height={44} borderRadius={6} />
      </div>

      <div className={`${styles.pageContent} ${styles.container}`}>
        {/* Top Lists Section Skeleton */}
        <div style={{ marginTop: 20 }}>
            {/* Section Title */}
            <div className={styles.sectionTitle}>
                <Skeleton width={180} height={24} />
            </div>

            {/* Grid Layout */}
            <div className={styles.listsGrid}>
                {skeletonItems.map((_, index) => (
                    <ListCardSkeleton key={index} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeListSearchPageSkeleton;