import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import type { Server, Episode } from '../WatchPage.types';
import styles from './VideoPlayer.module.css';

// Endpoint Proxy Node.js
const PROXY_BASE = 'http://localhost:5000/api/proxy';

const createProxyUrl = (url: string, referer: string) => {
  if (!url) return '';
  return `${PROXY_BASE}?url=${encodeURIComponent(url)}&referer=${encodeURIComponent(referer)}`;
};

interface StreamData {
    videoUrl: string;
    subUrl: string | null;
    referer: string | null;
}

interface VideoPlayerProps {
    streamData: StreamData | null;
    isLoading: boolean;
    servers: Server[];
    activeServerId: string;
    onServerChange: (id: string) => void;
    currentEpisode: Episode | null;
    onNextEpisode?: () => void;
    onPrevEpisode?: () => void;
}

const AnimePlayer: React.FC<{ stream: StreamData }> = ({ stream }) => {
  const artRef = useRef<HTMLDivElement>(null);
  // Dùng ref để giữ instance player, giúp clean up chính xác
  const playerRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    // 1. Clean up ngay lập tức nếu đã có instance tồn tại (Fix lỗi double audio)
    if (playerRef.current) {
        if ((playerRef.current as any).hls) {
            (playerRef.current as any).hls.destroy();
        }
        playerRef.current.destroy(false);
        playerRef.current = null;
    }

    if (!artRef.current || !stream.videoUrl) return;

    console.log("🎬 Initializing Player for:", stream.videoUrl);

    // Lấy config sub cũ
    const savedStyle = JSON.parse(localStorage.getItem('artplayer_sub_style') || '{"color":"#ffffff","fontSize":"24px","background":"rgba(0,0,0,0)"}');
    
    const originalBase = stream.videoUrl.substring(0, stream.videoUrl.lastIndexOf('/') + 1);
    const refererHeader = stream.referer || 'https://megacloud.blog/';

    const art = new Artplayer({
      container: artRef.current,
      url: stream.videoUrl, 
      type: 'm3u8',
      volume: 0.7,
      isLive: false,
      autoplay: false, // Lưu ý: Một số trình duyệt chặn autoplay nếu chưa tương tác
      autoMini: true,
      setting: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      theme: '#3b82f6',
      
      // Config Subtitle qua Proxy
      subtitle: stream.subUrl ? {
        url: createProxyUrl(stream.subUrl, refererHeader),
        type: 'vtt',
        style: savedStyle,
        encoding: 'utf-8',
      } : undefined,

      customType: {
        m3u8: function (video: HTMLVideoElement, url: string, art: Artplayer) {
          if (Hls.isSupported()) {
            const hls = new Hls({
              xhrSetup: function (xhr, u) {
                let targetUrl = u;

                if (!u.startsWith('http')) {
                   targetUrl = originalBase + u;
                } 
                else if (u.includes('localhost:5000') && !u.includes('/proxy')) {
                   const parts = u.split('/');
                   const fileName = parts[parts.length - 1];
                   targetUrl = originalBase + fileName;
                }

                if (!targetUrl.startsWith(PROXY_BASE)) {
                    const proxied = createProxyUrl(targetUrl, refererHeader);
                    xhr.open('GET', proxied, true);
                } else {
                    xhr.open('GET', targetUrl, true);
                }
              }
            });

            hls.loadSource(url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
               // Chỉ gọi play khi manifest đã load xong để tránh lỗi race condition
               // video.play().catch(() => {}); 
               
               const levels = data.levels.map((level, index) => ({
                 html: level.height + 'P',
                 name: level.height + 'P',
                 index: index,
                 default: index === data.levels.length - 1
               }));
               
               if (art.setting) {
                    art.setting.add({
                        html: 'Quality',
                        width: 150,
                        tooltip: 'Auto',
                        selector: [{ html: 'Auto', current: true, index: -1 }, ...levels],
                        onSelect: (item: any) => { hls.currentLevel = item.index; return item.html; },
                    });
               }
            });
            
            // Gán HLS vào art instance để tiện destroy sau này
            (art as any).hls = hls;
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = createProxyUrl(url, refererHeader);
          }
        },
      },
    });

    playerRef.current = art;

    // 2. Clean up function khi component unmount hoặc url đổi
    return () => {
      console.log("🧹 Destroying Player...");
      if (playerRef.current) {
         if ((playerRef.current as any).hls) {
             (playerRef.current as any).hls.destroy();
         }
         playerRef.current.destroy(false);
         playerRef.current = null;
      }
    };
  }, [stream.videoUrl, stream.subUrl, stream.referer]); // Dependency array

  return <div ref={artRef} className={styles.playerContainer} />;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  streamData,
  isLoading,
  servers,
  activeServerId,
  onServerChange,
  onNextEpisode,
  onPrevEpisode
}) => {

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
         <div className={styles.playerContainer} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: '#000'}}>
             <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⏳</div>
                <p>Loading stream...</p>
             </div>
         </div>
      ) : streamData && streamData.videoUrl ? (
        // Key prop ở đây cực kỳ quan trọng:
        // Khi videoUrl thay đổi, React sẽ unmount component cũ và mount component mới hoàn toàn.
        // Điều này đảm bảo Player cũ bị destroy 100% trước khi cái mới được tạo.
        <AnimePlayer key={streamData.videoUrl} stream={streamData} />
      ) : (
        <div className={styles.playerContainer}>
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>🎬</div>
            <p>Select an episode to watch</p>
          </div>
        </div>
      )}

      <div className={styles.controlsGroup}>
        <div className={styles.controlPanel}>
            <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Navigation</span>
            </div>
            <div className={styles.episodeNav}>
            <button className={styles.navBtn} onClick={onPrevEpisode}>← Previous</button>
            <button className={`${styles.navBtn} ${styles.navBtnPrimary}`} onClick={onNextEpisode}>Next Episode →</button>
            </div>
        </div>

        <div className={styles.controlPanel}>
            <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>☁️ Server Selection</span>
            </div>
            <div className={styles.serverGrid}>
            {servers.map(server => (
                <button
                key={server.id}
                onClick={() => onServerChange(server.id)}
                className={`${styles.serverBtn} ${activeServerId === server.id ? styles.serverBtnActive : ''}`}
                >
                {server.name}
                </button>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};