import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText,
  cancelText,
  type = 'danger'
}) => {
  const { t } = useTranslation(['Admin']);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{title || t('Admin:confirmModal.defaultTitle')}</h2>
        </div>
        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelBtn} 
            onClick={onCancel} 
            disabled={isLoading}
          >
            {cancelText || t('Admin:confirmModal.btnCancel')}
          </button>
          <button 
            className={`${styles.confirmBtn} ${styles[type]}`} 
            onClick={onConfirm} 
            disabled={isLoading}
          >
            {isLoading ? '...' : (confirmText || t('Admin:confirmModal.btnConfirm'))}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
