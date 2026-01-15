// src/components/MainContent/Staffs_section/StaffSection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import StaffCard from './StaffCard';
import { useStaffData } from '@umamusumeenjoyer/shared-logic'; 
// Nếu StaffMember được export từ shared-logic hoặc file types local, hãy import nó
// import { StaffMember } from '../../Staff/staffSection.types'; 
import styles from './StaffSection.module.css';

// 1. Cập nhật Interface Props: Nhận data thay vì animeId
interface StaffSectionProps {
  data: any[]; // Tốt nhất nên thay 'any' bằng 'StaffMember[]'
}

const StaffSection: React.FC<StaffSectionProps> = ({ data }) => {
  const { t } = useTranslation(['StaffSection', 'common']);
  
  // 2. Truyền data vào hook (Hook này bây giờ chỉ làm nhiệm vụ cắt mảng slice(0,3))
  // Lưu ý: Hook đã sửa không còn trả về 'loading' nữa
  const { staff } = useStaffData(data);

  // 3. Xóa logic check loading (vì cha đã lo việc này)
  
  if (!staff || staff.length === 0) {
    return <p>{t('common:staff.no_info')}</p>;
  }

  return (
    <div className={styles.staffGrid}>
      {staff.map((member: any) => (
        <StaffCard key={member.id} staffMember={member} />
      ))}
    </div>
  );
};

export default StaffSection;