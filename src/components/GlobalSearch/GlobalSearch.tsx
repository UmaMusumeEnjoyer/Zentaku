// src/components/GlobalSearch/GlobalSearchModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Thay đổi cách import style
import styles from './GlobalSearch.module.css'; 
import { useGlobalSearch, type GlobalSearchModalProps } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['GlobalSearch']);

  const handleUserSelect = (username: string) => {
    navigate(`/user/${username}`);
  };

  const { 
    searchTerm, 
    results, 
    loading, 
    handleInputChange, 
    handleUserClick 
  } = useGlobalSearch(isOpen, onClose, handleUserSelect);

  if (!isOpen) return null;

  const defaultAvatar = import.meta.env.VITE_DEFAULT_AVATAR_SEARCH;

  return (
    // 2. Sử dụng styles['tên-class'] cho các class cục bộ
    <div className={styles['gs-overlay']} onClick={onClose}>
      <div className={styles['gs-content']} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles['gs-header']}>
          <div className={styles['gs-search-wrapper']}>
            {/* 3. Giữ nguyên 'material-symbols-outlined' vì đây là class global của thư viện icon */}
            <span 
              className="material-symbols-outlined" 
              style={{
                position: 'absolute', 
                left: '14px', 
                top: '12px', 
                color: 'var(--text-secondary)'
              }}
            >
              search
            </span>
            <input 
              className={styles['gs-input']}
              placeholder={t('GlobalSearch:placeholder')}
              value={searchTerm}
              onChange={handleInputChange}
              autoFocus
            />
          </div>
          <button className={styles['gs-close-btn']} onClick={onClose}>
            <span className="material-symbols-outlined" style={{fontSize: '28px'}}>close</span>
          </button>
        </div>

        {/* Body */}
        <div className={styles['gs-body']}>
          {loading && <div className={styles['gs-loading']}>{t('GlobalSearch:loading')}</div>}

          {!loading && results.length === 0 && searchTerm && (
            <div className={styles['gs-empty']}>
              {t('GlobalSearch:no_results', { query: searchTerm })}
            </div>
          )}
          
          {!loading && results.length === 0 && !searchTerm && (
            <div className={styles['gs-empty']}>{t('GlobalSearch:start_typing')}</div>
          )}

          <div className={styles['gs-results-list']}>
            {results.map((user) => (
              <div 
                key={user.id || user.username} 
                className={styles['gs-result-item']}
                onClick={() => handleUserClick(user.username)}
              >
                <img 
                  src={user.avatar || defaultAvatar} 
                  alt={user.username} 
                  className={styles['gs-avatar']} 
                />
                <div className={styles['gs-info']}>
                  <span className={styles['gs-displayname']}>{user.displayName || user.username}</span>
                  <span className={styles['gs-username']}>@{user.username}</span>
                </div>
                {user.followersCount !== undefined && (
                  <div className={styles['gs-followers']}>
                    <span className="material-symbols-outlined">group</span>
                    <span>{user.followersCount} followers</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;