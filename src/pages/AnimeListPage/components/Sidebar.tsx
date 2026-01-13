import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@umamusumeenjoyer/shared-logic';
import type { SidebarProps } from '@umamusumeenjoyer/shared-logic';
import UserItem from './UserItem';

// Import CSS Module
import styles from './Sidebar.module.css';

const Sidebar: React.FC<SidebarProps> = ({ 
  members = [], 
  onAddEditor, 
  onAddViewer, 
  onRemoveMember 
}) => {
  const { t } = useTranslation(['sidebar']);
  const {
    currentUsername,
    isCurrentUserOwner,
    categorizedMembers,
    hasMembers,
  } = useSidebar(members);

  if (!hasMembers) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <h3 className={styles.sidebarTitle}>{t('sidebar.members')}</h3>
          {/* Đã chuyển inline style sang class CSS Module */}
          <p className={styles.loadingText}>
            {t('sidebar.loading')}
          </p>
        </div>
      </aside>
    );
  }

  const { owner, editors, viewers } = categorizedMembers;

  return (
    <aside className={styles.sidebar}>
      {/* 1. OWNER SECTION */}
      {owner && (
        <div className={styles.sidebarSection}>
          <h3 className={styles.sidebarTitle}>{t('sidebar.owner')}</h3>
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
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarTitle}>
            {t('sidebar.editorsHeader', { count: editors.length })}
          </h3>
          {isCurrentUserOwner && (
            <button className={styles.addBtn} onClick={onAddEditor} title={t('sidebar.inviteEditor')}>
              <span className="material-symbols-outlined">add</span>
            </button>
          )}
        </div>
        <div className={styles.userList}>
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
            <p className={styles.emptyText}>{t('sidebar.noEditors')}</p>
          )}
        </div>
      </div>

      {/* 3. VIEWERS SECTION */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarTitle}>
            {t('sidebar.viewersHeader', { count: viewers.length })}
          </h3>
          {isCurrentUserOwner && (
            <button className={styles.addBtn} onClick={onAddViewer} title={t('sidebar.inviteViewer')}>
              <span className="material-symbols-outlined">add</span>
            </button>
          )}
        </div>
        <div className={styles.userList}>
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
            <p className={styles.emptyText}>{t('sidebar.noViewers')}</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;