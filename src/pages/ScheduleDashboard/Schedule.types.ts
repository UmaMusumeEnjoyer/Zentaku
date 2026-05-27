export interface AnimeInfo {
  id: string;
  title: string;
  thumbnail: string;
  season?: string;
  episode?: string;
  time: string; // HH:mm
  color?: string; // Hex for accent or category
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: AnimeInfo[];
}

export interface UpNextItem extends AnimeInfo {
  airingIn: string; // e.g., "00:24:12"
  airingAtTimestamp: number;
}

export interface ScheduleData {
  month: string;
  year: number;
  days: CalendarDay[];
  upNext: UpNextItem[];
  updates: {
    hasNew: boolean;
    message: string;
  };
}

export interface UseAnimeScheduleReturn {
  data: ScheduleData | null;
  selectedDate: Date | null;
  selectedDayEvents: AnimeInfo[];
  isLoading: boolean;
  error: Error | null;
  actions: {
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
    handleSelectDate: (date: Date) => void;
    handleCloseDetail: () => void;
    handleRetry: () => void;
  };
}