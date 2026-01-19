import React from 'react';
import ListSearchBar from './components/ListSearchBar'; 
import TopListsSection from './components/TopListsSection';
import SearchListCard from './components/SearchListCard';
import { useAnimeListSearchPage } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import styles from './AnimeListSearchPage.module.css';

// [UPDATE] Import cả 2 loại Skeleton
import AnimeListSearchPageSkeleton, { SearchResultsSkeleton } from './AnimeListSearchSkeleton';

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

  if (loadingTop && topLists.length === 0) {
    return <AnimeListSearchPageSkeleton />;
  }

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

            {/* [LOGIC 2] Xử lý Load khi tìm kiếm */}
            {loadingSearch ? (
               // Thay thế text loading đơn giản bằng Skeleton Grid
               <SearchResultsSkeleton />
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
          // Trường hợp loadingTop nhưng đã có data (ví dụ refresh ngầm) hoặc fallback
          loadingTop ? (
            // Nếu muốn skeleton cục bộ cho phần này, có thể dùng SearchResultsSkeleton tạm
            // hoặc giữ loading text nếu không muốn chớp nháy cả trang.
            // Ở đây vì Logic 1 đã bắt trường hợp load đầu tiên, dòng này chỉ là dự phòng.
             <SearchResultsSkeleton />
          ) : (
            <TopListsSection title={t('AnimeListSearch:top_lists.title')} lists={topLists} />
          )
        )}
      </div>
    </div>
  );
};

export default AnimeListSearchPage;