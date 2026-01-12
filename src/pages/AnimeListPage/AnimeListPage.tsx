import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import hook
import { useAnimeListPage } from '@umamusumeenjoyer/shared-logic';

// Import Child Components
import Sidebar from './components/Sidebar';
import AddAnimeModal from './components/AddAnimeModal';
import ListHeader from './components/ListHeader';
import UserAnimeGroup from './components/UserAnimeGroup';
import EditListModal from './components/EditListModal';
import UserSearchModal from './components/UserSearchModal';
import RequestModal from './components/RequestModal';
import RequestList from './components/RequestList';

import './AnimeListPage.css';

const AnimeListPage: React.FC = () => {
  const { t } = useTranslation(['animeListPage']); // Khởi tạo hook dịch
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    currentUsername,
    currentPermission,
    canEdit,
    isViewer,
    listInfo,
    groupedAnime,
    loading,
    searchTerm,
    members,
    pendingRequests,
    showEditModal,
    showAddModal,
    showUserModal,
    modalRoleType,
    showRequestModal,
    requestType,
    isSubmittingRequest,
    deleteMode,
    selectedAnimeIds,
    isDeleting,
    allAnimeInList,
    currentUserHasItems,
    setSearchTerm,
    setShowAddModal,
    setShowEditModal,
    setShowUserModal,
    setShowRequestModal,
    filterAnime,
    handleAcceptRequest,
    handleRejectRequest,
    handleEditListClick,
    handleUpdateSuccess,
    handleDeleteList,
    handleOpenJoinRequest,
    handleOpenEditRequest,
    handleSubmitRequest,
    handleAddAnime,
    toggleDeleteMode,
    handleSelectAnime,
    handleConfirmDelete,
    handleOpenAddEditor,
    handleOpenAddViewer,
    handleUserAdded,
    handleRemoveMember,
  } = useAnimeListPage(id || '', location.state, navigate);

  return (
    <div className="page-container">
      <div className="main-layout">
        <main className="content-area">
          <ListHeader listInfo={listInfo} listId={id || ''} />

          <div className="filter-bar-sticky">
            <div className="search-wrapper">
              <span className="material-symbols-outlined search-icon">search</span>
              <input
                type="text"
                className="search-input"
                placeholder={t('animeListPage.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="anime-lists-container">
            {loading ? (
              <div className="loading-state">{t('animeListPage.loading')}</div>
            ) : Object.keys(groupedAnime).length > 0 ? (
              <>
                {canEdit && !currentUserHasItems && (
                  <div className="user-group-section" style={{ marginBottom: '30px' }}>
                    <div className="user-group-header">
                      <div className="user-group-title">
                        <span className="material-symbols-outlined">person</span>
                        <h3>{t('animeListPage.emptyState.userTitle', { user: currentUsername })}</h3>
                      </div>
                    </div>
                    <div style={{
                      padding: '30px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '12px',
                      border: '1px dashed rgba(255, 255, 255, 0.1)'
                    }}>
                      <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '0.95rem' }}>
                        {t('animeListPage.emptyState.noAnimeYet')}
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowAddModal(true)}
                      >
                        <span className="material-symbols-outlined" style={{ marginRight: '5px' }}>add</span>
                        {t('animeListPage.emptyState.addAnimeButton')}
                      </button>
                    </div>
                  </div>
                )}

                {Object.keys(groupedAnime)
                  .sort((a, b) => {
                    if (a === currentUsername) return -1;
                    if (b === currentUsername) return 1;
                    return 0;
                  })
                  .map((user) => {
                    const userAnimeList = filterAnime(groupedAnime[user]);
                    if (userAnimeList.length === 0) return null;

                    return (
                      <UserAnimeGroup
                        key={user}
                        user={user}
                        animeList={userAnimeList}
                        isCurrentUser={user === currentUsername}
                        canEdit={canEdit}
                        deleteMode={deleteMode}
                        selectedAnimeIds={selectedAnimeIds}
                        isDeleting={isDeleting}
                        onOpenAddModal={() => setShowAddModal(true)}
                        onToggleDeleteMode={toggleDeleteMode}
                        onConfirmDelete={handleConfirmDelete}
                        onSelectAnime={handleSelectAnime}
                      />
                    );
                  })}
              </>
            ) : (
              <div className="empty-state">
                <p>{t('animeListPage.emptyState.listEmpty')}</p>
                {canEdit && (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '16px' }}
                    onClick={() => setShowAddModal(true)}
                  >
                    {t('animeListPage.emptyState.addAnimeButton')}
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        <div className="sidebar-area">
          <div className="action-buttons sidebar-actions">
            {listInfo.is_owner ? (
              <>
                <button className="btn btn-secondary" onClick={handleEditListClick}>
                  {t('animeListPage.sidebarActions.editDetails')}
                </button>
                <button className="btn btn-danger" onClick={handleDeleteList}>
                  {t('animeListPage.sidebarActions.deleteList')}
                </button>
              </>
            ) : isViewer ? (
              <button
                className="btn btn-primary btn-icon"
                onClick={handleOpenEditRequest}
              >
                <span className="material-symbols-outlined">edit_note</span>
                {t('animeListPage.sidebarActions.requestEdit')}
              </button>
            ) : !currentPermission && (
              <button
                className="btn btn-primary btn-icon"
                onClick={handleOpenJoinRequest}
                style={{ backgroundColor: 'var(--accent-green)' }}
              >
                <span className="material-symbols-outlined">person_add</span>
                {t('animeListPage.sidebarActions.joinRequest')}
              </button>
            )}
          </div>

          <Sidebar
            members={members}
            onAddEditor={handleOpenAddEditor}
            onAddViewer={handleOpenAddViewer}
            onRemoveMember={handleRemoveMember}
          />

          {listInfo.is_owner && (
            <RequestList
              requests={pendingRequests}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
              currentMembers={members}
            />
          )}
        </div>
      </div>

      <AddAnimeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddAnime={handleAddAnime}
        currentList={allAnimeInList}
      />

      <EditListModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        listId={id || ''}
        initialData={listInfo}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <UserSearchModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        listId={id || ''}
        roleType={modalRoleType}
        currentMembers={members}
        onUserAdded={handleUserAdded}
      />

      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleSubmitRequest}
        title={requestType === 'join' 
          ? t('animeListPage.requestModal.joinTitle') 
          : t('animeListPage.requestModal.editTitle')
        }
        placeholder={
          requestType === 'join'
            ? t('animeListPage.requestModal.joinPlaceholder')
            : t('animeListPage.requestModal.editPlaceholder')
        }
        isLoading={isSubmittingRequest}
      />
    </div>
  );
};

export default AnimeListPage;