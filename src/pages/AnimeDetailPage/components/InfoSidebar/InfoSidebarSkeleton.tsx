import React from 'react';
// Giả định component Skeleton nằm ở thư mục cha hoặc cùng thư mục. 
// Hãy điều chỉnh đường dẫn import này tùy theo cấu trúc dự án của bạn.
import Skeleton from '../../../../components/PlaceholderSkeleton/Skeleton'; 
import styles from './InfoSidebar.module.css';

const InfoSidebarSkeleton: React.FC = () => {
  // Tạo mảng gồm 8 phần tử giả để lấp đầy Sidebar
  // Số lượng 8 là đủ để tạo cảm giác "đầy đặn" trên desktop 
  // và đủ để kích hoạt scroll ngang trên mobile
  const dummyBlocks = Array.from({ length: 8 });

  return (
    <aside className={styles.sidebar}>
      {dummyBlocks.map((_, index) => (
        <div key={index} className={styles.block}>
          {/* Giả lập Label (Tiêu đề nhỏ) */}
          {/* height=14 tương đương font-size 0.9rem */}
          <Skeleton 
            width="50%" 
            height={14} 
            style={{ marginBottom: '6px' }} 
          />
          
          {/* Giả lập Value (Giá trị nội dung) */}
          {/* height=16 tương đương nội dung text */}
          <Skeleton 
            width="80%" 
            height={16} 
          />
        </div>
      ))}
    </aside>
  );
};

export default InfoSidebarSkeleton;