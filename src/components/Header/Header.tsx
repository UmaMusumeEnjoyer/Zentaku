// src/components/Header/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useHeader, userService } from '@umamusumeenjoyer/shared-logic';
// Import hook logic hoạt hình mới tạo
import { useHeaderAnimation } from './useHeaderAnimation';

const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR_URL;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout: authLogout } = useAuth();
  const { t, i18n } = useTranslation(['Header']);

  // 1. Hook xử lý UI Animation (Local ViewModel)
  // Logic: Ẩn/Hiện khi scroll + Trong suốt ở trang chỉ định
  const { isVisible, isTransparent, animationHandlers } = useHeaderAnimation();

  // Notification Preferences State
  const [emailNoti, setEmailNoti] = React.useState(true);
  const [pushNoti, setPushNoti] = React.useState(true);

  const handleToggleEmail = async () => {
    const newVal = !emailNoti;
    setEmailNoti(newVal);
    if (isAuthenticated) {
      try {
        await userService.updatePreferences({ notificationSettings: { email: newVal, push: pushNoti } });
      } catch (err) {
        console.error('Failed to update email preferences', err);
      }
    }
  };

  const handleTogglePush = async () => {
    const newVal = !pushNoti;
    setPushNoti(newVal);
    if (isAuthenticated) {
      try {
        await userService.updatePreferences({ notificationSettings: { email: emailNoti, push: newVal } });
      } catch (err) {
        console.error('Failed to update push preferences', err);
      }
    }
  };

  const avatarUrl = React.useMemo(() => {
    const url = user?.avatar || user?.avatar_url;
    if (!url) return DEFAULT_AVATAR;
    if (url.startsWith('/uploads')) return url;
    if (url.startsWith('http')) return url;
    return `${BACKEND_DOMAIN}${url}`;
  }, [user?.avatar, user?.avatar_url]);

  const isAuthenticated = !!user;
  const hasToken = localStorage.getItem('accessToken');
  const isUserLoading = !user && hasToken;

  const handleMouseEnter = () => {
    if (!isDropdownOpen) {
      toggleDropdown();
    }
  };

  const handleMouseLeave = () => {
    if (isDropdownOpen) {
      toggleDropdown();
    }
  };

  // 2. Hook xử lý Business Logic (Shared ViewModel)
  // Logic: Noti, Search, Dropdown, Settings
  const {
    isDropdownOpen,
    isSettingsModalOpen,
    toggleDropdown,
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

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // 3. Tạo chuỗi className động dựa trên state animation
  const headerClasses = [
    styles.appHeader,
    isVisible ? styles.headerVisible : styles.headerHidden,
    isTransparent ? styles.headerTransparent : styles.headerSolid
  ].join(' ');

  return (
    <>
      <header 
        className={headerClasses} 
        data-theme={theme}
        {...animationHandlers} // Gắn sự kiện onMouseEnter/onMouseLeave
      >
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <Link to="/">
              <img src="/images/app_logo.png" alt="Logo" className={styles.logoImg} />
            </Link>
          </div>
        </div>

        <nav className={styles.headerCenter}>
          <Link to="/">{t('Header:navigation.home')}</Link>
          <Link to="/browse">{t('Header:navigation.browse')}</Link>
          {isAuthenticated && (
            <>
              <Link to="/animelist">{t('Header:navigation.anime_list')}</Link>
              <Link to="/profile">{t('Header:navigation.profile')}</Link>
            </>
          )}
        </nav>

        <div className={styles.headerRight}>
          {isUserLoading ? (
             // TRẠNG THÁI LOADING:
             // Hiển thị một khung placeholder (Skeleton) thay vì nút Login
             // Giữ kích thước tương đương Avatar để không bị giật layout
             <div className={styles.userMenuContainer}>
                <div 

                />
             </div>
          ) : isAuthenticated ? (
            <>
              <div className={styles.userMenuContainer}
                   onMouseEnter={handleMouseEnter} // Di chuột vào vùng này (gồm cả ảnh và menu) thì mở
                onMouseLeave={handleMouseLeave}
              >
                <div className={styles.userAvatarTrigger} >
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className={styles.userAvatarImg}
                  />

                </div>

                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.mobileNavGroup}>
                      <Link to="/" className={styles.dropdownItem} onClick={toggleDropdown}>
                        {t('Header:navigation.home')}
                      </Link>
                      <Link to="/browse" className={styles.dropdownItem} onClick={toggleDropdown}>
                        {t('Header:navigation.browse')}
                      </Link>
                      <Link to="/animelist" className={styles.dropdownItem} onClick={toggleDropdown}>
                        {t('Header:navigation.anime_list')}
                      </Link>
                      <div className={styles.dropdownDivider}></div>
                    </div>

                    <Link to="/profile" className={styles.dropdownItem} onClick={toggleDropdown}>
                      {t('Header:user_menu.profile')}
                    </Link>
                    

                    <button className={styles.dropdownItem} onClick={openSettingsModal}>
                      {t('Header:user_menu.settings')}
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        toggleDropdown();
                      }}
                      className={`${styles.dropdownItem} ${styles.btnDropdownLogout}`}
                    >
                      {t('Header:buttons.logout')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.btnLogin}>
                {t('Header:buttons.login')}
              </Link>
              <Link to="/signup" className={styles.btnSignup}>
                {t('Header:buttons.sign_up')}
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className={styles.settingsModalOverlay} onClick={closeSettingsModal}>
          <div className={styles.settingsModalContent} data-theme={theme} onClick={(e) => e.stopPropagation()}>
            <div className={styles.settingsHeader}>
              <h3>{t('Header:settings.title')}</h3>
              <button className={styles.btnCloseSettings} onClick={closeSettingsModal}>
                &times;
              </button>
            </div>
            
            <div className={styles.settingsBody}>
              {/* Theme Section */}
              <div className={styles.settingsSection}>
                <h4 className={styles.settingsSectionTitle}>{t('Header:settings.theme.title')}</h4>
                <p className={styles.settingsSectionDescription}>{t('Header:settings.theme.description')}</p>
                <div className={styles.settingsOptions}>
                  <button
                    className={`${styles.settingsOptionBtn} ${theme === 'dark' ? styles.active : ''}`}
                    onClick={() => theme === 'light' && toggleTheme()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <span>{t('Header:settings.theme.dark')}</span>
                  </button>
                  <button
                    className={`${styles.settingsOptionBtn} ${theme === 'light' ? styles.active : ''}`}
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
              <div className={styles.settingsSection}>
                <h4 className={styles.settingsSectionTitle}>{t('Header:settings.language.title')}</h4>
                <p className={styles.settingsSectionDescription}>{t('Header:settings.language.description')}</p>
                <div className={styles.settingsOptions}>
                  <button
                    className={`${styles.settingsOptionBtn} ${i18n.language === 'en' ? styles.active : ''}`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    <span className={styles.languageFlag}>🇬🇧</span>
                    <span>{t('Header:settings.language.english')}</span>
                  </button>
                  <button
                    className={`${styles.settingsOptionBtn} ${i18n.language === 'jp' ? styles.active : ''}`}
                    onClick={() => handleLanguageChange('jp')}
                  >
                    <span className={styles.languageFlag}>🇯🇵</span>
                    <span>{t('Header:settings.language.japanese')}</span>
                  </button>
                </div>
              </div>

              {/* Notifications Section */}
              <div className={styles.settingsSection}>
                <h4 className={styles.settingsSectionTitle}>{t('Header:notifications.title')}</h4>
                <p className={styles.settingsSectionDescription}>{t('Header:notifications.description')}</p>
                <div className={styles.settingsOptions}>
                  <button
                    className={`${styles.settingsOptionBtn} ${emailNoti ? styles.active : ''}`}
                    onClick={handleToggleEmail}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{t('Header:notifications.email')}</span>
                  </button>
                  <button
                    className={`${styles.settingsOptionBtn} ${pushNoti ? styles.active : ''}`}
                    onClick={handleTogglePush}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span>{t('Header:notifications.push')}</span>
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