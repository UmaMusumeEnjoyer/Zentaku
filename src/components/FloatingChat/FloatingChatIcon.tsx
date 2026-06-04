import React from 'react';
import styles from './FloatingChat.module.css';

interface FloatingChatIconProps {
  totalUnread: number;
  isPulse: boolean;
  isActive: boolean;
  onClick: () => void;
  onHide: () => void;
}

const FloatingChatIcon: React.FC<FloatingChatIconProps> = ({
  totalUnread,
  isPulse,
  isActive,
  onClick,
  onHide,
}) => {
  const iconClasses = [
    styles.floatingIcon,
    isActive ? styles.floatingIconActive : '',
    isPulse ? styles.pulse : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.iconWrapper}>
      <button 
        className={styles.hideIconBtn} 
        onClick={(e) => {
          e.stopPropagation();
          onHide();
        }} 
        title="Hide Chat"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
      </button>
      <button
        id="floating-chat-icon"
        className={iconClasses}
        onClick={onClick}
        aria-label="Chat messages"
        title="Messages"
      >
        <span className={`material-symbols-outlined ${styles.iconSymbol}`}>
          chat_bubble
        </span>
        {totalUnread > 0 && (
          <span className={styles.badge}>
            {totalUnread > 99 ? '99+' : totalUnread}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingChatIcon;
