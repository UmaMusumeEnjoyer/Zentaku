import { useParams, useNavigate } from 'react-router-dom';
import { useWatchAlongLogic } from '@umamusumeenjoyer/shared-logic';
import { useAuth } from '../../context/AuthContext';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useWatchAlong = () => {
  const { roomId } = useParams<{ roomId: string }>();
  // Assuming current user ID is accessible somehow, but we'll use useWatchAlongLogic's auth context which we updated to take currentUserId.
  // Actually, wait, useWatchAlongLogic takes currentUserId. Let's get user from useAuth in pbl5_webFE.
  // Wait, I updated useWatchAlongLogic to take currentUserId, but from where? From pbl5_webFE's useAuth.

  const { user } = useAuth();
  const navigate = useNavigate();
  
  const currentUserId = user?.id?.toString() || null;

  const handleKicked = useCallback(() => {
    toast.error('Bạn đã bị kick khỏi phòng xem chung này.', {
      position: 'top-right',
      autoClose: 5000,
    });
    navigate('/');
  }, [navigate]);

  const logic = useWatchAlongLogic(roomId || '', currentUserId, handleKicked);

  // We need streamData for the VideoPlayer.
  // For now, we will construct it from room's currentSourceUrl.
  let videoUrl = logic.room?.currentSourceUrl || '';
  let subUrl = logic.room?.settings?.subUrl || null;

  const currentHost = window.location.hostname;
  const filmPort = import.meta.env.VITE_FILM_SERVER_PORT || '3636';
  if (videoUrl && videoUrl.includes(`:${filmPort}`)) {
    videoUrl = videoUrl.substring(videoUrl.indexOf('/movies'));
  } else if (videoUrl && videoUrl.includes('localhost')) {
    videoUrl = videoUrl.replace('localhost', currentHost).replace('127.0.0.1', currentHost);
  }
  
  if (subUrl && subUrl.includes(`:${filmPort}`)) {
    subUrl = subUrl.substring(subUrl.indexOf('/movies'));
  } else if (subUrl && subUrl.includes('localhost')) {
    subUrl = subUrl.replace('localhost', currentHost).replace('127.0.0.1', currentHost);
  }

  const streamData = videoUrl ? {
    videoUrl,
    subUrl,
    referer: logic.room?.settings?.referer || 'https://megacloud.blog/',
    requiresProxy: !videoUrl.includes('localhost') && !videoUrl.includes('filmserver') && !videoUrl.startsWith('/movies')
  } : null;

  return {
    ...logic,
    streamData
  };
};