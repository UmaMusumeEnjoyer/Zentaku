import React from 'react';
import './ProfilePage.css';
import { useProfilePage, type UserProfile } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

// Components
import ProfileBanner from './components/ProfileBanner'; 
import ActivityHistory from './components/ActivityHistory';
import ActivityFeed from './components/ActivityFeed';
import AnimeCard from '../../components/AnimeCard/AnimeCard';
import EditProfileModal from './components/EditProfileModal';

const ProfilePage: React.FC = () => {
  // i18n
  const { t } = useTranslation('ProfilePagePage');
  
  // Kết nối ThemeContext
  const { theme } = useTheme();

  // Kết nối ViewModel
  const {
    // Info
    targetUsername, isOwnProfile, userProfile, profileLoading,
    getDisplayName, getAvatarUrl, formatDateJoined,

    // Tabs
    activeTab, handleTabChange,

    // Activity
    totalContributions, setTotalContributions, selectedDate, handleDateSelect,

    // Lists
    customLists, listsLoading, likedLists, likedListsLoading, handleListClick,

    // Favorites
    favoriteList, favLoading,

    // Modals
    showEditModal, setShowEditModal, handleUpdateSuccess,
    showCreateModal, setShowCreateModal, newListData, creating, 
    handleCreateListSubmit, handleNewListInputChange
  } = useProfilePage();

  // Helper Component nhỏ cho UI badge
  const PrivateBadge = () => (
    <span style={{ fontSize: '10px', marginLeft: '8px', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '10px', color: 'var(--text-secondary)', verticalAlign: 'middle', fontWeight: 'normal' }}>
      {t('anime_list.badges.private')}
    </span>
  );

  return (
    <div className="profile-page" data-theme={theme}>
      <div className="profile-layout">
        
        {/* === LEFT COLUMN: SIDEBAR === */}
        <div className="profile-sidebar">
          {profileLoading ? (
             <div style={{color: 'var(--text-secondary)', padding: '20px'}}>{t('loading.profile')}</div>
          ) : (
            <>
              <div className="profile-avatar-wrapper">
                <img 
                  src={getAvatarUrl(userProfile?.avatar_url)} 
                  alt="Profile" 
                  className="profile-avatar" 
                />
              </div>
              <div className="profile-names">
                <span className="profile-display-name">{getDisplayName()}</span>
                <span className="profile-username">{userProfile?.username || targetUsername}</span>
              </div>
              
              {(isOwnProfile || userProfile?.is_own_profile) && (
                <button 
                    className="btn-edit-profile"
                    onClick={() => setShowEditModal(true)}
                >
                    {t('sidebar.edit_profile')}
                </button>
              )}

              <div className="profile-meta">
                {userProfile?.date_joined && (
                  <div className="meta-item">
                     <svg className="meta-icon" viewBox="0 0 16 16" style={{fill: 'var(--text-secondary)'}}>
                        <path fillRule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"></path>
                     </svg>
                     <span>{t('sidebar.joined', { date: formatDateJoined(userProfile.date_joined) })}</span>
                  </div>
                )}
              </div>

              <div className="separator"></div>
              
              {userProfile?.is_staff && (
                <div style={{marginBottom: '16px'}}>
                    <div className="section-title" style={{fontWeight: 600}}>{t('sidebar.badges.title')}</div>
                    <div style={{marginTop: '8px'}}>
                      <span style={{border: '1px solid var(--border-color)', borderRadius: '20px', padding: '2px 8px', fontSize: '12px', color: '#a371f7'}}>✦ {t('sidebar.badges.staff')}</span>
                    </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* === RIGHT COLUMN: MAIN CONTENT === */}
        <div className="profile-content">
          <ProfileBanner activeTab={activeTab} onTabChange={handleTabChange} />

          {/* --- TAB: OVERVIEW --- */}
          {activeTab === 'Overview' && (
            <>
              <div className="activity-section-wrapper" style={{marginTop: 0}}>
                 <div className="section-header">
                    <div className="section-title">{t('overview.contributions.title', { count: totalContributions })}</div>
                 </div>
                 <ActivityHistory 
                    onTotalCountChange={setTotalContributions}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                 />
              </div>
              <div className="activity-section-wrapper">
                 <ActivityFeed filterDate={selectedDate || undefined} />
              </div>
            </>
          )}

          {/* --- TAB: ANIME LIST --- */}
          {activeTab === 'Anime List' && (
             <>
               {/* 1. My Custom Lists */}
               <div className="custom-lists-container">
                 <div className="section-header">
                   <h2 className="section-title" style={{fontSize: '20px', fontWeight: 600}}>
                     {(isOwnProfile || userProfile?.is_own_profile) 
                       ? t('anime_list.my_custom_lists') 
                       : t('anime_list.users_lists', { username: targetUsername })}
                   </h2>
                   {(isOwnProfile || userProfile?.is_own_profile) && (
                     <button className="btn-edit-profile" style={{width: 'auto'}} onClick={() => setShowCreateModal(true)}>
                       {t('anime_list.new_list')}
                     </button>
                   )}
                 </div>
                 
                 {listsLoading ? <div>{t('loading.lists')}</div> : (
                   <div className="custom-list-grid">
                      {customLists.map(list => (
                         <div key={list.list_id} className="custom-list-card" onClick={() => handleListClick(list)}>
                            <h3 className="list-name">
                              {list.list_name}
                              {list.is_private && <PrivateBadge />}
                            </h3>
                            <p className="list-desc">{list.description}</p>
                         </div>
                      ))}
                      {customLists.length === 0 && <div className="empty-text">{t('anime_list.empty.no_lists')}</div>}
                   </div>
                 )}
               </div>

               {/* 2. Liked Lists */}
               {(isOwnProfile || userProfile?.is_own_profile) && (
                 <div className="custom-lists-container" style={{ marginTop: '40px' }}>
                   <div className="section-header">
                     <h2 className="section-title" style={{fontSize: '20px', fontWeight: 600}}>
                       {t('anime_list.liked_lists')}
                     </h2>
                   </div>
                   
                   {likedListsLoading ? <div>{t('loading.liked_lists')}</div> : (
                     <div className="custom-list-grid">
                        {likedLists.map(list => (
                           <div key={list.list_id} className="custom-list-card" onClick={() => handleListClick(list)}>
                              <h3 className="list-name">
                                {list.list_name}
                                {list.is_private && <PrivateBadge />}
                              </h3>
                              <p className="list-desc">{list.description}</p>
                              <div style={{marginTop: '8px', fontSize: '11px', color: 'var(--text-secondary)'}}>
                                 {t('anime_list.likes_count', { count: list.like_count })}
                              </div>
                           </div>
                        ))}
                        {likedLists.length === 0 && <div className="empty-text">{t('anime_list.empty.no_liked_lists')}</div>}
                     </div>
                   )}
                 </div>
               )}
             </>
          )}

          {/* --- TAB: FAVORITES --- */}
          {activeTab === 'Favorites' && (
            <div className="favorites-container">
               <div className="section-header">
                 <h2 className="section-title" style={{fontSize: '20px', fontWeight: 600}}>{t('favorites.title')}</h2>
               </div>
               {favLoading ? <div>{t('loading.favorites')}</div> : (
                 <div className="anime-grid-6">
                    {favoriteList.map((anime) => (
                      <div key={anime.id || anime.anilist_id} className="grid-item">
                          <AnimeCard anime={anime} />
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL: EDIT PROFILE --- */}
      <EditProfileModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentUser={userProfile as UserProfile}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* --- MODAL: CREATE LIST --- */}
      {showCreateModal && (isOwnProfile || userProfile?.is_own_profile) && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
           <div className="modal-content" onClick={e => e.stopPropagation()}>
             <h3 style={{marginTop: 0, color: 'var(--text-main)'}}>{t('create_list_modal.title')}</h3>
             <form onSubmit={handleCreateListSubmit}>
                <div className="form-group">
                   <label style={{display: 'block', marginBottom: '5px', color: 'var(--text-main)'}}>
                     {t('create_list_modal.fields.list_name.label')}
                   </label>
                   <input 
                      type="text" name="list_name" required
                      value={newListData.list_name} onChange={handleNewListInputChange}
                      style={{width: '100%', padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px'}}
                   />
                </div>
                <div className="form-group" style={{marginTop: '10px'}}>
                   <label style={{display: 'block', marginBottom: '5px', color: 'var(--text-main)'}}>
                     {t('create_list_modal.fields.description.label')}
                   </label>
                   <textarea 
                      name="description" 
                      value={newListData.description} onChange={handleNewListInputChange}
                      style={{width: '100%', padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px'}}
                   />
                </div>
                
                <div className="form-group" style={{marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                   <input 
                      type="checkbox" name="is_private" id="is_private"
                      checked={newListData.is_private} onChange={handleNewListInputChange}
                   />
                   <label htmlFor="is_private" style={{color: 'var(--text-main)', fontSize: '14px'}}>
                     {t('create_list_modal.fields.is_private.label')}
                   </label>
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
                   <button type="button" onClick={() => setShowCreateModal(false)} style={{padding: '6px 12px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer'}}>
                     {t('create_list_modal.actions.cancel')}
                   </button>
                   <button type="submit" style={{padding: '6px 12px', background: 'var(--accent-green)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer'}} disabled={creating}>
                     {creating ? t('create_list_modal.actions.creating') : t('create_list_modal.actions.create')}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;