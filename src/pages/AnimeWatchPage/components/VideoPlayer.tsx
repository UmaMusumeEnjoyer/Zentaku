import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import type { Episode, Server } from '../WatchPage.types';
import styles from './VideoPlayer.module.css';

// --- CẤU HÌNH PROXY ---
const PROXY_BASE = 'http://localhost:5000/proxy';

const createProxyUrl = (url: string, referer: string) => {
  return `${PROXY_BASE}?url=${encodeURIComponent(url)}&referer=${encodeURIComponent(referer)}`;
};

// --- CẤU HÌNH MẶC ĐỊNH CHO SUBTITLE ---
const DEFAULT_SUB_STYLE = {
  color: '#ffffff',
  fontSize: '24px',
  background: 'rgba(0, 0, 0, 0)',
};

// --- Component Player Chính ---
const AnimePlayer: React.FC<{ 
  episode: Episode;
  referer: string; 
  subUrl?: string; 
}> = ({ episode, referer, subUrl }) => {
  const artRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (!artRef.current || !episode.videoUrl) return;

    // Lấy config đã lưu từ trước (nếu có)
    const savedStyle = JSON.parse(localStorage.getItem('artplayer_sub_style') || JSON.stringify(DEFAULT_SUB_STYLE));

    const originalBase = episode.videoUrl.substring(0, episode.videoUrl.lastIndexOf('/') + 1);

    const art = new Artplayer({
      container: artRef.current,
      url: episode.videoUrl,
      type: 'm3u8',
      poster: episode.thumbnail || '',
      volume: 0.7,
      isLive: false,
      muted: false,
      autoplay: false,
      autoMini: true,
      setting: true,     // Bật menu settings
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      theme: '#3b82f6',
      
      subtitle: subUrl ? {
        url: createProxyUrl(subUrl, referer),
        type: 'vtt',
        style: savedStyle, // Áp dụng style đã lưu
        encoding: 'utf-8',
        escape: false,     // Cho phép render HTML trong sub nếu cần
      } : undefined,

      customType: {
        m3u8: function (video: HTMLVideoElement, url: string, art: Artplayer) {
          if (Hls.isSupported()) {
            const hls = new Hls({
              xhrSetup: function (xhr, u) {
                let targetUrl = u;
                if (u.includes('localhost:5000') && !u.includes('/proxy')) {
                  const fileName = u.split('/').pop();
                  if (fileName) targetUrl = originalBase + fileName;
                } else if (!u.startsWith('http')) {
                  targetUrl = originalBase + u;
                }

                if (!targetUrl.startsWith(PROXY_BASE)) {
                  xhr.open('GET', createProxyUrl(targetUrl, referer), true);
                }
              }
            });

            hls.loadSource(url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
              // --- MENU CHỌN CHẤT LƯỢNG ---
              const levels = data.levels.map((level, index) => ({
                html: level.height + 'P',
                name: level.height + 'P',
                index: index,
                default: index === data.levels.length - 1
              }));

              art.setting.add({
                html: 'Chất lượng',
                width: 150,
                tooltip: levels[levels.length - 1]?.html || 'Auto',
                selector: [{ html: 'Auto', current: true, index: -1 }, ...levels],
                onSelect: (item: any) => { hls.currentLevel = item.index; return item.html; },
              });
            });

            (art as any).hls = hls;
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = createProxyUrl(url, referer);
          }
        },
      },
    });

    // --- THÊM TÙY CHỈNH SUBTITLE VÀO MENU SETTINGS ---
    if (subUrl) {
      // 1. Màu sắc
      art.setting.add({
        html: 'Màu phụ đề',
        width: 150,
        tooltip: 'Trắng',
        selector: [
          { html: '<span style="color:#fff">Trắng</span>', color: '#ffffff', default: savedStyle.color === '#ffffff' },
          { html: '<span style="color:#facc15">Vàng</span>', color: '#facc15', default: savedStyle.color === '#facc15' },
          { html: '<span style="color:#4ade80">Xanh lá</span>', color: '#4ade80', default: savedStyle.color === '#4ade80' },
          { html: '<span style="color:#f472b6">Hồng</span>', color: '#f472b6', default: savedStyle.color === '#f472b6' },
        ],
        onSelect: function (item: any) {
          art.subtitle.style('color', item.color);
          saveSubStyle('color', item.color);
          return item.html;
        },
      });

      // 2. Kích thước
      art.setting.add({
        html: 'Cỡ chữ',
        width: 150,
        tooltip: 'Vừa',
        selector: [
          { html: 'Nhỏ', size: '18px', default: savedStyle.fontSize === '18px' },
          { html: 'Vừa', size: '24px', default: savedStyle.fontSize === '24px' },
          { html: 'Lớn', size: '32px', default: savedStyle.fontSize === '32px' },
          { html: 'Cực lớn', size: '40px', default: savedStyle.fontSize === '40px' },
        ],
        onSelect: function (item: any) {
          art.subtitle.style('fontSize', item.size);
          saveSubStyle('fontSize', item.size);
          return item.html;
        },
      });

      // 3. Phông nền (Background)
      art.setting.add({
        html: 'Nền phụ đề',
        width: 150,
        tooltip: 'Tắt',
        selector: [
          { html: 'Tắt', bg: 'rgba(0,0,0,0)', default: savedStyle.background === 'rgba(0,0,0,0)' },
          { html: 'Mờ', bg: 'rgba(0,0,0,0.5)', default: savedStyle.background === 'rgba(0,0,0,0.5)' },
          { html: 'Đậm', bg: 'rgba(0,0,0,0.8)', default: savedStyle.background === 'rgba(0,0,0,0.8)' },
        ],
        onSelect: function (item: any) {
          art.subtitle.style('background', item.bg);
          // Cần padding nếu có background để nhìn đẹp hơn
          if (item.bg !== 'rgba(0,0,0,0)') {
              art.subtitle.style('padding', '2px 5px'); 
          } else {
              art.subtitle.style('padding', '0');
          }
          saveSubStyle('background', item.bg);
          return item.html;
        },
      });
    }

    // Helper lưu setting vào localStorage
    const saveSubStyle = (key: string, value: string) => {
      const current = JSON.parse(localStorage.getItem('artplayer_sub_style') || JSON.stringify(DEFAULT_SUB_STYLE));
      current[key] = value;
      localStorage.setItem('artplayer_sub_style', JSON.stringify(current));
    };

    playerRef.current = art;

    if (playerRef.current && episode.videoUrl !== playerRef.current.option.url) {
        playerRef.current.switchUrl(episode.videoUrl);
    }

    return () => {
      if (playerRef.current && (playerRef.current as any).hls) (playerRef.current as any).hls.destroy();
      if (playerRef.current) playerRef.current.destroy(false);
    };
  }, [episode.videoUrl, referer, subUrl]);

  return <div ref={artRef} className={styles.playerContainer} />;
};

// --- Các Component UI Giữ Nguyên ---
const EpisodeControls: React.FC = () => (
  <div className={styles.controlPanel}>
    <div className={styles.panelHeader}>
      <span className={styles.panelTitle}>Episode Navigation</span>
    </div>
    <div className={styles.episodeNav}>
      <button className={styles.navBtn}>← Previous</button>
      <button className={`${styles.navBtn} ${styles.navBtnPrimary}`}>Next Episode →</button>
    </div>
  </div>
);

const ServerSelector: React.FC<{
  servers: Server[];
  activeServerId: string;
  onServerChange: (serverId: string) => void;
}> = ({ servers, activeServerId, onServerChange }) => (
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
);

// --- Export VideoPlayer ---
export const VideoPlayer: React.FC<{
  currentEpisode: Episode;
  servers: Server[];
  activeServerId: string;
  onServerChange: (serverId: string) => void;
  customReferer?: string;
  customSubUrl?: string;
}> = (props) => {
  const finalReferer = props.customReferer || 'https://megacloud.blog/';

  return (
    <div className={styles.wrapper}>
      {props.currentEpisode.videoUrl ? (
        <AnimePlayer 
          episode={props.currentEpisode} 
          referer={finalReferer}
          subUrl={props.customSubUrl}
        />
      ) : (
        <div className={styles.playerContainer}>
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>🎬</div>
            <p>No video source available</p>
          </div>
        </div>
      )}

      <div className={styles.controlsGroup}>
        <EpisodeControls />
        <ServerSelector 
          servers={props.servers}
          activeServerId={props.activeServerId}
          onServerChange={props.onServerChange}
        />
      </div>
    </div>
  );
};