import React from 'react';
import { useTranslation } from 'react-i18next';
import AnimeCard from '../../../components/AnimeCard/AnimeCard';
import { type SectionGridProps } from '@umamusumeenjoyer/shared-logic';
import { useSectionGrid } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import styles from './SectionGrid.module.css';

const SectionGrid: React.FC<SectionGridProps> = ({ title, data, onViewAll }) => {
  // Kết nối ViewModel, Theme và i18n
  const { handleViewAllClick, hasData } = useSectionGrid(data, onViewAll);
  const { theme } = useTheme();
  const { t } = useTranslation('common');

  if (!hasData) {
    return null; 
  }

  return (
    <div className={styles.animeSection} data-theme={theme}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        
        {/* Nút View All với i18n */}
        <a 
          href="#!" 
          className={styles.viewAllBtn} 
          onClick={handleViewAllClick}
        >
          {t('buttons.view_all')}
        </a>
      </div>

      <div className={styles.animeGrid}>
        {data.map((anime) => (
          <div key={anime.id} className={styles.gridItem}>
            {/* Truyền toàn bộ object anime vào component con */}
            <AnimeCard anime={anime} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;