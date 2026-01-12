// src/components/MainContent/Ranking_section/RankingCard.tsx
import React from 'react';
import type { Ranking } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
// 1. Import CSS Module
import styles from './RankingCard.module.css';

// 2. Xóa import useTheme vì không cần thiết nữa
// import { useTheme } from '../../../../../context/ThemeContext';

interface RankingCardProps {
  ranking: Ranking;
}

const RankingCard: React.FC<RankingCardProps> = ({ ranking }) => {
  const { t } = useTranslation('RankingSection');
  // const { theme } = useTheme(); -> Đã xóa

  const getIcon = () => {
    switch (ranking.type) {
      case 'RATED':
        return '⭐';
      case 'POPULAR':
        return '❤️';
      default:
        return '●';
    }
  };

  const getContextText = () => {
    const translatedSeason = ranking.season 
      ? t(`ranking.season.${ranking.season.toLowerCase()}`) 
      : '';

    return t('ranking.format', {
      rank: ranking.rank,
      context: ranking.context,
      season: translatedSeason,
      year: ranking.year
    });
  };

  return (
    // 3. Sử dụng class từ module
    <div className={styles.rankingCard}>
      <span className={styles.rankingIcon}>{getIcon()}</span>
      <span className={styles.rankingText}>{getContextText()}</span>
    </div>
  );
};

export default RankingCard;