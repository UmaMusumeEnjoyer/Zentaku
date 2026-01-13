import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
// [CHANGE] Import styles from module
import styles from './AnimeSearchPage.module.css';

// Import Components
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import SectionGrid from './components/SectionGrid';
import AnimeCard from '../../components/AnimeCard/AnimeCard';

// Import Hook Logic
import { useAnimeSearchPage } from '@umamusumeenjoyer/shared-logic';
// [NOTE] useTheme không còn cần thiết để lấy giá trị 'theme' string cho class name nữa, 
// nhưng vẫn giữ nếu component con cần context này. 
// Trong trường hợp này, ta có thể bỏ destruct { theme } nếu không dùng logic gì khác.
import { useTheme } from '../../context/ThemeContext';

// Import Static Data
import {
  heroList,
  trendingAnime,
  popularSeason,
  upcomingNext,
  allTimePopular
} from '@umamusumeenjoyer/shared-logic';

const AnimeSearchPage: React.FC = () => {
  // [CHANGE] Class name giờ tự động handle theo CSS variables, không cần string template theme
  const { theme } = useTheme(); 
  const { t } = useTranslation('AnimeSearch');
  
  const {
    searchResults,
    isSearching,
    loading,
    viewTitle,
    canLoadMore,
    currentFilters,
    handleSearch,
    handleBackToHome,
    handleViewAllClick,
    handleLoadMore
  } = useAnimeSearchPage();

  return (
    // [CHANGE] Sử dụng styles.animeSearchPage thay vì className string
    // Thuộc tính data-theme vẫn giữ để hỗ trợ debug hoặc global overrides nếu cần
    <div className={styles.animeSearchPage} data-theme={theme}>
      <HeroSection slides={heroList} />
      
      <FilterBar onSearch={handleSearch} activeFilters={currentFilters} />

      <div className={styles.pageContent}>
        {isSearching ? (
          // --- VIEW: SEARCH MODE ---
          <div className={`${styles.container} ${styles.animeSection}`}>
            
            <div className={styles.searchResultsHeader}>
              <h2 className={styles.sectionTitle}>{viewTitle}</h2>
              <button className={styles.backBtn} onClick={handleBackToHome}>
                <FaArrowLeft /> {t('searchResults.back')}
              </button>
            </div>
            
            <div className={styles.animeGrid}>
              {searchResults.length > 0 ? (
                searchResults.map((anime, index) => (
                  <div key={`${anime.id}-${index}`} className={styles.gridItem}>
                    <AnimeCard anime={anime} />
                  </div>
                ))
              ) : (
                !loading && (
                  <div className={styles.noResultsMessage}>
                    {t('searchResults.noResults')}
                  </div>
                )
              )}
            </div>

            {loading && <div className={styles.loadingMessage}>{t('searchResults.loading')}</div>}

            {!loading && canLoadMore && searchResults.length > 0 && (
              <div className={styles.loadMoreContainer}>
                <button className={styles.btnSeeMore} onClick={handleLoadMore}>
                  {t('searchResults.seeMore')}
                </button>
              </div>
            )}
          </div>
        ) : (
          // --- VIEW: DEFAULT HOME MODE ---
          <>
            <SectionGrid 
                title={t('sections.trendingNow')}
                data={trendingAnime} 
                onViewAll={() => handleViewAllClick('TRENDING_NOW')}
            />
            
            <SectionGrid 
              title={t('sections.popularThisSeason')}
              data={popularSeason} 
              onViewAll={() => handleViewAllClick('POPULAR_THIS_SEASON')}
            />
            
            <SectionGrid 
              title={t('sections.upcomingNextSeason')}
              data={upcomingNext} 
              onViewAll={() => handleViewAllClick('UPCOMING_NEXT_SEASON')}
            />
            
            <SectionGrid 
              title={t('sections.allTimePopular')}
              data={allTimePopular} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AnimeSearchPage;