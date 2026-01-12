import React from 'react';
import { useTranslation } from 'react-i18next'; // Import hook
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
  const { t } = useTranslation(['sidebar']); // Khởi tạo hook dịch
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
          <h3 className="sidebar-title">{t('sidebar.members')}</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
            {t('sidebar.loading')}
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
          <h3 className="sidebar-title">{t('sidebar.owner')}</h3>
          <UserItem 
            user={owner} 
            roleIcon="verified_user" 
            iconTitle={t('sidebar.ownerRole')} 
            canRemove={false}
            isCurrentUser={owner.username === currentUsername}
          />
        </div>
      )}

      {/* 2. EDITORS SECTION */}
      <div className="sidebar-section">
        <div className="sidebar-header">
          {/* Sử dụng interpolation để hiển thị số lượng */}
          <h3 className="sidebar-title">
            {t('sidebar.editorsHeader', { count: editors.length })}
          </h3>
          {isCurrentUserOwner && (
            <button className="add-btn" onClick={onAddEditor} title={t('sidebar.inviteEditor')}>
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
                iconTitle={t('sidebar.editorRole')}
                canRemove={isCurrentUserOwner} 
                onRemove={onRemoveMember}
                isCurrentUser={editor.username === currentUsername}
              />
            ))
          ) : (
            <p className="empty-text">{t('sidebar.noEditors')}</p>
          )}
        </div>
      </div>

      {/* 3. VIEWERS SECTION */}
      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3 className="sidebar-title">
            {t('sidebar.viewersHeader', { count: viewers.length })}
          </h3>
          {isCurrentUserOwner && (
            <button className="add-btn" onClick={onAddViewer} title={t('sidebar.inviteViewer')}>
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
                iconTitle={t('sidebar.viewerRole')}
                canRemove={isCurrentUserOwner}
                onRemove={onRemoveMember}
                isCurrentUser={viewer.username === currentUsername}
              />
            ))
          ) : (
            <p className="empty-text">{t('sidebar.noViewers')}</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;