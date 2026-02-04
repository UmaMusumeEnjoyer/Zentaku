import React from 'react';
import type { AnimeInfo } from '../WatchPage.types';

interface SidebarProps {
  data: AnimeInfo;
}

export const Sidebar: React.FC<SidebarProps> = ({ data }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-card">
        {/* Poster Image */}
        <div className="poster-wrapper">
          <img 
            src={data.posterUrl} 
            alt={data.title} 
            className="poster-img"
          />
          <div className="badge-container">
            <span className="badge hd">HD</span>
            <span className="badge ep">EP 3</span>
          </div>
        </div>

        {/* Title & Rating */}
        <div className="info-header">
          <h2 className="anime-title">{data.title}</h2>
          <div style={{ color: '#facc15', fontSize: '0.875rem', display: 'flex', gap: '2px' }}>
             {/* Giả lập rating stars */}
             <span>★</span><span>★</span><span>★</span><span>★</span><span style={{color: '#6b7280'}}>★</span>
             <span style={{color: '#9ca3af', marginLeft: '4px'}}>({data.rating}/10)</span>
          </div>
        </div>

        {/* Tags */}
        <div className="tags">
          {data.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>

        {/* Synopsis */}
        <div className="synopsis">
            <h3 style={{textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.25rem'}}>Synopsis</h3>
            <p>{data.synopsis}</p>
        </div>

        {/* Actions */}
        <div className="actions">
          <button className="action-btn btn-add">
             <span>+</span> Add to List
          </button>
          <button className="action-btn btn-more">
             View More Info <span>→</span>
          </button>
        </div>
      </div>
    </aside>
  );
};