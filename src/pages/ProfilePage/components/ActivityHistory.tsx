import React from 'react';
import { type ActivityHistoryProps } from '@umamusumeenjoyer/shared-logic';
import { useActivityHistory } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
// [CHANGE] Import styles from module
import styles from './ActivityHistory.module.css';

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ 
  username,
  onTotalCountChange, 
  selectedDate, 
  onDateSelect 
}) => {
  
  // Kết nối ThemeContext
  const { theme } = useTheme();
  
  // Kết nối i18n
  const { t, i18n } = useTranslation('ActivityHistory');
  
  // Kết nối ViewModel
  const { 
    heatmapCounts, 
    loading, 
    yearWeeks, 
    getLevelClass 
  } = useActivityHistory(username,onTotalCountChange);

  // Format date theo ngôn ngữ
  const formatDateByLanguage = (dateString: string) => {
    const date = new Date(dateString);
    const currentLang = i18n.language;
    
    if (currentLang === 'jp') {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    // [CHANGE] Use module class
    return <div className={styles.heatmapContainer}>{t('loading')}</div>;
  }

  return (
    // [CHANGE] Use styles.heatmapWrapper and data-theme
    <div className={styles.heatmapWrapper} data-theme={theme}>
      <div className={styles.heatmapContainer}>
        <div className={styles.heatmapGrid}>
            {yearWeeks.map((week, wIndex) => (
                <div key={wIndex} className={styles.heatmapCol}>
                    {week.map((day) => {
                        // Ẩn ngày tương lai
                        if (day.isFuture) return null;
                        
                        const count = heatmapCounts[day.date] || 0;
                        const isSelected = selectedDate === day.date;
                        
                        // [NOTE] getLevelClass trả về string dạng 'level-0', 'level-1'...
                        // Ta cần map nó vào styles['level-0']
                        const levelClassName = styles[getLevelClass(count)];

                        return (
                            <div 
                                key={day.date}
                                className={`
                                  ${styles.heatmapCell} 
                                  ${levelClassName} 
                                  ${isSelected ? styles.selectedDay : ''}
                                `}
                                title={`${formatDateByLanguage(day.date)}: ${count} ${t('tooltip.activities')}`}
                                onClick={() => onDateSelect && onDateSelect(day.date)}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
      </div>
      
      {/* Legend Area */}
       <div className={styles.heatmapLegend}>
           <span>{t('legend.less')}</span>
           <div className={`${styles.heatmapCell} ${styles['level-0']}`}></div>
           <div className={`${styles.heatmapCell} ${styles['level-1']}`}></div>
           <div className={`${styles.heatmapCell} ${styles['level-2']}`}></div>
           <div className={`${styles.heatmapCell} ${styles['level-3']}`}></div>
           <div className={`${styles.heatmapCell} ${styles['level-4']}`}></div>
           <span>{t('legend.more')}</span>
       </div>
    </div>
  );
};

export default ActivityHistory;