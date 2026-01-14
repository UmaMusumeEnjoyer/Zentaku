import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAddAnimeModal } from '@umamusumeenjoyer/shared-logic';
import type { AddAnimeModalProps } from '@umamusumeenjoyer/shared-logic';
import AnimeCard from '../../../components/AnimeCard/AnimeCard';

// Import CSS Module
import styles from './AddAnimeModal.module.css';

const AddAnimeModal: React.FC<AddAnimeModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddAnime, 
  currentList = [] 
}) => {
  const { t } = useTranslation(['addAnimeModal']);
  const {
    userData,
    globalResults,
    isGlobalSearch,
    loading,
    searchTerm,
    statusKeys,
    handleSearchAction,
    handleInputChange,
    handleAddClick,
    getAnimeState,
    mapAnimeData,
  } = useAddAnimeModal(isOpen, currentList);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Kiểm tra class overlay thông qua object styles
    if ((e.target as HTMLElement).classList.contains(styles.addAnimeModalOverlay)) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchAction();
    }
  };

  const renderAnimeCard = (anime: any) => {
    const animeIdStr = String(anime.id);
    const { isAdding, isAdded } = getAnimeState(animeIdStr);
    
    return (
      <div key={animeIdStr} className={styles.modalCardWrapper}>
        <AnimeCard
          anime={{
            ...anime,
          }}
        />
        <button
          className={`${styles.btnCardAdd} ${isAdded ? styles.addedSuccess : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleAddClick(anime, onAddAnime);
          }}
          disabled={isAdding || isAdded}
          title={isAdded ? t('addAnimeModal.alreadyInList') : t('addAnimeModal.addToList')}
        >
          {isAdding ? (
            <span className={`material-symbols-outlined ${styles.spinIcon}`}>progress_activity</span>
          ) : isAdded ? (
            <span className="material-symbols-outlined">check</span>
          ) : (
            <span className="material-symbols-outlined">add</span>
          )}
        </button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.addAnimeModalOverlay} onClick={handleOverlayClick}>
      <div className={styles.addAnimeModalContent}>
        <div className={styles.addAnimeModalHeader}>
          <div className={styles.modalSearchWrapper}>
            <span 
              className={`material-symbols-outlined ${styles.searchIcon}`}
              onClick={handleSearchAction}
              style={{cursor: 'pointer', pointerEvents: 'auto'}}
            >
              search
            </span>
            <input
              type="text"
              className={styles.modalSearchInput}
              placeholder={t('addAnimeModal.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className={styles.addAnimeModalBody}>
          {loading ? (
            <div className={styles.modalLoading}>
              <span className={`material-symbols-outlined ${styles.spinIcon}`} style={{marginRight: '10px'}}>progress_activity</span>
              {isGlobalSearch ? t('addAnimeModal.searchingDatabase') : t('addAnimeModal.loadingLibrary')}
            </div>
          ) : (
            <>
              {isGlobalSearch ? (
                <div className={styles.modalSection}>
                  <h3 className={styles.sectionTitle}>
                    {t('addAnimeModal.searchResults')}
                    <span className={styles.countBadge}>{globalResults.length}</span>
                  </h3>
                  {globalResults.length > 0 ? (
                    <div className={styles.modalGrid}>
                      {globalResults.map(anime => renderAnimeCard(anime))}
                    </div>
                  ) : (
                    <div className={styles.modalError}>
                        {t('addAnimeModal.noResults', { searchTerm })}
                    </div>
                  )}
                </div>
              ) : (
                userData ? (
                  statusKeys.map((status) => {
                    const rawItems = userData[status] || [];
                    if (rawItems.length === 0) return null;

                    const normalizedItems = rawItems.map(mapAnimeData);

                    return (
                      <div key={status} className={styles.modalSection}>
                        <h3 className={styles.sectionTitle}>
                          {t(`addAnimeModal.sections.${status}`)}
                          <span className={styles.countBadge}>{normalizedItems.length}</span>
                        </h3>

                        <div className={styles.modalGrid}>
                          {normalizedItems.map(anime => renderAnimeCard(anime))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.modalError}>{t('addAnimeModal.loadError')}</div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAnimeModal;