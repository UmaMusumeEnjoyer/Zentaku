import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { type ListSearchBarProps } from '@umamusumeenjoyer/shared-logic';
import { useListSearchBar } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import '../AnimeListSearchPage.css';

const ListSearchBar: React.FC<ListSearchBarProps> = ({ onSearch }) => {
  const { t } = useTranslation(['AnimeListSearch']);
  
  const { 
    keyword, 
    setKeyword, 
    handleSearchAction, 
    handleKeyDown 
  } = useListSearchBar(onSearch);

  return (
    <div className="list-search-bar container">
      <div className="ls-search-group">
        <label>{t('AnimeListSearch:search_bar.label')}</label>
        <div className="ls-search-box">
          <input
            type="text"
            placeholder={t('AnimeListSearch:search_bar.placeholder')}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div 
            className="ls-search-btn" 
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