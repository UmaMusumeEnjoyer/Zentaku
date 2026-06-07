// src/components/Notification/NotificationBell.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore, NotificationType } from '@umamusumeenjoyer/shared-logic';
import type { NotificationItem } from '@umamusumeenjoyer/shared-logic';
import styles from './Notification.module.css';

const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const isLoading = useNotificationStore((s) => s.isLoading);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: NotificationItem) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate based on type
    if (notification.type === NotificationType.MESSAGE && notification.metadata?.channelId) {
      navigate(`/chat`);
    } else if (notification.type === NotificationType.ANIME_AIRING && notification.metadata?.animeId) {
      navigate(`/anime/${notification.metadata.animeId}`);
    } else if (notification.type === NotificationType.LIST_INTERACTION && notification.metadata?.listId) {
      navigate(`/list/${notification.metadata.listId}`);
    }

    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case NotificationType.MESSAGE:
        return 'chat_bubble';
      case NotificationType.ANIME_AIRING:
        return 'live_tv';
      case NotificationType.LIST_INTERACTION:
        return 'list_alt';
      default:
        return 'notifications';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${diffDay}d ago`;
  };

  // Lọc trùng lặp (nếu user click liên tục tạo nhiều bản ghi ở Backend hoặc bị spam)
  const uniqueNotificationsAll = Array.from(
    new Map(
      notifications.map((n) => {
        const metaKey = n.metadata?.channelId || n.metadata?.listId || n.metadata?.animeId || '';
        const key = `${n.type}-${n.title}-${n.body || ''}-${metaKey}`;
        return [key, n];
      })
    ).values()
  );
  
  const uniqueNotifications = uniqueNotificationsAll.slice(0, 20);

  // Tính số lượng duplicate trong list hiện tại để trừ đi khỏi unreadCount
  let displayUnreadCount = unreadCount;
  if (notifications.length > 0) {
    const duplicatesRemoved = notifications.length - uniqueNotificationsAll.length;
    displayUnreadCount = Math.max(0, unreadCount - duplicatesRemoved);
  }

  return (
    <div className={styles.bellContainer} ref={dropdownRef}>
      <button
        className={styles.bellButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        id="notification-bell"
      >
        <span className="material-symbols-outlined">notifications</span>
        {displayUnreadCount > 0 && (
          <span className={styles.badge}>
            {displayUnreadCount > 99 ? '99+' : displayUnreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h3>Notifications</h3>
            {displayUnreadCount > 0 && (
              <button
                className={styles.markAllReadBtn}
                onClick={() => markAllAsRead()}
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className={styles.dropdownBody}>
            {isLoading && notifications.length === 0 ? (
              <div className={styles.loadingState}>Loading...</div>
            ) : uniqueNotifications.length === 0 ? (
              <div className={styles.emptyState}>
                <span className="material-symbols-outlined">notifications_off</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              uniqueNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${
                    !notification.isRead ? styles.unread : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.notificationIcon}>
                    {(() => {
                      const isPromote = notification.metadata?.actionType === 'PROMOTE';
                      const isDemote = notification.metadata?.actionType === 'DEMOTE';
                      const isPermissionChange = isPromote || isDemote;

                      let imageUrl = null;
                      if (isPermissionChange) {
                        imageUrl = notification.metadata?.actorAvatar;
                      } else {
                        imageUrl = notification.metadata?.listBanner || notification.metadata?.actorAvatar;
                      }

                      if (notification.type === NotificationType.LIST_INTERACTION && imageUrl) {
                        return (
                          <img 
                            src={imageUrl} 
                            alt="notification icon" 
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} 
                          />
                        );
                      }

                      if (notification.type === NotificationType.LIST_INTERACTION) {
                        if (isPromote) {
                          return (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e8f5e9', color: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span className="material-symbols-outlined">workspace_premium</span>
                            </div>
                          );
                        }
                        if (isDemote) {
                          return (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffebee', color: '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span className="material-symbols-outlined">person_remove</span>
                            </div>
                          );
                        }
                        return (
                          <div style={{
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            backgroundColor: `hsl(${(String(notification.metadata?.listId || notification.id).charCodeAt(0) * 137) % 360}, 70%, 60%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '18px'
                          }}>
                            {String(notification.metadata?.listName || 'L').charAt(0).toUpperCase()}
                          </div>
                        );
                      }

                      return (
                        <span className="material-symbols-outlined">
                          {getNotificationIcon(notification.type)}
                        </span>
                      );
                    })()}
                  </div>
                  <div className={styles.notificationContent}>
                    <p className={styles.notificationTitle}>{notification.title}</p>
                    {notification.body && (
                      <p className={styles.notificationBody}>{notification.body}</p>
                    )}
                    <span className={styles.notificationTime}>
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  {!notification.isRead && <div className={styles.unreadDot} />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
