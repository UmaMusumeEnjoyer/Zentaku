import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useUserSearchModal } from '@umamusumeenjoyer/shared-logic';
import type { UserSearchModalProps } from '@umamusumeenjoyer/shared-logic';
import UserSearchResultItem from './UserSearchResultItem';

// Import CSS Module
import styles from './UserSearchModal.module.css';

const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  listId,
  roleType,
  onUserAdded,
  currentMembers = []
}) => {
  const { t } = useTranslation(['userSearchModal']);
  const {
    searchTerm,
    results,
    loading,
    processingIds,
    isEditorMode,
    setSearchTerm,
    handleClose,
    handleAddUser,
  } = useUserSearchModal(isOpen, listId, roleType, currentMembers, onUserAdded, onClose);

  if (!isOpen) return null;

  return (
    <div className={styles.userModalOverlay} onClick={handleClose}>
      <div className={styles.userModalContent} onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className={styles.userModalHeader}>
          <div className={styles.modalSearchWrapper}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>
              search
            </span>
            <input 
              className={styles.userSearchInput}
              placeholder={t('userSearchModal.placeholder', { role: roleType })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* BODY */}
        <div className={styles.userModalBody}>
          {loading && <div className={styles.modalLoading}>{t('userSearchModal.searching')}</div>}

          {!loading && results.length === 0 && !searchTerm && (
            <div className={styles.modalHelperText}>
              <Trans
                i18nKey="userSearchModal.instruction"
                values={{ role: roleType }}
                components={{ 
                  // Màu sắc logic giữ nguyên hex
                  bold: <strong style={{color: isEditorMode ? '#e85d75' : '#3db4f2'}} /> 
                }}
              />
            </div>
          )}
          
          {!loading && results.length === 0 && searchTerm && (
            <div className={styles.modalHelperText}>{t('userSearchModal.noResults')}</div>
          )}

          <div className={styles.userGrid}>
            {results.map((user) => (
              <UserSearchResultItem 
                key={user.id || user.username}
                user={user}
                currentMembers={currentMembers}
                isEditorMode={isEditorMode}
                isProcessing={processingIds.includes(user.username)}
                onAddUser={handleAddUser}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;