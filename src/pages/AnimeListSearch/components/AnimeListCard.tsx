import React from 'react';
import { FaHeart, FaLayerGroup } from 'react-icons/fa';
import { type AnimeListCardProps } from '@umamusumeenjoyer/shared-logic';
import { useNavigate } from 'react-router-dom';
import { useAnimeListCard } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import '../AnimeListSearchPage.css';

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
      className="anime-list-card" 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* KHU VỰC 3 ẢNH PREVIEW */}
      <div className="alc-preview">
        {coverImages.map((img, index) => (
          <div 
            key={index} 
            className="alc-cover" 
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        
        {/* LỚP PHỦ HIỂN THỊ SỐ LƯỢNG ITEM */}
        <div className="alc-overlay">
            <span className="alc-count">
                <FaLayerGroup /> {t('AnimeListSearch:card.items_count', { count: listData.anime_count ?? 0 })}
            </span>
        </div>
      </div>

      {/* THÔNG TIN LIST */}
      <div className="alc-info">
        <h3 className="alc-title">{listData.list_name}</h3>
        
        <div className="alc-meta">
          {/* USER INFO */}
          <div className="alc-user">
            <img 
              src={avatarUrl} 
              alt="user" 
              className="alc-avatar"
              onError={(e) => { e.currentTarget.src = placeholderAvatar; }}
            />
            <span>{username}</span>
          </div>
          
          {/* LIKES */}
          <div className="alc-likes">
            <FaHeart className="heart-icon"/> {listData.like_count ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeListCard;