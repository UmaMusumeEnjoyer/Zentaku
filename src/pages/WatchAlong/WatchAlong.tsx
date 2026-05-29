import React, { useState, useEffect, useRef } from 'react';
import { useWatchAlong } from './useWatchAlong';
import styles from './WatchAlong.module.css';
import WatchAlongSkeleton from './WatchAlongSkeleton';
import { VideoPlayer } from '../AnimeWatchPage/components/VideoPlayer';
import { animeService, streamingService } from '@umamusumeenjoyer/shared-logic';
import type { Episode } from '../AnimeWatchPage/WatchPage.types';

const WatchAlongPage: React.FC = () => {
  const { room, isHost, isLoading, error, remotePlaybackState, streamData: originalStreamData, actions } = useWatchAlong();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [room?.messages]);

  const [chatMessage, setChatMessage] = useState('');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [animeData, setAnimeData] = useState<any>(null);
  const [fetchingStream, setFetchingStream] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const displayStreamData = originalStreamData;

  useEffect(() => {
    if (room?.settings?.anilistId) {
      const paramId = room.settings?.anilistId;
      const fetchInitialData = async () => {
        try {
          const [animeRes, episodesRes] = await Promise.all([
            animeService.getById(paramId),
            streamingService.getEpisodes(paramId)
          ]);
          setAnimeData(animeRes.data);

          const rawEpisodes = Array.isArray(episodesRes.data) ? episodesRes.data : episodesRes.data?.episodes || [];
          let mappedEpisodes: Episode[] = rawEpisodes.map((ep: any) => ({
            id: ep.id || ep.episodeId || String(ep.number),
            number: ep.number,
            title: ep.title || `Tập ${ep.number}`,
            thumbnail: ep.thumbnail || '',
            videoUrl: ''
          }));
          mappedEpisodes = mappedEpisodes.sort((a, b) => a.number - b.number);
          setEpisodes(mappedEpisodes);
        } catch (err) {
          console.error("Failed to fetch anime episodes in Watch Party", err);
        }
      };
      fetchInitialData();
    }
  }, [room?.settings?.anilistId]);

  // Lắng nghe sự thay đổi của tập từ server (khi room cập nhật)
  useEffect(() => {
    if (room?.settings?.episodeNumber !== undefined && episodes.length > 0) {
      const found = episodes.find(ep => ep.number === room.settings?.episodeNumber);
      if (found && found.number !== currentEpisode?.number) {
        setCurrentEpisode(found);
      }
    }
  }, [room?.settings?.episodeNumber, episodes, currentEpisode?.number]);

  if (isLoading) {
    return <WatchAlongSkeleton role={isHost ? 'owner' : 'viewer'} />;
  }

  if (error || !room) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2>Error: {error || 'No data available'}</h2>
      </div>
    );
  }

  // Handle play/pause/seek from VideoPlayer
  // But wait, VideoPlayer from AnimeWatchPage doesn't expose onPlay/onPause directly, it uses Artplayer.
  // This means we need to either modify VideoPlayer to accept onPlay/onPause, or just use it as is for now and let the host control.
  // For MVP, if it's the host, they can just use the video player naturally.
  // But how do we sync? We might need to listen to Artplayer events in VideoPlayer.
  // Wait! Let's modify VideoPlayer.tsx to accept `remotePlaybackState` and `onPlaybackEvent`.

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <aside className={`${styles.leftSidebar} ${styles.owner}`}>
          <div className={styles.sidebarContent}>


            {/* Host Section */}
            {(() => {
              const hostParticipants = room?.participants?.filter(p => p.userId === room.hostId) || [];
              const viewerParticipants = room?.participants?.filter(p => p.userId !== room.hostId) || [];

              return (
                <div style={{ padding: '0 16px' }}>
                  {hostParticipants.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#adadb8', textTransform: 'uppercase', marginBottom: '12px' }}>
                        Host — {hostParticipants.length}
                      </div>
                      {hostParticipants.map((p, index) => (
                        <div key={p.userId || index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '6px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }} className={styles.participantItem}>
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.displayName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginRight: '12px', border: '2px solid gold' }} />
                          ) : (
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px',
                              border: '2px solid gold', color: 'gold'
                            }}>
                              <i className="material-icons" style={{ fontSize: '18px' }}>star</i>
                            </div>
                          )}
                          <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {p.displayName || 'Unknown User'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Viewers Section */}
                  {viewerParticipants.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#adadb8', textTransform: 'uppercase', marginBottom: '12px' }}>
                        Viewers — {viewerParticipants.length}
                      </div>
                      {viewerParticipants.map((p, index) => (
                        <div key={p.userId || index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '6px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' }} className={styles.participantItem}>
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.displayName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginRight: '12px' }} />
                          ) : (
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px',
                              color: 'var(--text-secondary)'
                            }}>
                              <i className="material-icons" style={{ fontSize: '18px' }}>person</i>
                            </div>
                          )}
                          <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.displayName || 'Unknown User'}
                          </div>
                          {isHost && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Kick clicked for:', p.userId, 'actions:', actions);
                                if (actions.kickParticipant) {
                                  actions.kickParticipant(p.userId);
                                } else {
                                  console.error('actions.kickParticipant is undefined');
                                }
                              }}
                              title="Kick participant"
                              className={styles.kickButton}
                            >
                              <i className="material-icons" style={{ fontSize: '18px' }}>person_remove</i>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {(!room?.participants || room.participants.length === 0) && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '20px' }}>
                      Waiting for others to join...
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </aside>

        <main className={styles.mainArea}>
          <div className={styles.videoPlayer}>
            <VideoPlayer
              streamData={displayStreamData}
              isLoading={fetchingStream || isLoading}
              servers={[{ id: 'hd-1', name: 'Zentaku Server', type: 'sub' }]}
              activeServerId="hd-1"
              onServerChange={() => { }}
              currentEpisode={currentEpisode}
              episodes={episodes}
              onEpisodeClick={async (episode) => {
                if (!isHost) return;
                setCurrentEpisode(episode);
                setFetchingStream(true);
                try {
                  const res = await streamingService.getEpisodeSources(room?.settings?.anilistId, episode.number);
                  const data = res.data;
                  const innerData = data.data;
                  const videoUrl = innerData?.streamLinks?.[0] || data.video || (data.sources && data.sources[0]?.url) || '';
                  const subUrl = innerData?.subtitles?.find((s: any) => s.lang === 'en' || s.lang?.toLowerCase() === 'english')?.url || data.sub || null;
                  const referer = data.referer || data.headers?.Referer || null;
                  if (videoUrl) {
                    actions.changeEpisode(videoUrl, episode.number, subUrl, referer);
                  }
                } catch (err) {
                  console.error("Failed to fetch new stream", err);
                } finally {
                  setFetchingStream(false);
                }
              }}
              onNextEpisode={async () => {
                if (!isHost) return;
                const idx = episodes.findIndex(e => e.id === currentEpisode?.id);
                if (idx !== -1 && idx < episodes.length - 1) {
                  const nextEp = episodes[idx + 1];
                  // Trigger episode click logic
                  setCurrentEpisode(nextEp);
                  setFetchingStream(true);
                  try {
                    const res = await streamingService.getEpisodeSources(room?.settings?.anilistId, nextEp.number);
                    const data = res.data;
                    const videoUrl = data.data?.streamLinks?.[0] || data.video || (data.sources && data.sources[0]?.url) || '';
                    const subUrl = data.data?.subtitles?.find((s: any) => s.lang === 'en' || s.lang?.toLowerCase() === 'english')?.url || data.sub || null;
                    const referer = data.referer || data.headers?.Referer || null;
                    if (videoUrl) {
                      actions.changeEpisode(videoUrl, nextEp.number, subUrl, referer);
                    }
                  } catch (err) {
                    console.error("Failed to load next episode", err);
                  } finally {
                    setFetchingStream(false);
                  }
                }
              }}
              onPrevEpisode={async () => {
                if (!isHost) return;
                const idx = episodes.findIndex(e => e.id === currentEpisode?.id);
                if (idx > 0) {
                  const prevEp = episodes[idx - 1];
                  setCurrentEpisode(prevEp);
                  setFetchingStream(true);
                  try {
                    const res = await streamingService.getEpisodeSources(room?.settings?.anilistId, prevEp.number);
                    const data = res.data;
                    const videoUrl = data.data?.streamLinks?.[0] || data.video || (data.sources && data.sources[0]?.url) || '';
                    const subUrl = data.data?.subtitles?.find((s: any) => s.lang === 'en' || s.lang?.toLowerCase() === 'english')?.url || data.sub || null;
                    const referer = data.referer || data.headers?.Referer || null;
                    if (videoUrl) {
                      actions.changeEpisode(videoUrl, prevEp.number, subUrl, referer);
                    }
                  } catch (err) {
                    console.error("Failed to load previous episode", err);
                  } finally {
                    setFetchingStream(false);
                  }
                }
              }}
              isTheaterMode={isTheaterMode}
              onTheaterModeToggle={() => setIsTheaterMode(!isTheaterMode)}
              isHost={isHost}
              remotePlaybackState={remotePlaybackState}
              onPlay={(time) => actions.play(time)}
              onPause={(time) => actions.pause(time)}
              onSeek={(time) => actions.seek(time)}
            />
            {/* Note: In a real app, we would sync remotePlaybackState with VideoPlayer here */}
          </div>

          <div className={styles.streamInfo}>
            <div className={styles.infoHeader}>
              <div>
                <h1 className={styles.title}>{animeData?.title?.userPreferred || 'Watch Party Room'}</h1>
                <div className={styles.host}>
                  Host ID: {room.hostId}
                  {currentEpisode && ` • Tập ${currentEpisode.number}`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'red', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  <span style={{ width: 8, height: 8, background: 'red', borderRadius: '50%' }}></span>
                  LIVE
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className={styles.rightSidebar}>
          <div className={styles.chatHeader}>
            <span>Room Chat</span>
          </div>

          <div className={styles.chatList}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: 8 }}>
              Welcome to the watch party!
            </div>
            {room?.messages?.map((msg: any) => (
              <div key={msg.id} style={{ marginBottom: 12, wordBreak: 'break-word' }}>
                <strong style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{msg.senderName}</strong>
                <span style={{ fontSize: '0.75rem', color: 'gray', marginLeft: 8 }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div style={{ fontSize: '0.9rem', marginTop: 4 }}>{msg.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chatInputArea}>
            <textarea
              className={styles.chatInput}
              placeholder="Send a message..."
              rows={1}
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (chatMessage.trim()) {
                    actions.sendMessage(chatMessage);
                    setChatMessage('');
                  }
                }
              }}
            />
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{chatMessage.length}/500</span>
              <button className={styles.sendBtn} onClick={() => {
                console.log("Sending chat message:", chatMessage);
                if (chatMessage.trim()) {
                  try {
                    actions.sendMessage(chatMessage);
                    console.log("actions.sendMessage executed!");
                    setChatMessage('');
                  } catch (err) {
                    console.error("Error calling sendMessage:", err);
                  }
                }
              }}>Chat</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WatchAlongPage;