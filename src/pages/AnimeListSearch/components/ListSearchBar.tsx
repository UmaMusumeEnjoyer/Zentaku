import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { type ListSearchBarProps } from '@umamusumeenjoyer/shared-logic';
import { useListSearchBar } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
// [CHANGE] Import styles from module
import styles from '../AnimeListSearchPage.module.css';

const ListSearchBar: React.FC<ListSearchBarProps> = ({ onSearch }) => {
  const { t } = useTranslation(['AnimeListSearch']);
  
  const { 
    keyword, 
    setKeyword, 
    handleSearchAction, 
    handleKeyDown 
  } = useListSearchBar(onSearch);

  return (
    <div className={`${styles.listSearchBar} ${styles.container}`}>
      <div className={styles.lsSearchGroup}>
        <label>{t('AnimeListSearch:search_bar.label')}</label>
        <div className={styles.lsSearchBox}>
          <input
            type="text"
            placeholder={t('AnimeListSearch:search_bar.placeholder')}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div 
            className={styles.lsSearchBtn} 
            onClick={handleSearchAction}
            role="button"
            tabIndex={0}
          >
            <FaSearch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListSearchBar;