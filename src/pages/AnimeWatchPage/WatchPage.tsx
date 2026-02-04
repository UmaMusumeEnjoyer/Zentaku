import React, { useState } from 'react';
import { useWatchPage } from './useWatchPage';
import { VideoPlayer } from './components/VideoPlayer';
import WatchPageSkeleton from './WatchPageSkeleton';
import styles from './WatchPage.module.css';

const WatchPage: React.FC = () => {
  const { loading, error, data, activeServerId, handleServerChange } = useWatchPage();
  
  // --- STATE: DEVELOPER MODE (NHẬP TAY) ---
  const [manualMode, setManualMode] = useState(false);
  const [manualInputs, setManualInputs] = useState({
    videoUrl: 'https://lightningspark77.pro/_v7/b5701a62bcb257fbfd9503a2182b57793ec74f674d175d4b1af5549f9ebdcb151af1d6a187feec6aa877e22f2b41eae71ba43b9307333ff93fb2fd237c5a37909511016b4be3f409418af4878dc7dc86be579d096e51b94ad48b9b3a88775604a8654d28616a2728aff4367913524844a37aafe9fd805cedee3ef961a281f772/master.m3u8',
    subUrl: 'https://mgstatics.xyz/subtitle/41be1a218a7989011e75128f1fd11da3/eng-2.vtt',
    referer: 'https://megacloud.blog/'
  });

  if (loading) return <WatchPageSkeleton />;
  
  if (error || !data) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-primary)' }}>{error || 'Data not found'}</p>
      </div>
    );
  }

  const { anime, currentEpisode, servers } = data;

  // Nếu bật Manual Mode, ghi đè thông tin tập phim để hiển thị trong Player
  const displayEpisode = manualMode ? {
    ...currentEpisode,
    videoUrl: manualInputs.videoUrl,
    title: `[Dev Mode] ${currentEpisode.title}`
  } : currentEpisode;

  return (
    <div className={styles.container}>
      <main className={styles.mainLayout}>
        
        <div className={styles.videoWrapper}>
          
          {/* --- DEVELOPER TOOLS SECTION --- */}
          <div className={styles.devTools}>
            <div 
              className={styles.devHeader} 
              onClick={() => setManualMode(!manualMode)}
              title="Click to toggle Developer Mode"
            >
              <span>🛠️ Developer Override Settings</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: manualMode ? '#4ade80' : '#94a3b8' }}>
                {manualMode ? '● ON' : '○ OFF'}
              </span>
            </div>
            
            {manualMode && (
              <div className={styles.devBody}>
                <div className={styles.inputGroup}>
                  <label>M3U8 / Video URL:</label>
                  <input 
                    type="text"
                    value={manualInputs.videoUrl}
                    onChange={e => setManualInputs({...manualInputs, videoUrl: e.target.value})}
                    placeholder="Enter .m3u8 url..."
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Subtitle URL (.vtt):</label>
                  <input 
                    type="text"
                    value={manualInputs.subUrl}
                    onChange={e => setManualInputs({...manualInputs, subUrl: e.target.value})}
                    placeholder="Enter .vtt url..."
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Referer Header (Anti-hotlink):</label>
                  <input 
                    type="text"
                    value={manualInputs.referer}
                    onChange={e => setManualInputs({...manualInputs, referer: e.target.value})}
                    placeholder="https://megacloud.blog/"
                  />
                </div>
              </div>
            )}
          </div>
          {/* ------------------------------- */}

          {/* --- VIDEO PLAYER COMPONENT --- */}
          <VideoPlayer 
            currentEpisode={displayEpisode}
            servers={servers}
            activeServerId={activeServerId}
            onServerChange={handleServerChange}
            // Truyền props cho chế độ thủ công
            customReferer={manualMode ? manualInputs.referer : undefined}
            customSubUrl={manualMode ? manualInputs.subUrl : undefined}
          />
        </div>

        {/* --- SIDEBAR INFO --- */}
        <aside>
          <div className={styles.sidebarCard}>
            <div className={styles.posterWrapper}>
              <img src={anime.posterUrl} alt={anime.title} className={styles.posterImg} />
              <div className={styles.badgeContainer}>
                <span className={`${styles.badge} ${styles.badgeHd}`}>HD</span>
                <span className={`${styles.badge} ${styles.badgeEp}`}>EP {currentEpisode.number}</span>
              </div>
            </div>

            <div className={styles.infoHeader}>
              <h2 className={styles.animeTitle}>{anime.title}</h2>
              <div style={{ color: '#facc15', fontSize: '0.875rem', display: 'flex', gap: '2px', alignItems: 'center' }}>
                <span>★</span><span>★</span><span>★</span><span>★</span><span style={{ color: 'var(--text-secondary)' }}>★</span>
                <span style={{ color: 'var(--text-secondary)', marginLeft: '4px' }}>({anime.rating}/10)</span>
              </div>
            </div>

            <div className={styles.tags}>
              {anime.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>

            <div className={styles.synopsis}>
              <h3 style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#94a3b8' }}>Synopsis</h3>
              <p>{anime.synopsis}</p>
            </div>

            <div className={styles.actions}>
              <button className={`${styles.actionBtn} ${styles.btnAdd}`}>
                <span>+</span> Add to List
              </button>
              <button className={`${styles.actionBtn} ${styles.btnMore}`}>
                View Details <span>→</span>
              </button>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default WatchPage; 