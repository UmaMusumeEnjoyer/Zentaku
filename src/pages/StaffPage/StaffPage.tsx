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
    const formatDateByLanguage = (dateString?: string) => {
        if (!dateString) return t('info.not_available');
        
        const date = new Date(dateString);
        const currentLang = i18n.language;
        
        if (currentLang === 'jp') {
            // Format Nhật: YYYY年MM月DD日
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${year}年${month}月${day}日`;
        } else {
            // Format Anh: Month DD, YYYY
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
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
                        src={staff.image} 
                        alt={staff.name_full} 
                        className={styles.staffImage} 
                    />
                </div>

                {/* Cột phải: Thông tin chi tiết */}
                <div className={styles.rightColumn}>
                    <h1 className={styles.staffName}>{staff.name_full}</h1>
                    <p className={styles.nativeName}>{staff.name_native}</p>
                    
                    <div className={styles.infoGrid}>
                        <p><strong>{t('info.birth')}:</strong> {formatDateByLanguage(staff.date_of_birth)}</p>
                        <p><strong>{t('info.age')}:</strong> {staff.age || t('info.not_available')}</p>
                        <p><strong>{t('info.gender')}:</strong> {staff.gender || t('info.not_available')}</p>
                        <p><strong>{t('info.hometown')}:</strong> {staff.home_town || t('info.not_available')}</p>
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
                                    key={`${role.id}-${role.character_role || Math.random()}`} 
                                    className={styles.roleCardLink}
                                >
                                    <div className={styles.roleCard}>
                                        <img 
                                            src={role.cover_image} 
                                            alt={role.title_romaji} 
                                            className={styles.roleImage} 
                                        />
                                        <div className={styles.roleDetails}>
                                            <p className={styles.roleMainText}>{role.title_romaji}</p>
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