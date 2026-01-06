import React from 'react';
import './ProfileBanner.css';
import { type ProfileBannerProps } from '@umamusumeenjoyer/shared-logic';
import { useProfileBanner } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ProfileBanner: React.FC<ProfileBannerProps> = ({ activeTab, onTabChange }) => {
  // i18n
  const { t } = useTranslation('ProfilePagePage');
  
  // Kết nối ThemeContext
  const { theme } = useTheme();
  
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
    <div className={`profile-nav-container ${theme}`}>
      <nav className="profile-nav">
        {tabs.map((tab) => (
          <div 
            key={tab.key}
            className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.key)}
            role="button"
            tabIndex={0}
          >
            <svg className="nav-icon" viewBox="0 0 16 16">
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