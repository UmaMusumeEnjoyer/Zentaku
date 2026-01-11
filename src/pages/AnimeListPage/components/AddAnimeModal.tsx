import React from 'react';
import { useAddAnimeModal } from '@umamusumeenjoyer/shared-logic';
import type { AddAnimeModalProps } from '@umamusumeenjoyer/shared-logic';
import AnimeCard from '../../../components/AnimeCard/AnimeCard';
import './AddAnimeModal.css';

const AddAnimeModal: React.FC<AddAnimeModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddAnime, 
  currentList = [] 
}) => {
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
    formatStatusTitle,
    getAnimeState,
    mapAnimeData,
  } = useAddAnimeModal(isOpen, currentList);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('add-anime-modal-overlay')) {
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
      <div key={animeIdStr} className="modal-card-wrapper">
        <AnimeCard
          anime={{
            ...anime,
            episode_progress: undefined,
            next_airing_ep: undefined
          }}
        />
        <button
          className={`btn-card-add ${isAdded ? 'added-success' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleAddClick(anime, onAddAnime);
          }}
          disabled={isAdding || isAdded}
          title={isAdded ? "Already in this list" : "Add to list"}
        >
          {isAdding ? (
            <span className="material-symbols-outlined spin-icon">progress_activity</span>
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
    <div className="add-anime-modal-overlay" onClick={handleOverlayClick}>
      <div className="add-anime-modal-content">
        <div className="add-anime-modal-header">
          <div className="modal-search-wrapper">
            <span 
              className="material-symbols-outlined search-icon" 
              onClick={handleSearchAction}
              style={{cursor: 'pointer', pointerEvents: 'auto'}}
            >
              search
            </span>
            <input
              type="text"
              className="modal-search-input"
              placeholder="Search anime to add..."
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="add-anime-modal-body">
          {loading ? (
            <div className="modal-loading">
              <span className="material-symbols-outlined spin-icon" style={{marginRight: '10px'}}>progress_activity</span>
              {isGlobalSearch ? "Searching database..." : "Loading your library..."}
            </div>
          ) : (
            <>
              {isGlobalSearch ? (
                <div className="modal-section">
                  <h3 className="section-title">
                    Search Results
                    <span className="count-badge">{globalResults.length}</span>
                  </h3>
                  {globalResults.length > 0 ? (
                    <div className="modal-grid">
                      {globalResults.map(anime => renderAnimeCard(anime))}
                    </div>
                  ) : (
                    <div className="modal-error">No results found for "{searchTerm}"</div>
                  )}
                </div>
              ) : (
                userData ? (
                  statusKeys.map((status) => {
                    const rawItems = userData[status] || [];
                    if (rawItems.length === 0) return null;

                    const normalizedItems = rawItems.map(mapAnimeData);

                    return (
                      <div key={status} className="modal-section">
                        <h3 className="section-title">
                          {formatStatusTitle(status)}
                          <span className="count-badge">{normalizedItems.length}</span>
                        </h3>

                        <div className="modal-grid">
                          {normalizedItems.map(anime => renderAnimeCard(anime))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="modal-error">Could not load library data.</div>
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