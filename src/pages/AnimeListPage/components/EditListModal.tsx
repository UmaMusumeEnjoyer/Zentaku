import React from 'react';
import { useTranslation } from 'react-i18next'; // Import hook
import { useEditListModal } from '@umamusumeenjoyer/shared-logic';
import type { EditListModalProps } from '@umamusumeenjoyer/shared-logic';
import './EditListModal.css';

const EditListModal: React.FC<EditListModalProps> = ({ 
  isOpen, 
  onClose, 
  listId, 
  initialData, 
  onUpdateSuccess 
}) => {
  const { t } = useTranslation(['editListModal']); // Khởi tạo hook dịch
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
      // Dịch thông báo lỗi
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
    <div className="edit-list-overlay" onClick={handleOverlayClick}>
      <div className="edit-list-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="edit-list-title">{t('editListModal.title')}</h2>
        <form onSubmit={handleFormSubmit}>
          
          <div className="form-group">
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

          <div className="form-group">
            <label>{t('editListModal.description')}</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChangeWrapper} 
              placeholder={t('editListModal.descriptionPlaceholder')}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('editListModal.themeColor')}</label>
              <div className="color-input-wrapper">
                <input 
                  type="color" 
                  name="color" 
                  value={formData.color} 
                  onChange={handleInputChangeWrapper}
                  disabled={isSubmitting}
                />
                <span className="color-value">{formData.color}</span>
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
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

          <div className="edit-list-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('editListModal.cancel')}
            </button>
            <button 
              type="submit" 
              className="btn-submit"
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