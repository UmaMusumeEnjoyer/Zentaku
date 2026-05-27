import { useState, useEffect, useMemo } from 'react';
import type { AnimeInfo, ScheduleData, UseAnimeScheduleReturn, CalendarDay, UpNextItem } from './Schedule.types';
import { animeService } from '@umamusumeenjoyer/shared-logic';

const generateEmptyCalendar = (year: number, month: number): CalendarDay[] => {
  const date = new Date(year, month, 1);
  const days: CalendarDay[] = [];
  const firstDayIndex = (date.getDay() + 6) % 7; // Mon start
  
  const todayStr = new Date().toDateString();
  
  // Previous month filler
  const prevMonth = new Date(year, month, 0);
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonth.getDate() - i);
    days.push({
      date: d,
      isCurrentMonth: false,
      isToday: d.toDateString() === todayStr,
      events: []
    });
  }

  // Current month
  while (date.getMonth() === month) {
    days.push({
      date: new Date(date),
      isCurrentMonth: true,
      isToday: date.toDateString() === todayStr,
      events: []
    });
    date.setDate(date.getDate() + 1);
  }
  
  return days;
};

// Helper to format time (e.g. seconds to "HH:MM:SS" or "Xd HH:MM:SS")
export const formatTimeUntil = (seconds: number): string => {
  if (seconds < 0) return '00:00:00';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return d > 0 ? `${d}d ${timeStr}` : timeStr;
};

export const useAnimeSchedule = (): UseAnimeScheduleReturn => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ScheduleData | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
      const startUnix = Math.floor(startOfMonth.getTime() / 1000);
      const endUnix = Math.floor(endOfMonth.getTime() / 1000);

      const response = await animeService.getAnimeSchedule(startUnix, endUnix);
      const { calendarEvents = [], upNextEvents = [] } = response.data || {};

      // 1. Generate empty calendar days
      const days = generateEmptyCalendar(currentDate.getFullYear(), currentDate.getMonth());

      // 2. Map calendarEvents to their respective days
      calendarEvents.forEach((edge: any) => {
        const date = new Date(edge.airingAt * 1000);
        const dateString = date.toDateString();
        
        const dayMatch = days.find(d => d.date.toDateString() === dateString);
        if (dayMatch) {
          dayMatch.events.push({
            id: edge.id.toString(),
            title: edge.media?.title?.romaji || edge.media?.title?.english || 'Unknown',
            thumbnail: edge.media?.coverImage?.large,
            season: edge.media?.season ? `${edge.media.season} ${edge.media.seasonYear || ''}` : '',
            episode: edge.episode ? edge.episode.toString().padStart(2, '0') : '',
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            color: '#3b82f6' // Default color
          });
        }
      });

      // 3. Format UpNext (filter for current week only)
      const now = new Date();
      const currentDayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0 for Mon, 6 for Sun
      const startOfCurrentWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - currentDayIndex);
      startOfCurrentWeek.setHours(0, 0, 0, 0);
      const endOfCurrentWeek = new Date(startOfCurrentWeek);
      endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6);
      endOfCurrentWeek.setHours(23, 59, 59, 999);

      const filteredUpNextEvents = upNextEvents.filter((edge: any) => {
        const date = new Date(edge.airingAt * 1000);
        return date >= startOfCurrentWeek && date <= endOfCurrentWeek;
      });

      const upNext: UpNextItem[] = filteredUpNextEvents.map((edge: any) => {
        const date = new Date(edge.airingAt * 1000);
        return {
          id: edge.id.toString(),
          title: edge.media?.title?.romaji || edge.media?.title?.english || 'Unknown',
          thumbnail: edge.media?.coverImage?.large,
          season: edge.media?.season ? `${edge.media.season} ${edge.media.seasonYear || ''}` : '',
          episode: edge.episode ? edge.episode.toString().padStart(2, '0') : '',
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          airingIn: formatTimeUntil(edge.timeUntilAiring),
          airingAtTimestamp: edge.airingAt
        };
      });

      setData({
        month: currentDate.toLocaleString('default', { month: 'long' }),
        year: currentDate.getFullYear(),
        days,
        upNext,
        updates: {
          hasNew: true,
          message: "Data fetched from your 'Watching' list!"
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load schedule'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentDate.getMonth(), currentDate.getFullYear()]);

  const selectedDayEvents = useMemo(() => {
    if (!data || !selectedDate) return [];
    const dateString = selectedDate.toDateString();
    const dayMatch = data.days.find(d => d.date.toDateString() === dateString);
    return dayMatch ? dayMatch.events : [];
  }, [data, selectedDate]);

  const actions = {
    handlePrevMonth: () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)),
    handleNextMonth: () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)),
    handleSelectDate: (date: Date) => setSelectedDate(date),
    handleCloseDetail: () => setSelectedDate(null),
    handleRetry: fetchData
  };

  return { data, selectedDate, selectedDayEvents, isLoading, error, actions };
};