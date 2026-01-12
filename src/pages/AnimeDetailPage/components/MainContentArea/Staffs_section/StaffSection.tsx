// src/components/MainContent/Staffs_section/StaffSection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import StaffCard from './StaffCard';
import { useStaffData } from '@umamusumeenjoyer/shared-logic'; 
import type { StaffSectionProps } from '@umamusumeenjoyer/shared-logic';
// 1. Import CSS Module
import styles from './StaffSection.module.css';

const StaffSection: React.FC<StaffSectionProps> = ({ animeId }) => {
  const { t } = useTranslation(['StaffSection', 'common']);
  
  const { staff, loading } = useStaffData(animeId);

  if (loading) {
    return <div>{t('common:staff.loading')}</div>;
  }

  if (staff.length === 0) {
    return <p>{t('common:staff.no_info')}</p>;
  }

  return (
    // 2. Sử dụng class từ module
    <div className={styles.staffGrid}>
      {staff.map((member) => (
        <StaffCard key={member.id} staffMember={member} />
      ))}
    </div>
  );
};

export default StaffSection;