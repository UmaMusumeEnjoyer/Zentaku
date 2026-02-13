import React from 'react';
import styles from './NovelReader.module.css';
// Giả định component Skeleton cơ bản
import Skeleton from '../../components/PlaceholderSkeleton/Skeleton'; 

const LightNovelReaderSkeleton: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Left Sidebar Skeleton */}
      <aside className={styles.leftSidebar} style={{marginLeft: 0}}>
        <div className={styles.sidebarContent}>
           <div style={{display: 'flex', justifyContent: 'flex-end'}}>
             <Skeleton width={24} height={24} borderRadius={4} />
           </div>
           {/* Cover Image Skeleton */}
           <Skeleton width="100%" height={300} borderRadius={8} style={{marginBottom: '1rem'}} />
           
           {/* Title & Meta Skeleton */}
           <Skeleton width="80%" height={24} style={{margin: '0 auto 1rem auto'}} />
           <div className={styles.metaList}>
             <Skeleton width="60%" height={16} />
             <Skeleton width="40%" height={16} />
             <Skeleton width="50%" height={16} />
           </div>
           
           {/* Synopsis Skeleton */}
           <div style={{marginTop: '2rem'}}>
             <Skeleton width="100%" height={14} style={{marginBottom: 8}} />
             <Skeleton width="100%" height={14} style={{marginBottom: 8}} />
             <Skeleton width="90%" height={14} style={{marginBottom: 8}} />
           </div>
        </div>
      </aside>

      {/* Main Reader Skeleton */}
      <main className={styles.readerArea}>
        <div className={styles.contentWrapper}>
           {/* Header Skeleton */}
           <header className={styles.chapterHeader}>
             <Skeleton width={80} height={20} style={{margin: '0 auto 8px auto'}} />
             <Skeleton width={300} height={32} style={{margin: '0 auto 16px auto'}} />
             
             <div className={styles.metaInfo} style={{gap: '2rem'}}>
                <Skeleton width={100} height={16} />
                <Skeleton width={100} height={16} />
                <Skeleton width={100} height={16} />
             </div>
           </header>

           {/* Paragraph Skeletons */}
           <article>
             {Array.from({ length: 8 }).map((_, index) => (
               <div key={index} style={{marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                 <Skeleton width="100%" height={18} />
                 <Skeleton width={index % 2 === 0 ? "90%" : "95%"} height={18} />
                 {index % 3 === 0 && <Skeleton width="60%" height={18} />}
               </div>
             ))}
           </article>
        </div>
      </main>

      {/* Right Sidebar Skeleton */}
      <aside className={`${styles.rightSidebar} ${styles.expanded}`}>
         <div style={{width: '100%', padding: '0 10px'}}>
            <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '20px'}}>
              <Skeleton width={24} height={24} borderRadius={4} />
            </div>

            {/* Nav Controls */}
            <div className={styles.settingGroup}>
               <Skeleton width={80} height={16} style={{marginBottom: 10}} />
               <div style={{display: 'flex', gap: '10px'}}>
                  <Skeleton width="100%" height={36} borderRadius={4} />
                  <Skeleton width="100%" height={36} borderRadius={4} />
               </div>
            </div>

             {/* Font & Theme Controls */}
            <div className={styles.settingGroup}>
               <Skeleton width={100} height={16} style={{marginBottom: 10}} />
               <Skeleton width="100%" height={32} style={{marginBottom: 10}} borderRadius={4} />
               <div className={styles.themeGrid}>
                  <Skeleton width="100%" height={32} borderRadius={4} />
                  <Skeleton width="100%" height={32} borderRadius={4} />
                  <Skeleton width="100%" height={32} borderRadius={4} />
               </div>
            </div>
         </div>
      </aside>
    </div>
  );
};

export default LightNovelReaderSkeleton;