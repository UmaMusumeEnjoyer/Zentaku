import React from 'react';
import { useListHeader } from '@umamusumeenjoyer/shared-logic';
import type { ListHeaderProps } from '@umamusumeenjoyer/shared-logic';
import LikersModal from './LikersModal';
import './ListHeader.css';

const ListHeader: React.FC<ListHeaderProps> = ({ listInfo, listId }) => {
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
    <div className="page-header">
      <div className="header-text">
        <h1 className="page-title">{listInfo.list_name}</h1>
        {listInfo.description && (
          <p className="page-description">{listInfo.description}</p>
        )}
        {listInfo.is_private && (
          <div className="private-badge-wrapper">
            <span className="count-badge private-badge">Private</span>
          </div>
        )}
      </div>

      <div className="header-actions">
        {/* NÚT 1: CHỈ ĐỂ LIKE */}
        <button 
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`} 
          onClick={handleToggleLike}
          disabled={isLoadingLike}
          title={isLiked ? "Unlike" : "Like"}
        >
          <span className={`material-symbols-outlined heart-icon ${isLiked ? 'filled' : ''}`}>
            favorite
          </span>
        </button>

        {/* NÚT 2: HIỂN THỊ SỐ LƯỢNG & XEM DANH SÁCH (RIÊNG BIỆT) */}
        <button 
          className={`action-btn count-btn ${listInfo.is_owner ? 'clickable' : ''}`}
          onClick={listInfo.is_owner ? handleViewLikers : undefined}
          title={listInfo.is_owner ? "View who liked this list" : ""}
          disabled={!listInfo.is_owner && likeCount === 0}
        >
          <span className="count-number">{likeCount}</span>
          <span className="count-label">Likes</span>
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