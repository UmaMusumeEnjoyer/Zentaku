import React, { useState } from 'react';
import { useWatchPage } from './useWatchPage';
import { VideoPlayer } from './components/VideoPlayer';
import { Sidebar } from './components/Sidebar';
import WatchPageSkeleton from './WatchPageSkeleton';
import styles from './WatchPage.module.css';

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
  
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  
  if (loading) return <WatchPageSkeleton />;
  
  if (error || !animeData) {
    return (
      <div className={styles.container}>
         <div className={styles.errorContainer}>
            <p className={styles.errorText}>⚠️ {error || 'Data not found'}</p>
         </div>
      </div>
    );
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
          />
          
        </div>

        {!isTheaterMode && <Sidebar animeData={animeData} animeId={animeId} />}

      </main>
    </div>
  );
};

export default WatchPage;