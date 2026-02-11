import { useState, useEffect, useMemo } from 'react';
import type { AnimeInfo, ScheduleData, UseAnimeScheduleReturn, CalendarDay } from './Schedule.types';

// Mock helpers
const generateDays = (year: number, month: number): CalendarDay[] => {
  const date = new Date(year, month, 1);
  const days: CalendarDay[] = [];
  const firstDayIndex = (date.getDay() + 6) % 7; // Mon start
  
  // Previous month filler
  const prevMonth = new Date(year, month, 0);
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonth.getDate() - i),
      isCurrentMonth: false,
      isToday: false,
      events: []
    });
  }

  // Current month
  while (date.getMonth() === month) {
    days.push({
      date: new Date(date),
      isCurrentMonth: true,
      isToday: new Date().toDateString() === date.toDateString(),
      events: Math.random() > 0.7 ? [
        { id: `evt-${date.getDate()}`, title: 'Spy x Family', time: '19:30', thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6Ub2l89wmEO6N6UR__gZU8w_BMHfXWAD0JA7MKAKl2kiHyvTwwCQjt6-UnBASDmUOya3CTt1AU4qwhek_xyrfcosa3r4y9Ba-85jm5Cisj6OXv8G274rttE2fy29w6n71S3VG7AU7f-566H3vF9x0n7W1L8IIj3EFM65cdOoPrEPFm5SUgw8FMkVuScYrF9SntcGblN3bLTPdWET4zyw1NFidE9yCRAQUaCumPaiNSTyZ-N-jBzdNysXSJPeL48ChP2UUzAPg2FSm', color: '#3b82f6' }
      ] : []
    });
    date.setDate(date.getDate() + 1);
  }
  
  return days;
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
      // Simulation of API Call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockData: ScheduleData = {
        month: currentDate.toLocaleString('default', { month: 'long' }),
        year: currentDate.getFullYear(),
        days: generateDays(currentDate.getFullYear(), currentDate.getMonth()),
        upNext: [
          { id: '1', title: "Frieren: Journey's End", season: "Season 1", episode: "04", time: "18:00", thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhkNqrrsH-Wf2cZKk_Do34sa4dH7SdyNzMQd8CBQQmUrgpw0tFG_LNb_PHx5pd6Vw9-UcYHHpvnFziNYz6wCm9KmqMpuMb4DwjAayH-Sag3GDjGA661od15NKIdFVl_OtcBbayFXkqUll9c-8fDoF_rTpwzSTHQ3kRVAbjYb-MVKmSx-5fKaF-A5gCYoYgXQelL1ICi0d5Vb2EDIqJG_m0VwA6G5YcY-vDxgmx0UXZlV_ZemzRrc6onlqrycwZWaA4MJ_s8JyMCyxx", airingIn: "00:24:12" },
          { id: '2', title: "Spy x Family", season: "Season 2", episode: "03", time: "19:30", thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6Ub2l89wmEO6N6UR__gZU8w_BMHfXWAD0JA7MKAKl2kiHyvTwwCQjt6-UnBASDmUOya3CTt1AU4qwhek_xyrfcosa3r4y9Ba-85jm5Cisj6OXv8G274rttE2fy29w6n71S3VG7AU7f-566H3vF9x0n7W1L8IIj3EFM65cdOoPrEPFm5SUgw8FMkVuScYrF9SntcGblN3bLTPdWET4zyw1NFidE9yCRAQUaCumPaiNSTyZ-N-jBzdNysXSJPeL48ChP2UUzAPg2FSm", airingIn: "01:45:00" },
          { id: '3', title: "Jujutsu Kaisen", season: "Season 2", episode: "14", time: "22:00", thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuADBFb_wLFoDyYNVaAE_d4jmZ0VW2Jl75E4VQTAHRhLexnKROu5enuAUG_1nIxYFIOySEPEUbWA-Trr_VJejg1z8xO6QDi1DbZXh3D-YJXYqICR4AYdPS3moLJ7UKVmQRH_Jy3U-qZ58DDk4ZIjTd6jiKCkRFKQzEbkoT8qpssOWA5Lnj3HtisLZHn2_IyrFhCWnK1w1sQu2inTekwmJZsfWg8tFvyIikLvoxwfiFsFGzP26YN6plOv_z0mvpBVfMThdELfXN2Wcewk", airingIn: "03:10:00" },
        ],
        updates: {
          hasNew: true,
          message: "Auto-sync with MyAnimeList is now live!"
        }
      };
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load schedule'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentDate.getMonth()]);

  const selectedDayEvents = useMemo(() => {
    if (!data || !selectedDate) return [];
    // Mocking specific details for the selected day
    return [
      { id: 'd1', title: 'Sousou no Frieren', season: 'S1', episode: '04', time: '18:00', thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhkNqrrsH-Wf2cZKk_Do34sa4dH7SdyNzMQd8CBQQmUrgpw0tFG_LNb_PHx5pd6Vw9-UcYHHpvnFziNYz6wCm9KmqMpuMb4DwjAayH-Sag3GDjGA661od15NKIdFVl_OtcBbayFXkqUll9c-8fDoF_rTpwzSTHQ3kRVAbjYb-MVKmSx-5fKaF-A5gCYoYgXQelL1ICi0d5Vb2EDIqJG_m0VwA6G5YcY-vDxgmx0UXZlV_ZemzRrc6onlqrycwZWaA4MJ_s8JyMCyxx', color: '#00a889' },
      { id: 'd2', title: 'Spy x Family', season: 'S2', episode: '03', time: '19:30', thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6Ub2l89wmEO6N6UR__gZU8w_BMHfXWAD0JA7MKAKl2kiHyvTwwCQjt6-UnBASDmUOya3CTt1AU4qwhek_xyrfcosa3r4y9Ba-85jm5Cisj6OXv8G274rttE2fy29w6n71S3VG7AU7f-566H3vF9x0n7W1L8IIj3EFM65cdOoPrEPFm5SUgw8FMkVuScYrF9SntcGblN3bLTPdWET4zyw1NFidE9yCRAQUaCumPaiNSTyZ-N-jBzdNysXSJPeL48ChP2UUzAPg2FSm', color: '#60a5fa' },
      { id: 'd3', title: 'Jujutsu Kaisen', season: 'S2', episode: '14', time: '22:00', thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADBFb_wLFoDyYNVaAE_d4jmZ0VW2Jl75E4VQTAHRhLexnKROu5enuAUG_1nIxYFIOySEPEUbWA-Trr_VJejg1z8xO6QDi1DbZXh3D-YJXYqICR4AYdPS3moLJ7UKVmQRH_Jy3U-qZ58DDk4ZIjTd6jiKCkRFKQzEbkoT8qpssOWA5Lnj3HtisLZHn2_IyrFhCWnK1w1sQu2inTekwmJZsfWg8tFvyIikLvoxwfiFsFGzP26YN6plOv_z0mvpBVfMThdELfXN2Wcewk', color: '#f87171' }
    ];
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