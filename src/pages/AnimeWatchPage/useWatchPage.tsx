import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 1. Import useParams
import type { Episode, Server } from './WatchPage.types';

// Cấu hình API Backend
const BACKEND_URL = 'http://localhost:5000/api';

interface StreamData {
  videoUrl: string;
  subUrl: string | null;
  referer: string | null;
}

export const useWatchPage = () => {
  // 2. Lấy ID từ URL
  // Lưu ý: Tên biến 'id' phải trùng với tên bạn đặt trong Router (ví dụ: path="/anime/:id/watch")
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
    // Nếu không có ID trên URL thì không làm gì hoặc báo lỗi
    if (!paramId) {
        setError("Không tìm thấy ID Anime");
        setLoading(false);
        return;
    }

    const fetchInitialData = async () => {
      setLoading(true);
      setError(null); // Reset error khi load ID mới
      
      try {
        console.log(`Fetching data for AniList ID: ${paramId}`);
        
        // Gọi API lấy episodes với ID động
        const res = await fetch(`${BACKEND_URL}/anime/${paramId}/episodes`);
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to fetch episodes');
        }
        
        const data = await res.json();

        // Map dữ liệu API
        const mappedEpisodes: Episode[] = data.episodes.map((ep: any) => ({
          id: ep.episodeId,
          number: ep.number,
          title: ep.title,
          thumbnail: '', 
          videoUrl: ''
        }));

        setEpisodes(mappedEpisodes);

        // Set metadata
        setAnimeData({
          id: data.providerId,
          title: `Anime ID: ${paramId} (Data from HiAnime)`, // Có thể update title thật nếu backend trả về
          rating: 9.0,
          posterUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx178022-bA3dC4ae5t5u.jpg', // Placeholder
          tags: ['Action', 'Supernatural'],
          synopsis: 'Dữ liệu được lấy trực tiếp từ Backend Node.js custom.'
        });

        // Chọn tập đầu tiên mặc định
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
  }, [paramId]); // 3. Thêm paramId vào dependency array

  // 2. Fetch Link Stream khi đổi tập/server
  useEffect(() => {
    if (!currentEpisode || !paramId) return;

    const fetchStreamSource = async () => {
      setLoadingStream(true);
      setStreamData(null);
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