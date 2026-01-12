import React from 'react';
import { useTranslation } from 'react-i18next'; // Import hook
import { useUserAnimeGroup } from '@umamusumeenjoyer/shared-logic';
import type { UserAnimeGroupProps } from '@umamusumeenjoyer/shared-logic';
import AnimeCard from '../../../components/AnimeCard/AnimeCard';
import './UserAnimeGroup.css';

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
  onSelectAnime 
}) => {
  const { t } = useTranslation(['userAnimeGroup']); // Khởi tạo hook dịch
  const {
    hasEditPermission,
    shouldRender,
    animeCount,
    isAnimeSelected,
    getAnimeId,
  } = useUserAnimeGroup(animeList, isCurrentUser, canEdit, deleteMode, selectedAnimeIds);

  if (!shouldRender) return null;

  return (
    <div className="user-group-section">
      <div className="user-group-header">
        <div className="user-group-title">
          <span className="material-symbols-outlined">person</span>
          {/* Sử dụng interpolation để truyền tên user */}
          <h3>{t('userAnimeGroup.addedBy', { user })}</h3>
          <span className="count-badge">{animeCount}</span>
          
          {hasEditPermission && !deleteMode && (
            <button 
              className="btn-add-circle" 
              title={t('userAnimeGroup.addAnimeTitle')}
              onClick={onOpenAddModal} 
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          )}
        </div>

        {hasEditPermission && (
          <div className="user-actions-controls">
            {!deleteMode ? (
              <button 
                className="btn-icon-only text-danger"
                onClick={onToggleDeleteMode}
                title={t('userAnimeGroup.deleteItemsTitle')}
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            ) : (
              <div className="delete-actions-group">
                {/* Sử dụng interpolation để hiển thị số lượng đã chọn */}
                <span className="selection-count">
                  {t('userAnimeGroup.selectedCount', { count: selectedAnimeIds.length })}
                </span>
                <button 
                  className="btn-icon-only text-secondary"
                  onClick={onToggleDeleteMode}
                  title={t('userAnimeGroup.cancelTitle')}
                  disabled={isDeleting}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <button 
                  className="btn-confirm-delete"
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

      <div className="anime-grid-row">
        {animeList.map((anime) => {
          const animeId = getAnimeId(anime);
          const isSelected = isAnimeSelected(animeId);
          
          return (
            <div 
              className={`grid-item-wrapper ${deleteMode && hasEditPermission ? 'delete-mode' : ''} ${isSelected ? 'selected' : ''}`} 
              key={anime.id}
              onClick={() => deleteMode && hasEditPermission && onSelectAnime(animeId)}
            >
              <div className="grid-item">
                <AnimeCard anime={anime} />
              </div>
              
              {deleteMode && hasEditPermission && (
                <div className="delete-overlay">
                  <span className="material-symbols-outlined check-icon">
                    {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserAnimeGroup;