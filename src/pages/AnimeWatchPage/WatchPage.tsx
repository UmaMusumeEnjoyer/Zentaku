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
    streamData, // Dữ liệu stream từ API (Video, Sub, Referer)
    loadingStream,
    handleEpisodeChange
  } = useWatchPage();
  
  if (loading) return <WatchPageSkeleton />;
  
  if (error || !animeData) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>⚠️ {error || 'Data not found'}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.mainLayout}>
        
        <div className={styles.videoWrapper}>
          
          {/* --- VIDEO PLAYER COMPONENT --- */}
          <VideoPlayer 
            // Truyền trực tiếp dữ liệu stream lấy từ API
            streamData={streamData} 
            isLoading={loadingStream}

            // Các props điều khiển UI
            servers={servers}
            activeServerId={activeServerId}
            onServerChange={setActiveServerId}
            
            // Logic Next/Prev tập
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

           {/* List tập phim đơn giản (Demo) */}
           <div style={{ marginTop: '1rem', background: '#1e293b', padding: '1rem', borderRadius: '8px' }}>
              <h3 style={{color: 'white', marginBottom: '0.5rem'}}>Episodes ({episodes.length})</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                {episodes.map(ep => (
                  <button 
                    key={ep.id}
                    onClick={() => handleEpisodeChange(ep)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: currentEpisode?.id === ep.id ? '#3b82f6' : '#334155',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
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
              <div style={{ color: '#facc15', fontSize: '0.875rem', display: 'flex', gap: '2px', alignItems: 'center' }}>
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
              <h3 style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#94a3b8' }}>Synopsis</h3>
              <p>{animeData.synopsis}</p>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default WatchPage;