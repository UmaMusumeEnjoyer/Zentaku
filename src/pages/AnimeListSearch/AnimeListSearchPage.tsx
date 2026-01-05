import React from 'react';
import ListSearchBar from './components/ListSearchBar'; 
import TopListsSection from './components/TopListsSection';
import SearchListCard from './components/SearchListCard';
import { useAnimeListSearchPage } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './AnimeListSearchPage.css';

const AnimeListSearchPage: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation(['AnimeListSearch']);
  
  // Kết nối ViewModel
  const {
    topLists,
    searchResults,
    searchMetadata,
    loadingTop,
    loadingSearch,
    isSearching,
    handleSearch
  } = useAnimeListSearchPage();

  return (
    <div className="anime-list-search-page" data-theme={theme}>
      <div className="list-page-header container">
        <h1>{t('AnimeListSearch:page_header.title')}</h1>
        <p>{t('AnimeListSearch:page_header.subtitle')}</p>
      </div>

      <ListSearchBar onSearch={handleSearch} />

      <div className="page-content container">
        {/* LOGIC HIỂN THỊ CÓ ĐIỀU KIỆN */}
        
        {isSearching ? (
          // --- VIEW 1: SEARCH RESULTS ---
          <section className="search-results-section">
            <h2 className="section-title">
              {loadingSearch 
                ? t('AnimeListSearch:search_results.searching')
                : `${t('AnimeListSearch:search_results.title')} ${searchMetadata ? `(${searchMetadata.total})` : ''}`
              }
            </h2>

            {loadingSearch ? (
               <p>{t('AnimeListSearch:search_results.loading')}</p>
            ) : searchResults.length > 0 ? (
              <div className="lists-grid">
                {searchResults.map((list) => (
                  <SearchListCard key={list.list_id} listData={list} />
                ))}
              </div>
            ) : (
              <p style={{color: '#8BA0B2'}}>{t('AnimeListSearch:search_results.no_results')}</p>
            )}
          </section>

        ) : (
          // --- VIEW 2: TOP LISTS (DEFAULT) ---
          loadingTop ? (
            <p>{t('AnimeListSearch:top_lists.loading')}</p>
          ) : (
            <TopListsSection title={t('AnimeListSearch:top_lists.title')} lists={topLists} />
          )
        )}
      </div>
    </div>
  );
};

export default AnimeListSearchPage;