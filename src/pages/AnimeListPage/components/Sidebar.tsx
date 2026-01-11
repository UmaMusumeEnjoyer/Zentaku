import React from 'react';
import { useSidebar } from '@umamusumeenjoyer/shared-logic';
import type { SidebarProps } from '@umamusumeenjoyer/shared-logic';
import UserItem from './UserItem';
import './Sidebar.css';

const Sidebar: React.FC<SidebarProps> = ({ 
  members = [], 
  onAddEditor, 
  onAddViewer, 
  onRemoveMember 
}) => {
  const {
    currentUsername,
    isCurrentUserOwner,
    categorizedMembers,
    hasMembers,
  } = useSidebar(members);

  if (!hasMembers) {
    return (
      <aside className="sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Members</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Loading members...
          </p>
        </div>
      </aside>
    );
  }

  const { owner, editors, viewers } = categorizedMembers;

  return (
    <aside className="sidebar">
      {/* 1. OWNER SECTION */}
      {owner && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">Owner</h3>
          <UserItem 
            user={owner} 
            roleIcon="verified_user" 
            iconTitle="List Owner" 
            canRemove={false}
            isCurrentUser={owner.username === currentUsername}
          />
        </div>
      )}

      {/* 2. EDITORS SECTION */}
      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Editors ({editors.length})</h3>
          {isCurrentUserOwner && (
            <button className="add-btn" onClick={onAddEditor} title="Invite new Editor">
              <span className="material-symbols-outlined">add</span>
            </button>
          )}
        </div>
        <div className="user-list">
          {editors.length > 0 ? (
            editors.map((editor) => (
              <UserItem 
                key={editor.user_id || editor.username} 
                user={editor} 
                roleIcon="edit" 
                iconTitle="Can edit content"
                canRemove={isCurrentUserOwner} 
                onRemove={onRemoveMember}
                isCurrentUser={editor.username === currentUsername}
              />
            ))
          ) : (
            <p className="empty-text">No editors yet.</p>
          )}
        </div>
      </div>

      {/* 3. VIEWERS SECTION */}
      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Viewers ({viewers.length})</h3>
          {isCurrentUserOwner && (
            <button className="add-btn" onClick={onAddViewer} title="Invite new Viewer">
              <span className="material-symbols-outlined">add</span>
            </button>
          )}
        </div>
        <div className="user-list">
          {viewers.length > 0 ? (
            viewers.map((viewer) => (
              <UserItem 
                key={viewer.user_id || viewer.username} 
                user={viewer} 
                roleIcon="visibility" 
                iconTitle="Can view only"
                canRemove={isCurrentUserOwner}
                onRemove={onRemoveMember}
                isCurrentUser={viewer.username === currentUsername}
              />
            ))
          ) : (
            <p className="empty-text">No viewers yet.</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;