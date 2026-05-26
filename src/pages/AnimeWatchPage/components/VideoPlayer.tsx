import React, { useEffect, useRef, useState } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import type { Server, Episode } from '../WatchPage.types';
import styles from './VideoPlayer.module.css';
import {
  getSavedSubtitleStyle,
  saveSubtitleSetting,
  SUB_COLORS,
  SUB_SIZES,
  SUB_BACKGROUNDS
} from './PlayerConfig';

const PROXY_BASE = 'http://localhost:5000/api/proxy';

const createProxyUrl = (url: string, referer: string) => {
  if (!url) return '';
  return `${PROXY_BASE}?url=${encodeURIComponent(url)}&referer=${encodeURIComponent(referer)}`;
};

interface StreamData {
  videoUrl: string;
  subUrl: string | null;
  referer: string | null;
  requiresProxy: boolean;
}

interface VideoPlayerProps {
  streamData: StreamData | null;
  isLoading: boolean;
  servers: Server[];
  activeServerId: string;
  onServerChange: (id: string) => void;
  currentEpisode: Episode | null;
  episodes: Episode[];
  onEpisodeClick: (episode: Episode) => void;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  isTheaterMode?: boolean;
  onTheaterModeToggle?: () => void;
}

// Helper set CSS var
const setSubtitleBackgroundVar = (artRef: HTMLElement | null, color: string) => {
  if (artRef) {
    artRef.style.setProperty('--subtitle-background', color);
  }
};

const getTargetUrl = (url: string, referer: string, useProxy: boolean) => {
  if (!useProxy) return url;
  return createProxyUrl(url, referer);
};

