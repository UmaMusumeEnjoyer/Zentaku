import React from 'react';
// Reuse styles to prevent CLS (Cumulative Layout Shift)
import styles from './AnimeSearchPage.module.css';

// Import Generic Skeleton
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton'; // Giả định đường dẫn

// Import Custom Component Placeholder per requirement
import AnimeCardPlaceholder from '../../components/AnimeCard/AnimeCardSkeleton'; // Giả định đường dẫn cùng thư mục với AnimeCard

const AnimeSearchSkeleton: React.FC = () => {
  // Create dummy array for grid items (e.g., 8 items)
  const dummyItems = Array.from({ length: 8 });

  return (
    // Reuse container classes from Search Mode view
    <div className={`${styles.container} ${styles.animeSection}`}>
      
      {/* Header Skeleton: Title & Back Button */}
      <div className={styles.searchResultsHeader}>
        {/* Title Placeholder */}
        <Skeleton width={250} height={32} borderRadius={4} />
        
        {/* Back Button Placeholder */}
        <Skeleton width={100} height={24} borderRadius={4} />
      </div>

      {/* Grid Skeleton: Reusing exact grid classes */}
      <div className={styles.animeGrid}>
        {dummyItems.map((_, index) => (
          <div key={index} className={styles.gridItem}>
            <AnimeCardPlaceholder />
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default AnimeSearchSkeleton;