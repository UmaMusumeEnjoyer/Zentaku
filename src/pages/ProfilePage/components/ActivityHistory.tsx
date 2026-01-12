import React from 'react';
import { type ActivityHistoryProps } from '@umamusumeenjoyer/shared-logic';
import { useActivityHistory } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './ActivityHistory.css';

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

  // Format date theo ngôn ngữ (tương tự formatDateByLanguage trong StaffPage)
  const formatDateByLanguage = (dateString: string) => {
    const date = new Date(dateString);
    const currentLang = i18n.language;
    
    if (currentLang === 'jp') {
      // Format Nhật: YYYY年MM月DD日
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    } else {
      // Format Anh: Month DD, YYYY
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return <div className="heatmap-container">{t('loading')}</div>;
  }

  return (
    <div className={`heatmap-wrapper ${theme}`}>
      <div className="heatmap-container">
        <div className="heatmap-grid">
            {yearWeeks.map((week, wIndex) => (
                <div key={wIndex} className="heatmap-col">
                    {week.map((day) => {
                        // Ẩn ngày tương lai
                        if (day.isFuture) return null;
                        
                        const count = heatmapCounts[day.date] || 0;
                        const isSelected = selectedDate === day.date;

                        return (
                            <div 
                                key={day.date}
                                className={`heatmap-cell ${getLevelClass(count)} ${isSelected ? 'selected-day' : ''}`}
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
       <div className="heatmap-legend">
           <span>{t('legend.less')}</span>
           <div className="heatmap-cell level-0"></div>
           <div className="heatmap-cell level-1"></div>
           <div className="heatmap-cell level-2"></div>
           <div className="heatmap-cell level-3"></div>
           <div className="heatmap-cell level-4"></div>
           <span>{t('legend.more')}</span>
       </div>
    </div>
  );
};

export default ActivityHistory;