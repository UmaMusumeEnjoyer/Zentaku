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
  let processedVideoUrl = logic.room?.currentSourceUrl || '';
  let processedSubUrl = logic.room?.settings?.subUrl || null;
  
  const currentHost = window.location.hostname;
  if (processedVideoUrl && processedVideoUrl.includes(':3636')) {
    processedVideoUrl = processedVideoUrl.substring(processedVideoUrl.indexOf('/movies'));
  } else if (processedVideoUrl && processedVideoUrl.includes('localhost')) {
    processedVideoUrl = processedVideoUrl.replace('localhost', currentHost).replace('127.0.0.1', currentHost);
  }
  
  if (processedSubUrl && processedSubUrl.includes(':3636')) {
    processedSubUrl = processedSubUrl.substring(processedSubUrl.indexOf('/movies'));
  } else if (processedSubUrl && processedSubUrl.includes('localhost')) {
    processedSubUrl = processedSubUrl.replace('localhost', currentHost).replace('127.0.0.1', currentHost);
  }

  const streamData = processedVideoUrl ? {
    videoUrl: processedVideoUrl,
    subUrl: processedSubUrl,
    referer: logic.room?.settings?.referer || 'https://megacloud.blog/',
    requiresProxy: !processedVideoUrl.includes('localhost') && !processedVideoUrl.includes('filmserver') && !processedVideoUrl.startsWith('/movies')
  } : null;

  return {
    ...logic,
    streamData
  };
};