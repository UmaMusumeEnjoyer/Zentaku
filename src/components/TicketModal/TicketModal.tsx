import React, { useState } from 'react';
import styles from './TicketModal.module.css';
import { supportService, TicketCategory } from '@umamusumeenjoyer/shared-logic';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('TicketModal');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>(TicketCategory.OTHER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error(t('TicketModal:errors.required'));
      return;
    }

    setIsSubmitting(true);
    try {
      await supportService.createTicket({ title, description, category });
      toast.success(t('TicketModal:success'));
      setTitle('');
      setDescription('');
      setCategory(TicketCategory.OTHER);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('TicketModal:errors.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t('TicketModal:title')}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className={styles.formGroup}>
            <label htmlFor="category">{t('TicketModal:form.category')}</label>
            <select 
              id="category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
            >
              <option value={TicketCategory.UI}>{t('TicketModal:categories.ui')}</option>
              <option value={TicketCategory.SERVER}>{t('TicketModal:categories.server')}</option>
              <option value={TicketCategory.CONTENT}>{t('TicketModal:categories.content')}</option>
              <option value={TicketCategory.OTHER}>{t('TicketModal:categories.other')}</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="title">{t('TicketModal:form.title')}</label>
            <input 
              id="title" 
              type="text" 
              placeholder={t('TicketModal:placeholders.title')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">{t('TicketModal:form.description')}</label>
            <textarea 
              id="description" 
              placeholder={t('TicketModal:placeholders.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? t('TicketModal:buttons.submitting') : t('TicketModal:buttons.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketModal;
