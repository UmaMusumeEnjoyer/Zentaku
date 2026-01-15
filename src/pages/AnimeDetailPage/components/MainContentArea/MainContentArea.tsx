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
  trailer?: TrailerInfo;
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
  trailerInfo?: TrailerInfo;
}

// ------------------- Helper Components -------------------

const Section: React.FC<SectionProps> = ({ title, children }) => (
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

// ------------------- Main Component -------------------

const MainContentArea: React.FC<MainContentAreaProps> = ({ 
  anime, 
  staffList, 
  characterList, 
  stats // 1. Nhận stats từ props
}) => {
  
  // 2. QUAN TRỌNG: Đã xóa dòng "useAnimeStats(anime.id)" để tránh gọi API lặp lại
  
  const { t } = useTranslation(['MainContentArea', 'common']);

  // 3. Đã xóa block "if (loading)" và "if (error)"
  // Lý do: Parent Page (AnimeDetailPage) đã handle loading tổng thể.
  // Tại đây chỉ cần render dữ liệu (nếu có) hoặc mảng rỗng.

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
          <StatusDistribution distribution={(stats?.status_distribution as StatusItem[]) || []} />
        </Section>
        <Section title={t('MainContentArea:sections.score_distribution')}>
          <ScoreDistribution distribution={(stats?.score_distribution as ScoreItem[]) || []} />
        </Section>
      </div>
      
      {/* Trailer Section */}
      <Section title={t('MainContentArea:sections.trailer')}>
        <Trailer trailerInfo={anime.trailer} />
      </Section>
    </main>
  );
};

export default MainContentArea;