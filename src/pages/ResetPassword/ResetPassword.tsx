import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '@umamusumeenjoyer/shared-logic';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['Auth']);
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      toast.error(t('Auth:validation.confirm_password_mismatch'));
      return;
    }

    if (password.length < 8) {
      toast.error(t('Auth:validation.password_min_length'));
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token, password);
      toast.success(t('Auth:resetPassword.success'));
      navigate('/login');
    } catch (error: any) {
      toast.error(t('Auth:resetPassword.error') || error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <h1>{t('Auth:resetPassword.title')}</h1>
            <p className={styles.description}>{t('Auth:resetPassword.description')}</p>

            <div className={styles.inputGroup}>
              <div className={styles.passwordInputWrapper}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('Auth:placeholders.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggleIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.passwordInputWrapper}>
                <input
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('Auth:placeholders.confirm_password')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggleIcon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading || !password || !confirmPassword}>
              {isLoading ? '...' : t('Auth:resetPassword.submit')}
            </button>

            <a href="#" className={styles.backLink} onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              {t('Auth:resetPassword.back_to_login')}
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
