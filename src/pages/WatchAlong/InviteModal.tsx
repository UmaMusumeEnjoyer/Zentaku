import React, { useState, useEffect, useMemo } from 'react';
import { userService } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import styles from './InviteModal.module.css';

interface InviteUser {
  id: string | number;
  username: string;
  displayName?: string | null;
  avatar?: string | null;
}

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string | number;
  roomParticipantIds: string[];
  onInvite: (targetUserId: string | number) => Promise<void>;
}

const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  roomParticipantIds,
  onInvite,
}) => {
  const { t } = useTranslation(['WatchAlong']);
  const [followingList, setFollowingList] = useState<InviteUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedSet, setInvitedSet] = useState<Set<string>>(new Set());
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Fetch following list when modal opens
  useEffect(() => {
    if (!isOpen || !currentUserId) return;

    let cancelled = false;
    const fetchFollowing = async () => {
      setIsLoadingList(true);
      try {
        const response = await userService.getUserFollowing(currentUserId, 1, 100);
        if (!cancelled) {
          // response.data can be { data: User[], pagination } or direct array
          const users = response?.data?.data || response?.data || [];
          setFollowingList(
            users.map((u: any) => ({
              id: u.id?.toString() || u.userId?.toString(),
              username: u.username || '',
              displayName: u.displayName || u.display_name || null,
              avatar: u.avatar || null,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to fetch following list:', err);
        if (!cancelled) setFollowingList([]);
      } finally {
        if (!cancelled) setIsLoadingList(false);
      }
    };

    fetchFollowing();
    return () => { cancelled = true; };
  }, [isOpen, currentUserId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setInvitedSet(new Set());
      setInvitingId(null);
    }
  }, [isOpen]);

  // Filter list by search query (local)
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return followingList;
    const q = searchQuery.toLowerCase();
    return followingList.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        (u.displayName && u.displayName.toLowerCase().includes(q))
    );
  }, [followingList, searchQuery]);

  const handleInvite = async (userId: string | number) => {
    const id = userId.toString();
    setInvitingId(id);
    try {
      await onInvite(userId);
      setInvitedSet((prev) => new Set(prev).add(id));
    } catch (err) {
      console.error('Failed to invite user:', err);
    } finally {
      setInvitingId(null);
    }
  };

  if (!isOpen) return null;

  const participantSet = new Set(roomParticipantIds.map(String));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h3>
            <span className={`material-symbols-outlined ${styles.headerIcon}`}>group_add</span>
            {t('inviteModal.title', 'Mời bạn bè xem cùng')}
          </h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Search */}
        <div className={styles.searchWrapper}>
          <div className={styles.searchContainer}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder={t('inviteModal.searchPlaceholder', 'Tìm kiếm bạn bè...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* User List */}
        <div className={styles.userList}>
          {isLoadingList ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
            </div>
          ) : filteredList.length === 0 ? (
            <div className={styles.emptyState}>
              <span className="material-symbols-outlined">person_search</span>
              <p>
                {searchQuery
                  ? t('inviteModal.noResults', 'Không tìm thấy người dùng')
                  : t('inviteModal.noFollowing', 'Bạn chưa follow ai')}
              </p>
            </div>
          ) : (
            filteredList.map((user) => {
              const uid = user.id.toString();
              const isInRoom = participantSet.has(uid);
              const isInvited = invitedSet.has(uid);
              const isInviting = invitingId === uid;

              return (
                <div key={uid} className={styles.userItem}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className={styles.userAvatar} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {(user.displayName || user.username).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>
                      {user.displayName || user.username}
                    </div>
                    <div className={styles.userUsername}>@{user.username}</div>
                  </div>
                  {isInRoom ? (
                    <span className={styles.inRoomLabel}>
                      {t('inviteModal.inRoom', 'Đang trong phòng')}
                    </span>
                  ) : isInvited ? (
                    <button className={styles.inviteBtn} disabled>
                      {t('inviteModal.invited', 'Đã mời')}
                    </button>
                  ) : (
                    <button
                      className={`${styles.inviteBtn} ${isInviting ? styles.invitingBtn : ''}`}
                      onClick={() => handleInvite(user.id)}
                      disabled={isInviting}
                    >
                      {isInviting
                        ? t('inviteModal.inviting', 'Đang mời...')
                        : t('inviteModal.invite', 'Mời')}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
