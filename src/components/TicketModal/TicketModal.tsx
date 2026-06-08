import React, { useState } from 'react';
import styles from './TicketModal.module.css';
import { supportService, TicketCategory } from '@umamusumeenjoyer/shared-logic';
import { toast } from 'react-toastify';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>(TicketCategory.OTHER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await supportService.createTicket({ title, description, category });
      toast.success('Your report has been submitted successfully.');
      setTitle('');
      setDescription('');
      setCategory(TicketCategory.OTHER);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Report a Bug</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
            >
              <option value={TicketCategory.UI}>User Interface</option>
              <option value={TicketCategory.SERVER}>Server Issue</option>
              <option value={TicketCategory.CONTENT}>Content Issue</option>
              <option value={TicketCategory.OTHER}>Other</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input 
              id="title" 
              type="text" 
              placeholder="Brief summary of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              placeholder="Please provide details to help us reproduce the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketModal;
