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

  const isDefault = (val: any) => typeof val === 'string' && val.includes('default.jpg');
  const hasDefaultImage = isDefault(node.image?.large) || isDefault(node.image) || isDefault(node.image_url);
  
  const getPersonName = (personNode: any) => {
    if (!personNode) return '';
    if (i18n.language === 'ja') {
      return personNode.name?.native || personNode.name_native || personNode.name?.full || personNode.name_full;
    }
    return personNode.name?.full || personNode.name_full;
  };
  
  return (
    // 2. Sử dụng class từ module
    <div className={styles.staffCard}>
      {hasDefaultImage ? (
        <div className={styles.noImagePlaceholder}>
          <span>{t('common:staff.no_image')}</span>
        </div>
      ) : (
        <img 
          src={node.image?.large || (typeof node.image === 'string' ? node.image : undefined) || node.image_url} 
          alt={getPersonName(node)} 
          className={styles.staffAvatar} 
        />
      )}
      <div className={styles.staffDetails}>
        <p className={styles.staffName}>{getPersonName(node)}</p>
        <p className={styles.staffRole}>{role}</p>
      </div>
    </div>
  );
};

export default StaffCard;