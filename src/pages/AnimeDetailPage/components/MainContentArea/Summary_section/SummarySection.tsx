// src/components/SummarySection.tsx
import React, { useMemo, useState } from 'react'; // [ADD] import useState
import EditorModal from '../../AnimeModal/EditorModal'; 
import styles from './SummarySection.module.css';
import type { SummarySectionProps } from '@umamusumeenjoyer/shared-logic';
import { useSummarySection } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';

const SummarySection: React.FC<SummarySectionProps> = ({ anime, hasBanner }) => {
  const { t } = useTranslation(['AnimeModal', 'common']); // Thêm namespace 'common' nếu cần
  
  // [ADD] State để kiểm soát việc mở rộng mô tả
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

  // [ADD] Xác định class cho description dựa trên state
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
          
          {/* [MODIFIED] Áp dụng class động và hiển thị nút See more */}
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