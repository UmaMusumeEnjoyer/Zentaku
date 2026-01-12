import React from 'react';
import { FaHeart, FaListAlt } from 'react-icons/fa';
import { type SearchListCardProps } from '@umamusumeenjoyer/shared-logic';
import { useNavigate } from 'react-router-dom';
import { useSearchListCard } from '@umamusumeenjoyer/shared-logic';
import '../AnimeListSearchPage.css';

const SearchListCard: React.FC<SearchListCardProps> = ({ listData }) => {
  
  const navigate = useNavigate();
  const { handleCardClick, cardColor } = useSearchListCard(listData, navigate);
  return (
    <div 
      className="anime-list-card" 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* KHU VỰC MÀU */}
      <div 
        className="alc-color-preview" 
        style={{ backgroundColor: cardColor }}
      >
        <FaListAlt className="alc-color-icon" />
      </div>

      {/* THÔNG TIN LIST */}
      <div className="alc-info">
        <h3 className="alc-title">{listData.list_name}</h3>
        
        {listData.description && (
             <p style={{
                 fontSize: '0.8rem', 
                 color: '#8BA0B2', 
                 margin: '5px 0 0',
                 overflow: 'hidden',
                 textOverflow: 'ellipsis',
                 whiteSpace: 'nowrap'
             }}>
                 {listData.description}
             </p>
        )}

        <div className="alc-meta no-avatar">
          <div className="alc-likes">
            <FaHeart className="heart-icon"/> {listData.like_count ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchListCard;