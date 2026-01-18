import React from 'react';
import Skeleton from '../../../../components/PlaceholderSkeleton/Skeleton'; // Đảm bảo đường dẫn import đúng
import styles from './MainContentArea.module.css';

// KHÔNG import CharactersSkeleton ở đây nữa
// import CharactersSkeleton from './Characters_section/CharactersSkeleton';

// Helper component để tạo khung tiêu đề Section giống hệt thật
const SectionSkeleton: React.FC<{ children: React.ReactNode; titleWidth?: number }> = ({ 
  children, 
  titleWidth = 150 
}) => (
  <section className={styles.contentSection}>
    <div className={styles.sectionTitle}>
      <Skeleton width={titleWidth} height={24} />
    </div>
    {children}
  </section>
);

const MainContentSkeleton: React.FC = () => {
  return (
    <main className={styles.mainContentArea}>
      
      {/* 1. Characters Section Skeleton */}
      <SectionSkeleton titleWidth={120}>
        {/* TODO: Import và thêm <CharactersSkeleton /> vào đây sau */}
        {/* Placeholder tạm thời: Giả lập Grid 3 cột đơn giản */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <Skeleton height={80} borderRadius={6} />
            <Skeleton height={80} borderRadius={6} />
            <Skeleton height={80} borderRadius={6} />
        </div>
      </SectionSkeleton>
      
      {/* 2. Staff Section Skeleton */}
      <SectionSkeleton titleWidth={100}>
        {/* TODO: Import và thêm <StaffSkeleton /> vào đây sau */}
        <div style={{ display: 'flex', gap: '20px' }}>
             <Skeleton width="100%" height={80} borderRadius={6} />
             <Skeleton width="100%" height={80} borderRadius={6} />
        </div>
      </SectionSkeleton>
      
      {/* 3. Rankings Section Skeleton */}
      <SectionSkeleton titleWidth={140}>
        {/* TODO: Thêm <RankingsSkeleton /> vào đây sau */}
        <Skeleton width="100%" height={150} />
      </SectionSkeleton>
      
      {/* 4. Distribution Sections (Stats) Skeleton */}
      <div className={styles.distributionContainer}>
        {/* Status Distribution */}
        <div style={{ flex: 1 }}>
            <SectionSkeleton titleWidth={160}>
                 {/* TODO: Thêm <StatusDistributionSkeleton /> */}
                 <Skeleton width="100%" height={200} />
            </SectionSkeleton>
        </div>
        
        {/* Score Distribution */}
        <div style={{ flex: 1 }}>
            <SectionSkeleton titleWidth={160}>
                 {/* TODO: Thêm <ScoreDistributionSkeleton /> */}
                 <Skeleton width="100%" height={200} />
            </SectionSkeleton>
        </div>
      </div>
      
      {/* 5. Trailer Section Skeleton */}
      <SectionSkeleton titleWidth={100}>
        <div className={styles.trailerContainer} style={{ backgroundColor: 'transparent' }}>
             {/* TODO: Thêm <TrailerSkeleton /> hoặc giữ nguyên */}
             <Skeleton width="100%" height="100%" borderRadius={8} />
        </div>
      </SectionSkeleton>

    </main>
  );
};

export default MainContentSkeleton;