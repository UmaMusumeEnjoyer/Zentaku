import React from 'react';
import { type ActivityFeedProps } from '@umamusumeenjoyer/shared-logic';
import { useActivityFeed } from '@umamusumeenjoyer/shared-logic';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './ActivityFeed.css';

const ActivityFeed: React.FC<ActivityFeedProps> = ({ filterDate }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation(['ActivityFeed']);
  
  // Kết nối ViewModel - Truyền hàm t vào hook
  const {
    username,
    loading,
    displayItems,
    canLoadMore,
    hasActivity,
    handleLoadMore,
    getTargetUrl,
    formatTimeAgo,
    getActionClass,
    getActionIconChar,
    getActionDescription,
    getTargetName
  } = useActivityFeed({ filterDate, t });

  const handleTargetClick = (item: any) => {
    const url = getTargetUrl(item);
    navigate(url);
  };

  // --- Render Loading ---
  if (loading) return <div className="feed-loading" data-theme={theme}>{t('ActivityFeed:loading')}</div>;
  
  // --- Render Empty State ---
  if (!hasActivity) {
    return (
      <div className="feed-empty" data-theme={theme} style={{textAlign: 'left', paddingLeft: '10px'}}>
        {filterDate 
          ? t('ActivityFeed:empty_state.no_activity_on_date', { date: filterDate })
          : t('ActivityFeed:empty_state.no_activity')
        }
      </div>
    );
  }

  // --- Render List ---
  return (
    <div className="feed-container" data-theme={theme}>
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;

        return (
          <div key={item.id} className="feed-row">
            {/* Timeline Column */}
            <div className="feed-timeline">
               <div className={`feed-icon-circle ${getActionClass(item.action_type)}`}>
                   {getActionIconChar(item.action_type)}
               </div>
               {!isLast && <div className="feed-line"></div>}
            </div>

            {/* Content Column */}
            <div className="feed-content-wrapper">
                <div className="feed-header">
                    <span className="feed-user">{username}</span>
                    
                    <span className="feed-action">
                        {getActionDescription(item.action_type)}
                    </span>
                    
                    <span 
                        className="feed-target clickable" 
                        onClick={() => handleTargetClick(item)}
                        role="button"
                        tabIndex={0}
                    >
                        {getTargetName(item)}
                    </span>
                    
                    <span className="feed-time">{formatTimeAgo(item.ago_seconds)}</span>
                </div>
            </div>
          </div>
        );
      })}

      {canLoadMore && (
        <button className="btn-load-more" onClick={handleLoadMore}>
          {t('ActivityFeed:buttons.load_more')}
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;