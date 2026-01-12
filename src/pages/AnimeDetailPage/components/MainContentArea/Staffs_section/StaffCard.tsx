// src/components/MainContent/Staffs_section/StaffCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { StaffCardProps } from '@umamusumeenjoyer/shared-logic'; 
// 1. Import CSS Module
import styles from './StaffCard.module.css';

const StaffCard: React.FC<StaffCardProps> = ({ staffMember }) => {
  const { t } = useTranslation(['StaffSection', 'common']);

  const hasDefaultImage = staffMember.image?.includes('default.jpg');
  
  return (
    // 2. Sử dụng class từ module
    <div className={styles.staffCard}>
      {hasDefaultImage ? (
        <div className={styles.noImagePlaceholder}>
          <span>{t('common:staff.no_image')}</span>
        </div>
      ) : (
        <img 
          src={staffMember.image} 
          alt={staffMember.name_full} 
          className={styles.staffAvatar} 
        />
      )}
      <div className={styles.staffDetails}>
        <p className={styles.staffName}>{staffMember.name_full}</p>
        <p className={styles.staffRole}>{staffMember.role}</p>
      </div>
    </div>
  );
};

export default StaffCard;