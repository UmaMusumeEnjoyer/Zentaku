import React from 'react';
import { useTranslation } from 'react-i18next';
import { useListHeader } from '@umamusumeenjoyer/shared-logic';
import type { ListHeaderProps } from '@umamusumeenjoyer/shared-logic';
import LikersModal from './LikersModal';
import { useNavigate } from 'react-router-dom';
import { listService } from '@umamusumeenjoyer/shared-logic';

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

  const navigate = useNavigate();

  const handleChatClick = async () => {
    if (listInfo.channelId) {
      navigate(`/chat?channelId=${listInfo.channelId}`);
    } else if (listInfo.is_owner) {
      try {
        const res = await listService.createChat(listId);
        const data = res.data?.data || res.data;
        if (data.channelId) {
          navigate(`/chat?channelId=${data.channelId}`);
        }
      } catch (err) {
        console.error('Failed to create chat', err);
        alert('Có lỗi xảy ra khi tạo nhóm chat');
      }
    }
  };

  const FALLBACK_BANNER = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_EKkkCeMlmiwTOTcuvq-IgSjufiZ4Rz80Zw&s';
  const rawBanner = listInfo.bannerImage || '';
  const isColor = rawBanner.startsWith('#');
  const finalBanner = (rawBanner === '' || isColor) ? FALLBACK_BANNER : rawBanner;
  
  const hasBanner = true;

  const headerStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${finalBanner.startsWith('http') || finalBanner.startsWith('/') ? finalBanner : `https://${finalBanner}`})`
  };

  return (
    <div className={`${styles.pageHeader} ${hasBanner ? styles.withBanner : styles.noBanner}`} style={headerStyle}>
      <div className={styles.headerText}>
        <h1 className={styles.pageTitle} style={{ color: hasBanner ? 'white' : 'var(--text-primary)' }}>
          {listInfo.list_name}
        </h1>
        {listInfo.description && (
          <p className={styles.pageDescription} style={{ color: hasBanner ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }}>
            {listInfo.description}
          </p>
        )}
        {listInfo.is_private && (
          <div className={styles.privateBadgeWrapper}>
            <span className={`count-badge ${styles.privateBadge}`}>
              {t('listHeader.private')}
            </span>
          </div>
        )}
      </div>

      <div className={styles.headerActions} style={{ backgroundColor: hasBanner ? 'rgba(0,0,0,0.5)' : 'var(--bg-panel)', borderColor: hasBanner ? 'rgba(255,255,255,0.2)' : 'var(--border-subtle)' }}>
        {/* NÚT 1: CHỈ ĐỂ LIKE */}
        <button
          className={`${styles.actionBtn} ${styles.likeBtn} ${isLiked ? styles.liked : ''}`}
          onClick={handleToggleLike}
          disabled={isLoadingLike}
          title={isLiked ? t('listHeader.unlike') : t('listHeader.like')}
          style={{ color: hasBanner ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }}
        >
          <span className={`material-symbols-outlined ${styles.heartIcon} ${isLiked ? styles.filled : ''}`} style={{ color: isLiked ? '#ef4444' : 'inherit' }}>
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
          style={{
            color: hasBanner ? 'white' : 'var(--text-primary)',
            borderColor: hasBanner ? 'rgba(255,255,255,0.2)' : 'var(--border-subtle)'
          }}
        >
          <span className={styles.countNumber} style={{ color: hasBanner ? 'white' : 'var(--text-primary)' }}>{likeCount}</span>
          <span className={styles.countLabel} style={{ color: hasBanner ? 'rgba(255,255,255,0.8)' : 'inherit' }}>{t('listHeader.likesLabel')}</span>
        </button>

        {/* NÚT 3: TẠO / VÀO NHÓM CHAT */}
        {(listInfo.is_owner || (listInfo.isMember && listInfo.channelId)) && (
          <button
            className={`${styles.actionBtn} ${styles.chatBtn}`}
            onClick={handleChatClick}
            title={listInfo.channelId ? t('listHeader.enterChatTitle', 'Vào nhóm chat') : t('listHeader.createChatTitle', 'Tạo nhóm chat')}
            style={{
              color: hasBanner ? 'white' : 'var(--text-primary)',
              borderColor: hasBanner ? 'rgba(255,255,255,0.2)' : 'var(--border-subtle)'
            }}
          >
            <span className={`material-symbols-outlined ${styles.chatIcon}`} style={{ color: hasBanner ? 'white' : 'var(--primary-color)' }}>
              forum
            </span>
            <span className={styles.chatLabel} style={{ color: hasBanner ? 'rgba(255,255,255,0.8)' : 'inherit', marginLeft: '8px' }}>
              {listInfo.channelId ? t('listHeader.enterChat', 'Vào Chat') : t('listHeader.createChat', 'Tạo Chat')}
            </span>
          </button>
        )}
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