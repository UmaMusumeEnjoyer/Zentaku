import React from 'react';
import styles from './ProfilePage.module.css';
import { useProfilePage, type UserProfile } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAuth as useAuthContext } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import ProfileBanner from './components/ProfileBanner'; 
import ActivityHistory from './components/ActivityHistory';
import ActivityFeed from './components/ActivityFeed';
import AnimeCard from '../../components/AnimeCard/AnimeCard';
import EditProfileModal from './components/EditProfileModal';

// [CHANGE] Import Skeletons
import { 
  ProfileSidebarSkeleton, 
  ProfileBannerSkeleton, 
  AnimeListsSkeleton, 
  FavoritesSkeleton,
  ActivityHistorySkeleton, // <--- Import mới
  ActivityFeedSkeleton
} from './ProfileSkeletons'; // Điều chỉnh path nếu cần

import Skeleton from '../../components/PlaceholderSkeleton/Skeleton';

const ProfilePage: React.FC = () => {
  // ... (Giữ nguyên hooks và logic ViewModel không đổi) ...
  const { t } = useTranslation('ProfilePagePage');
  const { username } = useParams<{ username: string }>();
  const { theme } = useTheme();
  const { updateUserInState: syncAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const {
    targetUsername, isOwnProfile, userProfile, profileLoading,
    getDisplayName, getAvatarUrl, formatDateJoined,
    activeTab, handleTabChange,
    totalContributions, setTotalContributions, selectedDate, handleDateSelect,
    customLists, listsLoading, likedLists, likedListsLoading, handleListClick,
    favoriteList, favLoading,
    showEditModal, setShowEditModal, handleUpdateSuccess,
    showCreateModal, setShowCreateModal, newListData, creating, 
    handleCreateListSubmit, handleNewListInputChange
  } = useProfilePage(username, { 
    onNavigateToList: (listId) => navigate(`/list/${listId}`),
    onNavigateToUserProfile: (newUsername) => {}
  });

   React.useEffect(() => {
    if (isOwnProfile && userProfile) {
      syncAuthUser(userProfile);
    }
  }, [isOwnProfile, userProfile, syncAuthUser]);

  const PrivateBadge = () => (
    <span className={styles.privateBadge}>{t('anime_list.badges.private')}</span>
  );

  return (
    <div className={styles.profilePage} data-theme={theme}>
      <div className={styles.profileContainer}>
        <div className={styles.profileLayout}>
          
          {/* === LEFT COLUMN: SIDEBAR === */}
          <div className={styles.profileSidebar}>
            {/* [CHANGE] Logic Loading Sidebar */}
            {profileLoading ? (
              <ProfileSidebarSkeleton />
            ) : (
              <>
                <div className={styles.profileAvatarWrapper}>
                  <img 
                    src={getAvatarUrl(userProfile?.avatar_url)} 
                    alt="Profile" 
                    className={styles.profileAvatar} 
                  />
                </div>
                <div className={styles.profileNames}>
                  <span className={styles.profileDisplayName}>{getDisplayName()}</span>
                  <span className={styles.profileUsername}>{userProfile?.username || targetUsername}</span>
                </div>
                
                {(isOwnProfile || userProfile?.is_own_profile) && (
                  <button 
                      className={styles.btnEditProfile}
                      onClick={() => setShowEditModal(true)}
                  >
                      {t('sidebar.edit_profile')}
                  </button>
                )}

                <div className={styles.profileMeta}>
                  {userProfile?.date_joined && (
                    <div className={styles.metaItem}>
                      <svg className={styles.metaIcon} viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"></path>
                      </svg>
                      <span>{t('sidebar.joined', { date: formatDateJoined(userProfile.date_joined) })}</span>
                    </div>
                  )}
                </div>

                <div className={styles.separator}></div>
                
                {userProfile?.is_staff && (
                  <div className={styles.badgeSection}>
                      <div className={styles.badgeTitle}>{t('sidebar.badges.title')}</div>
                      <div>
                        <span className={styles.staffBadge}>✦ {t('sidebar.badges.staff')}</span>
                      </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* === RIGHT COLUMN: MAIN CONTENT === */}
          <div className={styles.profileContent}>
            
            {/* [CHANGE] Nếu đang load profile chính, hiển thị Banner Skeleton */}
            {profileLoading ? (
               <ProfileBannerSkeleton />
            ) : (
               <ProfileBanner activeTab={activeTab} onTabChange={handleTabChange} />
            )}

            {/* --- TAB: OVERVIEW --- */}
            {activeTab === 'Overview' && (
              <>
                <div className={styles.activitySectionWrapper} style={{marginTop: 0}}>
                  <div className={styles.sectionHeader}>
                      <div className={styles.sectionTitle}>{t('overview.contributions.title', { count: totalContributions })}</div>
                  </div>
                  {/* Nếu ActivityHistory có loading prop riêng thì truyền vào, ở đây giả sử nó tự handle hoặc dùng profileLoading */}
                  {profileLoading ? (
                    <Skeleton height={150} width="100%" /> 
                  ) : (
                    <ActivityHistory 
                        username={targetUsername}
                        onTotalCountChange={setTotalContributions}
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                    />
                  )}
                </div>
                <div className={styles.activitySectionWrapper}>
                   {/* [CHANGE] Activity Feed Loading */}
                  {profileLoading ? (
                          <ActivityFeedSkeleton />
                        ) : (
                          <ActivityFeed 
                            username={targetUsername}
                            filterDate={selectedDate || undefined} 
                          />
                        )}
                </div>
              </>
            )}

            {/* --- TAB: ANIME LIST --- */}
            {activeTab === 'Anime List' && (
              <>
                {/* 1. My Custom Lists */}
                <div className={styles.customListsContainer}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                      {(isOwnProfile || userProfile?.is_own_profile) 
                        ? t('anime_list.my_custom_lists') 
                        : t('anime_list.users_lists', { username: targetUsername })}
                    </h2>
                    {(isOwnProfile || userProfile?.is_own_profile) && (
                      <button className={styles.btnEditProfile} style={{width: 'auto', marginBottom: 0}} onClick={() => setShowCreateModal(true)}>
                        {t('anime_list.new_list')}
                      </button>
                    )}
                  </div>
                  
                  {/* [CHANGE] Logic Loading Lists */}
                  {listsLoading ? (
                    <AnimeListsSkeleton />
                  ) : (
                    <div className={styles.customListGrid}>
                        {customLists.map(list => (
                          <div key={list.list_id} className={styles.customListCard} onClick={() => handleListClick(list)}>
                              <h3 className={styles.listName}>
                                {list.list_name}
                                {list.is_private && <PrivateBadge />}
                              </h3>
                              <p className={styles.listDesc}>{list.description}</p>
                          </div>
                        ))}
                        {customLists.length === 0 && <div className={styles.emptyText}>{t('anime_list.empty.no_lists')}</div>}
                    </div>
                  )}
                </div>

                {/* 2. Liked Lists */}
                {(isOwnProfile || userProfile?.is_own_profile) && (
                  <div className={styles.customListsContainer} style={{ marginTop: '40px' }}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>
                        {t('anime_list.liked_lists')}
                      </h2>
                    </div>
                    
                    {/* [CHANGE] Logic Loading Liked Lists */}
                    {likedListsLoading ? (
                      <AnimeListsSkeleton />
                    ) : (
                      <div className={styles.customListGrid}>
                          {likedLists.map(list => (
                            <div key={list.list_id} className={styles.customListCard} onClick={() => handleListClick(list)}>
                                <h3 className={styles.listName}>
                                  {list.list_name}
                                  {list.is_private && <PrivateBadge />}
                                </h3>
                                <p className={styles.listDesc}>{list.description}</p>
                                <div className={styles.listMeta}>
                                  {t('anime_list.likes_count', { count: list.like_count })}
                                </div>
                            </div>
                          ))}
                          {likedLists.length === 0 && <div className={styles.emptyText}>{t('anime_list.empty.no_liked_lists')}</div>}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* --- TAB: FAVORITES --- */}
            {activeTab === 'Favorites' && (
              <div className={styles.favoritesContainer}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>{t('favorites.title')}</h2>
                </div>
                
                {/* [CHANGE] Logic Loading Favorites */}
                {favLoading ? (
                  <FavoritesSkeleton />
                ) : (
                  <div className={styles.animeGrid6}>
                      {favoriteList.map((anime) => (
                        <div key={anime.id || anime.anilist_id} className={styles.gridItem}>
                            <AnimeCard anime={anime} />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ... MODALS giữ nguyên ... */}
        <EditProfileModal 
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentUser={userProfile as UserProfile}
          onUpdateSuccess={handleUpdateSuccess}
        />
        {/* ... Create List Modal giữ nguyên ... */}
        {showCreateModal && (isOwnProfile || userProfile?.is_own_profile) && (
           /* ... code modal cũ ... */
           <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
              {/* ... nội dung modal ... */}
              <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                 {/* ... copy lại form từ code cũ ... */}
                 <h3 className={styles.modalTitle}>{t('create_list_modal.title')}</h3>
                  <form onSubmit={handleCreateListSubmit}>
                      {/* ... các input ... */}
                      <div className={styles.modalActions}>
                        <button type="button" onClick={() => setShowCreateModal(false)} className={styles.btnCancel}>
                          {t('create_list_modal.actions.cancel')}
                        </button>
                        <button type="submit" className={styles.btnCreate} disabled={creating}>
                          {creating ? t('create_list_modal.actions.creating') : t('create_list_modal.actions.create')}
                        </button>
                      </div>
                  </form>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;