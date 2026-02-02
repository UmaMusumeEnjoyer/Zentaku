import React from 'react';
import Skeleton from '../../../../../components/PlaceholderSkeleton/Skeleton'; 
import styles from './SummarySection.module.css';

interface SummarySkeletonProps {
  hasBanner?: boolean;
}

const SummarySkeleton: React.FC<SummarySkeletonProps> = ({ hasBanner = true }) => {
  const sectionClass = !hasBanner 
    ? `${styles.summarySection} ${styles.noBanner}` 
    : styles.summarySection;

  return (
    <div className={sectionClass}>

      <div className={styles.summaryLeft}>
        <Skeleton 
          className={styles.summaryCover} 
          height={305} 
          borderRadius={8} 
        />
        
        <Skeleton 
          height={40} 
          borderRadius={6} 
        />
      </div>

      <div className={styles.summaryRight}>

        <Skeleton 
          height={48} 
          width="60%" 
          style={{ marginBottom: '15px' }} 
        />

        {/* Giả lập Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
          <Skeleton height={16} width="100%" />
          <Skeleton height={16} width="98%" />
          <Skeleton height={16} width="95%" />
          <Skeleton height={16} width="90%" />
          <Skeleton height={16} width="92%" />
          <Skeleton height={16} width="40%" />
        </div>
        
        {/* Giả lập nút Read More */}
        <Skeleton 
          height={14} 
          width={80} 
          style={{ marginBottom: '30px' }} 
        />

        {/* [NEW] Giả lập Navigation Bar */}
        <div className={styles.navBar} style={{ marginTop: 'auto' }}>
          <Skeleton height={20} width={60} />
          <Skeleton height={20} width={45} />
          <Skeleton height={20} width={70} />
          <Skeleton height={20} width={40} />
          <Skeleton height={20} width={40} />
          <Skeleton height={20} width={50} />
        </div>
      </div>
    </div>
  );
};

export default SummarySkeleton;