import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEditListModal } from '@umamusumeenjoyer/shared-logic';
import type { EditListModalProps } from '@umamusumeenjoyer/shared-logic';

// Import CSS Module
import styles from './EditListModal.module.css';

const EditListModal: React.FC<EditListModalProps> = ({ 
  isOpen, 
  onClose, 
  listId, 
  initialData, 
  onUpdateSuccess 
}) => {
  const { t } = useTranslation(['editListModal']);
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  } = useEditListModal(isOpen, initialData, listId, onUpdateSuccess, onClose);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSubmit();
    } catch (error) {
      alert(t('editListModal.updateError'));
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChangeWrapper = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    handleInputChange(name, type === 'checkbox' ? checked : value);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.editListOverlay} onClick={handleOverlayClick}>
      <div className={styles.editListContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.editListTitle}>{t('editListModal.title')}</h2>
        <form onSubmit={handleFormSubmit}>
          
          <div className={styles.formGroup}>
            <label>{t('editListModal.listName')}</label>
            <input 
              type="text" 
              name="list_name" 
              value={formData.list_name} 
              onChange={handleInputChangeWrapper} 
              placeholder={t('editListModal.listNamePlaceholder')}
              required 
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t('editListModal.description')}</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChangeWrapper} 
              placeholder={t('editListModal.descriptionPlaceholder')}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t('editListModal.themeColor')}</label>
              <div className={styles.colorInputWrapper}>
                <input 
                  type="color" 
                  name="color" 
                  value={formData.color} 
                  onChange={handleInputChangeWrapper}
                  disabled={isSubmitting}
                />
                <span className={styles.colorValue}>{formData.color}</span>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  name="is_private" 
                  checked={formData.is_private} 
                  onChange={handleInputChangeWrapper}
                  disabled={isSubmitting}
                />
                {t('editListModal.privateList')}
              </label>
            </div>
          </div>

          <div className={styles.editListActions}>
            <button 
              type="button" 
              className={styles.btnCancel} 
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('editListModal.cancel')}
            </button>
            <button 
              type="submit" 
              className={styles.btnSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('editListModal.saving') : t('editListModal.saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListModal;