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
import { useTranslation } from 'react-i18next';

const PROXY_BASE = '/api/proxy';

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

interface RemotePlaybackState {
  isPlaying: boolean;
  currentTimestamp: number;
  updatedAt: number;
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
  // Watch-Along sync props
  isHost?: boolean;
  remotePlaybackState?: RemotePlaybackState | null;
  onPlay?: (currentTime: number) => void;
  onPause?: (currentTime: number) => void;
  onSeek?: (currentTime: number) => void;
  onCreateWatchParty?: () => void;
  creatingRoom?: boolean;
  canCreateWatchParty?: boolean;
  hideControlsOnMobile?: boolean;
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
  isHost?: boolean;
  remotePlaybackState?: RemotePlaybackState | null;
  onPlay?: (currentTime: number) => void;
  onPause?: (currentTime: number) => void;
  onSeek?: (currentTime: number) => void;
}> = ({ stream, onEnded, isHost = true, remotePlaybackState, onPlay, onPause, onSeek }) => {
  const { t } = useTranslation(['WatchPage']);
  const artRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Artplayer | null>(null);
  
  // ✅ Sử dụng ref để giữ hàm onEnded mới nhất
  const onEndedRef = useRef(onEnded);
  // Refs for sync callbacks to avoid stale closures
  const onPlayRef = useRef(onPlay);
  const onPauseRef = useRef(onPause);
  const onSeekRef = useRef(onSeek);
  // Track whether we're programmatically syncing (to avoid feedback loops)
  const isSyncingRef = useRef(false);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    onPlayRef.current = onPlay;
    onPauseRef.current = onPause;
    onSeekRef.current = onSeek;
  }, [onPlay, onPause, onSeek]);

  useEffect(() => {
    if (playerRef.current) {
      if ((playerRef.current as any).hls) {
        (playerRef.current as any).hls.destroy();
      }
      playerRef.current.destroy(false);
      playerRef.current = null;
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
      hotkey: true,
      pip: true,
      lock: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: false,
      theme: '#3b82f6',
      
      ...(stream.subUrl ? {
        subtitle: {
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
        }
      } : {}),

      settings: [
        {
          html: t('WatchPage:subtitleSettings'),
          width: 250,
          tooltip: t('WatchPage:customize'),
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#ffffff" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/></svg>',
          selector: [
            {
              html: t('WatchPage:showSubtitles'),
              tooltip: savedStyle.visible ? t('WatchPage:on') : t('WatchPage:off'),
              switch: savedStyle.visible,
              onSwitch: function (item) {
                const isVisible = !item.switch;
                item.tooltip = isVisible ? t('WatchPage:on') : t('WatchPage:off');
                art.subtitle.show = isVisible;
                saveSubtitleSetting('visible', isVisible);

                if (!isVisible && art.template.$subtitle) {
                  art.template.$subtitle.classList.remove('has-text');
                }
                return isVisible;
              },
            },
            {
              html: t('WatchPage:color'),
              tooltip: t('WatchPage:select'),
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
              html: t('WatchPage:size'),
              tooltip: t('WatchPage:select'),
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
              html: t('WatchPage:background'),
              tooltip: t('WatchPage:select'),
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

            hls.attachMedia(video);
            hls.on(Hls.Events.MEDIA_ATTACHED, function () {
              hls.loadSource(url);
            });

            hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
              const levels = data.levels.map((level, index) => ({
                html: level.height + 'P',
                name: level.height + 'P',
                index: index,
                default: false
              }));
              const levelsDesc = levels.reverse();
              const autoOption = { html: t('WatchPage:auto'), current: true, index: -1 };
              if (art.setting) {
                art.setting.add({
                  html: t('WatchPage:quality'),
                  width: 150,
                  tooltip: t('WatchPage:auto'),
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

    // ========== Watch-Along: Host emits playback events ==========
    if (isHost) {
      art.on('video:play', () => {
        if (!isSyncingRef.current && onPlayRef.current) {
          onPlayRef.current(art.currentTime);
        }
      });
      art.on('video:pause', () => {
        if (!isSyncingRef.current && onPauseRef.current) {
          onPauseRef.current(art.currentTime);
        }
      });
      art.on('video:seeked', () => {
        if (!isSyncingRef.current && onSeekRef.current) {
          onSeekRef.current(art.currentTime);
        }
      });
    }

    if (!savedStyle.visible) {
      art.subtitle.show = false;
      if (art.template.$subtitle) {
        art.template.$subtitle.classList.remove('has-text');
      }
    }

    // Focus player khi ready để hotkeys hoạt động ngay
    art.on('ready', () => {
      if (art.template.$container) {
        art.template.$container.tabIndex = 0;
        art.template.$container.focus();
      }
    });

    // Ngăn chặn Viewer (người xem) click vào video để Play/Pause
    // Bắt sự kiện ở Capture Phase (true) để chặn trước khi Artplayer xử lý
    const blockViewerClick = (e: MouseEvent) => {
      if (isHost) return;
      const target = e.target as HTMLElement;
      // Cho phép click vào bottom control bar và setting panel
      if (target.closest('.art-bottom') || target.closest('.art-setting') || target.closest('.art-setting-panel')) {
        return;
      }
      // Chặn các click còn lại (lên video)
      e.stopPropagation();
    };

    if (art.template.$player) {
      art.template.$player.addEventListener('click', blockViewerClick, true);
    }

    // Xử lý phím tắt toàn cục (ngoại trừ khi đang gõ chat)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          if (isHost) art.toggle();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (isHost) art.backward = 5;
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (isHost) art.forward = 5;
          break;
        case 'ArrowUp':
          e.preventDefault();
          art.volume += 0.1; // Volume is always local
          break;
        case 'ArrowDown':
          e.preventDefault();
          art.volume -= 0.1; // Volume is always local
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    playerRef.current = art;

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (playerRef.current) {
        if (playerRef.current.template?.$player) {
           playerRef.current.template.$player.removeEventListener('click', blockViewerClick, true);
        }
        // Cleanup video element listener
        if (playerRef.current.video) {
            playerRef.current.video.removeEventListener('ended', handleEnd);
        }
        
        if ((playerRef.current as any).hls) {
          (playerRef.current as any).hls.destroy();
        }
        playerRef.current.destroy(false);
        playerRef.current = null;
      }
    };
  }, [stream.videoUrl, stream.subUrl, stream.referer, isHost]);

  // Keep latest remote state in a ref for the sync interval
  const remotePlaybackRef = useRef(remotePlaybackState);
  useEffect(() => {
    remotePlaybackRef.current = remotePlaybackState;
  }, [remotePlaybackState]);

  // Autoplay blocker state for Watch Along
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // ========== Watch-Along: Viewer sync interval ==========
  useEffect(() => {
    // Only run for viewers. Don't bail if playerRef is null yet — 
    // the interval will guard internally.
    if (isHost) return;

    const syncInterval = setInterval(() => {
      const art = playerRef.current;
      const state = remotePlaybackRef.current;
      if (!art || !state) return;

      const now = Date.now();
      const elapsed = (now - state.updatedAt) / 1000;
      const expectedTime = state.isPlaying
        ? state.currentTimestamp + elapsed
        : state.currentTimestamp;

      const drift = Math.abs(art.currentTime - expectedTime);

      isSyncingRef.current = true;

      const SYNC_THRESHOLD = 1.5; // seconds
      if (drift > SYNC_THRESHOLD) {
        // Only seek if we are currently playing, OR if the host wants us to pause.
        // If the host wants us to play but we are paused (e.g. autoplay block), do NOT scrub continuously.
        if (!art.video?.paused || !state.isPlaying) {
          if (!autoplayBlocked) {
            art.currentTime = expectedTime;
          }
        }
      }

      // Sync play/pause state
      if (state.isPlaying && art.video?.paused) {
        if (!autoplayBlocked) {
          art.play().then(() => {
            setAutoplayBlocked(false);
          }).catch((err: any) => {
            console.error('[WatchAlong Sync] Browser autoplay policy blocked playback!', err);
            setAutoplayBlocked(true);
          });
        }
      } else if (!state.isPlaying && !art.video?.paused) {
        art.pause();
      }

      // Reset the flag after a tick to allow natural events to fire
      setTimeout(() => { isSyncingRef.current = false; }, 50);
    }, 1000);

    return () => clearInterval(syncInterval);
  }, [isHost, autoplayBlocked]);

  return (
    <div className={`${styles.playerContainer} ${!isHost ? styles.viewerMode : ''}`}>
      {/* Autoplay Block Overlay */}
      {autoplayBlocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center p-6 bg-gray-900 rounded-xl border border-gray-700 shadow-2xl max-w-md text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-blue-500 transition shadow-lg shadow-blue-500/50" 
                 onClick={() => {
                   if (playerRef.current) {
                     playerRef.current.play().then(() => setAutoplayBlocked(false));
                   }
                 }}>
              <svg className="w-8 h-8 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('WatchPage:browserBlockedAutoplay')}</h3>
            <p className="text-gray-400 text-sm">
              {t('WatchPage:autoplayBlockedDesc')}
            </p>
          </div>
        </div>
      )}

      <div ref={artRef} key={stream.videoUrl} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
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
  onTheaterModeToggle,
  isHost = true,
  remotePlaybackState,
  onPlay,
  onPause,
  onSeek,
  onCreateWatchParty,
  creatingRoom,
  canCreateWatchParty,
  hideControlsOnMobile = false,
}) => {
    const { t } = useTranslation(['WatchPage']);
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
          <p>{t('WatchPage:loadingStreamText')}</p>
        </div>
      ) : streamData && streamData.videoUrl ? (
        <AnimePlayer 
            stream={streamData} 
            onEnded={handleVideoEnded}
            isHost={isHost}
            remotePlaybackState={remotePlaybackState}
            onPlay={onPlay}
            onPause={onPause}
            onSeek={onSeek}
        />
      ) : (
        <div className={styles.playerContainer}>
          <div className={styles.placeholder}>
            <p>{t('WatchPage:serverError')}</p>
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
                <span className={styles.toggleText}>{t('WatchPage:autoPlay')}</span>
                <span className={styles.toggleSwitch}></span>
            </label>
          </div>
          
          <div className={styles.controlRight}>
             {onCreateWatchParty && (
                 <button
                    className={`${styles.iconBtn} hint--rounded hint--top`}
                    aria-label={creatingRoom ? t('WatchPage:creatingRoom') : t('WatchPage:watchTogether')}
                    onClick={onCreateWatchParty}
                    disabled={creatingRoom || !canCreateWatchParty}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '0 12px', borderRadius: '4px', opacity: (creatingRoom || !canCreateWatchParty) ? 0.5 : 1 }}
                 >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{t('WatchPage:watchTogether')}</span>
                 </button>
             )}
             <button 
                className={`${styles.iconBtn} ${isTheaterMode ? styles.iconBtnActive : ''} hint--rounded hint--top`} 
                aria-label={isTheaterMode ? t('WatchPage:exitTheaterMode') : t('WatchPage:theaterMode')}
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
        <div className={`${styles.controlsGroup} ${hideControlsOnMobile ? styles.hideOnMobile : ''}`}>
          {/* Episode List */}
          <div className={styles.controlPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>{t('WatchPage:episodesLabel')} ({episodes.length})</span>
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
              <span className={styles.panelTitle}>{t('WatchPage:serverSelection')}</span>
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