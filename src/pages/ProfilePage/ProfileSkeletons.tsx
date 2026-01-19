import React from 'react';
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton'; // Đường dẫn tới component Skeleton gốc

// Import Styles từ các Module tương ứng
import pageStyles from './ProfilePage.module.css';
import bannerStyles from './components/ProfileBanner.module.css';
import historyStyles from './components/ActivityHistory.module.css';
import feedStyles from './components/ActivityFeed.module.css';

/* ========================================================================
   1. SIDEBAR SKELETON
   (Dựa trên ProfilePage.module.css)
   ======================================================================== */
export const ProfileSidebarSkeleton: React.FC = () => (
  <>
    {/* Avatar: dùng class profileAvatar để lấy size responsive (250px -> 80px) */}
    <div className={pageStyles.profileAvatarWrapper}>
      <Skeleton className={pageStyles.profileAvatar} borderRadius="50%" />
    </div>

    {/* Names */}
    <div className={pageStyles.profileNames}>
      <Skeleton height={24} width="70%" style={{ marginBottom: 8 }} />
      <Skeleton height={20} width="40%" />
    </div>

    {/* Edit Button Placeholder */}
    <div style={{ width: '100%', marginBottom: 16 }}>
      <Skeleton height={32} borderRadius={6} />
    </div>

    {/* Meta Info */}
    <div className={pageStyles.profileMeta}>
      <div className={pageStyles.metaItem}>
        <Skeleton width={16} height={16} borderRadius={2} />
        <Skeleton width={120} height={14} style={{ marginLeft: 8 }} />
      </div>
    </div>

    <div className={pageStyles.separator}></div>

    {/* Badges */}
    <div className={pageStyles.badgeSection}>
      <Skeleton height={16} width={60} style={{ marginBottom: 8 }} />
      <Skeleton height={24} width={80} borderRadius={20} />
    </div>
  </>
);

/* ========================================================================
   2. BANNER SKELETON
   (Dựa trên ProfileBanner.module.css)
   ======================================================================== */
export const ProfileBannerSkeleton: React.FC = () => (
  <div className={bannerStyles.profileNavContainer}>
    <div className={bannerStyles.profileNav}>
      {/* Giả lập 4 tab items */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={bannerStyles.navItem} style={{ borderBottom: 'none' }}>
           {/* Icon placeholder */}
           <Skeleton width={16} height={16} borderRadius={2} style={{ marginRight: 8 }} />
           {/* Text placeholder */}
           <Skeleton width={60} height={14} />
        </div>
      ))}
    </div>
  </div>
);

/* ========================================================================
   3. ACTIVITY HISTORY (HEATMAP) SKELETON
   (Dựa trên ActivityHistory.module.css)
   ======================================================================== */
export const ActivityHistorySkeleton: React.FC = () => (
  // Sử dụng heatmapWrapper để có border, padding và background đúng
  <div className={historyStyles.heatmapWrapper}>
    <div className={historyStyles.heatmapContainer}>
      {/* Thay vì render hàng trăm ô nhỏ, ta render một block lớn đại diện cho grid */}
      <Skeleton width="100%" height={100} borderRadius={4} />
    </div>
    
    {/* Legend Area */}
    <div className={historyStyles.heatmapLegend}>
       <Skeleton width={30} height={12} style={{ marginRight: 4 }} />
       <div style={{ display: 'flex', gap: 3 }}>
          {[1, 2, 3, 4, 5].map(i => (
             <Skeleton key={i} width={10} height={10} borderRadius={2} />
          ))}
       </div>
       <Skeleton width={30} height={12} style={{ marginLeft: 4 }} />
    </div>
  </div>
);

/* ========================================================================
   4. ACTIVITY FEED SKELETON
   (Dựa trên ActivityFeed.module.css)
   ======================================================================== */
export const ActivityFeedSkeleton: React.FC = () => (
  <div className={feedStyles.feedContainer}>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className={feedStyles.feedRow}>
        {/* Timeline Column */}
        <div className={feedStyles.feedTimeline}>
           {/* Icon Circle Skeleton */}
           <Skeleton width={16} height={16} borderRadius="50%" style={{ marginTop: 4 }} />
           {/* Line Skeleton (nếu không phải item cuối) */}
           {i !== 4 && (
             <div 
                className={feedStyles.feedLine} 
                style={{ backgroundColor: 'var(--border-subtle)' }} 
             />
           )}
        </div>

        {/* Content Column */}
        <div className={feedStyles.feedContentWrapper}>
            <div className={feedStyles.feedHeader} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                {/* User */}
                <Skeleton width={80} height={14} />
                {/* Action */}
                <Skeleton width={40} height={14} />
                {/* Target */}
                <Skeleton width={100} height={14} />
                {/* Time */}
                <Skeleton width={30} height={12} />
            </div>
        </div>
      </div>
    ))}
  </div>
);

/* ========================================================================
   5. ANIME LISTS SKELETON
   (Dựa trên ProfilePage.module.css)
   ======================================================================== */
export const AnimeListsSkeleton: React.FC = () => (
  <div className={pageStyles.customListGrid}>
    {[1, 2, 3, 4].map((item) => (
      // Reuse customListCard class for hover effects, padding, border
      <div key={item} className={pageStyles.customListCard}>
        {/* Title & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <Skeleton height={20} width="60%" />
            <Skeleton height={14} width={40} style={{ marginLeft: 'auto' }} borderRadius={10} />
        </div>
        
        {/* Description Lines */}
        <Skeleton height={14} width="90%" style={{ marginBottom: 4 }} />
        <Skeleton height={14} width="50%" />
        
        {/* Meta count */}
        <div className={pageStyles.listMeta} style={{ marginTop: 12 }}>
           <Skeleton height={12} width={30} />
        </div>
      </div>
    ))}
  </div>
);

/* ========================================================================
   6. FAVORITES SKELETON
   (Dựa trên ProfilePage.module.css)
   ======================================================================== */
export const FavoritesSkeleton: React.FC = () => (
  <div className={pageStyles.animeGrid6}>
    {[...Array(12)].map((_, index) => (
      <div key={index} className={pageStyles.gridItem}>
         {/* Aspect ratio 2:3 cho Anime Poster */}
         <Skeleton style={{ aspectRatio: '2/3', width: '100%' }} borderRadius={4} />
         <Skeleton height={14} width="80%" style={{ marginTop: 8 }} />
      </div>
    ))}
  </div>
);