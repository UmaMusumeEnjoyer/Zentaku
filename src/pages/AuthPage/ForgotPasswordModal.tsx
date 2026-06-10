import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '@umamusumeenjoyer/shared-logic';
import { toast } from 'react-toastify';
import styles from './ForgotPasswordModal.module.css';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation(['Auth']);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      // Backend returns message, use translation if possible, else backend message
      toast.success(t('Auth:forgotPassword.success') || response.data.message);
      onClose();
      setEmail('');
    } catch (error: any) {
      toast.error(t('Auth:forgotPassword.error') || error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{t('Auth:forgotPassword.title')}</h2>
        <p>{t('Auth:forgotPassword.description')}</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder={t('Auth:placeholders.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              disabled={isLoading}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={isLoading}>
              {t('Auth:forgotPassword.cancel')}
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isLoading || !email}>
              {isLoading ? '...' : t('Auth:forgotPassword.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