const AnimePlayer: React.FC<{
  stream: StreamData;
  onEnded: () => void;
  setArtInstance: (art: Artplayer | null) => void;
}> = ({ stream, onEnded, setArtInstance }) => {
  const artRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Artplayer | null>(null);
  
  // ✅ Sử dụng ref để giữ hàm onEnded mới nhất
  const onEndedRef = useRef(onEnded);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    if (playerRef.current) {
      if ((playerRef.current as any).hls) {
        (playerRef.current as any).hls.destroy();
      }
      playerRef.current.destroy(false);
      playerRef.current = null;
      setArtInstance(null);
    }

    if (!artRef.current || !stream.videoUrl) return;

    const savedStyle = getSavedSubtitleStyle();
    setSubtitleBackgroundVar(artRef.current, savedStyle.background);

    const originalBase = stream.videoUrl.substring(0, stream.videoUrl.lastIndexOf('/') + 1);
    const refererHeader = stream.referer || 'https://megacloud.blog/';
    const useProxy = stream.requiresProxy;

    const art = new Artplayer({
      container: artRef.current,
      url: stream.videoUrl,
      type: 'm3u8',
      volume: 0.7,
      isLive: false,
      autoplay: false,
      autoMini: true,
      setting: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: false,
      theme: '#3b82f6',
      
      subtitle: stream.subUrl ? {
        url: getTargetUrl(stream.subUrl, refererHeader, useProxy),
        type: 'vtt',
        style: {
          color: savedStyle.color,
          fontSize: savedStyle.fontSize,
          background: 'none',
          padding: '0',
        } as any,
        encoding: 'utf-8',
        escape: false,
      } : undefined,

      settings: [
        {
          html: 'Subtitle Settings',
          width: 250,
          tooltip: 'Customize',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#ffffff" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/></svg>',
          selector: [
            {
              html: 'Show Subtitles',
              tooltip: savedStyle.visible ? 'On' : 'Off',
              switch: savedStyle.visible,
              onSwitch: function (item) {
                const isVisible = !item.switch;
                item.tooltip = isVisible ? 'On' : 'Off';
                art.subtitle.show = isVisible;
                saveSubtitleSetting('visible', isVisible);

                if (!isVisible && art.template.$subtitle) {
                  art.template.$subtitle.classList.remove('has-text');
                }
                return isVisible;
              },
            },
            {
              html: 'Color',
              tooltip: 'Select',
              selector: SUB_COLORS.map(item => ({
                ...item,
                default: item.value === savedStyle.color
              })),
              onSelect: (item: any) => {
                art.subtitle.style('color', item.value);
                saveSubtitleSetting('color', item.value);
                return item.html;
              },
            },
            {
              html: 'Size',
              tooltip: 'Select',
              selector: SUB_SIZES.map(item => ({
                ...item,
                default: item.value === savedStyle.fontSize
              })),
              onSelect: (item: any) => {
                art.subtitle.style('fontSize', item.value);
                saveSubtitleSetting('fontSize', item.value);
                return item.html;
              },
            },
            {
              html: 'Background',
              tooltip: 'Select',
              selector: SUB_BACKGROUNDS.map(item => ({
                ...item,
                default: item.value === savedStyle.background
              })),
              onSelect: (item: any) => {
                setSubtitleBackgroundVar(artRef.current, item.value);
                saveSubtitleSetting('background', item.value);
                return item.html;
              },
            }
          ]
        }
      ],

      customType: {
        m3u8: function (video: HTMLVideoElement, url: string, art: Artplayer) {
          if (Hls.isSupported()) {
            const hls = new Hls({
              xhrSetup: function (xhr, u) {
                if (!useProxy) return;

                let targetUrl = u;
                if (!u.startsWith('http')) {
                  targetUrl = originalBase + u;
                } else if (useProxy && u.includes('localhost:5000') && !u.includes('/proxy')) {
                  const parts = u.split('/');
                  targetUrl = originalBase + parts[parts.length - 1];
                }

                if (useProxy && !targetUrl.startsWith(PROXY_BASE)) {
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
              const levels = data.levels.map((level, index) => ({
                html: level.height + 'P',
                name: level.height + 'P',
                index: index,
                default: false
              }));
              const levelsDesc = levels.reverse();
              const autoOption = { html: 'Auto', current: true, index: -1 };
              if (art.setting) {
                art.setting.add({
                  html: 'Quality',
                  width: 150,
                  tooltip: 'Auto',
                  selector: [...levelsDesc, autoOption],
                  onSelect: (item: any) => { hls.currentLevel = item.index; return item.html; },
                });
              }
            });
            (art as any).hls = hls;
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = getTargetUrl(url, refererHeader, useProxy);
          }
        },
      },
    });

    art.on('subtitle:update', (text) => {
      if (art.template.$subtitle) {
        if (typeof text === 'string' && text.trim().length > 0) {
          art.template.$subtitle.classList.add('has-text');
        } else {
          art.template.$subtitle.classList.remove('has-text');
        }
      }
    });

    // ✅ Sử dụng nhiều event để đảm bảo bắt được sự kiện kết thúc video
    const handleEnd = () => {
        console.log("Video ended - triggering autoplay check");
        if (onEndedRef.current) {
            onEndedRef.current();
        }
    };

    // Event chính từ Artplayer
    art.on('video:ended', handleEnd);
    
    // Backup: Lắng nghe trực tiếp từ video element
    if (art.video) {
        art.video.addEventListener('ended', handleEnd);
    }

    if (!savedStyle.visible) {
      art.subtitle.show = false;
      if (art.template.$subtitle) {
        art.template.$subtitle.classList.remove('has-text');
      }
    }

    playerRef.current = art;
    setArtInstance(art);

    return () => {
      if (playerRef.current) {
        // Cleanup video element listener
        if (playerRef.current.video) {
            playerRef.current.video.removeEventListener('ended', handleEnd);
        }
        
        if ((playerRef.current as any).hls) {
          (playerRef.current as any).hls.destroy();
        }
        playerRef.current.destroy(false);
        playerRef.current = null;
        setArtInstance(null);
      }
    };
  }, [stream.videoUrl, stream.subUrl, stream.referer]);

  return <div ref={artRef} className={styles.playerContainer} />;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  streamData,
  isLoading,
  servers,
  activeServerId,
  onServerChange,
  currentEpisode,
  episodes,
  onEpisodeClick,
  onNextEpisode,
  isTheaterMode = false,
  onTheaterModeToggle
}) => {
    const [artInstance, setArtInstance] = useState<Artplayer | null>(null);
    
    // Autoplay State
    const [autoPlay, setAutoPlay] = useState<boolean>(() => {
        const saved = localStorage.getItem('player_autoplay');
        return saved ? JSON.parse(saved) : true;
    });

    // Refs để tránh closure cũ
    const autoPlayRef = useRef(autoPlay);
    const onNextEpisodeRef = useRef(onNextEpisode);
    const currentEpisodeRef = useRef(currentEpisode);
    const episodesRef = useRef(episodes);

    useEffect(() => {
        autoPlayRef.current = autoPlay;
        localStorage.setItem('player_autoplay', JSON.stringify(autoPlay));
    }, [autoPlay]);

    useEffect(() => {
        onNextEpisodeRef.current = onNextEpisode;
    }, [onNextEpisode]);

    useEffect(() => {
        currentEpisodeRef.current = currentEpisode;
    }, [currentEpisode]);

    useEffect(() => {
        episodesRef.current = episodes;
    }, [episodes]);

    // Hàm sẽ được gọi khi video kết thúc
    const handleVideoEnded = () => {
        console.log("=== Video Ended Event Triggered ===");
        console.log("Auto Play Enabled:", autoPlayRef.current);
        console.log("Current Episode:", currentEpisodeRef.current?.number);
        console.log("Total Episodes:", episodesRef.current.length);
        
        if (!autoPlayRef.current) {
            console.log("Auto play is disabled, not switching episode");
            return;
        }

        // Kiểm tra xem có tập tiếp theo không
        const currentIdx = episodesRef.current.findIndex(
            ep => ep.id === currentEpisodeRef.current?.id
        );
        
        if (currentIdx === -1) {
            console.log("Current episode not found in list");
            return;
        }

        if (currentIdx >= episodesRef.current.length - 1) {
            console.log("Already at last episode, cannot go next");
            return;
        }

        console.log(`Switching from episode ${currentIdx + 1} to ${currentIdx + 2}`);
        
        if (onNextEpisodeRef.current) {
            onNextEpisodeRef.current();
        } else {
            console.warn("onNextEpisode callback not available");
        }
    };

  return (
    <div className={`${styles.wrapper} ${isTheaterMode ? styles.theaterMode : ''}`}>
      {/* 1. Video Player */}
      {isLoading ? (
        <div className={`${styles.playerContainer} ${styles.playerLoading}`}>
          <p>Loading Stream...</p>
        </div>
      ) : streamData && streamData.videoUrl ? (
        <AnimePlayer 
            key={streamData.videoUrl} 
            stream={streamData} 
            onEnded={handleVideoEnded}
            setArtInstance={setArtInstance}
        />
      ) : (
        <div className={styles.playerContainer}>
          <div className={styles.placeholder}>
            <p>Server error please try again</p>
          </div>
        </div>
      )}

      {/* 2. Player Control Bar */}
      <div className={styles.playerControlsBar}>
          <div className={styles.controlLeft}>
            <label className={styles.toggleLabel}>
                <input 
                    type="checkbox" 
                    checked={autoPlay} 
                    onChange={(e) => setAutoPlay(e.target.checked)} 
                />
                <span className={styles.toggleText}>Auto Play</span>
                <span className={styles.toggleSwitch}></span>
            </label>
          </div>
          
          <div className={styles.controlRight}>
             <button 
                className={`${styles.iconBtn} ${isTheaterMode ? styles.iconBtnActive : ''} hint--rounded hint--top`} 
                aria-label={isTheaterMode ? "Exit Theater Mode" : "Theater Mode"}
                onClick={onTheaterModeToggle}
             >
                 {isTheaterMode ? (
                    // Icon exit theater mode
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                    </svg>
                 ) : (
                    // Icon enter theater mode
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                    </svg>
                 )}
             </button>
          </div>
      </div>

      {/* 3. Main Controls Group: Episode List & Servers - Ẩn trong theater mode */}
      {!isTheaterMode && (
        <div className={styles.controlsGroup}>
          {/* Episode List */}
          <div className={styles.controlPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Episodes ({episodes.length})</span>
            </div>
            <div className={styles.episodeGrid}>
              {episodes.map(ep => (
                  <button 
                      key={ep.id}
                      onClick={() => onEpisodeClick(ep)}
                      className={`${styles.episodeBtn} ${currentEpisode?.id === ep.id ? styles.episodeBtnActive : ''}`}
                  >
                      {ep.number}
                  </button>
              ))}
            </div>
          </div>

          {/* Server Selection */}
          <div className={styles.controlPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Server Selection</span>
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
      )}
    </div>
  );
};