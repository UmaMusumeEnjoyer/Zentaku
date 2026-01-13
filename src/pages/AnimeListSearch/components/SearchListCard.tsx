import React from 'react';
import { FaHeart, FaListAlt } from 'react-icons/fa';
import { type SearchListCardProps } from '@umamusumeenjoyer/shared-logic';
import { useNavigate } from 'react-router-dom';
import { useSearchListCard } from '@umamusumeenjoyer/shared-logic';
// [CHANGE] Import styles
import styles from '../AnimeListSearchPage.module.css';

const SearchListCard: React.FC<SearchListCardProps> = ({ listData }) => {
  
  const navigate = useNavigate();
  const { handleCardClick, cardColor } = useSearchListCard(listData, navigate);
  return (
    <div 
      className={styles.animeListCard} 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* KHU VỰC MÀU */}
      <div 
        className={styles.alcColorPreview} 
        style={{ backgroundColor: cardColor }}
      >
        <FaListAlt className={styles.alcColorIcon} />
      </div>

      {/* THÔNG TIN LIST */}
      <div className={styles.alcInfo}>
        <h3 className={styles.alcTitle}>{listData.list_name}</h3>
        
        {listData.description && (
             <p className={styles.alcDescription}>
                 {listData.description}
             </p>
        )}

        <div className={`${styles.alcMeta} ${styles.noAvatar}`}>
          <div className={styles.alcLikes}>
            <FaHeart className={styles.heartIcon}/> {listData.like_count ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchListCard;