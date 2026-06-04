import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FloatingChat.module.css';
import type { FloatingRoom, FloatingUser } from './useFloatingChat';

interface FloatingChatWindowProps {
  room: FloatingRoom;
  currentUser: FloatingUser;
  isMinimized: boolean;
  typingUsers: string[];
  onClose: () => void;
  onMinimize: () => void;
  onSendMessage: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
}

const FloatingChatWindow: React.FC<FloatingChatWindowProps> = ({
  room,
  currentUser,
  isMinimized,
  typingUsers,
  onClose,
  onMinimize,
  onSendMessage,
  onTyping,
}) => {
  const { t } = useTranslation(['ChatApp']);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const prevMsgCountRef = useRef(0);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (room.messages.length > prevMsgCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMsgCountRef.current = room.messages.length;
  }, [room.messages.length]);

  // Scroll to bottom when opening/unminimizing
  useEffect(() => {
    if (!isMinimized) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 50);
    }
  }, [isMinimized]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputValue('');
    onTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onTyping(val.trim() !== '');
  };

  const windowClasses = [
    styles.chatWindow,
    isMinimized ? styles.chatWindowMinimized : '',
  ].filter(Boolean).join(' ');

  // Group messages: consecutive messages from same sender don't repeat avatar
  const shouldShowAvatar = (index: number) => {
    if (index === 0) return true;
    return room.messages[index].sender.id !== room.messages[index - 1].sender.id;
  };

  return (
    <div className={windowClasses} id="floating-chat-window">
      {/* Header – always visible, clickable to toggle minimize */}
      <div className={styles.windowHeader} onClick={onMinimize}>
        <img src={room.avatar} alt={room.name} className={styles.windowAvatar} />
        <div className={styles.windowUserInfo}>
          <div className={styles.windowUserName}>{room.name}</div>
          <div className={styles.windowUserStatus}>
            <span className={styles.statusDot} />
            {t('ChatApp:floatingChat.active')}
          </div>
        </div>
        <div className={styles.windowActions}>
          <button
            className={styles.windowActionBtn}
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            aria-label={t('ChatApp:floatingChat.minimize')}
            title={t('ChatApp:floatingChat.minimize')}
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <button
            className={styles.windowActionBtn}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            aria-label={t('ChatApp:floatingChat.close')}
            title={t('ChatApp:floatingChat.close')}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* Messages area – hidden when minimized */}
      {!isMinimized && (
        <>
          <div className={styles.messagesArea} ref={messageAreaRef}>
            {room.isLoadingMessages ? (
              <div className={styles.loadingMessages}>
                <span className={styles.loadingDots}>Loading</span>
              </div>
            ) : (
              <>
                {room.messages.map((msg, index) => {
                  const isOwn = msg.sender.id === currentUser.id;
                  const showAvatar = shouldShowAvatar(index);

                  return (
                    <React.Fragment key={msg.id}>
                      {/* Sender name for other users (only when avatar shows) */}
                      {!isOwn && showAvatar && (
                        <div className={styles.msgSenderName}>{msg.sender.name}</div>
                      )}
                      <div className={`${styles.messageRow} ${isOwn ? styles.messageRowOwn : styles.messageRowOther}`}>
                        {!isOwn && showAvatar && (
                          <img src={msg.sender.avatar} alt="" className={styles.msgAvatar} />
                        )}
                        {!isOwn && !showAvatar && (
                          <div style={{ width: 28, flexShrink: 0 }} />
                        )}
                        <div className={`${styles.msgBubble} ${isOwn ? styles.msgBubbleOwn : styles.msgBubbleOther}`}>
                          {msg.content}
                        </div>
                      </div>
                      {/* Timestamp – show on last message of group or last message */}
                      {(index === room.messages.length - 1 ||
                        room.messages[index + 1]?.sender.id !== msg.sender.id) && (
                          <div className={`${styles.msgTime} ${isOwn ? styles.msgTimeOwn : styles.msgTimeOther}`}>
                            {msg.timestamp}
                          </div>
                        )}
                    </React.Fragment>
                  );
                })}
                {typingUsers.length > 0 && (
                  <div className={styles.typingIndicator}>
                    {t('ChatApp:someoneIsTyping')}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className={styles.windowInputArea}>
            <input
              type="text"
              className={styles.windowInput}
              placeholder={t('ChatApp:floatingChat.typeMessage')}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={!inputValue.trim()}
              aria-label="Send"
            >
              <span className={`material-symbols-outlined ${styles.sendBtnIcon}`}>
                send
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingChatWindow;
