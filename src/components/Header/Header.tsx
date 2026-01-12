// src/components/Header/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import GlobalSearchModal from '../GlobalSearch/GlobalSearch';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useHeader } from '@umamusumeenjoyer/shared-logic';

const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR_URL;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout: authLogout } = useAuth();
  const { t, i18n } = useTranslation(['Header']);


    const avatarUrl = React.useMemo(() => {
    if (!user?.avatar_url) return DEFAULT_AVATAR;
    if (user.avatar_url.startsWith('http')) return user.avatar_url;
    return `${BACKEND_DOMAIN}${user.avatar_url}`;
  }, [user?.avatar_url]);


  const isAuthenticated = !!user;

  // Sử dụng hook từ shared-logic
  const {
    isDropdownOpen,
    isSearchModalOpen,
    isNotiModalOpen,
    isSettingsModalOpen,
    notificationCount,
    notifications,
    toggleDropdown,
    openSearchModal,
    closeSearchModal,
    openNotificationModal,
    closeNotificationModal,
    openSettingsModal,
    closeSettingsModal,
    formatDateTime,
    getRelativeTime,
  } = useHeader({
    isAuthenticated,
    defaultAvatar: DEFAULT_AVATAR,
    backendDomain: BACKEND_DOMAIN,
  });


  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  const renderRelativeTime = (timeString: string) => {
    if (timeString === 'Aired') {
      return t('Header:notifications.aired');
    }
    return timeString;
  };

  // Language change handler
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <header className="app-header" data-theme={theme}>
        <div className="header-left">
          <div className="logo">
            <Link to="/">
              <img src="/images/app_logo.png" alt="Logo" className="logo-img" />
            </Link>
          </div>
        </div>

        <nav className="header-center">
          <Link to="/">{t('Header:navigation.home')}</Link>
          <Link to="/browse">{t('Header:navigation.browse')}</Link>
          {isAuthenticated && (
            <>
              <Link to="/animelist">{t('Header:navigation.anime_list')}</Link>
              <Link to="/profile">{t('Header:navigation.profile')}</Link>
              <Link to="/animelist">{t('Header:navigation.anime_list')}</Link>
            </>
          )}
        </nav>

        <div className="header-right">
          {isAuthenticated ? (
            <>
              <button
                className="btn-search"
                aria-label={t('Header:accessibility.search')}
                onClick={openSearchModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>

              <div className="user-menu-container">
                <div className="user-avatar-trigger" onClick={toggleDropdown}>
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="user-avatar-img"
                  />
                  {notificationCount > 0 && (
                    <span className="notification-badge">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="mobile-nav-group">
                      <Link to="/" className="dropdown-item" onClick={toggleDropdown}>
                        {t('Header:navigation.home')}
                      </Link>
                      <Link to="/browse" className="dropdown-item" onClick={toggleDropdown}>
                        {t('Header:navigation.browse')}
                      </Link>
                      <Link to="/animelist" className="dropdown-item" onClick={toggleDropdown}>
                        {t('Header:navigation.anime_list')}
                      </Link>
                      <div className="dropdown-divider"></div>
                    </div>

                    <Link to="/profile" className="dropdown-item" onClick={toggleDropdown}>
                      {t('Header:user_menu.profile')}
                    </Link>
                    
                    <button className="dropdown-item" onClick={openNotificationModal}>
                      {t('Header:user_menu.notifications')}
                      {notificationCount > 0 && (
                        <span className="dropdown-badge">{notificationCount}</span>
                      )}
                    </button>

                    {/* Settings Button */}
                    <button className="dropdown-item" onClick={openSettingsModal}>
                      {t('Header:user_menu.settings')}
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        toggleDropdown();
                      }}
                      className="dropdown-item btn-dropdown-logout"
                    >
                      {t('Header:buttons.logout')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                {t('Header:buttons.login')}
              </Link>
              <Link to="/signup" className="btn-signup">
                {t('Header:buttons.sign_up')}
              </Link>
            </>
          )}
        </div>
      </header>

      <GlobalSearchModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />

      {/* Notification Modal */}
      {isNotiModalOpen && (
        <div className="noti-modal-overlay" onClick={closeNotificationModal}>
          <div className="noti-modal-content" data-theme={theme} onClick={(e) => e.stopPropagation()}>
            <div className="noti-header">
              <h3>{t('Header:notifications.title')}</h3>
              <button className="btn-close-noti" onClick={closeNotificationModal}>
                &times;
              </button>
            </div>
            <div className="noti-list">
              {notifications.length > 0 ? (
                notifications.map((noti) => (
                  <div key={noti.notification_id} className="noti-item">
                    <div className="noti-icon">
                      {/* [REF] Đổi cứng màu #3DB4F2 thành biến var(--btn-primary-bg) */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--btn-primary-bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </div>
                    <div className="noti-info">
                      <p className="noti-text">
                        <strong>{t('Header:notifications.episode')} {noti.episode_number}</strong>
                        <span className="anime-title-highlight">
                          {noti.anime_title || `${t('Header:notifications.anime_id')}: ${noti.anilist_id}`}
                        </span>
                      </p>
                      <div className="noti-meta-row">
                        <span className="noti-time">{t('Header:notifications.sent')}: {formatDateTime(noti.sent_at)}</span>
                        <span className={`noti-countdown ${getRelativeTime(noti.airing_at) === 'Aired' ? 'aired' : ''}`}>
                          <svg style={{ marginRight: '4px', marginBottom: '-1px' }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {renderRelativeTime(getRelativeTime(noti.airing_at))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="noti-empty">{t('Header:notifications.empty')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="settings-modal-overlay" onClick={closeSettingsModal}>
          <div className="settings-modal-content" data-theme={theme} onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h3>{t('Header:settings.title')}</h3>
              <button className="btn-close-settings" onClick={closeSettingsModal}>
                &times;
              </button>
            </div>
            
            <div className="settings-body">
              {/* Theme Section */}
              <div className="settings-section">
                <h4 className="settings-section-title">{t('Header:settings.theme.title')}</h4>
                <p className="settings-section-description">{t('Header:settings.theme.description')}</p>
                <div className="settings-options">
                  <button
                    className={`settings-option-btn ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => theme === 'light' && toggleTheme()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <span>{t('Header:settings.theme.dark')}</span>
                  </button>
                  <button
                    className={`settings-option-btn ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => theme === 'dark' && toggleTheme()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    <span>{t('Header:settings.theme.light')}</span>
                  </button>
                </div>
              </div>

              {/* Language Section */}
              <div className="settings-section">
                <h4 className="settings-section-title">{t('Header:settings.language.title')}</h4>
                <p className="settings-section-description">{t('Header:settings.language.description')}</p>
                <div className="settings-options">
                  <button
                    className={`settings-option-btn ${i18n.language === 'en' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    <span className="language-flag">🇬🇧</span>
                    <span>{t('Header:settings.language.english')}</span>
                  </button>
                  <button
                    className={`settings-option-btn ${i18n.language === 'jp' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('jp')}
                  >
                    <span className="language-flag">🇯🇵</span>
                    <span>{t('Header:settings.language.japanese')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;