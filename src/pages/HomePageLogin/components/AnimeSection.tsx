import React, { useState } from 'react';
import AnimeCard from '../../../components/AnimeCard/AnimeCard';
import { type AnimeSectionProps } from '@umamusumeenjoyer/shared-logic';
import { useAnimeSection } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './AnimeSection.css';

const AnimeSection: React.FC<AnimeSectionProps> = ({ title, animeList, allowNotification = false }) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['AnimeSection']);
  
  // Cấu hình số lượng hiển thị ban đầu
  const INITIAL_DISPLAY_COUNT = 7;
  const [isExpanded, setIsExpanded] = useState(false);

  // Lấy các logic về Notification từ hook (bỏ qua logic hiển thị cũ của hook)
  const {
    showModal,
    isLoadingSettings,
    settings,
    hasData,
    // displayedAnime, // Không dùng từ hook nữa
    // isExpanded,     // Không dùng từ hook nữa
    // showViewAllButton, // Không dùng từ hook nữa
    // toggleExpand,   // Không dùng từ hook nữa
    handleNotifyClick,
    handleCloseModal,
    handleSettingChange,
    handleSaveSettings
  } = useAnimeSection(animeList, allowNotification);

  // --- LOGIC MỚI: Xử lý hiển thị 6 thẻ ---
  const shouldShowButton = animeList.length > INITIAL_DISPLAY_COUNT;
  
  const displayedAnime = isExpanded 
    ? animeList 
    : animeList.slice(0, INITIAL_DISPLAY_COUNT);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  // ----------------------------------------

  if (!hasData) {
    return null;
  }

  return (
    <section className="anime-section" data-theme={theme}>
      {/* --- HEADER SECTION --- */}
      <div className="section-header">
        <h2 className="section-title">
          {title} <span className="count-badge">{animeList.length}</span>
        </h2>
        
        <div className="header-controls">
          {allowNotification && (
            <button 
              className="notify-btn" 
              onClick={handleNotifyClick}
              title={t('AnimeSection:accessibility.notificationSettings')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="btn-text">{t('AnimeSection:buttons.notify')}</span>
            </button>
          )}

          {/* Nút View All / Show Less mới */}
          {shouldShowButton && (
            <button 
              className="view-all-btn" 
              onClick={handleToggleExpand}
            >
              {isExpanded ? t('AnimeSection:buttons.showLess') : t('AnimeSection:buttons.viewAll')}
            </button>
          )}
        </div>
      </div>

      {/* --- ANIME GRID --- */}
      <div className="anime-grid">
        {displayedAnime.map(anime => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>

      {/* --- NOTIFICATION MODAL (Giữ nguyên) --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" data-theme={theme}>
            <div className="modal-header">
              <h3>{t('AnimeSection:modal.title')}</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            {isLoadingSettings ? (
              <div className="loading-settings">
                {t('AnimeSection:modal.loading')}
              </div>
            ) : (
              <form onSubmit={handleSaveSettings} className="modal-body">
                <div className="form-group-checkbox master-switch">
                  <label>
                    <input 
                      type="checkbox" 
                      name="enabled"
                      checked={settings.enabled}
                      onChange={handleSettingChange}
                    />
                    {t('AnimeSection:form.enableNotifications')}
                  </label>
                </div>

                <div className={`settings-group ${!settings.enabled ? 'disabled' : ''}`}>
                  <div className="form-group">
                    <label>{t('AnimeSection:form.notifyBeforeHours')}</label>
                    <input 
                      type="number" 
                      name="notify_before_hours"
                      value={settings.notify_before_hours}
                      onChange={handleSettingChange}
                      min={1}
                      disabled={!settings.enabled}
                    />
                  </div>

                  <div className="form-group-checkbox">
                    <label>
                      <input 
                        type="checkbox" 
                        name="notify_by_email"
                        checked={settings.notify_by_email}
                        onChange={handleSettingChange}
                        disabled={!settings.enabled}
                      />
                      {t('AnimeSection:form.sendViaEmail')}
                    </label>
                  </div>

                  <div className="form-group-checkbox">
                    <label>
                      <input 
                        type="checkbox" 
                        name="notify_in_app"
                        checked={settings.notify_in_app}
                        onChange={handleSettingChange}
                        disabled={!settings.enabled}
                      />
                      {t('AnimeSection:form.sendInAppNotification')}
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                    {t('AnimeSection:buttons.cancel')}
                  </button>
                  <button type="submit" className="save-btn">
                    {t('AnimeSection:buttons.saveChanges')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AnimeSection;