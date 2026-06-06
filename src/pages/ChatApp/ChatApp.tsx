import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatMessenger } from './useChatApp';
import styles from './ChatApp.module.css';
import ChatMessengerSkeleton from './ChatAppSkeleton';
import { socketService } from '@umamusumeenjoyer/shared-logic';
import { useAuth } from '../../context/AuthContext';

const ChatMessenger: React.FC = () => {
  const { t } = useTranslation(['ChatApp']);
  const { chatRooms, privateRooms, activeRoom, loading, error, setActiveRoomId, sendMessage, typingUsers, loadMoreMessages, isLoadingMore } = useChatMessenger();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'dm' | 'community'>('dm');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }); // changed to auto to prevent jumpy behavior when typing fast or switching rooms
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0 && activeRoom?.hasMore && !isLoadingMore) {
      previousScrollHeightRef.current = e.currentTarget.scrollHeight;
      loadMoreMessages();
    }
  };

  useEffect(() => {
    if (previousScrollHeightRef.current > 0 && messageAreaRef.current) {
      const newScrollHeight = messageAreaRef.current.scrollHeight;
      messageAreaRef.current.scrollTop = newScrollHeight - previousScrollHeightRef.current;
      previousScrollHeightRef.current = 0; // reset
    } else {
      scrollToBottom();
    }
  }, [activeRoom?.messages]);

  if (loading) return <ChatMessengerSkeleton />;
  if (error) return <div style={{ color: 'var(--text-primary)' }}>{error.message || t('ChatApp:errorLoadingData')}</div>;

  const handleSend = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue) {
        sendMessage(trimmedValue);
        setInputValue('');
        if (activeRoom) {
          socketService.emit('typing.stopped', { channelId: activeRoom.id });
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (activeRoom) {
      if (e.target.value.trim() !== '') {
        socketService.emit('typing.started', { channelId: activeRoom.id });
      } else {
        socketService.emit('typing.stopped', { channelId: activeRoom.id });
      }
    }
  };

  const currentList = activeTab === 'dm' ? privateRooms : chatRooms;
  const onlineMembers = activeRoom?.members?.filter(m => m.status === 'online') || [];
  const offlineMembers = activeRoom?.members?.filter(m => m.status === 'offline') || [];

  return (
    <div className={styles.layout}>
      {/* Overlay for Mobile */}
      {(isLeftSidebarOpen || isRightSidebarOpen) && (
        <div 
          className={styles.sidebarOverlay} 
          onClick={() => { setIsLeftSidebarOpen(false); setIsRightSidebarOpen(false); }}
        />
      )}

      {/* Left Sidebar: Room List */}
      <aside className={`${styles.sidebarLeft} ${isLeftSidebarOpen ? styles.sidebarLeftOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarHeaderTitle}>{t('ChatApp:chatsTitle')}</h1>
          <div className={styles.tabGroup}>
            <button 
              onClick={() => setActiveTab('dm')}
              className={`${styles.tabBtn} ${activeTab === 'dm' ? styles.tabBtnActive : ''}`}
            >
              {t('ChatApp:directTab')}
            </button>
            <button 
              onClick={() => setActiveTab('community')}
              className={`${styles.tabBtn} ${activeTab === 'community' ? styles.tabBtnActive : ''}`}
            >
              {t('ChatApp:groupsTab')}
            </button>
          </div>
        </div>
        <div className={styles.chatList}>
          {currentList?.map(room => (
            <div 
              key={room.id} 
              className={`${styles.chatItem} ${activeRoom?.id === room.id ? styles.chatItemActive : ''}`}
              onClick={() => {
                setActiveRoomId(room.id);
                setIsLeftSidebarOpen(false);
              }}
            >
              <div className={styles.avatarContainer}>
                <img src={room.avatar || 'https://i.pravatar.cc/150'} alt="avatar" className={styles.avatar} />
                <span className={`${styles.statusIndicator} ${styles.statusOnline}`}></span>
              </div>
              <div className={styles.chatItemInfo}>
                <h3 className={styles.chatItemName}>{room.name}</h3>
                <p className={styles.chatItemLastMsg}>{room.messages[room.messages.length - 1]?.content || t('ChatApp:noMessagesYet')}</p>
              </div>
            </div>
          ))}
          {currentList?.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              {t('ChatApp:noConversations')}
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={styles.mainChat}>
        {activeRoom ? (
          <>
            <header className={styles.chatHeader}>
              <button className={styles.mobileMenuBtn} onClick={() => setIsLeftSidebarOpen(true)}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
              </button>
              <div className={styles.headerTitleGroup}>
                <h2 className={styles.chatHeaderTitle}>{activeRoom.name}</h2>
                {activeRoom.description && (
                  <p className={styles.chatHeaderDesc}>{activeRoom.description}</p>
                )}
              </div>
              {activeTab === 'community' && (
                <button 
                  className={styles.infoToggleBtn} 
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  title={t('ChatApp:toggleMembers') || 'Members Info'}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                </button>
              )}
            </header>

            <div className={styles.messageArea} ref={messageAreaRef} onScroll={handleScroll}>
              <div style={{ marginTop: 'auto' }}></div>
              {isLoadingMore && <div style={{ textAlign: 'center', padding: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading older messages...</div>}
              {activeRoom.messages.map(msg => {
                const isMyMessage = user && String(msg.sender.id) === String(user.id);
                let nameColor = 'var(--text-primary)';
                if (activeRoom.roles) {
                  const role = activeRoom.roles[msg.sender.id];
                  if (role === 'OWNER' || role === 'ADMIN') nameColor = '#ef4444'; // Red
                  else if (role === 'MODERATOR' || role === 'EDITOR') nameColor = '#10b981'; // Green
                }
                
                return (
                <div key={msg.id} className={`${styles.messageRow} ${isMyMessage ? styles.myMessageRow : ''}`}>
                  {!isMyMessage && (
                    <div className={styles.avatarContainer}>
                      <img src={msg.sender.avatar} alt="avatar" className={styles.avatar} />
                    </div>
                  )}
                  <div className={`${styles.messageContent} ${isMyMessage ? styles.myMessageContent : ''}`}>
                    {!isMyMessage && (
                      <div className={styles.messageMeta}>
                        <span className={styles.messageSender} style={{ color: nameColor }}>{msg.sender.name}</span>
                        <span className={styles.messageTime}>{msg.timestamp}</span>
                      </div>
                    )}
                    <div className={`${styles.messageBubble} ${isMyMessage ? styles.myMessageBubble : ''}`}>
                      <div className={styles.messageText}>{msg.content}</div>
                    </div>
                    {isMyMessage && (
                      <div className={styles.messageMetaRight}>
                        <span className={styles.messageTime}>{msg.timestamp}</span>
                      </div>
                    )}
                  </div>
                </div>
              )})}
              {typingUsers.length > 0 && (
                <div className={styles.messageRow} style={{ opacity: 0.7 }}>
                  <div className={styles.messageContent}>
                    <div className={styles.messageText}><i>{t('ChatApp:someoneIsTyping')}</i></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputArea}>
              <div className={styles.inputWrapper}>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder={`${t('ChatApp:sendMessageTo')} ${activeRoom.name}`}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleSend}
                />
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyStateContainer}>
            <button className={styles.btnOpenSidebar} onClick={() => setIsLeftSidebarOpen(true)}>
               ☰ {t('ChatApp:openChatList') || "Mở danh sách Chat"}
            </button>
            <div style={{marginTop: 10}}>{t('ChatApp:selectChatToStart')}</div>
          </div>
        )}
      </main>

      {/* Right Sidebar: Members (Hidden behind toggle) */}
      {activeTab === 'community' && activeRoom && isRightSidebarOpen && (
        <aside className={styles.sidebarRight}>
          <div className={styles.sidebarRightHeader}>
            <h3 className={styles.sidebarRightTitle}>{t('ChatApp:members') || 'Thành viên'}</h3>
            <button className={styles.closeSidebarBtn} onClick={() => setIsRightSidebarOpen(false)}>✕</button>
          </div>
          <div>
            <h3 className={styles.memberCategory}>{t('ChatApp:online')} — {onlineMembers.length}</h3>
            <div className={styles.chatList}>
              {onlineMembers.map(member => (
                <div key={member.id} className={styles.chatItem}>
                  <div className={styles.avatarContainer}>
                    <img src={member.avatar} alt="avatar" className={styles.avatar} />
                    <span className={`${styles.statusIndicator} ${styles.statusOnline}`}></span>
                  </div>
                  <div className={styles.chatItemInfo}>
                    <span className={styles.chatItemName}>{member.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {offlineMembers.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h3 className={styles.memberCategory}>{t('ChatApp:offline')} — {offlineMembers.length}</h3>
              <div className={styles.chatList}>
                {offlineMembers.map(member => (
                  <div key={member.id} className={styles.chatItem} style={{ opacity: 0.6 }}>
                    <div className={styles.avatarContainer}>
                      <img src={member.avatar} alt="avatar" className={styles.avatar} style={{ filter: 'grayscale(1)' }} />
                      <span className={`${styles.statusIndicator} ${styles.statusOffline}`}></span>
                    </div>
                    <div className={styles.chatItemInfo}>
                      <span className={styles.chatItemName}>{member.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};

export default ChatMessenger;