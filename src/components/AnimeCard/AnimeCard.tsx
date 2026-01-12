// src/components/AnimeCard.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// 1. Xóa useTheme vì không cần dùng biến theme trong JS nữa
// import { useTheme } from '../../context/ThemeContext';

// 2. Import CSS Modules
import styles from './AnimeCard.module.css';

import type { AnimeData } from '@umamusumeenjoyer/shared-logic';
import { 
  getAnimeTitle, 
  getAnimeLinkId, 
  getAnimeDisplayInfo 
} from '@umamusumeenjoyer/shared-logic';

interface AnimeCardProps {
  anime: AnimeData;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  // const { theme } = useTheme(); -> Đã xóa
  const { i18n } = useTranslation();
  
  const currentLanguage = i18n.language as 'en' | 'jp';
  
  const title = useMemo(() => getAnimeTitle(anime, currentLanguage), [anime, currentLanguage]);
  const linkId = useMemo(() => getAnimeLinkId(anime), [anime]);
  const displayInfo = useMemo(() => getAnimeDisplayInfo(anime), [anime]);

  // 3. Xử lý logic class name với module
  // Kết hợp class 'anime-details' và 'no-info' (nếu có)
  const detailsClass = displayInfo 
    ? styles['anime-details'] 
    : `${styles['anime-details']} ${styles['no-info']}`;

  return (
    <Link to={`/anime/${linkId}`} className={styles['anime-card-link']}>
      {/* 4. Xóa class logic theo theme, chỉ dùng class gốc từ module */}
      <div className={styles['anime-card']} title={title}>
        <img 
          src={anime.cover_image} 
          alt={title} 
          className={styles['anime-poster']} 
          loading="lazy"
        />
        
        <div className={detailsClass}>
          <h3 className={styles['anime-title-text']}>{title}</h3>

          {displayInfo && (
            <div className={styles['airing-info']}>
              <p className={styles['episode-time']}>
                {/* Logic hiển thị thời gian đang để trống trong code gốc, giữ nguyên */}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;