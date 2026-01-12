// src/components/EditorModal/EditorModalForm.tsx
import React from 'react';
import type { EditorModalFormProps } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import styles from './EditorModal.module.css';

const EditorModalForm: React.FC<EditorModalFormProps> = ({ formData, handleChange, isEditMode }) => {
  const { t } = useTranslation(['AnimeModal']);

  return (
    <div className={styles.splitLayout}>
      <div className={styles.leftCol}>
        {/* --- STATUS GROUP --- */}
        <div className={styles.formGroup}>
          <label>{t('AnimeModal:labels.status')}</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className={styles.select}
          >
            <option value="plan_to_watch">{t('AnimeModal:status_options.plan_to_watch')}</option>
            <option value="watching">{t('AnimeModal:status_options.watching')}</option>
            <option value="completed">{t('AnimeModal:status_options.completed')}</option>
            <option value="dropped">{t('AnimeModal:status_options.dropped')}</option>
            <option value="on_hold">{t('AnimeModal:status_options.on_hold')}</option>
          </select>
        </div>

        {/* --- SCORE GROUP --- */}
        <div className={styles.formGroup}>
          <label>{t('AnimeModal:labels.score')}</label>
          <input 
            type="number" 
            name="score" 
            value={formData.score} 
            onChange={handleChange} 
            min="0" max="10" 
            disabled={isEditMode} 
            className={styles.input}
          />
        </div>

        {/* --- PROGRESS GROUP --- */}
        <div className={styles.formGroup}>
          <label>{t('AnimeModal:labels.episode_progress')}</label>
          <input 
            type="number" 
            name="progress" 
            value={formData.progress} 
            onChange={handleChange} 
            className={styles.input}
          />
        </div>

        {/* --- START DATE GROUP --- */}
        <div className={styles.formGroup}>
          <label>{t('AnimeModal:labels.start_date')}</label>
          <input 
            type="date" 
            name="startDate" 
            value={formData.startDate} 
            onChange={handleChange}
            disabled={isEditMode}
            className={styles.input}
          />
        </div>

        {/* --- FINISH DATE GROUP --- */}
        <div className={styles.formGroup}>
          <label>{t('AnimeModal:labels.finish_date')}</label>
          <input 
            type="date" 
            name="finishDate" 
            value={formData.finishDate} 
            onChange={handleChange}
            disabled={isEditMode}
            className={styles.input}
          />
        </div>

        {/* --- REWATCHES GROUP --- */}
        <div className={styles.formGroup}>
          <label>{t('AnimeModal:labels.total_rewatches')}</label>
          <input 
            type="number" 
            name="rewatches" 
            value={formData.rewatches} 
            onChange={handleChange}
            disabled={isEditMode}
            className={styles.input}
          />
        </div>

        {/* --- NOTES GROUP --- */}
        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
          <label>{t('AnimeModal:labels.notes')}</label>
          <textarea 
            name="notes" 
            rows={3} 
            value={formData.notes} 
            onChange={handleChange}
            className={styles.textarea}
          ></textarea>
        </div>
      </div>

      <div className={styles.rightCol}>
        {/* --- CUSTOM LISTS --- */}
        <div className={styles.formGroup}>
          <label>{t('AnimeModal:labels.custom_lists')}</label>
          <div className={styles.listPlaceholder}>
            {t('AnimeModal:placeholders.no_custom_lists')}
          </div>
        </div>
        
        {/* --- PRIVATE CHECKBOX --- */}
        <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
          <label style={{ opacity: isEditMode ? 0.5 : 1 }}>
            <input 
              type="checkbox" 
              name="private" 
              checked={formData.private} 
              onChange={handleChange}
              disabled={isEditMode}
            />
            {t('AnimeModal:labels.private')}
          </label>
        </div>
      </div>
    </div>
  );
};

export default EditorModalForm;