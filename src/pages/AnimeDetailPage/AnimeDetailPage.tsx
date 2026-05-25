// src/pages/AnimeDetail/AnimeDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAnimeDetail } from '@umamusumeenjoyer/shared-logic';

import PlaceholderSkeleton from '../../components/PlaceholderSkeleton/Skeleton';
import SummarySkeleton from './components/MainContentArea/Summary_section/SummarySkeleton';
import InfoSidebarSkeleton from './components/InfoSidebar/InfoSidebarSkeleton';
import MainContentSkeleton from './components/MainContentArea/MainContentSkeleton';


import styles from './AnimeDetailPage.module.css';

import SummarySection from './components/MainContentArea/Summary_section/SummarySection';
import InfoSidebar from './components/InfoSidebar/InfoSidebar';
import MainContentArea from './components/MainContentArea/MainContentArea';

const AnimeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // 3. Xóa destructuring theme
  const { anime, loading, error, hasBanner, staffList, characterList, stats } = useAnimeDetail(id);

  if (loading) {
    return (
      <div className={`${styles.pageWrapper}`}>
        <PlaceholderSkeleton 
          height="var(--banner-h)"
          borderRadius={0} 
        />   
        <div className={styles.mainContentContainer}>
        <div className={styles.contentWrapper}>
          <SummarySkeleton></SummarySkeleton>  
          <div className={styles.gridContainer}>
            <InfoSidebarSkeleton></InfoSidebarSkeleton>
            <MainContentSkeleton></MainContentSkeleton>
          </div>
          
        </div>
      </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className={`${styles.pageWrapper} ${styles.errorState}`}>
        {error || "Anime not found"}
      </div>
    );
  }
  return (
    // 4. Áp dụng styles.pageWrapper để lấy màu nền var(--bg-app)
    <div className={styles.pageWrapper}>
      
      {hasBanner ? (
        <div 
          className={styles.bannerImage} 
          style={{ backgroundImage: `url(${anime.bannerImage || anime.banner_image})` }}
        ></div>
      ) : (
        <div className={styles.bannerPlaceholder}></div>
      ) 
      }

      <div className={styles.mainContentContainer}>
        <div className={styles.contentWrapper}>
          
          <SummarySection anime={anime as any} hasBanner={hasBanner} />
          
          <div className={styles.gridContainer}>
            {/* Cột trái */}
            <InfoSidebar anime={anime as any} />
            
            {/* Cột phải */}
            <MainContentArea 
              anime={anime as any}
              staffList={staffList} 
              characterList={characterList}
              stats={stats}
             />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AnimeDetailPage;