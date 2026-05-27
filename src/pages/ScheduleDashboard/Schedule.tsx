import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnimeSchedule, formatTimeUntil } from './useSchedule';
import AnimeScheduleSkeleton from './ScheduleSkeleton';
import styles from './Schedule.module.css';

const CountdownTimer: React.FC<{ airingAtTimestamp: number }> = ({ airingAtTimestamp }) => {
  const { t } = useTranslation('ScheduleDashboard');
  const [timeLeft, setTimeLeft] = useState(airingAtTimestamp - Math.floor(Date.now() / 1000));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(airingAtTimestamp - Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [airingAtTimestamp]);
  
  const formatted = formatTimeUntil(timeLeft);
  const hoverText = new Date(airingAtTimestamp * 1000).toLocaleString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  });
  
  return <span title={hoverText} style={{ cursor: 'help' }}>{t('airingIn')} {formatted}</span>;
};

const AnimeSchedule: React.FC = () => {
  const { t, i18n } = useTranslation('ScheduleDashboard');
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
        <div className={styles.sidebarGroup}>
          <div className={styles.navSection}>
            <h4>{t('navigation')}</h4>
            <div className={styles.navLinks}>
              <a href="#" className={styles.navItem}>
                <span className="material-symbols-outlined">calendar_view_week</span>
                {t('weekly')}
              </a>
              <a href="#" className={`${styles.navItem} ${styles.navItemActive}`}>
                <span className="material-symbols-outlined">calendar_month</span>
                {t('monthlySchedule')}
              </a>
              <a href="#" className={styles.navItem}>
                <span className="material-symbols-outlined">favorite</span>
                {t('following')}
              </a>
            </div>
          </div>
          <div className={styles.navSection}>
            <h4>{t('quickAccess')}</h4>
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
            <p className={styles.updateTitle}>{t('newUpdate')}</p>
            <p className={styles.updateMessage}>{data.updates.message}</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.headerControls}>
          <div>
            <h1 className={styles.monthTitle}>{data.month} {data.year}</h1>
            <div className={styles.localTime}>
              <span className="material-symbols-outlined" style={{fontSize: '0.875rem'}}>public</span>
              <span>{t('localTime')}</span>
            </div>
          </div>
          <div className={styles.navButtons}>
            <button onClick={actions.handlePrevMonth} className={styles.iconBtn}>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className={styles.todayBtn} onClick={() => actions.handleSelectDate(new Date())}>{t('today')}</button>
            <button onClick={actions.handleNextMonth} className={styles.iconBtn}>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className={styles.calendarContainer}>
          <div className={styles.calendarCard}>
            {/* Week Header */}
            <div className={styles.weekGrid}>
              {[t('daysOfWeek.mon'), t('daysOfWeek.tue'), t('daysOfWeek.wed'), t('daysOfWeek.thu'), t('daysOfWeek.fri'), t('daysOfWeek.sat'), t('daysOfWeek.sun')].map(day => (
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
                    className={`${styles.dayCell} ${isSelected ? styles.selectedDay : ''} ${day.isToday ? styles.todayDay : ''}`}
                    onClick={() => actions.handleSelectDate(day.date)}
                    style={{opacity: day.isCurrentMonth ? 1 : 0.3}}
                  >
                    <div className={styles.dayNumberHeader}>
                      <span className={`${styles.dayNumber} ${isSelected ? styles.selectedNumber : ''} ${day.isToday && !isSelected ? styles.todayNumber : ''}`}>
                        {day.date.getDate().toString().padStart(2, '0')}
                      </span>
                      {isSelected && <span className={`material-symbols-outlined ${styles.selectedIndicator}`}>keyboard_double_arrow_down</span>}
                    </div>
                    <div className={styles.eventList}>
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
                <div className={styles.detailTitleGroup}>
                  <div className={styles.detailBadge}>
                    {selectedDate.getDate().toString().padStart(2, '0')}
                  </div>
                  <div className={styles.detailDateInfo}>
                    <h3>
                      {selectedDate.toLocaleDateString(i18n.language === 'jp' ? 'ja-JP' : 'en-US', { weekday: 'long', month: 'long' })}
                    </h3>
                    <p>{t('dailyDetailedSchedule')}</p>
                  </div>
                </div>
                <button onClick={actions.handleCloseDetail} className={styles.iconBtn}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div>
                {selectedDayEvents.map(evt => (
                  <div key={evt.id} className={styles.detailItem}>
                    <div className={styles.detailTime}>{evt.time}</div>
                    <div className={styles.detailContent}>
                      <img src={evt.thumbnail} alt="Thumb" className={styles.detailThumbnail} />
                      <div className={styles.detailMeta}>
                        <p className={styles.detailTitle}>{evt.title}</p>
                        <p className={styles.detailSubtitle} style={{color: evt.color}}>{evt.season} • {t('ep')} {evt.episode}</p>
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
        <div className={styles.sidebarHeader}>
          <h2>{t('comingUp')}</h2>
          <span className={styles.countBadge}>{data.upNext.length} {t('total')}</span>
        </div>
        <div className={styles.upNextList}>
          {data.upNext.map(item => (
            <div key={item.id} className={styles.upNextItem}>
              <img src={item.thumbnail} alt="Cover" className={styles.upNextImage} />
              <div className={styles.upNextContent}>
                <p className={styles.airingTime} style={{color: 'var(--btn-primary-bg)'}}>
                  <CountdownTimer airingAtTimestamp={item.airingAtTimestamp} />
                </p>
                <h3 className={styles.upNextTitle}>{item.title}</h3>
                <p className={styles.upNextSubtitle}>{item.season} • {t('episode')} {item.episode}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.alertBox}>
          <div className={styles.alertHeader}>
            <span className={`material-symbols-outlined ${styles.alertIcon}`}>warning</span>
            <p className={styles.alertTitle}>{t('scheduleAlerts')}</p>
          </div>
          <p className={styles.alertMessage}>"Attack on Titan Final Part" airing is delayed by 1 hour.</p>
        </div>
      </aside>
    </div>
  );
};

export default AnimeSchedule;