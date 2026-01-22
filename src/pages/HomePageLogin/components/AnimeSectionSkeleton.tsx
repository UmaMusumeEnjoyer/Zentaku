import React from 'react';
import Skeleton from '../../../components/PlaceholderSkeleton/Skeleton';
import AnimeCardSkeleton from '../../../components/AnimeCard/AnimeCardSkeleton'; // Đường dẫn giả định
import styles from './AnimeSection.module.css';

const AnimeSectionSkeleton: React.FC = () => {
  // Không cần useTheme nữa vì CSS Variables tự xử lý màu sắc
  
  // Tạo mảng giả 7 item
  const dummyData = Array.from({ length: 7 });

  return (
    <section className={styles.animeSection}>
      
      {/* --- HEADER SKELETON --- */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          {/* Mô phỏng Title + Badge */}
          <Skeleton width={200} height={32} borderRadius={4} />
        </div>
        
        <div className={styles.headerControls}>
          {/* Mô phỏng nút View All/Controls */}
          <Skeleton width={80} height={30} borderRadius={20} />
        </div>
      </div>

      {/* --- GRID SKELETON --- */}
      <div className={styles.animeGrid}>
        {dummyData.map((_, index) => (
          <AnimeCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
};

export default AnimeSectionSkeleton;