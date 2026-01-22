import React, { useState } from 'react';
import AnimeCard from '../../../components/AnimeCard/AnimeCard';
import { type AnimeSectionProps } from '@umamusumeenjoyer/shared-logic';
import { useAnimeSection } from '@umamusumeenjoyer/shared-logic';
// import { useTheme } from '../../../context/ThemeContext'; // Không cần thiết nữa nếu dùng CSS Var global
import { useTranslation } from 'react-i18next';
import styles from './AnimeSection.module.css';

const AnimeSection: React.FC<AnimeSectionProps> = ({ title, animeList, allowNotification = false }) => {
  // const { theme } = useTheme(); // CSS Variable tự động handle theme, không cần prop data-theme
  const { t } = useTranslation(['AnimeSection']);
  
  const INITIAL_DISPLAY_COUNT = 7;
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    showModal,
    isLoadingSettings,
    settings,
    hasData,
    handleCloseModal,
    handleSettingChange,
    handleSaveSettings
  } = useAnimeSection(animeList, allowNotification);

  // Logic hiển thị
  const shouldShowButton = animeList.length > INITIAL_DISPLAY_COUNT;
  
  const displayedAnime = isExpanded 
    ? animeList 
    : animeList.slice(0, INITIAL_DISPLAY_COUNT);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!hasData) {
    return null;
  }

  return (
    <section className={styles.animeSection}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {title} <span className={styles.countBadge}>{animeList.length}</span>
        </h2>
        
        <div className={styles.headerControls}>
          {shouldShowButton && (
            <button 
              className={styles.viewAllBtn} 
              onClick={handleToggleExpand}
            >
              {isExpanded ? t('AnimeSection:buttons.showLess') : t('AnimeSection:buttons.viewAll')}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className={styles.animeGrid}>
        {displayedAnime.map(anime => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{t('AnimeSection:modal.title')}</h3>
              <button className={styles.closeBtn} onClick={handleCloseModal}>&times;</button>
            </div>
            
            {isLoadingSettings ? (
              <div className={styles.loadingSettings}>
                {t('AnimeSection:modal.loading')}
              </div>
            ) : (
              <form onSubmit={handleSaveSettings} className={styles.modalBody}>
                <div className={`${styles.formGroupCheckbox} ${styles.masterSwitch}`}>
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

                <div className={`${styles.settingsGroup} ${!settings.enabled ? styles.disabled : ''}`}>
                  <div className={styles.formGroup}>
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

                  <div className={styles.formGroupCheckbox}>
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

                  <div className={styles.formGroupCheckbox}>
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

                <div className={styles.modalFooter}>
                  <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>
                    {t('AnimeSection:buttons.cancel')}
                  </button>
                  <button type="submit" className={styles.saveBtn}>
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