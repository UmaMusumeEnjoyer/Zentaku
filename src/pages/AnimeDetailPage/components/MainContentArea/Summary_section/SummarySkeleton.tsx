import React from 'react';
import Skeleton from '../../../../../components/PlaceholderSkeleton/Skeleton'; // Đảm bảo đường dẫn import đúng
import styles from './SummarySection.module.css';

interface SummarySkeletonProps {
  hasBanner?: boolean;
}

const SummarySkeleton: React.FC<SummarySkeletonProps> = ({ hasBanner = true }) => {
  // Logic class giống hệt component thật để giữ layout chính xác
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
        
        {/* Giả lập nút (Button) */}
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

        {/* Giả lập đoạn mô tả (Description) - Tạo nhiều dòng với độ dài khác nhau */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Skeleton height={16} width="100%" />
          <Skeleton height={16} width="98%" />
          <Skeleton height={16} width="95%" />
          <Skeleton height={16} width="90%" />
          <Skeleton height={16} width="92%" />
          <Skeleton height={16} width="40%" />
        </div>
        
        <Skeleton 
          height={14} 
          width={80} 
          style={{ marginTop: '15px' }} 
        />
      </div>
    </div>
  );
};

export default SummarySkeleton;