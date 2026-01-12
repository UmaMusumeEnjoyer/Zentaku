import React from 'react';
import { useTranslation, Trans } from 'react-i18next'; // Import hook và component Trans
import { useUserSearchModal } from '@umamusumeenjoyer/shared-logic';
import type { UserSearchModalProps } from '@umamusumeenjoyer/shared-logic';
import UserSearchResultItem from './UserSearchResultItem';
import './UserSearchModal.css';

const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  listId,
  roleType,
  onUserAdded,
  currentMembers = []
}) => {
  const { t } = useTranslation(['userSearchModal']); // Khởi tạo hook dịch
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
    <div className="user-modal-overlay" onClick={handleClose}>
      <div className="user-modal-content" onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="user-modal-header">
          <div className="modal-search-wrapper">
            <span className="material-symbols-outlined search-icon" 
                  style={{position: 'absolute', left: '12px', color: '#64748b'}}>
              search
            </span>
            <input 
              className="user-search-input"
              // Sử dụng interpolation để truyền roleType vào placeholder
              placeholder={t('userSearchModal.placeholder', { role: roleType })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <button className="close-btn" onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* BODY */}
        <div className="user-modal-body">
          {loading && <div className="modal-loading">{t('userSearchModal.searching')}</div>}

          {!loading && results.length === 0 && !searchTerm && (
            <div className="modal-helper-text">
              {/* Sử dụng Trans để xử lý text có format HTML/Style */}
              <Trans
                i18nKey="userSearchModal.instruction"
                values={{ role: roleType }}
                components={{ 
                  bold: <strong style={{color: isEditorMode ? '#e85d75' : '#3db4f2'}} /> 
                }}
              />
            </div>
          )}
          
          {!loading && results.length === 0 && searchTerm && (
            <div className="modal-helper-text">{t('userSearchModal.noResults')}</div>
          )}

          <div className="user-grid">
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