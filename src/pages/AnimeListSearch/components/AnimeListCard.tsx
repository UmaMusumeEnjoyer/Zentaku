import React from 'react';
import { FaHeart, FaLayerGroup } from 'react-icons/fa';
import { type AnimeListCardProps } from '@umamusumeenjoyer/shared-logic';
import { useNavigate } from 'react-router-dom';
import { useAnimeListCard } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
// [CHANGE] Import styles
import styles from '../AnimeListSearchPage.module.css';

const AnimeListCard: React.FC<AnimeListCardProps> = ({ listData }) => {
  const { t } = useTranslation(['AnimeListSearch']);
  const navigate = useNavigate();
  
  const { 
    handleCardClick, 
    avatarUrl, 
    username, 
    bannerImage, 
    placeholderAvatar 
  } = useAnimeListCard(listData, navigate);

  return (
    <div 
      className={styles.animeListCard} 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* KHU VỰC ẢNH BANNER */}
      <div className={styles.alcPreview}>
        <div 
          className={styles.alcCover} 
          style={bannerImage ? { backgroundImage: `url(${bannerImage})` } : {}}
        />
        
        {/* LỚP PHỦ HIỂN THỊ SỐ LƯỢNG ITEM */}
        <div className={styles.alcOverlay}>
            <span className={styles.alcCount}>
                <FaLayerGroup /> {t('AnimeListSearch:card.items_count', { count: listData.itemCount ?? 0 })}
            </span>
        </div>
      </div>

      {/* THÔNG TIN LIST */}
      <div className={styles.alcInfo}>
        <h3 className={styles.alcTitle}>{listData.name}</h3>
        
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
          
          {/* LIKES */}
          <div className={styles.alcLikes}>
            <FaHeart className={styles.heartIcon}/> {listData.likeCount ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeListCard;