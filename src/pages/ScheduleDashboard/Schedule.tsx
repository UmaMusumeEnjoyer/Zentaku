import React from 'react';
import { useAnimeSchedule } from './useSchedule'; // Giả định path import
import AnimeScheduleSkeleton from './ScheduleSkeleton';
import styles from './Schedule.module.css';

const AnimeSchedule: React.FC = () => {
  const { 
    data, 
    selectedDate, 
    selectedDayEvents, 
    isLoading, 
    error, 
    actions 
  } = useAnimeSchedule();

  if (isLoading) return <AnimeScheduleSkeleton />;
  if (error || !data) return <div className="p-8 text-center text-red-500">Error: {error?.message}</div>;

  return (
    <div className={styles.container}>
      {/* Left Sidebar */}
      <aside className={styles.sidebarLeft}>
        <div className="space-y-8">
          <div className={styles.navSection}>
            <h4>Navigation</h4>
            <div className="space-y-1">
              <a href="#" className={styles.navItem}>
                <span className="material-symbols-outlined">calendar_view_week</span>
                Weekly
              </a>
              <a href="#" className={`${styles.navItem} ${styles.navItemActive}`}>
                <span className="material-symbols-outlined">calendar_month</span>
                Monthly Schedule
              </a>
              <a href="#" className={styles.navItem}>
                <span className="material-symbols-outlined">favorite</span>
                Following
              </a>
            </div>
          </div>
          <div className={styles.navSection}>
            <h4>Quick Access</h4>
            <div className={styles.quickAccessItem}>
              <div className={styles.seasonBadge} style={{backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>S2</div>
              <span style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Spy x Family</span>
            </div>
            <div className={styles.quickAccessItem}>
              <div className={styles.seasonBadge} style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'}}>S1</div>
              <span style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Chainsaw Man</span>
            </div>
          </div>
        </div>
        
        {data.updates.hasNew && (
          <div className={styles.updateCard}>
            <p style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--btn-primary-bg)', marginBottom: '0.25rem'}}>New Update</p>
            <p style={{fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.6}}>{data.updates.message}</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.headerControls}>
          <div>
            <h1 className={styles.monthTitle}>{data.month} {data.year}</h1>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
              <span className="material-symbols-outlined" style={{fontSize: '0.875rem'}}>public</span>
              <span>Local Time (UTC+8)</span>
            </div>
          </div>
          <div className={styles.navButtons}>
            <button onClick={actions.handlePrevMonth} className={styles.iconBtn}>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider" style={{color: 'var(--text-primary)'}}>Today</button>
            <button onClick={actions.handleNextMonth} className={styles.iconBtn}>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className={styles.calendarContainer}>
          <div className={styles.calendarCard}>
            {/* Week Header */}
            <div className={styles.weekGrid}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className={styles.weekDay}>{day}</div>
              ))}
            </div>
            
            {/* Days Grid */}
            <div className={styles.daysGrid}>
              {data.days.map((day, idx) => {
                const isSelected = selectedDate?.toDateString() === day.date.toDateString();
                return (
                  <div 
                    key={idx} 
                    className={`${styles.dayCell} ${isSelected ? styles.selectedDay : ''}`}
                    onClick={() => actions.handleSelectDate(day.date)}
                    style={{opacity: day.isCurrentMonth ? 1 : 0.3}}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span className={`${styles.dayNumber} ${isSelected ? styles.selectedNumber : ''}`}>
                        {day.date.getDate().toString().padStart(2, '0')}
                      </span>
                      {isSelected && <span className="material-symbols-outlined animate-pulse" style={{fontSize: '14px', color: 'var(--btn-primary-bg)'}}>keyboard_double_arrow_down</span>}
                    </div>
                    <div style={{marginTop: '4px'}}>
                      {day.events.slice(0, 2).map(evt => (
                        <div key={evt.id} className={styles.eventDot} style={{borderLeftColor: evt.color || 'var(--btn-primary-bg)'}}>
                          {evt.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed View Slide-in */}
          {selectedDate && (
            <div className={styles.detailPanel}>
              <div className={styles.detailHeader}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center rounded-lg font-black">
                    {selectedDate.getDate().toString().padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long' })}
                    </h3>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Daily Detailed Schedule</p>
                  </div>
                </div>
                <button onClick={actions.handleCloseDetail} className={styles.iconBtn}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div>
                {selectedDayEvents.map(evt => (
                  <div key={evt.id} className={styles.detailItem}>
                    <div className="w-16 text-xs font-bold text-[var(--text-secondary)]">{evt.time}</div>
                    <div className="flex-1 flex items-center gap-4">
                      <img src={evt.thumbnail} alt="Thumb" className="w-10 h-10 rounded-md object-cover bg-gray-200" />
                      <div>
                        <p className="text-xs font-black text-[var(--text-primary)]">{evt.title}</p>
                        <p className="text-[10px] font-bold" style={{color: evt.color}}>{evt.season} • Ep {evt.episode}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className={styles.sidebarRight}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black tracking-tight uppercase text-[var(--text-primary)]">Coming Up</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{backgroundColor: 'rgba(0,168,137,0.1)', color: 'var(--btn-primary-bg)'}}>{data.upNext.length} TOTAL</span>
        </div>
        <div>
          {data.upNext.map(item => (
            <div key={item.id} className={styles.upNextItem}>
              <img src={item.thumbnail} alt="Cover" className={styles.upNextImage} />
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-xs font-bold mb-1" style={{color: 'var(--btn-primary-bg)'}}>AIRING IN {item.airingIn}</p>
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] truncate">{item.title}</h3>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{item.season} • Episode {item.episode}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.alertBox}>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-yellow-500 text-sm">warning</span>
            <p className="text-xs font-extrabold text-[var(--text-primary)]">SCHEDULE ALERTS</p>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] italic">"Attack on Titan Final Part" airing is delayed by 1 hour.</p>
        </div>
      </aside>
    </div>
  );
};

export default AnimeSchedule;