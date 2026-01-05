// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import ProfileBanner from './components/ProfileBanner'; 
import ActivityHistory from './components/ActivityHistory';
import ActivityFeed from './components/ActivityFeed';
import AnimeCard from '../../components/AnimeCard';
import EditProfileModal from './components/EditProfileModal'; // [NEW] Import Modal
import { useAuth } from '../../context/AuthContext'; // Import hook

// API Services
import { 
    getUserCustomLists, 
    createCustomList, 
    getUserAnimeList, 
    getListsLikedByUser, 
    getUserProfile 
} from '../../services/api'; 

// [CONFIG] Domain Backend để xử lý ảnh
const BACKEND_DOMAIN = 'https://doannguyen.pythonanywhere.com';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { username: routeUsername } = useParams(); 
  const { updateUserContext } = useAuth();
  // Lấy username hiện tại từ localStorage (được cập nhật khi login hoặc edit profile)
  const loggedInUsername = localStorage.getItem('username'); 

  // --- LOGIC XÁC ĐỊNH TARGET USER ---
  // Nếu URL không có username, mặc định là trang của người đang đăng nhập
  const targetUsername = routeUsername || loggedInUsername || "guest";
  
  // Kiểm tra quyền "Chính chủ"
  const isOwnProfile = !routeUsername || (routeUsername === loggedInUsername);

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('Overview');
  
  // Profile State
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false); // [NEW] State Modal

  // Avatar mặc định
  const DEFAULT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlZjpoc6BcEHSBXN83B8niRWSjcbNE-DArpg&s";

  // Lists State
  const [customLists, setCustomLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(false);
  
  const [likedLists, setLikedLists] = useState([]);
  const [likedListsLoading, setLikedListsLoading] = useState(false);

  // Favorites & Stats State
  const [favoriteList, setFavoriteList] = useState([]);
  const [favLoading, setFavLoading] = useState(false);
  const [totalContributions, setTotalContributions] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  // Create List Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListData, setNewListData] = useState({
    list_name: '', description: '', is_private: false, color: '#3db4f2'
  });
  const [creating, setCreating] = useState(false);

  // --- HELPER FUNCTIONS ---

  // Xử lý URL Avatar: Nếu là đường dẫn tương đối -> ghép domain
  const getAvatarUrl = (url) => {
    if (!url) return DEFAULT_AVATAR;
    if (url.startsWith('http')) return url;
    return `${BACKEND_DOMAIN}${url}`;
  };

  const getDisplayName = () => {
    if (!userProfile) return targetUsername;
    const fullName = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
    return fullName || userProfile.username;
  };

  const formatDateJoined = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // --- [CORE LOGIC] FETCH DATA ---

  // 1. Fetch User Profile (Chạy lại khi targetUsername thay đổi)
  useEffect(() => {
    if (!targetUsername) return;
    
    setProfileLoading(true);
    getUserProfile(targetUsername)
      .then((res) => {
        setUserProfile(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        // Có thể navigate sang trang 404 nếu cần
      })
      .finally(() => {
        setProfileLoading(false);
      });

  }, [targetUsername]); // Dependency quan trọng: thay đổi username -> fetch lại

  // 2. Fetch Custom Lists
  const fetchCustomLists = () => {
    if (!targetUsername) return;
    setListsLoading(true);
    getUserCustomLists(targetUsername)
      .then((res) => setCustomLists(res.data && res.data.lists ? res.data.lists : []))
      .catch((err) => console.error(err))
      .finally(() => setListsLoading(false));
  };

  // 3. Fetch Liked Lists
  const fetchLikedLists = async () => {
    if (!targetUsername) return;
    setLikedListsLoading(true);
    try {
      const payload = { username: targetUsername, limit: 20, offset: 0 };
      const res = await getListsLikedByUser(payload);
      if (res.data && res.data.liked_lists) {
        setLikedLists(res.data.liked_lists);
      } else {
        setLikedLists([]);
      }
    } catch (error) {
      console.error("Failed to fetch liked lists:", error);
    } finally {
      setLikedListsLoading(false);
    }
  };

  // 4. Fetch Favorites
  useEffect(() => {
    if (activeTab === 'Favorites') {
      const fetchFavorites = async () => {
        if (!targetUsername) return;
        setFavLoading(true);
        try {
            const res = await getUserAnimeList(targetUsername);
            const data = res.data;
            const allAnime = [
              ...(data.watching || []), ...(data.completed || []),
              ...(data.on_hold || []), ...(data.dropped || []), ...(data.plan_to_watch || [])
            ];
            const filteredFavorites = allAnime.filter(anime => anime.isFavorite === true);
            setFavoriteList(filteredFavorites); 
        } catch (err) {
            console.error("Failed to fetch favorites:", err);
            setFavoriteList([]);
        } finally {
            setFavLoading(false);
        }
      };
      fetchFavorites();
    }
  }, [activeTab, targetUsername]);

  // 5. Initial Data Load based on Tab
  useEffect(() => {
    if (activeTab === 'Anime List') {
      fetchCustomLists();
      if (isOwnProfile) {
        fetchLikedLists();
      }
    }
    setSelectedDate(null);
  }, [activeTab, targetUsername, isOwnProfile]);


  // --- [NEW LOGIC] UPDATE PROFILE HANDLER ---
  const handleUpdateSuccess = (updatedUser) => {
    // Trường hợp 1: Người dùng thay đổi Username
    if (updatedUser.username !== userProfile.username) {
        // Cập nhật localStorage để giữ phiên đăng nhập đúng
        localStorage.setItem('username', updatedUser.username);
        
        // Điều hướng sang URL mới. 
        // Việc này sẽ kích hoạt lại useEffect([targetUsername]) ở trên, 
        // giúp load lại toàn bộ dữ liệu mới từ server.
        navigate(`/user/${updatedUser.username}`, { replace: true });
    } 
    // Trường hợp 2: Chỉ thay đổi Tên (First/Last name)
    else {
        // Cập nhật state cục bộ để UI phản hồi ngay lập tức
        setUserProfile(prev => ({
            ...prev,
            ...updatedUser
        }));
    }
    updateUserContext(updatedUser);
  };


  // --- EVENT HANDLERS ---
  const handleTabChange = (tabName) => setActiveTab(tabName);

  const handleDateSelect = (date) => {
    setSelectedDate(selectedDate === date ? null : date);
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createCustomList(newListData);
      setShowCreateModal(false);
      setNewListData({ list_name: '', description: '', is_private: false, color: '#3db4f2' });
      fetchCustomLists(); // Reload list sau khi tạo
    } catch (error) {
      alert("Error creating list.");
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewListData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const PrivateBadge = () => (
    <span style={{ fontSize: '10px', marginLeft: '8px', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '10px', color: 'var(--text-secondary)', verticalAlign: 'middle', fontWeight: 'normal' }}>
      Private
    </span>
  );

  // --- RENDER ---
  return (
    <div className="profile-page">
      <div className="profile-layout">
        
        {/* === LEFT COLUMN: SIDEBAR === */}
        <div className="profile-sidebar">
          {profileLoading ? (
             <div style={{color: 'var(--text-secondary)', padding: '20px'}}>Loading profile...</div>
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
              
              {/* [NEW] Nút Edit Profile kích hoạt Modal */}
              {(isOwnProfile || userProfile?.is_own_profile) && (
                <button 
                    className="btn-edit-profile"
                    onClick={() => setShowEditModal(true)}
                >
                    Edit profile
                </button>
              )}
              


              <div className="profile-meta">
                {userProfile?.date_joined && (
                  <div className="meta-item">
                     <svg className="meta-icon" viewBox="0 0 16 16" style={{fill: 'var(--text-secondary)'}}>
                        <path fillRule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"></path>
                     </svg>
                     <span>Joined {formatDateJoined(userProfile.date_joined)}</span>
                  </div>
                )}
                

              </div>

              <div className="separator"></div>
              
              {userProfile?.is_staff && (
                <div style={{marginBottom: '16px'}}>
                    <div className="section-title" style={{fontWeight: 600}}>Badges</div>
                    <div style={{marginTop: '8px'}}>
                      <span style={{border: '1px solid var(--border-color)', borderRadius: '20px', padding: '2px 8px', fontSize: '12px', color: '#a371f7'}}>✦ STAFF</span>
                    </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* === RIGHT COLUMN: MAIN CONTENT === */}
        <div className="profile-content">
          <ProfileBanner activeTab={activeTab} onTabChange={handleTabChange} />

          {activeTab === 'Overview' && (
            <>
              <div className="activity-section-wrapper" style={{marginTop: 0}}>
                 <div className="section-header">
                    <div className="section-title">{totalContributions} contributions in the last year</div>
                 </div>
                 <ActivityHistory 
                    username={targetUsername} 
                    onTotalCountChange={setTotalContributions}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                 />
              </div>
              <div className="activity-section-wrapper">
                 <ActivityFeed username={targetUsername} filterDate={selectedDate} />
              </div>
            </>
          )}

          {activeTab === 'Anime List' && (
             <>
               {/* 1. My Custom Lists */}
               <div className="custom-lists-container">
                 <div className="section-header">
                   <h2 className="section-title" style={{fontSize: '20px', fontWeight: 600}}>
                     {(isOwnProfile || userProfile?.is_own_profile) ? "My Custom Lists" : `${targetUsername}'s Lists`}
                   </h2>
                   {(isOwnProfile || userProfile?.is_own_profile) && (
                     <button className="btn-edit-profile" style={{width: 'auto'}} onClick={() => setShowCreateModal(true)}>
                       New List
                     </button>
                   )}
                 </div>
                 
                 {listsLoading ? <div>Loading...</div> : (
                   <div className="custom-list-grid">
                      {customLists.map(list => (
                         <div key={list.list_id} className="custom-list-card" onClick={() => navigate(`/list/${list.list_id}`, { state: { listData: list } })}>
                            <h3 className="list-name">
                              {list.list_name}
                              {list.is_private && <PrivateBadge />}
                            </h3>
                            <p className="list-desc">{list.description}</p>
                         </div>
                      ))}
                      {customLists.length === 0 && <div className="empty-text">No custom lists found.</div>}
                   </div>
                 )}
               </div>

               {/* 2. Liked Lists */}
               {(isOwnProfile || userProfile?.is_own_profile) && (
                 <div className="custom-lists-container" style={{ marginTop: '40px' }}>
                   <div className="section-header">
                     <h2 className="section-title" style={{fontSize: '20px', fontWeight: 600}}>
                       Liked Lists
                     </h2>
                   </div>
                   
                   {likedListsLoading ? <div>Loading liked lists...</div> : (
                     <div className="custom-list-grid">
                        {likedLists.map(list => (
                           <div key={list.list_id} className="custom-list-card" onClick={() => navigate(`/list/${list.list_id}`, { state: { listData: list } })}>
                              <h3 className="list-name">
                                {list.list_name}
                                {list.is_private && <PrivateBadge />}
                              </h3>
                              <p className="list-desc">{list.description}</p>
                              <div style={{marginTop: '8px', fontSize: '11px', color: 'var(--text-secondary)'}}>
                                 ❤️ {list.like_count}
                              </div>
                           </div>
                        ))}
                        {likedLists.length === 0 && <div className="empty-text">No liked lists yet.</div>}
                     </div>
                   )}
                 </div>
               )}
             </>
          )}

          {activeTab === 'Favorites' && (
            <div className="favorites-container">
               <div className="section-header">
                 <h2 className="section-title" style={{fontSize: '20px', fontWeight: 600}}>Favorites</h2>
               </div>
               {favLoading ? <div>Loading...</div> : (
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

      {/* --- [NEW] EDIT PROFILE MODAL --- */}
      <EditProfileModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentUser={userProfile}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* --- CREATE LIST MODAL --- */}
      {showCreateModal && (isOwnProfile || userProfile?.is_own_profile) && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
           <div className="modal-content" onClick={e => e.stopPropagation()}>
             <h3 style={{marginTop: 0, color: 'var(--text-main)'}}>Create New List</h3>
             <form onSubmit={handleSubmitCreate}>
                <div className="form-group">
                   <label style={{display: 'block', marginBottom: '5px', color: 'var(--text-main)'}}>List Name</label>
                   <input 
                      type="text" name="list_name" required
                      value={newListData.list_name} onChange={handleInputChange}
                      style={{width: '100%', padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px'}}
                   />
                </div>
                <div className="form-group" style={{marginTop: '10px'}}>
                   <label style={{display: 'block', marginBottom: '5px', color: 'var(--text-main)'}}>Description</label>
                   <textarea 
                      name="description" 
                      value={newListData.description} onChange={handleInputChange}
                      style={{width: '100%', padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px'}}
                   />
                </div>
                
                <div className="form-group" style={{marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                   <input 
                      type="checkbox" name="is_private" id="is_private"
                      checked={newListData.is_private} onChange={handleInputChange}
                   />
                   <label htmlFor="is_private" style={{color: 'var(--text-main)', fontSize: '14px'}}>Make this list private</label>
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
                   <button type="button" onClick={() => setShowCreateModal(false)} style={{padding: '6px 12px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer'}}>Cancel</button>
                   <button type="submit" style={{padding: '6px 12px', background: 'var(--accent-green)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer'}} disabled={creating}>Create</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;