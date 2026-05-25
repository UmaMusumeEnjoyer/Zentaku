// src/components/SummarySection.tsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // [1] Import useNavigate
import EditorModal from '../../../../../components/AnimeModal/EditorModal'; 
import styles from './SummarySection.module.css';
import type { SummarySectionProps } from '@umamusumeenjoyer/shared-logic';
import { useSummarySection } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';

// Danh sách các nút chức năng
const NAV_ITEMS = ['Overview', 'Watch', 'Characters', 'Staff', 'Stats'];

const SummarySection: React.FC<SummarySectionProps> = ({ anime, hasBanner }) => {
  const { t } = useTranslation(['AnimeModal', 'common']); 
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
    } else {
      // Logic cho các tab khác (nếu cần)
      console.log(`Clicked on ${item}`);
    }
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
          <h1 className={styles.animeTitleMain}>{anime.title?.romaji || anime.name_romaji}</h1>
          
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
            {NAV_ITEMS.map((item) => (
              <button 
                key={item} 
                className={styles.navItem}
                onClick={() => handleNavClick(item)} // [4] Gắn hàm xử lý vào đây
              >
                {t(`AnimeModal:navBar.${item}`) }
              </button>
            ))}
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