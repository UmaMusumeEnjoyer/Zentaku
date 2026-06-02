// src/components/EditorModal/EditorModalFooter.tsx
import React from 'react';
import type { EditorModalFooterProps } from '@umamusumeenjoyer/shared-logic';
import styles from './EditorModal.module.css';
import { useTranslation } from 'react-i18next';

const EditorModalFooter: React.FC<EditorModalFooterProps> = ({ onDelete }) => {
  const { t } = useTranslation(['AnimeModal']);
  return (
    <div className={styles.footer}>
      <button className={styles.btnDelete} onClick={onDelete}>{t('AnimeModal:buttons.delete')}</button>
    </div>
  );
};

export default EditorModalFooter;