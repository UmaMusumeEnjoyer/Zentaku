import React from 'react';
import { useTranslation } from 'react-i18next';
import { useListHeader } from '@umamusumeenjoyer/shared-logic';
import type { ListHeaderProps } from '@umamusumeenjoyer/shared-logic';
import LikersModal from './LikersModal';

// Import CSS Module
import styles from './ListHeader.module.css';

const ListHeader: React.FC<ListHeaderProps> = ({ listInfo, listId }) => {
  const { t } = useTranslation(['listHeader']);
  const {
    isLiked,
    likeCount,
    isLoadingLike,
    showLikersModal,
    likersList,
    showingCount,
    handleToggleLike,
    handleViewLikers,
    handleCloseLikersModal,
  } = useListHeader(listId, listInfo.is_owner);

  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerText}>
        <h1 className={styles.pageTitle}>{listInfo.list_name}</h1>
        {listInfo.description && (
          <p className={styles.pageDescription}>{listInfo.description}</p>
        )}
        {listInfo.is_private && (
          <div className={styles.privateBadgeWrapper}>
            {/* Giữ class 'count-badge' nếu nó là class global, thêm styles.privateBadge để override màu */}
            <span className={`count-badge ${styles.privateBadge}`}>
              {t('listHeader.private')}
            </span>
          </div>
        )}
      </div>

      <div className={styles.headerActions}>
        {/* NÚT 1: CHỈ ĐỂ LIKE */}
        <button 
          className={`${styles.actionBtn} ${styles.likeBtn} ${isLiked ? styles.liked : ''}`} 
          onClick={handleToggleLike}
          disabled={isLoadingLike}
          title={isLiked ? t('listHeader.unlike') : t('listHeader.like')}
        >
          <span className={`material-symbols-outlined ${styles.heartIcon} ${isLiked ? styles.filled : ''}`}>
            favorite
          </span>
        </button>

        {/* NÚT 2: HIỂN THỊ SỐ LƯỢNG & XEM DANH SÁCH */}
        <button 
          className={`
            ${styles.actionBtn} 
            ${styles.countBtn} 
            ${listInfo.is_owner ? styles.clickable : ''}
          `}
          onClick={listInfo.is_owner ? handleViewLikers : undefined}
          title={listInfo.is_owner ? t('listHeader.viewLikers') : ""}
          disabled={!listInfo.is_owner && likeCount === 0}
        >
          <span className={styles.countNumber}>{likeCount}</span>
          <span className={styles.countLabel}>{t('listHeader.likesLabel')}</span>
        </button>
      </div>

      <LikersModal 
        isOpen={showLikersModal}
        onClose={handleCloseLikersModal}
        likersData={likersList}
        totalShowing={showingCount}
        totalLikes={likeCount}
      />
    </div>
  );
};

export default ListHeader;