// src/components/AnimeCard.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import './AnimeCard.css';

// Import logic và type từ thư viện vừa tạo
import type { AnimeData } from '@umamusumeenjoyer/shared-logic';
import { 
  getAnimeTitle, 
  getAnimeLinkId, 
  getAnimeDisplayInfo 
} from '@umamusumeenjoyer/shared-logic';

// Định nghĩa Props cho Component
interface AnimeCardProps {
  anime: AnimeData;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  
  // Lấy ngôn ngữ hiện tại
  const currentLanguage = i18n.language as 'en' | 'jp';
  
  // Gọi các hàm logic để lấy dữ liệu - useMemo để re-calculate khi language thay đổi
  const title = useMemo(() => getAnimeTitle(anime, currentLanguage), [anime, currentLanguage]);
  const linkId = useMemo(() => getAnimeLinkId(anime), [anime]);
  const displayInfo = useMemo(() => getAnimeDisplayInfo(anime), [anime]);

  // Logic class giao diện
  const detailsClass = displayInfo ? 'anime-details' : 'anime-details no-info';

  return (
    <Link to={`/anime/${linkId}`} className="anime-card-link">
      <div className={`anime-card anime-card--${theme}`} title={title}>
        <img 
          src={anime.cover_image} 
          alt={title} 
          className="anime-poster" 
          loading="lazy"
        />
        
        <div className={detailsClass}>
          <h3 className="anime-title-text">{title}</h3>

          {displayInfo && (
            <div className="airing-info">
              <p className="episode-time"></p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;