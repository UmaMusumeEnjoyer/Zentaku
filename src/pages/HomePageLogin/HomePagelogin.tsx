import React, { useEffect } from 'react';
import AnimeSection from './components/AnimeSection'; 
import { useHomePagelogin } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './HomePagelogin.css';

const HomePagelogin: React.FC = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation(['HomePageLogin']);
  const { animeLists, loading, allListsAreEmpty } = useHomePagelogin();

  // Dùng i18n.language để force re-render
  const currentLanguage = i18n.language;

  // Debug: Kiểm tra ngôn ngữ và translation


  if (loading) {
    return (
      <div className="loading-container" data-theme={theme}>
        <h2>{t('HomePageLogin:loading.message')}</h2>
      </div>
    );
  }

  return (
    <div className="homepage-login-wrapper" data-theme={theme}>
      <div className="main-content-container">
        <main className="main-content">
          
          {allListsAreEmpty ? (
            <div className="empty-state">
              <h2>{t('HomePageLogin:emptyState.title')}</h2>
              <p>
                {t('HomePageLogin:emptyState.description')} <br />
                <span 
                  dangerouslySetInnerHTML={{
                    __html: t('HomePageLogin:emptyState.instruction', { 
                      feature: t('HomePageLogin:emptyState.browseFeature') 
                    })
                  }} 
                />
              </p>
            </div>
          ) : (
            <>
              <AnimeSection 
                key={`watching-${currentLanguage}`}
                title={t('HomePageLogin:sections.watching')}
                animeList={animeLists.watching} 
                allowNotification={true} 
              />
              
              <AnimeSection 
                key={`planning-${currentLanguage}`}
                title={t('HomePageLogin:sections.planning')}
                animeList={animeLists.planning} 
              />

              <AnimeSection 
                key={`completed-${currentLanguage}`}
                title={t('HomePageLogin:sections.completed')}
                animeList={animeLists.completed} 
              />

              <AnimeSection 
                key={`onHold-${currentLanguage}`}
                title={t('HomePageLogin:sections.onHold')}
                animeList={animeLists.onHold} 
              />

              <AnimeSection 
                key={`dropped-${currentLanguage}`}
                title={t('HomePageLogin:sections.dropped')}
                animeList={animeLists.dropped} 
              />
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default HomePagelogin;