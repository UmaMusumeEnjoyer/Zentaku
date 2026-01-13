import React from 'react';
// [CHANGE] Import styles from module
import styles from './ProfileBanner.module.css';
import { type ProfileBannerProps } from '@umamusumeenjoyer/shared-logic';
import { useProfileBanner } from '@umamusumeenjoyer/shared-logic';
// [NOTE] Không cần dùng theme string nữa vì CSS Modules tự handle qua var()
// import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ProfileBanner: React.FC<ProfileBannerProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation('ProfilePagePage');
  
  // Kết nối ViewModel
  const { tabs, handleTabClick } = useProfileBanner(onTabChange);

  // Map labels to i18n keys
  const getTabLabel = (key: string) => {
    const labelMap: Record<string, string> = {
      'Overview': t('tabs.overview'),
      'Anime List': t('tabs.anime_list'),
      'Favorites': t('tabs.favorites'),
      'Social': t('tabs.social')
    };
    return labelMap[key] || key;
  };

  return (
    // [CHANGE] Class name đơn giản, không cần nối chuỗi theme
    <div className={styles.profileNavContainer}>
      <nav className={styles.profileNav}>
        {tabs.map((tab) => (
          <div 
            key={tab.key}
            // [CHANGE] Kết hợp class active
            className={`${styles.navItem} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.key)}
            role="button"
            tabIndex={0}
          >
            <svg className={styles.navIcon} viewBox="0 0 16 16">
              <path fillRule="evenodd" d={tab.iconPath}></path>
            </svg>
            {getTabLabel(tab.key)}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default ProfileBanner;