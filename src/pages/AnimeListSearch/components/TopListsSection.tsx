import React from 'react';
import AnimeListCard from './AnimeListCard';
import { type TopListsSectionProps } from '@umamusumeenjoyer/shared-logic';
import { useTopListsSection } from '@umamusumeenjoyer/shared-logic';
// [CHANGE] Import styles
import styles from '../AnimeListSearchPage.module.css';

const TopListsSection: React.FC<TopListsSectionProps> = ({ title, lists }) => {
  const { hasLists } = useTopListsSection(lists);

  if (!hasLists) {
    return null;
  }

  return (
    <section className={`${styles.topListsSection} ${styles.container}`}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      
      <div className={styles.listsGrid}>
        {lists.map((list) => (
          <AnimeListCard key={list.id} listData={list} />
        ))}
      </div>
    </section>
  );
};

export default TopListsSection;