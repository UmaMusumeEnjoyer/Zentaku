// src/components/MainContent/Statistics_section/StatusDistribution.tsx
import React from 'react';
import type { StatusDistributionProps } from '@umamusumeenjoyer/shared-logic';
import { useStatusDistribution } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
// 1. Import CSS Module
import styles from './StatusDistribution.module.css';
// 2. Xóa useTheme
// import { useTheme } from '../../../../../context/ThemeContext';

const StatusDistribution: React.FC<StatusDistributionProps> = ({ distribution }) => {
  const { sortedDistribution, totalUsers, getStatusColor } = useStatusDistribution(distribution);
  // const { theme } = useTheme(); -> Đã xóa
  
  const { t } = useTranslation(['StatisticsSection', 'common']);

  if (!distribution || distribution.length === 0) {
    return <p>{t('StatisticsSection:status_distribution.no_data')}</p>;
  }

  return (
    // 3. Sử dụng class từ module
    <div className={styles.container}>
      {/* Phần Legend */}
      <div className={styles.statusLegend}>
        {sortedDistribution.map(({ status, amount }) => (
          <div key={status} className={styles.legendItem}>
            <button 
              className={styles.legendButton} 
              style={{ backgroundColor: getStatusColor(status) }}
            >
              {status}
            </button>
            <p className={styles.legendUsers}>
              {t('common:users_count', { count: amount })}
            </p>
          </div>
        ))}
      </div>

      {/* Phần Progress Bar */}
      <div className={styles.statusProgressBar}>
        {sortedDistribution.map(({ status, amount }) => (
          <div
            key={status}
            className={styles.progressSegment}
            style={{
              width: totalUsers > 0 ? `${(amount / totalUsers) * 100}%` : '0%',
              backgroundColor: getStatusColor(status),
            }}
            title={`${status}: ${t('common:users_count', { count: amount })}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default StatusDistribution;