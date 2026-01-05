import React, { useEffect, useState } from 'react';
import { getUserHeatmap } from '../../../services/api';
import './ActivityHistory.css';

// [MỚI] Nhận props selectedDate và onDateSelect
const ActivityHistory = ({ onTotalCountChange, selectedDate, onDateSelect }) => {
  const [heatmapCounts, setHeatmapCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const generateYearData = () => {
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(endDate.getDate() - 364); 

    const dayOfWeek = startDate.getDay(); 
    startDate.setDate(startDate.getDate() - dayOfWeek);

    let currentDate = new Date(startDate);
    
    const weeks = [];
    for (let w = 0; w < 53; w++) {
        const week = [];
        for (let d = 0; d < 7; d++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const displayDate = new Date(currentDate);
            const isFuture = displayDate > today;

            week.push({
                date: dateStr,
                month: displayDate.toLocaleString('default', { month: 'short' }),
                day: displayDate.getDate(),
                isFuture: isFuture
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(week);
    }
    return weeks;
  };

  const yearWeeks = generateYearData();

  useEffect(() => {
    const fetchData = async () => {
      const username = localStorage.getItem('username');
      if (!username) { setLoading(false); return; }

      try {
        const res = await getUserHeatmap(username);
        if (res.data && res.data.counts) {
          const counts = res.data.counts;
          setHeatmapCounts(counts);

          let total = 0;
          const today = new Date();
          const pastYear = new Date();
          pastYear.setDate(today.getDate() - 365);

          Object.keys(counts).forEach(dateStr => {
             const d = new Date(dateStr);
             if (d >= pastYear && d <= today) {
                total += counts[dateStr];
             }
          });
          
          if (onTotalCountChange) onTotalCountChange(total);
        }
      } catch (error) {
        console.error("Error fetching heatmap:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLevelClass = (count) => {
    if (!count || count === 0) return 'level-0';
    if (count <= 2) return 'level-1';
    if (count <= 5) return 'level-2';
    if (count <= 9) return 'level-3';
    return 'level-4';
  };

  if (loading) return <div className="heatmap-container">Loading contribution graph...</div>;

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-container">
        <div className="heatmap-grid">
            {yearWeeks.map((week, wIndex) => (
                <div key={wIndex} className="heatmap-col">
                    {week.map((day) => {
                        if (day.isFuture) return null;
                        const count = heatmapCounts[day.date] || 0;
                        
                        // [MỚI] Kiểm tra xem ngày này có đang được chọn không
                        const isSelected = selectedDate === day.date;

                        return (
                            <div 
                                key={day.date}
                                className={`heatmap-cell ${getLevelClass(count)} ${isSelected ? 'selected-day' : ''}`}
                                title={`${day.date}: ${count} activities`}
                                // [MỚI] Xử lý click
                                onClick={() => onDateSelect && onDateSelect(day.date)}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
      </div>
       <div className="heatmap-legend">
           <span>Less</span>
           <div className="heatmap-cell level-0"></div>
           <div className="heatmap-cell level-1"></div>
           <div className="heatmap-cell level-2"></div>
           <div className="heatmap-cell level-3"></div>
           <div className="heatmap-cell level-4"></div>
           <span>More</span>
       </div>
    </div>
  );
};

export default ActivityHistory;