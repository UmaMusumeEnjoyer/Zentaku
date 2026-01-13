// src/pages/AnimeSearch/components/FilterBar.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
// [CHANGE] Import styles from module
import styles from './FilterBar.module.css';
import { FaSearch, FaSyncAlt } from 'react-icons/fa';
import { 
  filterData, 
  GENRE_I18N_MAP,
  type FilterBarProps 
} from '@umamusumeenjoyer/shared-logic';
import { useFilterBar } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';

const FilterBar: React.FC<FilterBarProps> = ({ onSearch, activeFilters }) => {
  const { theme } = useTheme();
  const { t } = useTranslation('AnimeSearch');
  
  const {
    filters,
    handleSearchAction,
    handleInputChange,
    handleFilterChange,
    handleClear,
    handleKeyDown,
  } = useFilterBar({ onSearch, activeFilters: activeFilters??undefined});

  return (
    // [CHANGE] Use styles.filterBar and data-theme attribute
    <div className={styles.filterBar} data-theme={theme}>
      {/* 1. SEARCH */}
      <div className={`${styles.filterGroup} ${styles.filterSearch}`}>
        <label>{t('filterBar.labels.search')}</label>
        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t('filterBar.placeholder.search')}
            value={filters.keyword}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className={styles.searchBtn} onClick={handleSearchAction}>
            <FaSearch />
          </div>
        </div>
      </div>

      {/* 2. GENRES */}
      <div className={`${styles.filterGroup} ${styles.filterGenres}`}>
        <label>{t('filterBar.labels.genres')}</label>
        <select 
          className={styles.selectInput}
          value={filters.genre} 
          onChange={(e) => handleFilterChange('genre', e.target.value)}
        >
          <option value="Any">{t('filterBar.options.any')}</option>
          {filterData.genres.map((g) => {
            const i18nKey = GENRE_I18N_MAP[g];
            return (
              <option key={g} value={g}>
                {t(`filterBar.options.genres.${i18nKey}`)}
              </option>
            );
          })}
        </select>
      </div>

      {/* 3. YEAR */}
      <div className={`${styles.filterGroup} ${styles.filterYear}`}>
        <label>{t('filterBar.labels.year')}</label>
        <select 
          className={styles.selectInput}
          value={filters.year} 
          onChange={(e) => handleFilterChange('year', e.target.value)}
        >
          <option value="Any">{t('filterBar.options.any')}</option>
          {filterData.years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* 4. SEASON */}
      <div className={`${styles.filterGroup} ${styles.filterSeason}`}>
        <label>{t('filterBar.labels.season')}</label>
        <select 
          className={styles.selectInput}
          value={filters.season} 
          onChange={(e) => handleFilterChange('season', e.target.value)}
        >
          <option value="Any">{t('filterBar.options.any')}</option>
          {filterData.seasons.map((item) => (
            <option key={item.value} value={item.value}>
              {t(`filterBar.options.seasons.${item.label}`)}
            </option>
          ))}
        </select>
      </div>

      {/* 5. FORMAT */}
      <div className={`${styles.filterGroup} ${styles.filterFormat}`}>
        <label>{t('filterBar.labels.format')}</label>
        <select 
          className={styles.selectInput}
          value={filters.format} 
          onChange={(e) => handleFilterChange('format', e.target.value)}
        >
          <option value="Any">{t('filterBar.options.any')}</option>
          {filterData.formats.map((item) => (
            <option key={item.value} value={item.value}>
              {t(`filterBar.options.formats.${item.label}`)}
            </option>
          ))}
        </select>
      </div>

      {/* 6. STATUS */}
      <div className={`${styles.filterGroup} ${styles.filterStatus}`}>
        <label>{t('filterBar.labels.status')}</label>
        <select 
          className={styles.selectInput}
          value={filters.status} 
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="Any">{t('filterBar.options.any')}</option>
          {filterData.statuses.map((item) => (
            <option key={item.value} value={item.value}>
              {t(`filterBar.options.statuses.${item.label}`)}
            </option>
          ))}
        </select>
      </div>

      {/* 7. SORT */}
      <div className={`${styles.filterGroup} ${styles.filterSort}`}>
        <label>{t('filterBar.labels.sort')}</label>
        <select 
          className={styles.selectInput}
          value={filters.sort} 
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          {filterData.sorts.map((item) => (
            <option key={item.value} value={item.value}>
              {t(`filterBar.options.sorts.${item.label}`)}
            </option>
          ))}
        </select>
      </div>

      {/* 8. CLEAR BUTTON */}
      <div className={styles.filterGroup} style={{ display: 'flex', alignItems: 'flex-end' }}>
        <button 
          onClick={handleClear}
          className={styles.btnClearFilter}
          title={t('filterBar.buttons.clearTitle')}
        >
          <FaSyncAlt style={{ marginRight: '5px' }} /> 
          {t('filterBar.buttons.clear')}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;