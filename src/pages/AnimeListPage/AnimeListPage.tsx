import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

import AnimeListPageSkeleton from './AnimeListPageSkeleton';

// Import CSS Module
import styles from './AnimeListPage.module.css';

const AnimeListPage: React.FC = () => {
  const { t } = useTranslation(['animeListPage']);
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
  
  if (loading) {
    return <AnimeListPageSkeleton />;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainLayout}>
        <main className="content-area"> {/* Class này có vẻ là layout global hoặc không style trong file css gốc, giữ nguyên string */}
          <ListHeader 
            listInfo={{
              list_name: listInfo.name,
              description: listInfo.description,
              is_private: listInfo.privacy === 'private',
              is_owner: listInfo.isOwner,
              color: listInfo.color,
              bannerImage: listInfo.bannerImage
            } as any} 
            listId={id || ''} 
          />

          <div className={styles.filterBarSticky}>
            <div className={styles.searchWrapper}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={t('animeListPage.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="anime-lists-container"> {/* Giữ nguyên nếu không có trong css gốc, hoặc map nếu cần */}
            {loading ? (
              <div className={styles.loadingState}>{t('animeListPage.loading')}</div>
            ) : Object.keys(groupedAnime).length > 0 ? (
              <>
                {canEdit && !currentUserHasItems && (
                  <div className={styles.userGroupSection}>
                    <div className={styles.userGroupHeader}>
                      <div className={styles.userGroupTitle}>
                        <span className="material-symbols-outlined">person</span>
                        <h3>{t('animeListPage.emptyState.userTitle', { user: currentUsername })}</h3>
                      </div>
                    </div>
                    
                    {/* Đã thay thế inline styles bằng class CSS Module */}
                    <div className={styles.emptyGroupContent}>
                      <p className={styles.emptyGroupText}>
                        {t('animeListPage.emptyState.noAnimeYet')}
                      </p>
                      <button
                        className={`${styles.btn} ${styles.btnPrimary}`}
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
              <div className={styles.emptyState}>
                <p>{t('animeListPage.emptyState.listEmpty')}</p>
                {canEdit && (
                  <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
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
          <div className={`${styles.actionButtons} ${styles.sidebarActions}`}>
            {listInfo.isOwner ? (
              <>
                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleEditListClick}>
                  {t('animeListPage.sidebarActions.editDetails')}
                </button>
                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDeleteList}>
                  {t('animeListPage.sidebarActions.deleteList')}
                </button>
              </>
            ) : isViewer ? (
              <button
                className={`${styles.btn} ${styles.btnPrimary} btn-icon`}
                onClick={handleOpenEditRequest}
              >
                <span className="material-symbols-outlined">edit_note</span>
                {t('animeListPage.sidebarActions.requestEdit')}
              </button>
            ) : !currentPermission && (
              <button
                className={`${styles.btn} ${styles.btnJoinRequest} btn-icon`}
                onClick={handleOpenJoinRequest}
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

          {listInfo.isOwner && (
            <RequestList
              requests={pendingRequests.map(req => ({
                request_id: req.id,
                username: req.username,
                request_type: req.type === 'edit' ? 'edit_permission' : 'join',
                status: (req.status === 'pending' || req.status === 'PENDING' || req.status_code === 'PENDING') ? 'pending' : (req.status === 'approved' || req.status === 'ACCEPTED' || req.status_code === 'ACCEPTED') ? 'approved' : 'rejected',
                message: req.message,
                requested_at: req.requested_at || req.requestedAt || req.createdAt
              })) as any}
              onAccept={(req: any) => handleAcceptRequest({
                id: req.request_id,
                username: req.username,
                type: req.request_type === 'edit_permission' ? 'edit' : 'join',
                status: 'PENDING',
                createdAt: req.requested_at
              } as any)}
              onReject={(req: any) => handleRejectRequest({
                id: req.request_id,
                username: req.username,
                type: req.request_type === 'edit_permission' ? 'edit' : 'join',
                status: 'PENDING',
                createdAt: req.requested_at
              } as any)}
              currentMembers={members.map(m => ({
                username: m.username,
                is_owner: m.isOwner,
                permission_level: m.permission === 'viewer' ? 'view' : m.permission === 'editor' ? 'edit' : m.permission,
              })) as any}
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
        initialData={{
          list_name: listInfo.name,
          description: listInfo.description,
          is_private: listInfo.privacy === 'private',
          color: (listInfo.bannerImage && listInfo.bannerImage.startsWith('#')) ? listInfo.bannerImage : listInfo.color,
          bannerImage: (listInfo.bannerImage && !listInfo.bannerImage.startsWith('#')) ? listInfo.bannerImage : ''
        }}
        onUpdateSuccess={(data) => handleUpdateSuccess({
          name: data.list_name,
          description: data.description,
          privacy: data.is_private ? 'private' : 'public',
          color: data.color,
          bannerImage: data.bannerImage
        })}
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