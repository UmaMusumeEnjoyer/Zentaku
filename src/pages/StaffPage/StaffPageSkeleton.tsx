// src/pages/StaffPage/StaffPageSkeleton.tsx
import React from 'react';
// Giả định đường dẫn import Skeleton base component
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton'; 
import styles from './StaffPage.module.css';

const StaffPageSkeleton: React.FC = () => {
    // Tạo mảng giả để render danh sách (ví dụ 2 nhóm năm, mỗi nhóm 6 roles)
    const dummyYears = [1, 2];
    const dummyRoles = Array.from({ length: 6 });

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                {/* Cột trái: Ảnh Staff */}
                <div className={styles.leftColumn}>
                    {/* Trong CSS: .mainContent grid-template-columns: 225px 1fr
                        Ta set chiều cao cứng khoảng 335px để mô phỏng tỉ lệ ảnh chân dung (tỉ lệ ~2:3)
                    */}
                    <Skeleton 
                        width="100%" 
                        height={335} 
                        borderRadius={8} 
                        className={styles.staffImage} // Tái sử dụng class để giữ shadow/margin nếu có
                    />
                </div>

                {/* Cột phải: Thông tin */}
                <div className={styles.rightColumn}>
                    {/* Tên Staff (H1 - 2.2rem ~ 40px) */}
                    <Skeleton 
                        width="60%" 
                        height={40} 
                        style={{ marginBottom: 10 }} 
                    />
                    
                    {/* Tên Native (1rem ~ 20px) */}
                    <Skeleton 
                        width="30%" 
                        height={20} 
                        style={{ marginBottom: 25 }} 
                    />
                    
                    {/* Info Grid - Tái sử dụng class .infoGrid để giữ layout 2 cột */}
                    <div className={styles.infoGrid}>
                        {/* 4 item thông tin cơ bản */}
                        <Skeleton width="80%" height={20} />
                        <Skeleton width="70%" height={20} />
                        <Skeleton width="60%" height={20} />
                        <Skeleton width="75%" height={20} />
                    </div>
                    
                    {/* Mô tả - Giả lập vài dòng text */}
                    <div className={styles.description}>
                        <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
                        <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
                        <Skeleton width="95%" height={16} style={{ marginBottom: 8 }} />
                        <Skeleton width="60%" height={16} />
                    </div>
                </div>
            </div>

            {/* Danh sách các vai diễn (Roles) */}
            <div className={styles.rolesSection}>
                {dummyYears.map((yearItem) => (
                    <div key={yearItem} className={styles.yearGroup}>
                        {/* Tiêu đề năm */}
                        <div className={styles.yearTitle} style={{ borderBottom: 'none' }}>
                            <Skeleton width={100} height={30} />
                        </div>

                        {/* Roles Grid - Tái sử dụng layout grid responsive */}
                        <div className={styles.rolesGrid}>
                            {dummyRoles.map((_, index) => (
                                // Giả lập .roleCard
                                <div key={index} className={styles.roleCard}>
                                    {/* Ảnh Role: CSS set width 55px, height 100% */}
                                    <div style={{ width: 55, height: '100%', flexShrink: 0 }}>
                                        <Skeleton 
                                            width="100%" 
                                            height="100%" 
                                            borderRadius={0} 
                                        />
                                    </div>
                                    
                                    {/* Role Details */}
                                    <div className={styles.roleDetails}>
                                        {/* Tên Role */}
                                        <Skeleton 
                                            width="80%" 
                                            height={16} 
                                            style={{ marginBottom: 6 }} 
                                        />
                                        {/* Format/Subtext */}
                                        <Skeleton 
                                            width="40%" 
                                            height={14} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffPageSkeleton;