import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
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
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate(); // [FIX] Get navigate from React Router

  const {
    currentUsername,
    currentPermission, // [FIX] Destructure currentPermission
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
  } = useAnimeListPage(id || '', location.state, navigate); // [FIX] Pass navigate

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
                placeholder="Search in this list..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="anime-lists-container">
            {loading ? (
              <div className="loading-state">Loading anime details...</div>
            ) : Object.keys(groupedAnime).length > 0 ? (
              <>
                {canEdit && !currentUserHasItems && (
                  <div className="user-group-section" style={{ marginBottom: '30px' }}>
                    <div className="user-group-header">
                      <div className="user-group-title">
                        <span className="material-symbols-outlined">person</span>
                        <h3>Added by {currentUsername}</h3>
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
                        You haven't added any anime to this list yet.
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowAddModal(true)}
                      >
                        <span className="material-symbols-outlined" style={{ marginRight: '5px' }}>add</span>
                        Add Anime Now
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
                <p>This list is empty.</p>
                {canEdit && (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '16px' }}
                    onClick={() => setShowAddModal(true)}
                  >
                    Add Anime Now
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
                  Edit List Details
                </button>
                <button className="btn btn-danger" onClick={handleDeleteList}>
                  Delete List
                </button>
              </>
            ) : isViewer ? (
              <button
                className="btn btn-primary btn-icon"
                onClick={handleOpenEditRequest}
              >
                <span className="material-symbols-outlined">edit_note</span>
                Request Edit Access
              </button>
            ) : !currentPermission && (
              <button
                className="btn btn-primary btn-icon"
                onClick={handleOpenJoinRequest}
                style={{ backgroundColor: 'var(--accent-green)' }}
              >
                <span className="material-symbols-outlined">person_add</span>
                Join Request
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
        title={requestType === 'join' ? "Join Request" : "Edit Access Request"}
        placeholder={
          requestType === 'join'
            ? "Hello, I would like to join this list as a contributor..."
            : "Please describe why you need edit permission..."
        }
        isLoading={isSubmittingRequest}
      />
    </div>
  );
};

export default AnimeListPage;