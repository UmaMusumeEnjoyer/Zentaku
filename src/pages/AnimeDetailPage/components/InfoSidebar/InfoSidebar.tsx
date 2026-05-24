// src/components/InfoSidebar/InfoSidebar.tsx
import React from 'react';
// 1. Xóa import css thường, thay bằng module
import styles from './InfoSidebar.module.css';
import type { InfoSidebarProps } from '@umamusumeenjoyer/shared-logic';
import { useInfoSidebar } from '@umamusumeenjoyer/shared-logic';
// 2. Xóa useTheme vì không cần dùng biến theme trong JS nữa
// import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { InfoBlock, InfoListBlock } from './InfoComponents';

const InfoSidebar: React.FC<InfoSidebarProps> = ({ anime }) => {
  const { airingString } = useInfoSidebar(anime);
  // const { theme } = useTheme(); -> Đã xóa
  
  const { t, i18n } = useTranslation(['AnimeDetail', 'common']);

  const formatDateByLanguage = (dateString?: string) => {
        if (!dateString) return t('info.not_available');
        
        const date = new Date(dateString);
        const currentLang = i18n.language;
        
        if (currentLang === 'jp') {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${year}年${month}月${day}日`;
        } else {
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    };

  return (
    // 3. Sử dụng styles.sidebar thay vì nối chuỗi theme
    <aside className={styles.sidebar}>
      {/* Các thông tin đặc biệt cần xử lý logic */}
      <InfoBlock 
        label={t('AnimeDetail:sidebar.airing')} 
        value={airingString} 
        isAiring={true} 
      />
      
      {/* Các thông tin cơ bản */}
      <InfoBlock 
        label={t('AnimeDetail:sidebar.format')} 
        value={anime.format || anime.airing_format} 
      />
      <InfoBlock 
        label={t('AnimeDetail:sidebar.episodes')} 
        value={anime.episodes || anime.airing_episodes} 
      />
      <InfoBlock 
        label={t('AnimeDetail:sidebar.episode_duration')} 
        value={anime.duration ? `${anime.duration} ${t('common:time.mins')}` : null} 
      />
      <InfoBlock 
        label={t('AnimeDetail:sidebar.status')} 
        value={(anime.status || anime.airing_status)?.replace(/_/g, ' ')} 
      />
      
      {/* Ngày tháng */}
      <InfoBlock 
        label={t('AnimeDetail:sidebar.start_date')} 
        value={formatDateByLanguage(anime.startDate || anime.starting_time)} 
      />
      <InfoBlock 
        label={t('AnimeDetail:sidebar.end_date')} 
        value={formatDateByLanguage(anime.endDate || anime.ending_time)} 
      />
      
      {/* Thông tin mùa và điểm số */}
      <InfoBlock 
        label={t('AnimeDetail:sidebar.season')} 
        value={anime.season && (anime.seasonYear || anime.season_year) ? `${anime.season} ${anime.seasonYear || anime.season_year}` : null} 
      />
      <InfoBlock 
        label={t('AnimeDetail:sidebar.average_score')} 
        value={(anime.score || anime.average_score) ? `${(anime.score || anime.average_score)}%` : null} 
      />
      <InfoBlock 
        label={t('AnimeDetail:sidebar.mean_score')} 
        value={(anime.meanScore || anime.mean_score) ? `${(anime.meanScore || anime.mean_score)}%` : null} 
      />
      
      {/* Số liệu thống kê */}
      <InfoBlock 
        label={t('AnimeDetail:sidebar.popularity')} 
        value={anime.popularity?.toLocaleString()} 
      />
      <InfoBlock 
        label={t('AnimeDetail:sidebar.favorites')} 
        value={anime.favourites?.toLocaleString()} 
      />
      
      {/* Danh sách */}
      <InfoListBlock 
        label={t('AnimeDetail:sidebar.studios')} 
        items={anime.studios} 
      />
      <InfoListBlock 
        label={t('AnimeDetail:sidebar.producers')} 
        items={anime.producers} 
      />
      
      {/* Tên gọi */}
      <InfoBlock 
        label={t('AnimeDetail:sidebar.source')} 
        value={anime.source} 
      />
      <InfoBlock 
        label={t('AnimeDetail:sidebar.native_title')} 
        value={anime.title?.native || anime.name_native} 
      />
      <InfoBlock 
        label={t('AnimeDetail:sidebar.english_title')} 
        value={anime.title?.english || anime.name_english} 
      />
    </aside>
  );
};

export default InfoSidebar;