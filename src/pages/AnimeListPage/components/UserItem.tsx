import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUserItem } from '@umamusumeenjoyer/shared-logic';
import type { UserItemProps } from '@umamusumeenjoyer/shared-logic';

// Import CSS Module
import styles from './UserItem.module.css';
import { useNavigate } from 'react-router-dom';

const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR_URL;

const UserItem: React.FC<UserItemProps> = ({ 
  user, 
  roleIcon, 
  iconTitle, 
  onRemove, 
  canRemove, 
  isCurrentUser 
}) => {
  const { t } = useTranslation(['userItem']);
  const { displayAvatar } = useUserItem(
    user.username, 
    user.avatar_url,
    DEFAULT_AVATAR,
    BACKEND_DOMAIN
  );
  
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate(`/user/${user.username}`);
  };

  return (
    <div className={`${styles.userItem} ${isCurrentUser ? styles.currentUser : ''}`}>
      <div className={styles.userInfo} onClick={handleUserClick} style={{ cursor: 'pointer' }}>
        <img src={displayAvatar} alt={user.username} className={styles.userAvatar} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <p className={styles.userName}>{user.username}</p>
            {isCurrentUser && <span className={styles.youBadge}>{t('userItem.youBadge')}</span>}
          </div>
          <p className={styles.userHandle}>@{user.username}</p> 
        </div>
      </div>
      
      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
        {roleIcon && (
          <span className={`material-symbols-outlined ${styles.roleIcon}`} title={iconTitle}>
            {roleIcon}
          </span>
        )}
        
        {canRemove && onRemove && (
          <button 
            className={styles.removeMemberBtn}
            onClick={() => onRemove(user.username)}
            title={t('userItem.removeMember')}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserItem;