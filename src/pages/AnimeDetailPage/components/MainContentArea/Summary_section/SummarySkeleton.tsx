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
      {/* --- CỘT TRÁI (Ảnh bìa + Nút) --- */}
      <div className={styles.summaryLeft}>
        {/* Giả lập ảnh bìa (Cover Image) */}
        {/* Chiều cao 305px là ước lượng dựa trên tỷ lệ ảnh anime chuẩn (2:3) với width ~215px */}
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

      {/* --- CỘT PHẢI (Tiêu đề + Mô tả) --- */}
      <div className={styles.summaryRight}>
        {/* Giả lập Tiêu đề (Title) */}
        {/* Margin bottom 15px để khớp với .animeTitleMain */}
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
        
        {/* Giả lập nút "See more" nhỏ ở dưới */}
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