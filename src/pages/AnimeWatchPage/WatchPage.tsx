import React from 'react';
import { useWatchPage } from './useWatchPage';
import { VideoPlayer } from './components/VideoPlayer';
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

           {/* List tập phim đã được Refactor sang CSS Module */}
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

        {/* --- SIDEBAR INFO --- */}
        <aside>
          <div className={styles.sidebarCard}>
            <div className={styles.posterWrapper}>
              <img src={animeData.posterUrl} alt={animeData.title} className={styles.posterImg} />
              <div className={styles.badgeContainer}>
                <span className={`${styles.badge} ${styles.badgeHd}`}>HD</span>
                <span className={`${styles.badge} ${styles.badgeEp}`}>EP {currentEpisode?.number}</span>
              </div>
            </div>

            <div className={styles.infoHeader}>
              <h2 className={styles.animeTitle}>{animeData.title}</h2>
              <div className={styles.ratingContainer}>
                <span>★</span><span>★</span><span>★</span><span>★</span><span style={{ color: 'var(--text-secondary)' }}>★</span>
                <span style={{ color: 'var(--text-secondary)', marginLeft: '4px' }}>({animeData.rating}/10)</span>
              </div>
            </div>

            <div className={styles.tags}>
              {animeData.tags?.map((tag: string, index: number) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>

            <div className={styles.synopsis}>
              <h3 className={styles.synopsisTitle}>Synopsis</h3>
              <p>{animeData.synopsis}</p>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default WatchPage;