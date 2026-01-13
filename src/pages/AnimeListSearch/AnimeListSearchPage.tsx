import React from 'react';
import ListSearchBar from './components/ListSearchBar'; 
import TopListsSection from './components/TopListsSection';
import SearchListCard from './components/SearchListCard';
import { useAnimeListSearchPage } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
// [CHANGE] Import styles
import styles from './AnimeListSearchPage.module.css';

const AnimeListSearchPage: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation(['AnimeListSearch']);
  
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
    <div className={styles.animeListSearchPage} data-theme={theme}>
      <div className={`${styles.listPageHeader} ${styles.container}`}>
        <h1>{t('AnimeListSearch:page_header.title')}</h1>
        <p>{t('AnimeListSearch:page_header.subtitle')}</p>
      </div>

      <ListSearchBar onSearch={handleSearch} />

      <div className={`${styles.pageContent} ${styles.container}`}>
        
        {isSearching ? (
          // --- VIEW 1: SEARCH RESULTS ---
          <section className={styles.searchResultsSection}>
            <h2 className={styles.sectionTitle}>
              {loadingSearch 
                ? t('AnimeListSearch:search_results.searching')
                : `${t('AnimeListSearch:search_results.title')} ${searchMetadata ? `(${searchMetadata.total})` : ''}`
              }
            </h2>

            {loadingSearch ? (
               <p style={{color: 'var(--text-secondary)'}}>{t('AnimeListSearch:search_results.loading')}</p>
            ) : searchResults.length > 0 ? (
              <div className={styles.listsGrid}>
                {searchResults.map((list) => (
                  <SearchListCard key={list.list_id} listData={list} />
                ))}
              </div>
            ) : (
              <p style={{color: 'var(--text-secondary)'}}>{t('AnimeListSearch:search_results.no_results')}</p>
            )}
          </section>

        ) : (
          // --- VIEW 2: TOP LISTS (DEFAULT) ---
          loadingTop ? (
            <p style={{color: 'var(--text-secondary)'}}>{t('AnimeListSearch:top_lists.loading')}</p>
          ) : (
            <TopListsSection title={t('AnimeListSearch:top_lists.title')} lists={topLists} />
          )
        )}
      </div>
    </div>
  );
};

export default AnimeListSearchPage;