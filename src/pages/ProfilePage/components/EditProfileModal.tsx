import React from 'react';
import './EditProfileModal.css';
import { type EditProfileModalProps } from '@umamusumeenjoyer/shared-logic';
import { useEditProfileModal } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  onUpdateSuccess 
}) => {
  // Kết nối ThemeContext
  const { theme } = useTheme();
  
  // Kết nối i18n
  const { t } = useTranslation('EditProfileModal');
  
  // Kết nối ViewModel
  const {
    formData,
    loading,
    error,
    fileInputRef,
    handleChange,
    handleUploadClick,
    handleFileChange,
    handleAvatarDelete,
    handleSubmit
  } = useEditProfileModal(isOpen, currentUser, onUpdateSuccess, onClose);

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className={`edit-modal-content ${theme}`} onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="edit-modal-header">
          <h3 className="edit-modal-title">{t('title')}</h3>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="edit-modal-body">
            {error && <div className="error-msg">{error}</div>}
            
            {/* AVATAR SECTION */}
            <div className="avatar-section">
              <label className="avatar-label">{t('avatar.label')}</label>
              <div className="avatar-actions">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  onChange={handleFileChange}
                />
                
                <button 
                  type="button" 
                  className="btn-avatar-action" 
                  onClick={handleUploadClick}
                  disabled={loading}
                >
                  {t('avatar.upload')}
                </button>
                
                <button 
                  type="button" 
                  className="btn-avatar-action btn-avatar-delete" 
                  onClick={handleAvatarDelete}
                  disabled={loading || !currentUser?.avatar_url}
                >
                  {t('avatar.delete')}
                </button>
              </div>
            </div>

            {/* FORM FIELDS */}
            <div className="form-group">
              <label className="form-label">{t('fields.first_name.label')}</label>
              <input 
                type="text" 
                name="first_name" 
                className="form-input"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('fields.last_name.label')}</label>
              <input 
                type="text" 
                name="last_name" 
                className="form-input"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('fields.username.label')}</label>
              <input 
                type="text" 
                name="username" 
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <div className="username-hint">
                {t('fields.username.hint')}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="edit-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              {t('actions.cancel')}
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? t('actions.saving') : t('actions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;