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
    coverImages, 
    placeholderAvatar 
  } = useAnimeListCard(listData, navigate);

  return (
    <div 
      className={styles.animeListCard} 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* KHU VỰC 3 ẢNH PREVIEW */}
      <div className={styles.alcPreview}>
        {coverImages.map((img, index) => (
          <div 
            key={index} 
            className={styles.alcCover} 
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        
        {/* LỚP PHỦ HIỂN THỊ SỐ LƯỢNG ITEM */}
        <div className={styles.alcOverlay}>
            <span className={styles.alcCount}>
                <FaLayerGroup /> {t('AnimeListSearch:card.items_count', { count: listData.anime_count ?? 0 })}
            </span>
        </div>
      </div>

      {/* THÔNG TIN LIST */}
      <div className={styles.alcInfo}>
        <h3 className={styles.alcTitle}>{listData.list_name}</h3>
        
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
            <FaHeart className={styles.heartIcon}/> {listData.like_count ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeListCard;