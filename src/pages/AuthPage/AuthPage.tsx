// src/pages/Auth/AuthPage.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuthPage } from '@umamusumeenjoyer/shared-logic';
import { useAuth } from '../../context/AuthContext';

import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation(['Auth']);
  const initialPath = location.pathname === '/signup' ? 'signup' : 'login';

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  const loginCallback = async (email: string, password: string) => {
    return await login({ email, password });
  };

  const {
    isActive,
    isLoading,
    registerData,
    loginData,
    loginErrors,
    registerErrors,
    handleRegisterChange,
    handleLoginChange,
    handleRegisterSubmit,
    handleLoginSubmit,
    handleRegisterClick,
    handleLoginClick,
    handleLoginBlur,
    handleRegisterBlur,
  } = useAuthPage(
    {
      onLoginSuccess: (message) => {
        toast.success(t(message));
        navigate('/'); 
      },
      onLoginError: (message) => toast.error(t(message)),
      onRegisterSuccess: (message) => toast.success(t(message)),
      onRegisterError: (message) => toast.error(t(message)),
      onVerifySuccess: (message) => toast.success(t(message)),
      onVerifyError: (message) => toast.error(t(message)),
      onNavigateToSignup: () => navigate('/signup'),
      onNavigateToLogin: () => navigate('/login'),
      loginCallback,
    },
    initialPath
  );

  return (
    <div className={styles.authPageWrapper}>
      
      <div className={`${styles.container} ${isActive ? styles.active : ''}`} id="container">
        
        {/* --- FORM ĐĂNG KÝ (SIGN UP) --- */}
        <div className={`${styles.formContainer} ${styles.signUp}`}>
          <form onSubmit={handleRegisterSubmit}>
            <h1>{t('Auth:signup.title')}</h1>
            
            {/* Email */}
            <div className={styles.inputGroup}>
              <input 
                name="email" 
                type="email" 
                placeholder={t('Auth:placeholders.email')} 
                value={registerData.email} 
                onChange={handleRegisterChange}
                onBlur={handleRegisterBlur}
                className={registerErrors.email ? styles.inputError : ''}
                required 
              />
              {registerErrors.email && (
                <span className={styles.errorText}>{t(registerErrors.email)}</span>
              )}
            </div>

            {/* Username */}
            <div className={styles.inputGroup}>
              <input 
                name="username" 
                type="text" 
                placeholder={t('Auth:placeholders.username')} 
                value={registerData.username} 
                onChange={handleRegisterChange}
                onBlur={handleRegisterBlur}
                className={registerErrors.username ? styles.inputError : ''}
                required 
              />
              {registerErrors.username && (
                <span className={styles.errorText}>{t(registerErrors.username)}</span>
              )}
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <div className={styles.passwordInputWrapper}>
                <input 
                  name="password" 
                  type={showRegisterPassword ? "text" : "password"} 
                  placeholder={t('Auth:placeholders.password')} 
                  value={registerData.password} 
                  onChange={handleRegisterChange}
                  onBlur={handleRegisterBlur}
                  className={registerErrors.password ? styles.inputError : ''}
                  required 
                />
                <button
                  type="button"
                  className={styles.passwordToggleIcon}
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                >
                  {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              <div className={styles.passwordStrengthContainer}>
                <div className={`${styles.strengthPill} ${/[A-Z]/.test(registerData.password) ? styles.active : ''}`}>A</div>
                <div className={`${styles.strengthPill} ${/[a-z]/.test(registerData.password) ? styles.active : ''}`}>a</div>
                <div className={`${styles.strengthPill} ${/[0-9]/.test(registerData.password) ? styles.active : ''}`}>1</div>
                <div className={`${styles.strengthPill} ${/[^A-Za-z0-9]/.test(registerData.password) ? styles.active : ''}`}>*</div>
                <div className={`${styles.strengthPill} ${registerData.password.length >= 8 ? styles.active : ''}`}>8+</div>
              </div>

              {registerErrors.password && (
                <span className={styles.errorText}>{t(registerErrors.password)}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.inputGroup}>
              <div className={styles.passwordInputWrapper}>
                <input 
                  name="confirm_password" 
                  type={showRegisterConfirmPassword ? "text" : "password"} 
                  placeholder={t('Auth:placeholders.confirm_password')} 
                  value={registerData.confirm_password} 
                  onChange={handleRegisterChange}
                  onBlur={handleRegisterBlur}
                  className={registerErrors.confirm_password ? styles.inputError : ''}
                  required 
                />
                <button
                  type="button"
                  className={styles.passwordToggleIcon}
                  onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                >
                  {showRegisterConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {registerErrors.confirm_password && (
                <span className={styles.errorText}>{t(registerErrors.confirm_password)}</span>
              )}
            </div>
            
            <div className={styles.terms}>
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">{t('Auth:signup.terms')}</label>
            </div>
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : t('Auth:signup.submit')}
            </button>
          </form>
        </div>

        {/* --- FORM ĐĂNG NHẬP (SIGN IN) --- */}
        <div className={`${styles.formContainer} ${styles.signIn}`}>
          <form onSubmit={handleLoginSubmit}>
            <h1>{t('Auth:signin.title')}</h1>
            

            
            <span>{t('Auth:signin.divider')}</span>
            
            {/* Email */}
            <div className={styles.inputGroup}>
              <input 
                name="email" 
                type="email" 
                placeholder={t('Auth:placeholders.email')} 
                value={loginData.email} 
                onChange={handleLoginChange}
                onBlur={handleLoginBlur}
                className={loginErrors.email ? styles.inputError : ''}
                required 
              />
              {loginErrors.email && (
                <span className={styles.errorText}>{t(loginErrors.email)}</span>
              )}
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <div className={styles.passwordInputWrapper}>
                <input 
                  name="password" 
                  type={showLoginPassword ? "text" : "password"} 
                  placeholder={t('Auth:placeholders.password')} 
                  value={loginData.password} 
                  onChange={handleLoginChange}
                  onBlur={handleLoginBlur}
                  className={loginErrors.password ? styles.inputError : ''}
                  required 
                />
                <button
                  type="button"
                  className={styles.passwordToggleIcon}
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {loginErrors.password && (
                <span className={styles.errorText}>{t(loginErrors.password)}</span>
              )}
            </div>
            
            <a href="#">{t('Auth:signin.forgot_password')}</a>
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : t('Auth:signin.submit')}
            </button>
          </form>
        </div>

        {/* --- OVERLAY ANIMATION --- */}
        <div className={styles.toggleContainer}>
           {/* ... (Phần toggle giữ nguyên) ... */}
          <div className={styles.toggle}>
            <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
              <h1>{t('Auth:toggle.welcome_back')}</h1>
              <button className={styles.hidden} onClick={handleLoginClick} disabled={isLoading}>
                {t('Auth:toggle.to_signin')}
              </button>
            </div>
            
            <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
              <h1>{t('Auth:toggle.hello_friend')}</h1>
              <button className={styles.hidden} onClick={handleRegisterClick} disabled={isLoading}>
                {t('Auth:toggle.to_signup')}
              </button>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default AuthPage;