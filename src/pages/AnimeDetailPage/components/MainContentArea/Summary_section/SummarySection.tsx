// src/components/SummarySection.tsx
import React from 'react';
import EditorModal from '../../AnimeModal/EditorModal'; 
// 1. Import CSS Module
import styles from './SummarySection.module.css';
import type { SummarySectionProps } from '@umamusumeenjoyer/shared-logic';
import { useSummarySection } from '@umamusumeenjoyer/shared-logic';
// 2. Xóa import useTheme vì không cần thiết nữa
// import { useTheme } from '../../../../../context/ThemeContext';

const SummarySection: React.FC<SummarySectionProps> = ({ anime, hasBanner }) => {
  const {
    isModalOpen,
    currentStatusData,
    buttonLabel,
    handleBtnClick,
    handleCloseModal,
    handleSave,
    handleDelete
  } = useSummarySection(anime);

  // const { theme } = useTheme(); -> Đã xóa

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