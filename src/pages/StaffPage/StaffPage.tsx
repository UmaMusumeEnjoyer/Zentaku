// src/pages/StaffPage/StaffPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStaffPage } from '@umamusumeenjoyer/shared-logic';
import styles from './StaffPage.module.css';

import StaffPageSkeleton from './StaffPageSkeleton';

interface DescriptionRendererProps {
    text?: string;
}

const DescriptionRenderer: React.FC<DescriptionRendererProps> = ({ text }) => {
    if (!text) return null;

    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return (
        <p>
            {parts.map((part, index) => {
                const match = part.match(/\[(.*?)\]\((.*?)\)/);
                if (match) {
                    return (
                        <a 
                            key={index} 
                            href={match[2]} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.descriptionLink}
                        >
                            {match[1]}
                        </a>
                    );
                }
                if (part.startsWith('__')) {
                    return <strong key={index}>{part.replace(/__/g, '')}</strong>;
                }
                if (part.startsWith('- ')) {
                    return <li key={index}>{part.substring(2)}</li>
                }
                return <span key={index}>{part}</span>;
            })}
        </p>
    );
};

// --- Main Component ---

const StaffPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    // [REMOVED] useTheme hook vì CSS Variables đã handle tự động
    const { t, i18n } = useTranslation('StaffPage');
    
    // Gọi Custom Hook để lấy dữ liệu và logic
    const { 
        staff, 
        loading, 
        rolesByYear, 
        sortedYears, 
        isDescriptionExpanded, 
        toggleDescription, 
        shouldShowReadMore,
    } = useStaffPage(id);

    // Format date theo ngôn ngữ
    const formatDateByLanguage = (dateObj?: { year?: number; month?: number; day?: number }) => {
        if (!dateObj || (!dateObj.year && !dateObj.month && !dateObj.day)) return t('info.not_available');
        
        const year = dateObj.year;
        const month = dateObj.month;
        const day = dateObj.day;
        
        const currentLang = i18n.language;
        
        if (currentLang === 'jp') {
            // Format Nhật: YYYY年MM月DD日
            let str = '';
            if (year) str += `${year}年`;
            if (month) str += `${month}月`;
            if (day) str += `${day}日`;
            return str || t('info.not_available');
        } else {
            // Format Anh: Month DD, YYYY
            const date = new Date();
            if (year) date.setFullYear(year);
            if (month) date.setMonth(month - 1);
            if (day) date.setDate(day);
            
            return date.toLocaleDateString('en-US', { 
                year: year ? 'numeric' : undefined, 
                month: month ? 'long' : undefined, 
                day: day ? 'numeric' : undefined 
            });
        }
    };

    if (loading) return(<StaffPageSkeleton></StaffPageSkeleton>);



    if (!staff) return <div className={styles.loading}>{t('error.not_found')}</div>;

    const descriptionText = staff.description || '';

    return (
        // [UPDATE] Chỉ sử dụng class pageWrapper, không cần logic theme
        <div className={styles.pageWrapper}>
            <div className={styles.mainContent}>
                {/* Cột trái: Ảnh */}
                <div className={styles.leftColumn}>
                    <img 
                        src={staff.image?.large} 
                        alt={staff.name?.full} 
                        className={styles.staffImage} 
                    />
                </div>

                {/* Cột phải: Thông tin chi tiết */}
                <div className={styles.rightColumn}>
                    <h1 className={styles.staffName}>{staff.name?.full}</h1>
                    <p className={styles.nativeName}>{staff.name?.native}</p>
                    
                    <div className={styles.infoGrid}>
                        <p><strong>{t('info.birth')}:</strong> {formatDateByLanguage(staff.dateOfBirth)}</p>
                        <p><strong>{t('info.age')}:</strong> {staff.age || t('info.not_available')}</p>
                        <p><strong>{t('info.gender')}:</strong> {staff.gender || t('info.not_available')}</p>
                        <p><strong>{t('info.hometown')}:</strong> {staff.homeTown || t('info.not_available')}</p>
                    </div>
                    
                    {/* Phần mô tả có tính năng Show More/Less */}
                    <div className={`${styles.description} ${!isDescriptionExpanded && shouldShowReadMore ? styles.collapsed : ''}`}>
                        <DescriptionRenderer text={descriptionText} />
                    </div>
                    
                    {shouldShowReadMore && (
                        <button onClick={toggleDescription} className={styles.readMoreButton}>
                            {isDescriptionExpanded ? t('actions.show_less') : t('actions.read_more')}
                        </button>
                    )}
                </div>
            </div>

            {/* Danh sách các vai diễn (Roles) */}
            <div className={styles.rolesSection}>
                {sortedYears.map(year => (
                    <div key={year} className={styles.yearGroup}>
                        <h2 className={styles.yearTitle}>{year}</h2>
                        <div className={styles.rolesGrid}>
                            {rolesByYear[year].map(role => (
                                <Link 
                                    to={`/anime/${role.id}`} 
                                    key={`${role.id}-${Math.random()}`} 
                                    className={styles.roleCardLink}
                                >
                                    <div className={styles.roleCard}>
                                        <img 
                                            src={role.coverImage?.large} 
                                            alt={role.title?.romaji} 
                                            className={styles.roleImage} 
                                        />
                                        <div className={styles.roleDetails}>
                                            <p className={styles.roleMainText}>{role.title?.romaji}</p>
                                            <p className={styles.roleSubText}>{role.format}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffPage;