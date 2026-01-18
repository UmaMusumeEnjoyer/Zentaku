import React from 'react'; 
import AnimeSection from './components/AnimeSection'; 
import { useHomePagelogin } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';

import AnimeSectionSkeleton from './components/AnimeSectionSkeleton';

// 2. Import CSS Module
import styles from './HomePagelogin.module.css';

const HomePagelogin: React.FC = () => {
  // const { theme } = useTheme(); -> Đã xóa
  const { t, i18n } = useTranslation(['HomePageLogin']);
  const { animeLists, loading, allListsAreEmpty } = useHomePagelogin();

  const currentLanguage = i18n.language;

  if (loading) {
    return (
         <div className={styles['homepage-login-wrapper']}>
            <div className={styles['main-content-container']}>
                 <main className={styles['main-content']}>
                  <AnimeSectionSkeleton></AnimeSectionSkeleton>
                 </main>
            </div>
         </div>
    );
  }

  return (
    // 4. Áp dụng styles module cho wrapper
    <div className={styles['homepage-login-wrapper']}>
      <div className={styles['main-content-container']}>
        <main className={styles['main-content']}>
          
          {allListsAreEmpty ? (
            <div className={styles['empty-state']}>
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