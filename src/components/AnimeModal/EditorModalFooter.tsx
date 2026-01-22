// src/components/EditorModal/EditorModalFooter.tsx
import React from 'react';
import type { EditorModalFooterProps } from '@umamusumeenjoyer/shared-logic';
import styles from './EditorModal.module.css';

const EditorModalFooter: React.FC<EditorModalFooterProps> = ({ onDelete }) => {
  return (
    <div className={styles.footer}>
      <button className={styles.btnDelete} onClick={onDelete}>Delete</button>
    </div>
  );
};

export default EditorModalFooter;