// src/features/character/CharacterPageSkeleton.tsx
import React from 'react';
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton'; 
// Import component Skeleton riêng cho AnimeCard
import AnimeCardSkeleton from '../../components/AnimeCard/AnimeCardSkeleton'; 
import styles from './CharacterPage.module.css';

const CharacterPageSkeleton: React.FC = () => {
  // Tạo mảng giả để render grid (6 item)
  const dummyMedia = Array.from({ length: 6 });

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* === Phần nội dung chính (Ảnh + Thông tin) === */}
        <div className={styles.mainContent}>
          {/* Cột trái: Ảnh nhân vật */}
          <div className={styles.leftColumn}>
            <Skeleton 
              width="100%" 
              height={320} 
              borderRadius={8} 
              className={styles.characterImage} 
            />
          </div>

          {/* Cột phải: Thông tin chi tiết */}
          <div className={styles.rightColumn}>
            {/* Tên nhân vật */}
            <Skeleton 
              width="60%" 
              height={40} 
              style={{ marginBottom: 10 }} 
            />
            
            {/* Tên gốc */}
            <Skeleton 
              width="30%" 
              height={20} 
              style={{ marginBottom: 25 }} 
            />

            {/* Extra Info Grid */}
            <div className={styles.extraInfoGrid}>
                <Skeleton width="80%" height={20} />
                <Skeleton width="70%" height={20} />
            </div>

            {/* Description */}
            <div className={styles.description}>
              <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
              <Skeleton width="95%" height={16} style={{ marginBottom: 8 }} />
              <Skeleton width="90%" height={16} style={{ marginBottom: 8 }} />
              <Skeleton width="40%" height={16} />
            </div>
          </div>
        </div>

        {/* === Media Section === */}
        <div className={styles.mediaSection}>
          {/* Tiêu đề Section */}
          <div style={{ marginBottom: 20 }}>
             <Skeleton width={200} height={30} />
          </div>
          
          {/* Media Grid */}
          <div className={styles.mediaGrid}>
            {dummyMedia.map((_, index) => (
              /* Sử dụng component AnimeCardSkeleton chuyên biệt */
              <AnimeCardSkeleton key={index} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CharacterPageSkeleton;