// src/pages/VerifyEmailPage/VerifyEmailPage.tsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '@umamusumeenjoyer/shared-logic';
import styles from './VerifyEmailPage.module.css';

// Cache the promise so React 18 StrictMode double-mounts don't fire two requests
// and both mounts can await the exact same result.
const verifyPromiseCache = new Map<string, Promise<any>>();

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
  const [message, setMessage] = useState<string>('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setStatus('ERROR');
      setMessage('No verification token provided. Please check your email link.');
      return;
    }

    if (!verifyPromiseCache.has(token)) {
      verifyPromiseCache.set(token, authService.verifyEmail(token));
    }

    let isSubscribed = true;

    verifyPromiseCache.get(token)!
      .then((response) => {
        if (isSubscribed) {
          setStatus('SUCCESS');
          setMessage(response.data?.message || 'Email verified successfully!');
        }
      })
      .catch((error: any) => {
        if (isSubscribed) {
          setStatus('ERROR');
          const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Verification failed. The link might be invalid or expired.';
          setMessage(errorMsg);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [token]);

  const handleNavigateLogin = () => {
    navigate('/login');
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        
        {status === 'LOADING' && (
          <>
            <div className={styles.iconContainer}>
              <span className={`material-symbols-outlined ${styles.iconLoading}`}>sync</span>
            </div>
            <h1 className={styles.title}>Verifying Email</h1>
            <p className={styles.message}>{message}</p>
          </>
        )}

        {status === 'SUCCESS' && (
          <>
            <div className={styles.iconContainer}>
              <span className={`material-symbols-outlined ${styles.iconSuccess}`}>check_circle</span>
            </div>
            <h1 className={styles.title}>Verification Complete</h1>
            <p className={styles.message}>{message}</p>
            <button className={styles.button} onClick={handleNavigateLogin}>
              Log in now
            </button>
          </>
        )}

        {status === 'ERROR' && (
          <>
            <div className={styles.iconContainer}>
              <span className={`material-symbols-outlined ${styles.iconError}`}>error</span>
            </div>
            <h1 className={styles.title}>Verification Failed</h1>
            <p className={styles.message}>{message}</p>
            <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleNavigateHome}>
              Go to Homepage
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmailPage;
