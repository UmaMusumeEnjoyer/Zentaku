import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Episode, Server } from './WatchPage.types';
import { animeService, streamingService } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';

interface StreamData {
  videoUrl: string;
  subUrl: string | null;
  referer: string | null;
  requiresProxy: boolean;
}

export const useWatchPage = () => {
  const { id: paramId } = useParams<{ id: string }>(); 
  const { t } = useTranslation(['WatchPage']);
  
  const [animeData, setAnimeData] = useState<any>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [loadingStream, setLoadingStream] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeServerId, setActiveServerId] = useState<string>('hd-1');

  // Currently Zentaku_BE will probably return the best streams based on internal logic.
  // The server list here might become dynamic later if the API returns multiple servers.
  const servers: Server[] = [
    { id: 'hd-1', name: 'Zentaku Server (Auto)', type: 'sub' },
  ];

  useEffect(() => {
    if (!paramId) {
        setError(t('WatchPage:errorAnimeIdNotFound'));
        setLoading(false);
        return;
    }

    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching data for AniList ID: ${paramId}`);
        
        const [animeRes, episodesRes] = await Promise.all([
          animeService.getById(paramId),
          streamingService.getEpisodes(paramId)
        ]);

        setAnimeData(animeRes.data);

        // Map episodes from Zentaku_BE format to UI format
        const rawEpisodes = Array.isArray(episodesRes.data) ? episodesRes.data : episodesRes.data?.episodes || [];
        
        let mappedEpisodes: Episode[] = rawEpisodes.map((ep: any) => ({
          id: ep.id || ep.episodeId || String(ep.number),
          number: ep.number,
          title: ep.title || `${t('WatchPage:episode')} ${ep.number}`,
          thumbnail: ep.thumbnail || '', 
          videoUrl: ''
        }));

        mappedEpisodes = mappedEpisodes.sort((a, b) => a.number - b.number);
        setEpisodes(mappedEpisodes);

        if (mappedEpisodes.length > 0) {
          setCurrentEpisode(mappedEpisodes[0]);
        } else {
          setError(t('WatchPage:errorNoEpisodes'));
        }

      } catch (err: any) {
        console.error(err);
        setError(err.message || t('WatchPage:errorLoadingPage'));
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [paramId]);

  useEffect(() => {
    if (!currentEpisode || !paramId) return;

    const fetchStreamSource = async () => {
      setLoadingStream(true);
      setStreamData(null);
      try {
        const res = await streamingService.getEpisodeSources(paramId, currentEpisode.number);
        const data = res.data;
        
        // Flexible mapping to handle unknown BE schema + Zentaku_BE explicit schema
        const innerData = data.data;
        let videoUrl = innerData?.streamLinks?.[0] || data.video || (data.sources && data.sources[0]?.url) || '';
        let subUrl = innerData?.subtitles?.find((s: any) => s.lang === 'en' || s.lang?.toLowerCase() === 'english')?.url || data.sub || (data.subtitles && data.subtitles.find((s: any) => s.lang?.toLowerCase() === 'english')?.url) || null;
        const referer = data.referer || data.headers?.Referer || null;
        
        const isFilmServer = innerData?.meta?.source === 'filmserver';

        const currentHost = window.location.hostname;
        if (videoUrl && videoUrl.includes(':3636')) {
          videoUrl = videoUrl.substring(videoUrl.indexOf('/movies'));
        } else if (videoUrl && videoUrl.includes('localhost')) {
          videoUrl = videoUrl.replace('localhost', currentHost).replace('127.0.0.1', currentHost);
        }
        if (subUrl && subUrl.includes(':3636')) {
          subUrl = subUrl.substring(subUrl.indexOf('/movies'));
        } else if (subUrl && subUrl.includes('localhost')) {
          subUrl = subUrl.replace('localhost', currentHost).replace('127.0.0.1', currentHost);
        }

        if (!videoUrl) throw new Error(t('WatchPage:errorVideoLinkNotFound'));

        setStreamData({
          videoUrl,
          subUrl,
          referer,
          requiresProxy: !isFilmServer
        });

      } catch (err) {
        console.error("Stream Error:", err);
      } finally {
        setLoadingStream(false);
      }
    };

    fetchStreamSource();
  }, [currentEpisode, activeServerId, paramId]);

  const handleEpisodeChange = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  return {
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
    handleEpisodeChange,
    animeId: paramId
  };
};