import React from 'react';
import { type ActivityFeedProps } from '@umamusumeenjoyer/shared-logic';
import { useActivityFeed } from '@umamusumeenjoyer/shared-logic';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
// [CHANGE] Import styles from module
import styles from './ActivityFeed.module.css';

const ActivityFeed: React.FC<ActivityFeedProps> = ({ username, filterDate }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation(['ActivityFeed']);
  
  // Kết nối ViewModel
  const {
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
  } = useActivityFeed({ username, filterDate, t });

  const handleTargetClick = (item: any) => {
    const url = getTargetUrl(item);
    navigate(url);
  };

  // Helper function để map class từ logic cũ sang module class mới
  const getModuleActionClass = (actionTypeClass: string) => {
    // Giả sử getActionClass trả về chuỗi như 'feed-icon-add' hoặc 'feed-icon-update'
    // Ta cần map nó sang styles.feedIconAdd
    if (actionTypeClass.includes('add')) return styles.feedIconAdd;
    if (actionTypeClass.includes('update')) return styles.feedIconUpdate;
    return styles.feedIconDefault;
  };

  // --- Render Loading ---
  if (loading) {
    return <div className={styles.feedLoading} data-theme={theme}>{t('ActivityFeed:loading')}</div>;
  }
  
  // --- Render Empty State ---
  if (!hasActivity) {
    return (
      <div className={styles.feedEmpty} data-theme={theme} style={{textAlign: 'left', paddingLeft: '10px'}}>
        {filterDate 
          ? t('ActivityFeed:empty_state.no_activity_on_date', { date: filterDate })
          : t('ActivityFeed:empty_state.no_activity')
        }
      </div>
    );
  }

  // --- Render List ---
  return (
    // [CHANGE] Sử dụng styles.feedContainer và data-theme
    <div className={styles.feedContainer} data-theme={theme}>
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const actionClass = getActionClass(item.action_type);

        return (
          <div key={item.id} className={styles.feedRow}>
            {/* Timeline Column */}
            <div className={styles.feedTimeline}>
               <div className={`${styles.feedIconCircle} ${getModuleActionClass(actionClass)}`}>
                   {getActionIconChar(item.action_type)}
               </div>
               {!isLast && <div className={styles.feedLine}></div>}
            </div>

            {/* Content Column */}
            <div className={styles.feedContentWrapper}>
                <div className={styles.feedHeader}>
                    <span className={styles.feedUser}>{username}</span>
                    
                    <span className={styles.feedAction}>
                        {getActionDescription(item.action_type)}
                    </span>
                    
                    <span 
                        className={styles.feedTarget}
                        onClick={() => handleTargetClick(item)}
                        role="button"
                        tabIndex={0}
                    >
                        {getTargetName(item)}
                    </span>
                    
                    <span className={styles.feedTime}>{formatTimeAgo(item.ago_seconds)}</span>
                </div>
            </div>
          </div>
        );
      })}

      {canLoadMore && (
        <button className={styles.btnLoadMore} onClick={handleLoadMore}>
          {t('ActivityFeed:buttons.load_more')}
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;