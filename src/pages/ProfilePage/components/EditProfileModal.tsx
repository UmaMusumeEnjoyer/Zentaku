import React from 'react';
// [CHANGE] Import CSS Module
import styles from './EditProfileModal.module.css';
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
  const { theme } = useTheme();
  const { t } = useTranslation('EditProfileModal');
  
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
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* [CHANGE] Sử dụng styles.modalContent và data-theme */}
      <div className={styles.modalContent} data-theme={theme} onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{t('title')}</h3>
          <button className={styles.btnCloseModal} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {error && <div className={styles.errorMsg}>{error}</div>}
            
            {/* AVATAR SECTION */}
            <div className={styles.avatarSection}>
              <label className={styles.avatarLabel}>{t('avatar.label')}</label>
              <div className={styles.avatarActions}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  onChange={handleFileChange}
                />
                
                <button 
                  type="button" 
                  className={styles.btnAvatarAction} 
                  onClick={handleUploadClick}
                  disabled={loading}
                >
                  {t('avatar.upload')}
                </button>
                
                <button 
                  type="button" 
                  className={`${styles.btnAvatarAction} ${styles.btnAvatarDelete}`} 
                  onClick={handleAvatarDelete}
                  disabled={loading || !currentUser?.avatar_url}
                >
                  {t('avatar.delete')}
                </button>
              </div>
            </div>

            {/* FORM FIELDS */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('fields.displayName.label')}</label>
              <input 
                type="text" 
                name="displayName" 
                className={styles.formInput}
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Your display name"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('fields.bio.label')}</label>
              <textarea 
                name="bio" 
                className={`${styles.formInput} ${styles.formTextarea}`}
                value={formData.bio}
                onChange={(e: any) => handleChange(e)}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('fields.location.label')}</label>
              <input 
                type="text" 
                name="location" 
                className={styles.formInput}
                value={formData.location}
                onChange={handleChange}
                placeholder="Your location"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('fields.website.label')}</label>
              <input 
                type="text" 
                name="website" 
                className={styles.formInput}
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              {t('actions.cancel')}
            </button>
            <button type="submit" className={styles.btnSave} disabled={loading}>
              {loading ? t('actions.saving') : t('actions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;