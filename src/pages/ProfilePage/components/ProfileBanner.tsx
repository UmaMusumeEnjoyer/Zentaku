import React from 'react';
import './ProfileBanner.css';

// Component này bây giờ chỉ đóng vai trò là Thanh Điều Hướng (Tab Navigation)
const ProfileBanner = ({ activeTab, onTabChange }) => {
  return (
    <div className="profile-nav-container">
      <nav className="profile-nav">
        {/* Overview Tab */}
        <div 
          className={`nav-item ${activeTab === 'Overview' ? 'active' : ''}`}
          onClick={() => onTabChange('Overview')}
        >
          <svg className="nav-icon" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.75 2.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5H1.75zm0 5a.75.75 0 000 1.5h6.25a.75.75 0 000-1.5H1.75zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5H1.75zM15 2a1 1 0 00-1-1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2zM2 2h12v12H2V2z"></path></svg>
          Overview
        </div>

        {/* Anime List Tab */}
        <div 
          className={`nav-item ${activeTab === 'Anime List' ? 'active' : ''}`}
          onClick={() => onTabChange('Anime List')}
        >
          <svg className="nav-icon" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path></svg>
          Anime List
        </div>

        {/* Favorites Tab */}
        <div 
          className={`nav-item ${activeTab === 'Favorites' ? 'active' : ''}`}
          onClick={() => onTabChange('Favorites')}
        >
          <svg className="nav-icon" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path></svg>
          Favorites
        </div>

        {/* Social Tab */}
        <div 
          className={`nav-item ${activeTab === 'Social' ? 'active' : ''}`}
          onClick={() => onTabChange('Social')}
        >
           <svg className="nav-icon" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a3.001 3.001 0 012.223 5.018 5.01 5.01 0 012.56 3.012.75.75 0 01-1.087.914 3.51 3.51 0 00-5.185-2.923.75.75 0 01-.818-1.218A4.996 4.996 0 0111 4z"></path></svg>
          Social
        </div>
      </nav>
    </div>
  );
};

export default ProfileBanner;