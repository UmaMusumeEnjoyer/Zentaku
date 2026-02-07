import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Episode, Server } from './WatchPage.types';

// Cấu hình API Backend
const BACKEND_URL = 'http://localhost:5000/api';

interface StreamData {
  videoUrl: string;
  subUrl: string | null;
  referer: string | null;
}

export const useWatchPage = () => {
  // Lấy ID từ URL
  const { id: paramId } = useParams<{ id: string }>(); 
  
  // State quản lý dữ liệu
  const [animeData, setAnimeData] = useState<any>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  
  // State cho player
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [loadingStream, setLoadingStream] = useState<boolean>(false);
  
  // State chung
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeServerId, setActiveServerId] = useState<string>('hd-1');

  // Danh sách server
  const servers: Server[] = [
    { id: 'hd-1', name: 'Vidstreaming (HD-1)', type: 'sub' },
    { id: 'hd-2', name: 'Vidcloud (HD-2)', type: 'sub' },
  ];

  // 1. Fetch danh sách tập phim khi vào trang (hoặc khi ID đổi)
  useEffect(() => {
    if (!paramId) {
        setError("Không tìm thấy ID Anime");
        setLoading(false);
        return;
    }

    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching data for AniList ID: ${paramId}`);
        
        const res = await fetch(`${BACKEND_URL}/anime/${paramId}/episodes`);
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to fetch episodes');
        }
        
        const data = await res.json();

        // Map dữ liệu API
        let mappedEpisodes: Episode[] = data.episodes.map((ep: any) => ({
          id: ep.episodeId,
          number: ep.number,
          title: ep.title,
          thumbnail: '', 
          videoUrl: ''
        }));

        // Sắp xếp tập phim theo thứ tự tăng dần để đảm bảo [0] là tập 1
        mappedEpisodes = mappedEpisodes.sort((a, b) => a.number - b.number);

        setEpisodes(mappedEpisodes);

        // Set metadata
        setAnimeData({
          id: data.providerId,
          title: `Chưa tày đâu em`,
          rating: 9.0,
          posterUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx178022-bA3dC4ae5t5u.jpg',
          tags: ['Action', 'Supernatural'],
          synopsis: 'Chưa tày đâu em.'
        });

        // CHỈNH SỬA QUAN TRỌNG: Tự động chọn tập đầu tiên sau khi load xong
        if (mappedEpisodes.length > 0) {
          setCurrentEpisode(mappedEpisodes[0]);
        } else {
            setError("Anime này chưa có tập nào.");
        }

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Lỗi tải trang');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [paramId]);

  // 2. Fetch Link Stream khi đổi tập/server
  useEffect(() => {
    if (!currentEpisode || !paramId) return;

    const fetchStreamSource = async () => {
      setLoadingStream(true);
      setStreamData(null); // Reset stream data cũ để hiện loading
      try {
        const url = `${BACKEND_URL}/anime/episode-src?id=${currentEpisode.id}&server=${activeServerId}&category=sub`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error('Không lấy được nguồn phát');
        
        const data = await res.json();
        
        setStreamData({
          videoUrl: data.video,
          subUrl: data.sub,
          referer: data.referer
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
    handleEpisodeChange
  };
};