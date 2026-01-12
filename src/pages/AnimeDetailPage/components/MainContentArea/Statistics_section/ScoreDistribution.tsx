// src/components/MainContent/Statistics_section/ScoreDistribution.tsx
import React from 'react';
import type { ScoreDistributionProps } from '@umamusumeenjoyer/shared-logic';
import { useScoreDistribution } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
// 1. Import CSS Module
import styles from './ScoreDistribution.module.css';
// 2. Xóa useTheme
// import { useTheme } from '../../../../../context/ThemeContext';

const ScoreDistribution: React.FC<ScoreDistributionProps> = ({ distribution }) => {
  const { maxAmount, getScoreColor } = useScoreDistribution(distribution);
  // const { theme } = useTheme(); -> Đã xóa
  
  const { t } = useTranslation(['StatisticsSection', 'common']);

  if (!distribution || distribution.length === 0) {
    return <p>{t('StatisticsSection:score_distribution.no_data')}</p>;
  }

  return (
    // 3. Sử dụng class từ module
    <div className={styles.container}>
      <div className={styles.scoreChart}>
        {distribution.map(({ score, amount }) => (
          <div key={score} className={styles.chartBarItem}>
            <span className={styles.barAmount}>{amount.toLocaleString()}</span>
            <div className={styles.barElementContainer}>
              <div
                className={styles.barElement}
                style={{
                  height: maxAmount > 0 ? `${(amount / maxAmount) * 100}%` : '0%',
                  backgroundColor: getScoreColor(score),
                }}
                title={`${score}: ${t('common:users_count', { count: amount })}`}
              ></div>
            </div>
            <span className={styles.barScore}>{score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreDistribution;