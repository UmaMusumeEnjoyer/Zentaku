// src/components/MainContent/MainContentArea.tsx
import React from 'react';
// 1. Import CSS Module
import styles from './MainContentArea.module.css';
import { useAnimeStats } from '@umamusumeenjoyer/shared-logic';
// 2. Xóa import useTheme
// import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import type { 
  Ranking,
  StatusItem,
  ScoreItem
} from '@umamusumeenjoyer/shared-logic';

import CharactersSection from './Characters_section/CharactersSection';
import StaffSection from './Staffs_section/StaffSection';
import RankingsSection from './Ranking_section/RankingsSection';
import StatusDistribution from './Statistics_section/StatusDistribution'; 
import ScoreDistribution from './Statistics_section/ScoreDistribution'; 

interface TrailerInfo {
  id: string;
  site: string;
  thumbnail?: string;
}

interface Anime_mainContentArea {
  id: number | string;
  trailer?: TrailerInfo;
}

interface MainContentAreaProps {
  anime: Anime_mainContentArea;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

interface TrailerProps {
  trailerInfo?: TrailerInfo;
}

// UI Helper Components
const Section: React.FC<SectionProps> = ({ title, children }) => (
  // 3. Sử dụng class từ module
  <section className={styles.contentSection}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    {children}
  </section>
);

const Trailer: React.FC<TrailerProps> = ({ trailerInfo }) => {
  const { t } = useTranslation(['MainContentArea']);

  if (!trailerInfo || !trailerInfo.id || trailerInfo.site !== 'youtube') {
    return <p>{t('MainContentArea:trailer.no_data')}</p>;
  }
  
  const youtubeBaseUrl = import.meta.env.VITE_YOUTUBE_EMBED_URL;
  const embedUrl = `${youtubeBaseUrl}/${trailerInfo.id}`;
  
  return (
    <div className={styles.trailerContainer}>
      <iframe
        src={embedUrl}
        title={t('MainContentArea:trailer.iframe_title')}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

// Main Component
const MainContentArea: React.FC<MainContentAreaProps> = ({ anime }) => {
  const { stats, loading, error } = useAnimeStats(anime.id);
  // const { theme } = useTheme(); -> Đã xóa
  
  const { t } = useTranslation(['MainContentArea', 'common']);

  if (loading) {
    return (
      <main className={styles.mainContentArea}>
        <div className={styles.loadingContainer}>
          <p>{t('common:loading_stats')}</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.mainContentArea}>
        <div className={styles.errorContainer}>
          <p>{t('common:error', { message: error })}</p>
        </div>
      </main>
    );
  }

  return (
    // 4. Áp dụng style module
    <main className={styles.mainContentArea}>
      <Section title={t('MainContentArea:sections.characters')}>
        <CharactersSection animeId={anime.id} />
      </Section>
      
      <Section title={t('MainContentArea:sections.staff')}>
        <StaffSection animeId={anime.id} />
      </Section>
      
      <Section title={t('MainContentArea:sections.rankings')}>
        <RankingsSection rankings={(stats?.rankings as Ranking[]) || []} />
      </Section>
      
      <div className={styles.distributionContainer}>
        <Section title={t('MainContentArea:sections.status_distribution')}>
          <StatusDistribution distribution={(stats?.status_distribution as StatusItem[]) || []} />
        </Section>
        <Section title={t('MainContentArea:sections.score_distribution')}>
          <ScoreDistribution distribution={(stats?.score_distribution as ScoreItem[]) || []} />
        </Section>
      </div>
      
      <Section title={t('MainContentArea:sections.trailer')}>
        <Trailer trailerInfo={anime.trailer} />
      </Section>
    </main>
  );
};

export default MainContentArea; 