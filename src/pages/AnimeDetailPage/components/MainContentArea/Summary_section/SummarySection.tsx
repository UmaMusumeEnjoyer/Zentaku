// src/components/SummarySection.tsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // [1] Import useNavigate
import EditorModal from '../../../../../components/AnimeModal/EditorModal'; 
import styles from './SummarySection.module.css';
import type { SummarySectionProps } from '@umamusumeenjoyer/shared-logic';
import { useSummarySection } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import { FaInfoCircle, FaPlay, FaUsers, FaUserTie } from 'react-icons/fa';

// Danh sách các nút chức năng
const NAV_ITEMS = ['Overview', 'Watch', 'Characters', 'Staff'];

const NAV_ICONS: Record<string, React.ReactNode> = {
  Overview: <FaInfoCircle />,
  Watch: <FaPlay />,
  Characters: <FaUsers />,
  Staff: <FaUserTie />
};

const SummarySection: React.FC<SummarySectionProps> = ({ anime, hasBanner, activeTab, setActiveTab }) => {
  const { t, i18n } = useTranslation(['AnimeModal', 'common']); 
  const navigate = useNavigate(); // [2] Khởi tạo hook navigate
  
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    isModalOpen,
    currentStatusData,
    watchStatus,      
    isLoadingStatus,  
    isFollowing,
    handleBtnClick,
    handleCloseModal,
    handleSave,
    handleDelete
  } = useSummarySection(anime);

  const buttonLabel = useMemo(() => {
    if (isLoadingStatus) return 'Loading...';
    if (isFollowing && watchStatus) {
      return t(`AnimeModal:status_options.${watchStatus}`);
    }
    return t('AnimeModal:status_options.default') || 'Add to List';
  }, [isLoadingStatus, isFollowing, watchStatus, t]);

  // [3] Hàm xử lý click điều hướng
  const handleNavClick = (item: string) => {
    if (item === 'Watch') {
      // Điều hướng tới /anime/:id/watch
      navigate(`/anime/${anime.id}/watch`);
    } else if (setActiveTab) {
      setActiveTab(item);
    }
  };

  const getDisplayTitle = () => {
    const title = anime.title as any;
    if (i18n.language === 'jp') {
      return title?.native || title?.romaji || anime.name_romaji;
    }
    if (i18n.language === 'en') {
      return title?.english || title?.romaji || anime.name_romaji;
    }
    return title?.romaji || anime.name_romaji;
  };

  const sectionClass = !hasBanner 
    ? `${styles.summarySection} ${styles.noBanner}` 
    : styles.summarySection;

  const descriptionClass = isExpanded 
    ? styles.animeDescription 
    : `${styles.animeDescription} ${styles.collapsed}`;

  return (
    <>
      <div className={sectionClass}>
        <div className={styles.summaryLeft}>
          <img 
            src={(typeof anime.coverImage === 'object' ? anime.coverImage?.large : anime.coverImage) || anime.cover_image || ''} 
            alt="Cover" 
            className={styles.summaryCover} 
          />
          
          <button 
            className={`${styles.btn} ${styles.btnWatching}`} 
            onClick={handleBtnClick}
          >
            {buttonLabel} 
          </button>
        </div>

        <div className={styles.summaryRight}>
          <h1 className={styles.animeTitleMain}>{getDisplayTitle()}</h1>
          
          {/* Description Block */}
          <div 
            className={descriptionClass} 
            dangerouslySetInnerHTML={{ __html: anime.description || anime.desc || '' }}
          ></div>

          <button 
            className={styles.seeMoreBtn}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? t('common:buttons.show_less') : t('common:buttons.read_more')}
          </button>

          {/* [NEW] Navigation Buttons */}
          <div className={styles.navBar}>
            {NAV_ITEMS.map((item) => {
              const isWatch = item === 'Watch';
              const isActive = activeTab === item;
              return (
                <button 
                  key={item} 
                  className={`${styles.navItem} ${isWatch ? styles.navItemWatch : ''} ${isActive ? styles.active : ''}`}
                  onClick={() => handleNavClick(item)} 
                >
                  <span className={styles.navIcon}>{NAV_ICONS[item]}</span>
                  <span className={styles.navText}>{t(`AnimeModal:navBar.${item}`)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <EditorModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        anime={anime}
        initialData={currentStatusData}
        onSave={handleSave} 
        onDelete={handleDelete}
      />
    </>
  );
};

export default SummarySection;