import React from 'react';
import { FaHeart, FaListAlt } from 'react-icons/fa';
import { type SearchListCardProps } from '@umamusumeenjoyer/shared-logic';
import { useNavigate } from 'react-router-dom';
import { useSearchListCard } from '@umamusumeenjoyer/shared-logic';
// [CHANGE] Import styles
import styles from '../AnimeListSearchPage.module.css';

const SearchListCard: React.FC<SearchListCardProps> = ({ listData }) => {
  
  const navigate = useNavigate();
  const { 
    handleCardClick, 
    cardColor,
    avatarUrl,
    username,
    bannerImage,
    placeholderAvatar
  } = useSearchListCard(listData, navigate);
  return (
    <div 
      className={styles.animeListCard} 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* KHU VỰC ẢNH BANNER / MÀU */}
      <div className={styles.alcPreview}>
        {bannerImage ? (
          <div 
            className={styles.alcCover} 
            style={{ backgroundImage: `url(${bannerImage})` }}
          />
        ) : (
          <div 
            className={styles.alcColorPreview} 
            style={{ backgroundColor: cardColor, width: '100%', height: '100%' }}
          >
            <FaListAlt className={styles.alcColorIcon} />
          </div>
        )}
      </div>

      {/* THÔNG TIN LIST */}
      <div className={styles.alcInfo}>
        <h3 className={styles.alcTitle}>{listData.name}</h3>
        
        {listData.description && (
             <p className={styles.alcDescription}>
                 {listData.description}
             </p>
        )}

        <div className={styles.alcMeta}>
          {/* USER INFO */}
          <div className={styles.alcUser}>
            <img 
              src={avatarUrl} 
              alt="user" 
              className={styles.alcAvatar}
              onError={(e) => { e.currentTarget.src = placeholderAvatar; }}
            />
            <span>{username}</span>
          </div>

          <div className={styles.alcLikes}>
            <FaHeart className={styles.heartIcon}/> {listData.likeCount ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchListCard;