// src/components/SummarySection.tsx
import React, { useMemo, useState } from 'react';
import EditorModal from '../../../../../components/AnimeModal/EditorModal'; 
import styles from './SummarySection.module.css';
import type { SummarySectionProps } from '@umamusumeenjoyer/shared-logic';
import { useSummarySection } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';

// Danh sách các nút chức năng
const NAV_ITEMS = ['Overview', 'Watch', 'Characters', 'Staff', 'Stats'  ];

const SummarySection: React.FC<SummarySectionProps> = ({ anime, hasBanner }) => {
  const { t } = useTranslation(['AnimeModal', 'common']); 
  
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
            src={anime.cover_image} 
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
          <h1 className={styles.animeTitleMain}>{anime.name_romaji}</h1>
          
          {/* Description Block */}
          <div 
            className={descriptionClass} 
            dangerouslySetInnerHTML={{ __html: anime.desc }}
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
                // onClick={() => console.log(item)} // Placeholder logic
              >
                {/* Bạn có thể thêm t() vào đây nếu muốn đa ngôn ngữ: t(`common:nav.${item}`) */}
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