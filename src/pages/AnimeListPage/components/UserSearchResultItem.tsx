import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUserSearchResultItem } from '@umamusumeenjoyer/shared-logic';
import type { UserSearchResultItemProps } from '@umamusumeenjoyer/shared-logic';

// Import CSS Module mới
import styles from './UserSearchResultItem.module.css';

const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN;
const DEFAULT_AVATAR = import.meta.env.VITE_DEFAULT_AVATAR_URL;

const UserSearchResultItem: React.FC<UserSearchResultItemProps> = ({
  user,
  currentMembers,
  isEditorMode,
  isProcessing,
  onAddUser
}) => {
  const { t } = useTranslation(['userSearchModal']);
  const {
    displayAvatar,
    isOwner,
    buttonState,
    statusText,
  } = useUserSearchResultItem(
    user, 
    currentMembers, 
    isEditorMode, 
    isProcessing, 
    DEFAULT_AVATAR, 
    BACKEND_DOMAIN
  );

const getStatusDisplay = () => {
    if (isOwner) return `${t('userSearchResultItem.currently')}: ${t('userSearchResultItem.status.owner')}`;
    if (!statusText) return `${t('userSearchResultItem.assign')}: ${isEditorMode ? t('userSearchResultItem.status.editor') : t('userSearchResultItem.status.viewer')}`;
    
    const roleKey = statusText.toLowerCase(); 
    const roleLabel = t(`userSearchResultItem.status.${roleKey}`, { defaultValue: statusText });
    return `${t('userSearchResultItem.currently')}: ${roleLabel}`;
  };

  // Helper function để map class string từ hook sang class module
  const getButtonClass = () => {
    // buttonState.className trả về 'editor' hoặc 'viewer' string
    const baseClass = styles.btnInvite;
    const roleClass = buttonState.className === 'editor' ? styles.editor : 
                      buttonState.className === 'viewer' ? styles.viewer : '';
    return `${baseClass} ${roleClass}`;
  };

  return (
    <div className={styles.userCardItem}>
      <div className={styles.userCardInfo}>
        <img src={displayAvatar} alt={user.username} className={styles.userCardAvatar} />
        <div>
          <p className={styles.userCardName}>
            {user.username}
            {user.email_verified && (
              <span 
                className={`material-symbols-outlined ${styles.verifiedIcon}`}
                title={t('userSearchResultItem.verifiedEmail')}>
                verified
              </span>
            )}
          </p>
          
          <p className={styles.userCardHandle}>
            <span className={`${styles.statusText} ${isOwner ? styles.statusOwner : ''}`}>
              {getStatusDisplay()}
            </span>
          </p>
        </div>
      </div>

      <button 
        className={getButtonClass()} 
        onClick={() => onAddUser(user)}
        disabled={buttonState.isDisabled}
        title={isOwner ? t('userSearchResultItem.cannotModifyOwner') : ""}
      >
        {isProcessing ? (
          <span className={`material-symbols-outlined ${styles.spinIcon}`}>sync</span>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{fontSize: '18px'}}>
              {buttonState.icon}
            </span>
            {t(`userSearchResultItem.actions.${buttonState.text}`)}
          </>
        )}
      </button>
    </div>
  );
};

export default UserSearchResultItem;