// WatchPage.types.ts

export interface AnimeInfo {
  id: string | number;
  title: string;
  posterUrl: string;
  rating: number;
  tags: string[];
  synopsis: string;
}

export interface Server {
  id: string;
  name: string;
  type: 'sub' | 'dub';
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
}

export interface PageData {
  anime: AnimeInfo;
  currentEpisode: Episode | null;
  servers: Server[];
  relatedEpisodes: Episode[];
}

// Interface cho giá trị trả về của Hook
export interface UseWatchPageReturn {
  loading: boolean;
  error: string | null;
  data: PageData | null;
  activeServerId: string;
  handleServerChange: (serverId: string) => void;
}