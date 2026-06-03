// src/pages/Auth/AuthPage.tsx
import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuthPage } from '@umamusumeenjoyer/shared-logic';
import { useAuth } from '../../context/AuthContext';

import { useTranslation } from 'react-i18next';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const { t } = useTranslation(['Auth']);

  const initialPath = location.pathname === '/signup' ? 'signup' : 'login';
  const verificationToken = searchParams.get('token');

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
        toast.success(message);
        navigate('/'); 
      },
      onLoginError: (message) => toast.error(message),
      onRegisterSuccess: (message) => toast.success(message),
      onRegisterError: (message) => toast.error(message),
      onVerifySuccess: (message) => toast.success(message),
      onVerifyError: (message) => toast.error(message),
      onNavigateToSignup: () => navigate('/signup'),
      onNavigateToLogin: () => navigate('/login'),
      loginCallback,
    },
    initialPath,
    verificationToken
  );

  return (
    <div className={styles.authPageWrapper}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
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
              <input 
                name="password" 
                type="password" 
                placeholder={t('Auth:placeholders.password')} 
                value={registerData.password} 
                onChange={handleRegisterChange}
                onBlur={handleRegisterBlur}
                className={registerErrors.password ? styles.inputError : ''}
                required 
              />
              {registerErrors.password && (
                <span className={styles.errorText}>{t(registerErrors.password)}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.inputGroup}>
              <input 
                name="confirm_password" 
                type="password" 
                placeholder={t('Auth:placeholders.confirm_password')} 
                value={registerData.confirm_password} 
                onChange={handleRegisterChange}
                onBlur={handleRegisterBlur}
                className={registerErrors.confirm_password ? styles.inputError : ''}
                required 
              />
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
            
            <div className={styles.socialIcons}>
              {/* ... (Icons giữ nguyên) ... */}
              <a href="#" className="icon"><FontAwesomeIcon icon={faGooglePlusG} /></a>
              <a href="#" className="icon"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" className="icon"><FontAwesomeIcon icon={faGithub} /></a>
              <a href="#" className="icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
            </div>
            
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
              <input 
                name="password" 
                type="password" 
                placeholder={t('Auth:placeholders.password')} 
                value={loginData.password} 
                onChange={handleLoginChange}
                onBlur={handleLoginBlur}
                className={loginErrors.password ? styles.inputError : ''}
                required 
              />
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