import React, { useEffect, useRef } from 'react';
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

const setSubtitleBackgroundVar = (artRef: HTMLElement | null, color: string) => {
    if (artRef) {
        artRef.style.setProperty('--subtitle-background', color);
    }
};

const AnimePlayer: React.FC<{ stream: StreamData }> = ({ stream }) => {
  const artRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Artplayer | null>(null);

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
      fullscreenWeb: true,
      theme: '#3b82f6',
      
      subtitle: stream.subUrl ? {
        url: createProxyUrl(stream.subUrl, refererHeader),
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
                let targetUrl = u;
                if (!u.startsWith('http')) {
                   targetUrl = originalBase + u;
                } else if (u.includes('localhost:5000') && !u.includes('/proxy')) {
                   const parts = u.split('/');
                   targetUrl = originalBase + parts[parts.length - 1];
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
            video.src = createProxyUrl(url, refererHeader);
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

    if (!savedStyle.visible) {
        art.subtitle.show = false;
        if (art.template.$subtitle) {
            art.template.$subtitle.classList.remove('has-text');
        }
    }

    playerRef.current = art;

    return () => {
      if (playerRef.current) {
         if ((playerRef.current as any).hls) {
             (playerRef.current as any).hls.destroy();
         }
         playerRef.current.destroy(false);
         playerRef.current = null;
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