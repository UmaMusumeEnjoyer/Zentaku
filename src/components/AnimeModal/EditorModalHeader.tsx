// src/components/EditorModal/EditorModalHeader.tsx
import React from 'react';
import type { EditorModalHeaderProps } from '@umamusumeenjoyer/shared-logic';
import styles from './EditorModal.module.css'; // Import cùng file module
import { useTranslation } from 'react-i18next';

const EditorModalHeader: React.FC<EditorModalHeaderProps> = ({ 
  anime, 
  onClose, 
  onSave, 
  isFavorite, 
  toggleFavorite 
}) => {
  const { t } = useTranslation(['AnimeModal']);
  const coverImageUrl = typeof anime.coverImage === 'string' 
    ? anime.coverImage 
    : anime.coverImage?.large || anime.cover_image || '';

  return (
    <div className={styles.header}>
      <button className={styles.btnClose} onClick={onClose}>×</button>
      
      <div className={styles.headerInfo}>
        <img src={coverImageUrl} alt="thumb" className={styles.thumb} />
        <span className={styles.animeTitle}>{anime.title?.romaji || anime.name_romaji}</span>
      </div>
      
      <div className={styles.headerActions}>
        <button 
          className={`${styles.btnIcon} ${isFavorite ? styles.btnIconActive : ''}`} 
          onClick={toggleFavorite}
        >
          ♥
        </button>
        <button className={styles.btnSave} onClick={onSave}>{t('AnimeModal:buttons.save')}</button>
      </div>
    </div>
  );
};

export default EditorModalHeader;