// src/components/SummarySection.tsx
import React, {useMemo} from 'react';
import EditorModal from '../../AnimeModal/EditorModal'; 
// 1. Import CSS Module
import styles from './SummarySection.module.css';
import type { SummarySectionProps } from '@umamusumeenjoyer/shared-logic';
import { useSummarySection } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
// 2. Xóa import useTheme vì không cần thiết nữa
// import { useTheme } from '../../../../../context/ThemeContext';

const SummarySection: React.FC<SummarySectionProps> = ({ anime, hasBanner }) => {
  const { t } = useTranslation(['AnimeModal']);
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

  // const { theme } = useTheme(); -> Đã xóa
  const buttonLabel = useMemo(() => {
    if (isLoadingStatus) return 'Loading...'; // Bạn có thể dùng t('common:loading') nếu muốn
    
    if (isFollowing && watchStatus) {
      // Ghép chuỗi để khớp với key trong file ngôn ngữ JSON
      // Ví dụ: t('AnimeModal:status_options.watching')
      return t(`AnimeModal:status_options.${watchStatus}`);
    }
    
    return t('AnimeModal:labels.add_to_list') || 'Add to List'; // Dịch nút mặc định
  }, [isLoadingStatus, isFollowing, watchStatus, t]);

  // Logic class cho wrapper chính
  const sectionClass = !hasBanner 
    ? `${styles.summarySection} ${styles.noBanner}` 
    : styles.summarySection;

  return (
    <>
      {/* 3. Sử dụng class từ module */}
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
          <div 
            className={styles.animeDescription} 
            dangerouslySetInnerHTML={{ __html: anime.desc }}
          ></div>
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