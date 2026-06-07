// src/components/Notification/NotificationToast.tsx

import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { NotificationItem } from '@umamusumeenjoyer/shared-logic';
import { NotificationType } from '@umamusumeenjoyer/shared-logic';
import styles from './Notification.module.css';

interface ToastItem {
  id: string;
  notification: NotificationItem;
  exiting: boolean;
}

const TOAST_DURATION = 5000;
const MAX_TOASTS = 3;

/**
 * NotificationToast - Manages and displays toast notifications.
 * 
 * Usage: Place at app root and call `showToast` when a new notification arrives.
 * The `useNotificationSocket` hook's `onNewNotification` callback should call this.
 */
const NotificationToast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));

    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      const timer = timersRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    }, 300);
  }, []);

  const showToast = useCallback(
    (notification: NotificationItem) => {
      setToasts((prev) => {
        // Prevent duplicate toasts for the same notification ID
        if (prev.some((t) => String(t.notification.id) === String(notification.id))) {
          return prev;
        }

        const id = `toast-${notification.id}-${Date.now()}`;
        const newToast: ToastItem = { id, notification, exiting: false };
        
        const updated = [newToast, ...prev];
        // Remove oldest if exceeding max
        if (updated.length > MAX_TOASTS) {
          const removed = updated.pop()!;
          const timer = timersRef.current.get(removed.id);
          if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(removed.id);
          }
        }

        // Auto-dismiss
        const timer = setTimeout(() => removeToast(id), TOAST_DURATION);
        timersRef.current.set(id, timer);

        return updated;
      });
    },
    [removeToast]
  );

  // Expose showToast globally for the notification socket hook
  useEffect(() => {
    (window as any).__showNotificationToast = showToast;
    return () => {
      delete (window as any).__showNotificationToast;
      // Clean up timers
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, [showToast]);

  const getIcon = (type: string) => {
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

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${toast.exiting ? styles.toastExiting : styles.toastEntering}`}
          onClick={() => removeToast(toast.id)}
          role="alert"
        >
          <div className={styles.toastIcon}>
            {(() => {
              const isPromote = toast.notification.metadata?.actionType === 'PROMOTE';
              const isDemote = toast.notification.metadata?.actionType === 'DEMOTE';
              const isPermissionChange = isPromote || isDemote;

              let imageUrl = null;
              if (isPermissionChange) {
                imageUrl = toast.notification.metadata?.actorAvatar;
              } else {
                imageUrl = toast.notification.metadata?.listBanner || toast.notification.metadata?.actorAvatar;
              }

              if (toast.notification.type === NotificationType.LIST_INTERACTION && imageUrl) {
                return (
                  <img 
                    src={imageUrl} 
                    alt="notification icon" 
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} 
                  />
                );
              }

              if (toast.notification.type === NotificationType.LIST_INTERACTION) {
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
                    backgroundColor: `hsl(${(String(toast.notification.metadata?.listId || toast.notification.id).charCodeAt(0) * 137) % 360}, 70%, 60%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    {String(toast.notification.metadata?.listName || 'L').charAt(0).toUpperCase()}
                  </div>
                );
              }

              return (
                <span className="material-symbols-outlined">
                  {getIcon(toast.notification.type)}
                </span>
              );
            })()}
          </div>
          <div className={styles.toastContent}>
            <p className={styles.toastTitle}>{toast.notification.title}</p>
            {toast.notification.body && (
              <p className={styles.toastBody}>{toast.notification.body}</p>
            )}
          </div>
          <button
            className={styles.toastClose}
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
