// src/components/MainContent/Ranking_section/RankingsSection.tsx
import React from 'react';
import RankingCard from './RankingCard';
import { useRankingFilter } from '@umamusumeenjoyer/shared-logic';
import type { Ranking } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
// 1. Import CSS Module
import styles from './RankingsSection.module.css';
// 2. Xóa import useTheme
// import { useTheme } from '../../../../../context/ThemeContext';

interface RankingsSectionProps {
  rankings: Ranking[] | undefined;
}

const RankingsSection: React.FC<RankingsSectionProps> = ({ rankings }) => {
  const { t } = useTranslation('RankingSection');
  // const { theme } = useTheme(); -> Đã xóa
  const filteredRankings = useRankingFilter(rankings);

  if (!filteredRankings || filteredRankings.length === 0) {
    // 3. Sử dụng class module cho thông báo lỗi
    return (
      <p className={styles.noRankingsMessage}>
        {t('ranking.no_available')}
      </p>
    );
  }

  return (
    // 4. Sử dụng class module cho grid
    <div className={styles.rankingsGrid}>
      {filteredRankings.map(rank => (
        <RankingCard key={rank.id} ranking={rank} />
      ))}
    </div>
  );
};

export default RankingsSection;