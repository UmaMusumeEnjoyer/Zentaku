import React from 'react';
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton'; // Đường dẫn giả định
import AnimeCardSkeleton from '../../components/AnimeCard/AnimeCardSkeleton'; // Component có sẵn như bạn yêu cầu

// Import CSS Modules
import pageStyles from './AnimeListPage.module.css';
import groupStyles from './components/UserAnimeGroup.module.css';
import sidebarStyles from './components/Sidebar.module.css';

// --- Sub-component: Skeleton cho từng User Row trong Sidebar ---
const UserItemSkeleton: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
    {/* Avatar */}
    <Skeleton width={32} height={32} borderRadius="50%" />
    {/* Name & Role */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <Skeleton width={100} height={14} />
      <Skeleton width={60} height={10} />
    </div>
  </div>
);

// --- Sub-component: Skeleton cho Sidebar ---
const SidebarSkeleton: React.FC = () => {
  return (
    <aside className={sidebarStyles.sidebar}>
      {/* 1. Owner Section */}
      <div className={sidebarStyles.sidebarSection}>
        <div className={sidebarStyles.sidebarHeader}>
            {/* Title: OWNER */}
            <Skeleton width={60} height={16} />
        </div>
        <UserItemSkeleton />
      </div>

      {/* 2. Editors Section */}
      <div className={sidebarStyles.sidebarSection}>
        <div className={sidebarStyles.sidebarHeader}>
           {/* Title: EDITORS (...) */}
           <Skeleton width={100} height={16} />
           {/* Add Button */}
           <Skeleton width={32} height={32} borderRadius={6} />
        </div>
        <div className={sidebarStyles.userList}>
          {Array.from({ length: 2 }).map((_, i) => (
            <UserItemSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* 3. Viewers Section */}
      <div className={sidebarStyles.sidebarSection}>
        <div className={sidebarStyles.sidebarHeader}>
           {/* Title: VIEWERS (...) */}
           <Skeleton width={100} height={16} />
           {/* Add Button */}
           <Skeleton width={32} height={32} borderRadius={6} />
        </div>
        <div className={sidebarStyles.userList}>
          {Array.from({ length: 3 }).map((_, i) => (
            <UserItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </aside>
  );
};

// --- Sub-component: Skeleton cho UserAnimeGroup ---
const UserAnimeGroupSkeleton: React.FC = () => {
  // Giả lập 1 hàng 5 item (mặc định của Grid)
  const dummyItems = Array.from({ length: 5 });

  return (
    <div className={groupStyles.userGroupSection}>
      {/* Header */}
      <div className={groupStyles.userGroupHeader}>
        <div className={groupStyles.userGroupTitle}>
          {/* Icon person */}
          <Skeleton width={24} height={24} borderRadius="50%" />
          {/* Text: Added by ... */}
          <Skeleton width={200} height={24} style={{ marginLeft: 10 }} />
          {/* Badge count */}
          <Skeleton width={30} height={20} borderRadius={10} style={{ marginLeft: 10 }} />
        </div>
        
        {/* Actions (Edit/Delete icons) */}
        <div className={groupStyles.userActionsControls}>
            <Skeleton width={32} height={32} borderRadius="50%" />
        </div>
      </div>

      {/* Grid Anime */}
      {/* Sử dụng đúng class grid logic của UserAnimeGroup để responsive tự động khớp */}
      <div className={groupStyles.animeGridRow}>
        {dummyItems.map((_, index) => (
          <div key={index} className={groupStyles.gridItemWrapper}>
            <div className={groupStyles.gridItem}>
              {/* Nhúng AnimeCardSkeleton đã có */}
              <AnimeCardSkeleton />
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className={groupStyles.loadMoreContainer}>
        <Skeleton width={120} height={36} borderRadius={20} />
      </div>
    </div>
  );
};

// --- Main Component: AnimeListPageSkeleton ---
const AnimeListPageSkeleton: React.FC = () => {
  const dummyGroups = Array.from({ length: 2 }); // Giả lập 2 nhóm user

  return (
    <div className={pageStyles.pageContainer}>
      <div className={pageStyles.mainLayout}>
        <main className="content-area">
          {/* List Header Skeleton */}
          <div style={{ marginBottom: 32 }}>
            <Skeleton width="40%" height={40} style={{ marginBottom: 16 }} />
            
          </div>

          {/* Sticky Search Bar */}
          <div className={pageStyles.filterBarSticky}>
            <div className={pageStyles.searchWrapper}>
              <span className={`material-symbols-outlined ${pageStyles.searchIcon}`} style={{ opacity: 0.5 }}>
                 search
              </span>
              {/* Input Skeleton */}
              <Skeleton 
                width="30%" 
                height={20} 
                style={{ marginLeft: 48, marginTop: 14 }} 
              />
            </div>
          </div>

          {/* Groups Container */}
          <div className="anime-lists-container">
            {dummyGroups.map((_, index) => (
              <UserAnimeGroupSkeleton key={index} />
            ))}
          </div>
        </main>

        <div className="sidebar-area">
          {/* Action Buttons (Edit, Delete, Join...) */}
          <div className={`${pageStyles.actionButtons} ${pageStyles.sidebarActions}`}>
             <Skeleton className={pageStyles.btn} width="100%" height={40} borderRadius={8} />
             <Skeleton className={pageStyles.btn} width="100%" height={40} borderRadius={8} />
          </div>

          {/* Sidebar Content */}
          <SidebarSkeleton />
        </div>
      </div>
    </div>
  );
};

export default AnimeListPageSkeleton;