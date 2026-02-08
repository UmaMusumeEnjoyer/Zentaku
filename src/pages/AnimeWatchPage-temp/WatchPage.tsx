import React from 'react';
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
    handleEpisodeChange
  } = useWatchPage();
  
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
    <div className={styles.container}>
      <main className={styles.mainLayout}>
        
        <div className={styles.videoWrapper}>
          
          <VideoPlayer 
            streamData={streamData} 
            isLoading={loadingStream}
            servers={servers}
            activeServerId={activeServerId}
            onServerChange={setActiveServerId}
            currentEpisode={currentEpisode}
            onNextEpisode={() => {
                const idx = episodes.findIndex(e => e.id === currentEpisode?.id);
                if (idx !== -1 && idx < episodes.length - 1) handleEpisodeChange(episodes[idx + 1]);
            }}
            onPrevEpisode={() => {
                const idx = episodes.findIndex(e => e.id === currentEpisode?.id);
                if (idx > 0) handleEpisodeChange(episodes[idx - 1]);
            }}
          />

           <div className={styles.episodeListContainer}>
              <h3 className={styles.episodeListTitle}>Episodes ({episodes.length})</h3>
              <div className={styles.episodeGrid}>
                {episodes.map(ep => (
                  <button 
                    key={ep.id}
                    onClick={() => handleEpisodeChange(ep)}
                    className={`${styles.episodeBtn} ${currentEpisode?.id === ep.id ? styles.episodeBtnActive : ''}`}
                  >
                    {ep.number}
                  </button>
                ))}
              </div>
           </div>
        </div>

        <Sidebar data={animeData} />

      </main>
    </div>
  );
};

export default WatchPage;