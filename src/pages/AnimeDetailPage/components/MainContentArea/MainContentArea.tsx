// src/components/MainContent/MainContentArea.tsx
import React from 'react';
import styles from './MainContentArea.module.css';
import { useTranslation } from 'react-i18next';

// Import Types
import type { 
  Ranking,
  StatusItem,
  ScoreItem
} from '@umamusumeenjoyer/shared-logic';

// Import các components con
import CharactersSection from './Characters_section/CharactersSection';
import StaffSection from './Staffs_section/StaffSection';
import RankingsSection from './Ranking_section/RankingsSection';
import StatusDistribution from './Statistics_section/StatusDistribution'; 
import ScoreDistribution from './Statistics_section/ScoreDistribution'; 

// ------------------- Interfaces -------------------

interface TrailerInfo {
  id: string;
  site: string;
  thumbnail?: string;
}

interface Anime_mainContentArea {
  id: number | string;
  trailer?: TrailerInfo | string;
  trailerUrl?: string;
  trailer_url?: string;
}

// CẬP NHẬT: Thêm stats vào props interface
interface MainContentAreaProps {
  anime: Anime_mainContentArea;
  staffList: any[];      // Nên thay bằng Type cụ thể nếu có (StaffMember[])
  characterList: any[];  // Nên thay bằng Type cụ thể nếu có (Character[])
  stats: any;            // Nên thay bằng Type cụ thể nếu có (AnimeStats)
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

interface TrailerProps {
  trailerData?: any;
}

// ------------------- Helper Components -------------------

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section className={styles.contentSection}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    {children}
  </section>
);

const Trailer: React.FC<TrailerProps> = ({ trailerData }) => {
  const { t } = useTranslation(['MainContentArea']);

  let embedUrl = '';

  if (trailerData) {
    const youtubeBaseUrl = import.meta.env.VITE_YOUTUBE_EMBED_URL || 'https://www.youtube.com/embed';
    
    // Nếu trailerData là Object có cấu trúc { id, site: 'youtube' }
    if (typeof trailerData === 'object' && trailerData.id && trailerData.site === 'youtube') {
      embedUrl = `${youtubeBaseUrl}/${trailerData.id}`;
    } 
    // Nếu trailerData là chuỗi URL YouTube
    else if (typeof trailerData === 'string') {
      let videoId = '';
      if (trailerData.includes('youtube.com/watch?v=')) {
        try {
          const url = new URL(trailerData);
          videoId = url.searchParams.get('v') || '';
        } catch (e) {
          // ignore parsing error
        }
      } else if (trailerData.includes('youtu.be/')) {
        videoId = trailerData.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      
      if (videoId) {
        embedUrl = `${youtubeBaseUrl}/${videoId}`;
      }
    }
  }

  if (!embedUrl) {
    return <p>{t('MainContentArea:trailer.no_data')}</p>;
  }
  
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

// ------------------- Main Component -------------------

const MainContentArea: React.FC<MainContentAreaProps> = ({ 
  anime, 
  staffList, 
  characterList, 
  stats // 1. Nhận stats từ props
}) => {
  

  
  const { t } = useTranslation(['MainContentArea', 'common']);



  return (
    <main className={styles.mainContentArea}>
      
      {/* Characters Section - Dữ liệu từ props */}
      <Section title={t('MainContentArea:sections.characters')}>
        <CharactersSection data={characterList} />
      </Section>
      
      {/* Staff Section - Dữ liệu từ props */}
      <Section title={t('MainContentArea:sections.staff')}>
        <StaffSection data={staffList} />
      </Section>
      
      {/* Rankings Section - Dữ liệu từ stats prop */}
      <Section title={t('MainContentArea:sections.rankings')}>
        <RankingsSection rankings={(stats?.rankings as Ranking[]) || []} />
      </Section>
      
      {/* Distribution Sections - Dữ liệu từ stats prop */}
      <div className={styles.distributionContainer}>
        <Section title={t('MainContentArea:sections.status_distribution')}>
          <StatusDistribution distribution={(stats?.stats?.statusDistribution || stats?.statusDistribution || stats?.status_distribution) as StatusItem[] || []} />
        </Section>
        <Section title={t('MainContentArea:sections.score_distribution')}>
          <ScoreDistribution distribution={(stats?.stats?.scoreDistribution || stats?.scoreDistribution || stats?.score_distribution) as ScoreItem[] || []} />
        </Section>
      </div>
      
      {/* Trailer Section */}
      <Section title={t('MainContentArea:sections.trailer')}>
        <Trailer trailerData={anime.trailer || anime.trailerUrl || anime.trailer_url} />
      </Section>
    </main>
  );
};

export default MainContentArea;