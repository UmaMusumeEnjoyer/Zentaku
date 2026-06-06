import { useNavigate } from 'react-router-dom';
import { useWatchPage } from './useWatchPage';
import { watchPartyService } from '@umamusumeenjoyer/shared-logic';
import { VideoPlayer } from './components/VideoPlayer';
import { Sidebar } from './components/Sidebar';
import WatchPageSkeleton from './WatchPageSkeleton';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import styles from './WatchPage.module.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const WatchPage: React.FC = () => {
  const {
    loading,
    error,
    animeData,
    episodes,
    currentEpisode,
    servers,
    activeServerId,
    setActiveServerId,
    streamData,
    loadingStream,
    animeId,
    handleEpisodeChange
  } = useWatchPage();

  const navigate = useNavigate();
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [mobileTab, setMobileTab] = useState<'episodes' | 'info'>('episodes');
  const { t } = useTranslation(['WatchPage']);

  const handleCreateWatchParty = async () => {
    if (!streamData?.videoUrl) {
      alert(t('WatchPage:waitStreamLoad'));
      return;
    }
    try {
      setCreatingRoom(true);
      const data = await watchPartyService.createWatchRoom({
        settings: { 
            anilistId: animeId,
            episodeNumber: currentEpisode?.number 
        },
        currentSourceUrl: streamData.videoUrl,
      });
      navigate(`/watch-along/${data.channelId}`);
    } catch (err) {
      console.error('Failed to create watch party', err);
      alert(t('WatchPage:errorCreateWatchParty'));
    } finally {
      setCreatingRoom(false);
    }
  };

  if (loading) return <WatchPageSkeleton />;

  if (error || !animeData) {
    return <NotFoundPage />;
  }

  return (
    <div className={`${styles.container} ${isTheaterMode ? styles.theaterModeActive : ''}`}>
      <main className={styles.mainLayout}>

        <div className={styles.videoWrapper}>

          <VideoPlayer
            streamData={streamData}
            isLoading={loadingStream}
            servers={servers}
            activeServerId={activeServerId}
            onServerChange={setActiveServerId}
            currentEpisode={currentEpisode}
            episodes={episodes}
            onEpisodeClick={handleEpisodeChange}
            onNextEpisode={() => {
              const idx = episodes.findIndex(e => e.id === currentEpisode?.id);
              if (idx !== -1 && idx < episodes.length - 1) handleEpisodeChange(episodes[idx + 1]);
            }}
            onPrevEpisode={() => {
              const idx = episodes.findIndex(e => e.id === currentEpisode?.id);
              if (idx > 0) handleEpisodeChange(episodes[idx - 1]);
            }}
            isTheaterMode={isTheaterMode}
            onTheaterModeToggle={() => setIsTheaterMode(!isTheaterMode)}
            onCreateWatchParty={handleCreateWatchParty}
            creatingRoom={creatingRoom}
            canCreateWatchParty={!loadingStream && !!streamData?.videoUrl}
            hideControlsOnMobile={mobileTab === 'info'}
          />

        </div>

        {/* Mobile Tabs */}
        {!isTheaterMode && (
          <div className={styles.mobileTabs}>
            <button 
              className={`${styles.mobileTabBtn} ${mobileTab === 'episodes' ? styles.mobileTabBtnActive : ''}`}
              onClick={() => setMobileTab('episodes')}
            >
              {t('WatchPage:episodesLabel')} & Server
            </button>
            <button 
              className={`${styles.mobileTabBtn} ${mobileTab === 'info' ? styles.mobileTabBtnActive : ''}`}
              onClick={() => setMobileTab('info')}
            >
              {t('WatchPage:animeInfo')}
            </button>
          </div>
        )}

        {!isTheaterMode && (
          <div className={`${styles.sidebarWrapper} ${mobileTab === 'episodes' ? styles.hideOnMobile : ''}`}>
            <Sidebar animeData={animeData} animeId={animeId} />
          </div>
        )}

      </main>
    </div>
  );
};

export default WatchPage;