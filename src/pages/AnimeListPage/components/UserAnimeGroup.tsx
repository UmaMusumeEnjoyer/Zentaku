import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserAnimeGroup } from '@umamusumeenjoyer/shared-logic';
import type { UserAnimeGroupProps } from '@umamusumeenjoyer/shared-logic';
import AnimeCard from '../../../components/AnimeCard/AnimeCard';

import styles from './UserAnimeGroup.module.css';

const UserAnimeGroup: React.FC<UserAnimeGroupProps> = ({ 
  user, 
  animeList, 
  isCurrentUser, 
  canEdit,
  deleteMode, 
  selectedAnimeIds, 
  isDeleting, 
  onOpenAddModal, 
  onToggleDeleteMode, 
  onConfirmDelete, 
  onSelectAnime,
  viewMode = 'grid'
}) => {
  const { t } = useTranslation(['userAnimeGroup']);
  
  // 1. Cấu hình
  const ITEMS_PER_ROW = 7; 
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_ROW);

  const {
    hasEditPermission,
    shouldRender,
    animeCount,
    isAnimeSelected,
    getAnimeId,
  } = useUserAnimeGroup(animeList, isCurrentUser, canEdit, deleteMode, selectedAnimeIds);

  // 2. Logic Mới: Kiểm tra trạng thái hiển thị
  const isAllExpanded = visibleCount >= animeList.length;
  const shouldShowButton = animeList.length > ITEMS_PER_ROW; // Chỉ hiện nút nếu list dài hơn 1 hàng

  const handleToggleView = () => {
    if (isAllExpanded) {
      // Nếu đang mở hết -> Thu gọn về ban đầu
      setVisibleCount(ITEMS_PER_ROW);
    } else {
      // Nếu chưa mở hết -> Mở thêm 1 hàng (hoặc mở hết luôn nếu muốn)
      setVisibleCount(prev => prev + ITEMS_PER_ROW);
    }
  };

  const displayedAnime = animeList.slice(0, visibleCount);

  if (!shouldRender) return null;

  return (
    <div className={styles.userGroupSection}>
      <div className={styles.userGroupHeader}>
        <div className={styles.userGroupTitle}>
          <span className="material-symbols-outlined">person</span>
          <h3>{t('userAnimeGroup.addedBy', { user })}</h3>
          <span className="count-badge">{animeCount}</span>
          
          {hasEditPermission && !deleteMode && isCurrentUser && (
            <button 
              className={styles.btnAddCircle} 
              title={t('userAnimeGroup.addAnimeTitle')}
              onClick={onOpenAddModal} 
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          )}
        </div>

        {hasEditPermission && (
          <div className={styles.userActionsControls}>
            {!deleteMode ? (
              <button 
                className={`${styles.btnIconOnly} ${styles.textDanger}`}
                onClick={onToggleDeleteMode}
                title={t('userAnimeGroup.deleteItemsTitle')}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            ) : (
              <div className={styles.deleteActionsGroup}>
                <span className={styles.selectionCount}>
                  {t('userAnimeGroup.selectedCount', { count: selectedAnimeIds.length })}
                </span>
                <button 
                  className={`${styles.btnIconOnly} ${styles.textSecondary}`}
                  onClick={onToggleDeleteMode}
                  title={t('userAnimeGroup.cancelTitle')}
                  disabled={isDeleting}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <button 
                  className={styles.btnConfirmDelete}
                  onClick={onConfirmDelete}
                  title={t('userAnimeGroup.confirmDeleteTitle')}
                  disabled={isDeleting || selectedAnimeIds.length === 0}
                >
                  {isDeleting ? (
                    <span className="material-symbols-outlined spin">sync</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">check</span>
                      <span>{t('userAnimeGroup.confirmText')}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid/List hiển thị Anime */}
      <div className={viewMode === 'list' ? styles.animeListRow : styles.animeGridRow}>
        {displayedAnime.map((anime) => {
          const animeId = getAnimeId(anime);
          const isSelected = isAnimeSelected(animeId);
          
          return (
            <div 
              className={`
                ${styles.gridItemWrapper} 
                ${deleteMode && hasEditPermission ? styles.deleteMode : ''} 
                ${isSelected ? styles.selected : ''}
              `} 
              key={anime.id}
              onClick={() => deleteMode && hasEditPermission && onSelectAnime(animeId)}
            >
              <div className={styles.gridItem}>
                <AnimeCard anime={anime} viewMode={viewMode} />
              </div>
              
              {deleteMode && hasEditPermission && (
                <div className={styles.deleteOverlay}>
                  <span className={`material-symbols-outlined ${styles.checkIcon}`}>
                    {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Nút Toggle View (View More / View Less) */}
      {shouldShowButton && (
        <div className={styles.loadMoreContainer}>
          <button onClick={handleToggleView} className={styles.loadMoreBtn}>
            {/* Đổi icon dựa trên trạng thái */}
            <span className="material-symbols-outlined">
              {isAllExpanded ? 'expand_less' : 'expand_more'}
            </span>
            {/* Đổi text dựa trên trạng thái */}
            {isAllExpanded 
              ? t('userAnimeGroup.viewLess', 'View Less') 
              : t('userAnimeGroup.viewMore', 'View More')
            }
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAnimeGroup;