import React from 'react';
import styles from './FloatingChat.module.css';

interface FloatingChatIconProps {
  totalUnread: number;
  isPulse: boolean;
  isActive: boolean;
  onClick: () => void;
}

const FloatingChatIcon: React.FC<FloatingChatIconProps> = ({
  totalUnread,
  isPulse,
  isActive,
  onClick,
}) => {
  const iconClasses = [
    styles.floatingIcon,
    isActive ? styles.floatingIconActive : '',
    isPulse ? styles.pulse : '',
  ].filter(Boolean).join(' ');

  return (
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
  );
};

export default FloatingChatIcon;
