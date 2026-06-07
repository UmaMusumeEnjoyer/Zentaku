import React from 'react';
import { useHomePagelogin } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import AnimeSection from '../HomePageLogin/components/AnimeSection';
import AnimeSectionSkeleton from '../HomePageLogin/components/AnimeSectionSkeleton';
import styles from '../HomePageLogin/HomePagelogin.module.css';

const FollowingView: React.FC = () => {
  const { t, i18n } = useTranslation(['HomePageLogin']);
  const { animeLists, loading, allListsAreEmpty } = useHomePagelogin();
  const currentLanguage = i18n.language;

  if (loading) {
    return (
      <div style={{ padding: '20px', width: '100%', overflowY: 'auto' }}>
        <AnimeSectionSkeleton />
        <AnimeSectionSkeleton />
        <AnimeSectionSkeleton />
        <AnimeSectionSkeleton />
      </div>
    );
  }

  if (allListsAreEmpty) {
    return (
      <div className={styles['empty-state']} style={{ margin: '20px' }}>
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
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: '0 24px 24px 24px' }}>
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
    </div>
  );
};

export default FollowingView;
