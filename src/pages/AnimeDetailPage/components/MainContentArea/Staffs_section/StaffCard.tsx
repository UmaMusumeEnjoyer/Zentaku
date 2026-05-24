// src/components/MainContent/Staffs_section/StaffCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { StaffCardProps } from '@umamusumeenjoyer/shared-logic'; 
// 1. Import CSS Module
import styles from './StaffCard.module.css';

const StaffCard: React.FC<StaffCardProps> = ({ staffMember: edge }) => {
  const { t } = useTranslation(['StaffSection', 'common']);
  
  const node = (edge as any).node || edge;
  const role = (edge as any).role || node.role;

  const hasDefaultImage = node.image?.large?.includes('default.jpg') || node.image?.includes('default.jpg') || node.image_url?.includes('default.jpg');
  
  return (
    // 2. Sử dụng class từ module
    <div className={styles.staffCard}>
      {hasDefaultImage ? (
        <div className={styles.noImagePlaceholder}>
          <span>{t('common:staff.no_image')}</span>
        </div>
      ) : (
        <img 
          src={node.image?.large || node.image || node.image_url} 
          alt={node.name?.full || node.name_full} 
          className={styles.staffAvatar} 
        />
      )}
      <div className={styles.staffDetails}>
        <p className={styles.staffName}>{node.name?.full || node.name_full}</p>
        <p className={styles.staffRole}>{role}</p>
      </div>
    </div>
  );
};

export default StaffCard;