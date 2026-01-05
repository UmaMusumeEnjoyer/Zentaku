import React from 'react';
import AnimeListCard from './AnimeListCard';
import { type TopListsSectionProps } from '@umamusumeenjoyer/shared-logic';
import { useTopListsSection } from '@umamusumeenjoyer/shared-logic';
import '../AnimeListSearchPage.css';

const TopListsSection: React.FC<TopListsSectionProps> = ({ title, lists }) => {
  const { hasLists } = useTopListsSection(lists);

  if (!hasLists) {
    return null; // Hoặc render message "No lists available"
  }

  return (
    <section className="top-lists-section container">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>
      
      <div className="lists-grid">
        {lists.map((list) => (
          <AnimeListCard key={list.list_id} listData={list} />
        ))}
      </div>
    </section>
  );
};

export default TopListsSection;