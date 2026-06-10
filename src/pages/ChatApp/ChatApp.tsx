import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatMessenger } from './useChatApp';
import styles from './ChatApp.module.css';
import ChatMessengerSkeleton from './ChatAppSkeleton';
import { socketService } from '@umamusumeenjoyer/shared-logic';
import { useAuth } from '../../context/AuthContext';

const ChatMessenger: React.FC = () => {
  const { t } = useTranslation(['ChatApp']);
  const { chatRooms, privateRooms, activeRoom, loading, error, setActiveRoomId, sendMessage, typingUsers, loadMoreMessages, isLoadingMore, toggleMuteCommunity } = useChatMessenger();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'dm' | 'community'>('dm');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

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

  useEffect(() => {
    if (activeRoom) {
      if (activeRoom.type === 'dm') {
        setActiveTab('dm');
      } else {
        setActiveTab('community');
      }
    }
  }, [activeRoom?.id, activeRoom?.type]);

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

      {/* Overlay to close search dropdown when clicking outside */}
      {isSearchDropdownOpen && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 15 }} 
          onClick={() => setIsSearchDropdownOpen(false)}
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
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder={t('ChatApp:search') || 'Search...'}
              className={styles.sidebarSearchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchDropdownOpen(e.target.value.trim().length > 0);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setIsSearchDropdownOpen(true);
              }}
            />
            {isSearchDropdownOpen && (
              <div className={styles.searchDropdown}>
                {currentList?.filter(room => room.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                  <div className={styles.searchDropdownEmpty}>{t('ChatApp:noResults') || 'No results found'}</div>
                ) : (
                  currentList?.filter(room => room.name.toLowerCase().includes(searchQuery.toLowerCase())).map(room => {
                    const avatar = room.avatar || '';
                    const isColor = avatar && avatar.startsWith('#');
                    let formattedAvatar = avatar;
                    if (avatar && !isColor && !avatar.startsWith('http') && !avatar.startsWith('/') && !avatar.startsWith('data:')) {
                      formattedAvatar = `https://${avatar}`;
                    }
                    const imgSrc = formattedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(room.name)}&background=random`;
                    
                    return (
                      <div
                        key={room.id}
                        className={styles.searchDropdownItem}
                        onClick={() => {
                          setActiveRoomId(room.id);
                          setSearchQuery('');
                          setIsSearchDropdownOpen(false);
                          setIsLeftSidebarOpen(false);
                        }}
                      >
                        <div className={styles.avatarContainer} style={{ width: 24, height: 24, flexShrink: 0 }}>
                          {isColor ? (
                            <div 
                              className={styles.avatar} 
                              style={{ 
                                backgroundColor: avatar, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                color: 'white', 
                                fontWeight: 'bold', 
                                fontSize: '12px',
                                width: '24px',
                                height: '24px'
                              }}
                            >
                              {room.name.charAt(0).toUpperCase()}
                            </div>
                          ) : (
                            <img 
                              src={imgSrc} 
                              alt="avatar" 
                              className={styles.avatar} 
                              style={{ width: '24px', height: '24px' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(room.name)}&background=random`;
                              }}
                            />
                          )}
                        </div>
                        <div className={styles.searchDropdownItemName}>{room.name}</div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.chatList}>
          {currentList?.map(room => {
            const avatar = room.avatar || '';
            const isColor = avatar && avatar.startsWith('#');
            let formattedAvatar = avatar;
            if (avatar && !isColor && !avatar.startsWith('http') && !avatar.startsWith('/') && !avatar.startsWith('data:')) {
              formattedAvatar = `https://${avatar}`;
            }
            const imgSrc = formattedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(room.name)}&background=random`;
            
            return (
            <div 
              key={room.id} 
              className={`${styles.chatItem} ${activeRoom?.id === room.id ? styles.chatItemActive : ''}`}
              onClick={() => {
                setActiveRoomId(room.id);
                setIsLeftSidebarOpen(false);
              }}
            >
              <div className={styles.avatarContainer}>
                {isColor ? (
                  <div 
                    className={styles.avatar} 
                    style={{ 
                      backgroundColor: avatar, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white', 
                      fontWeight: 'bold', 
                      fontSize: '20px' 
                    }}
                  >
                    {room.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <img 
                    src={imgSrc} 
                    alt="avatar" 
                    className={styles.avatar} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(room.name)}&background=random`;
                    }}
                  />
                )}
                <span className={`${styles.statusIndicator} ${styles.statusOnline}`}></span>
              </div>
              <div className={styles.chatItemInfo}>
                <h3 className={styles.chatItemName}>{room.name}</h3>
                <p className={styles.chatItemLastMsg}>{room.messages[room.messages.length - 1]?.content || t('ChatApp:noMessagesYet')}</p>
              </div>
            </div>
          )})}
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
              {activeTab === 'community' && activeRoom.communityId && (
                <button 
                  className={`${styles.infoToggleBtn} ${activeRoom.isMuted ? styles.mutedBtn : ''}`}
                  onClick={() => toggleMuteCommunity(activeRoom.communityId!, !activeRoom.isMuted)}
                  title={activeRoom.isMuted ? "Bật thông báo" : "Tắt thông báo"}
                  style={{ marginRight: '10px', color: activeRoom.isMuted ? '#ef4444' : 'currentColor' }}
                >
                  {activeRoom.isMuted ? (
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                  )}
                </button>
              )}
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
                  <div className={styles.avatarContainer}>
                    <img src={msg.sender.avatar || 'https://i.pravatar.cc/150'} alt="avatar" className={styles.avatar} />
                  </div>
                  <div className={`${styles.messageContent} ${isMyMessage ? styles.myMessageContent : ''}`}>
                    <div className={styles.messageMeta}>
                      <span className={styles.messageSender} style={{ color: nameColor }}>{msg.sender.name}</span>
                      <span className={styles.messageTime}>{msg.timestamp}</span>
                    </div>
                    <div className={`${styles.messageBubble} ${isMyMessage ? styles.myMessageBubble : ''}`}>
                      <div className={styles.messageText}>{msg.content}</div>
                    </div>
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
          <div className={styles.membersScrollArea}>
            {(() => {
              const members = activeRoom.members || [];
              const rolesMap = activeRoom.roles || {};
              
              const ownersAdmins: typeof members = [];
              const editorsMods: typeof members = [];
              const regularMembers: typeof members = [];
              
              members.forEach(m => {
                const role = (rolesMap[m.id] || 'MEMBER').toUpperCase();
                if (['OWNER', 'ADMIN'].includes(role)) ownersAdmins.push(m);
                else if (['EDITOR', 'MODERATOR'].includes(role)) editorsMods.push(m);
                else regularMembers.push(m);
              });
              
              const renderGroup = (title: string, groupMembers: typeof members, color: string) => {
                if (groupMembers.length === 0) return null;
                return (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 className={styles.memberCategory} style={{ color }}>{title} — {groupMembers.length}</h3>
                    <div className={styles.chatList}>
                      {groupMembers.map(member => (
                        <div key={member.id} className={styles.chatItem}>
                          <div className={styles.avatarContainer}>
                            <img src={member.avatar} alt="avatar" className={styles.avatar} />
                            <span className={`${styles.statusIndicator} ${member.status === 'online' ? styles.statusOnline : styles.statusOffline}`}></span>
                          </div>
                          <div className={styles.chatItemInfo}>
                            <span className={styles.chatItemName} style={{ color }}>{member.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              };
              
              return (
                <>
                  {renderGroup(t('ChatApp:ownerRole') || 'Owner', ownersAdmins, '#ef4444')}
                  {renderGroup(t('ChatApp:editorRole') || 'Editor', editorsMods, '#10b981')}
                  {renderGroup(t('ChatApp:viewerRole') || 'Viewer', regularMembers, 'var(--text-primary)')}
                </>
              );
            })()}
          </div>
        </aside>
      )}
    </div>
  );
};

export default ChatMessenger;