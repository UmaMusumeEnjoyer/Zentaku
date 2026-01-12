// src/components/InfoSidebar/InfoComponents.tsx
import React from 'react';
import type { InfoBlockProps, InfoListBlockProps } from '@umamusumeenjoyer/shared-logic';
// 1. Import styles từ module
import styles from './InfoSidebar.module.css';

export const InfoBlock: React.FC<InfoBlockProps> = ({ label, value, isAiring = false }) => {
  if (value === null || value === undefined || value === '') return null;
  
  // 2. Logic class động dựa trên module
  const labelClass = isAiring 
    ? `${styles.label} ${styles.airingLabel}` 
    : styles.label;

  const valueClass = isAiring 
    ? `${styles.value} ${styles.airingValue}` 
    : styles.value;

  return (
    <div className={styles.block}>
      <h4 className={labelClass}>{label}</h4>
      <p className={valueClass}>{value}</p>
    </div>
  );
};

export const InfoListBlock: React.FC<InfoListBlockProps> = ({ label, items }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className={styles.block}>
      <h4 className={styles.label}>{label}</h4>
      {items.map((item, index) => (
        <p key={index} className={`${styles.value} ${styles.listItem}`}>
          {item}
        </p>
      ))}
    </div>
  );
};