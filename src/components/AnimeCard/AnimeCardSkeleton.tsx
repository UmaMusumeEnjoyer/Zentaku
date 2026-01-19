import React from 'react';
// 1. Tái sử dụng CSS Module gốc để đảm bảo layout khớp 1:1
import styles from './AnimeCard.module.css';
// 2. Import component Skeleton base (giả định đường dẫn)
import Skeleton from '../PlaceholderSkeleton/Skeleton'; 

const AnimeCardSkeleton: React.FC = () => {
  return (
    // Thay Link bằng div để không click được, nhưng giữ class layout
    <div className={styles['anime-card-link']}>
      <div className={`${styles['anime-card']} ${styles['skeleton']}`}>
        
        {/* --- IMAGE SKELETON --- */}
        {/* Class 'anime-poster' chứa logic aspect-ratio: 2/3
            giúp giữ chỗ chính xác cho ảnh poster */}
        <div className={styles['anime-poster']} style={{ display: 'block' }}>
          <Skeleton 
            width="100%" 
            height="100%" 
            borderRadius={0} // Để border-radius của card (overflow hidden) xử lý
          />
        </div>
        
        {/* --- DETAILS SKELETON --- */}
        <div className={styles['anime-details']}>
          {/* Mô phỏng Title: Dùng class gốc để lấy margin và min-height */}
          <div className={styles['anime-title-text']}>
            {/* Dòng 1: Dài hơn */}
            <Skeleton 
              width="90%" 
              height="0.9rem" 
              style={{ marginBottom: '4px' }} 
            />
            {/* Dòng 2: Ngắn hơn (mô phỏng text tự nhiên) */}
            <Skeleton width="60%" height="0.9rem" />
          </div>

          {/* Mô phỏng Airing Info (Episode time) */}
          <div className={styles['airing-info']}>
            <p className={styles['episode-time']}>
              <Skeleton width="40%" height="0.75rem" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component tiện ích để render danh sách Skeleton (cho Grid/List view)
interface AnimeCardSkeletonListProps {
  count?: number;
}

export const AnimeCardSkeletonList: React.FC<AnimeCardSkeletonListProps> = ({ count = 6 }) => {
  // Tạo mảng giả (dummy array) để render
  const skeletons = Array(count).fill(0);

  return (
    <>
      {skeletons.map((_, index) => (
        <AnimeCardSkeleton key={`skeleton-anime-${index}`} />
      ))}
    </>
  );
};

export default AnimeCardSkeleton;