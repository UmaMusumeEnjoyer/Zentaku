import React from 'react';
import Skeleton from '../../../components/PlaceholderSkeleton/Skeleton'; // Đường dẫn giả định theo yêu cầu
import { useTheme } from '../../../context/ThemeContext'; // Import context để style khớp theme
import './AnimeSection.css'; // Tái sử dụng CSS module gốc

const AnimeSectionSkeleton: React.FC = () => {
  const { theme } = useTheme();
  
  // Tạo mảng giả 7 item tương ứng với INITIAL_DISPLAY_COUNT = 7 trong component thật
  const dummyData = Array.from({ length: 7 });

  return (
    // Giữ nguyên cấu trúc section và data-theme để kế thừa padding/margin của .anime-section
    <section className="anime-section" data-theme={theme}>
      
      {/* --- HEADER SKELETON --- */}
      {/* Sử dụng class .section-header để giữ spacing và flex layout */}
      <div className="section-header">
        <div className="section-title">
          {/* Mô phỏng Title + Badge */}
          <Skeleton width={200} height={32} borderRadius={4} />
        </div>
        
        <div className="header-controls">
          {/* Mô phỏng nút Notify */}
          <Skeleton width={90} height={30} borderRadius={20} />
          {/* Mô phỏng nút View All */}
          <Skeleton width={80} height={30} borderRadius={20} />
        </div>
      </div>

      {/* --- GRID SKELETON --- */}
      {/* Sử dụng .anime-grid để kế thừa CSS Grid responsive (Desktop/Mobile) */}
      <div className="anime-grid">
        {dummyData.map((_, index) => (
          <div key={index} className="anime-card-skeleton">
            {/* Mô phỏng AnimeCard: Hình ảnh Poster */}
            {/* Height 220px là chiều cao phổ biến cho poster tỉ lệ 2:3 trong grid minmax(140px) */}
            <Skeleton 
              width="100%" 
              height={220} 
              borderRadius={8} 
              style={{ marginBottom: '8px' }}
            />
            
            {/* Mô phỏng AnimeCard: Tên Anime (Dòng 1 dài, Dòng 2 ngắn) */}
            <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: '4px' }} />
            <Skeleton width="60%" height={16} borderRadius={4} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnimeSectionSkeleton;