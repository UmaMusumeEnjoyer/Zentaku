import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import styles from './AnimeSearchPage.module.css';

import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import SectionGrid from './components/SectionGrid';
import AnimeCard from '../../components/AnimeCard/AnimeCard';
import AnimeSearchSkeleton from './AnimeSearchSkeleton';

import { useAnimeSearchPage } from '@umamusumeenjoyer/shared-logic';
import { heroList } from '@umamusumeenjoyer/shared-logic';

const AnimeSearchPage: React.FC = () => {
  const { t } = useTranslation('AnimeSearch');
  
  const {
    searchResults,
    isSearching,
    loading,
    viewTitle,
    canLoadMore,
    currentFilters,
    // Section data (API-loaded)
    trendingAnime,
    popularSeason,
    upcomingNext,
    allTimePopular,
    sectionsLoading,
    // Actions
    handleSearch,
    handleBackToHome,
    handleViewAllClick,
    handleLoadMore
  } = useAnimeSearchPage();

  return (
    <div className={styles.animeSearchPage}>
      <HeroSection slides={heroList} />
      
      <FilterBar onSearch={handleSearch} activeFilters={currentFilters} />

      <div className={styles.pageContent}>
        {isSearching ? (
          loading && searchResults.length === 0 ? (
            <AnimeSearchSkeleton />
          ) : (
            <div className={`${styles.container} ${styles.animeSection}`}>
              
              <div className={styles.searchResultsHeader}>
                <h2 className={styles.sectionTitle}>{viewTitle}</h2>
                <button className={styles.backBtn} onClick={handleBackToHome}>
                  <FaArrowLeft /> {t('searchResults.back')}
                </button>
              </div>
              
              <div className={styles.animeGrid}>
                {searchResults.length > 0 ? (
                  searchResults.map((anime, index) => ({
                    ...anime,
                    nextAiringEpisode: anime.nextAiringEpisode || undefined
                  }) as any).map((anime, index) => (
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
          )
        ) : (
          sectionsLoading ? (
            <AnimeSearchSkeleton />
          ) : (
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
          )
        )}
      </div>
    </div>
  );
};

export default AnimeSearchPage;