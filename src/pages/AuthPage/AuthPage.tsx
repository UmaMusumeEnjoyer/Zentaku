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
// 1. Xóa import useTheme vì không cần thiết nữa
// import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  // const { theme } = useTheme(); -> Đã xóa

  const { t } = useTranslation(['Auth']);

  const initialPath = location.pathname === '/signup' ? 'signup' : 'login';
  const verificationToken = searchParams.get('token');

  const loginCallback = async (email: string, password: string) => {
    return await login({ email, password });
  };

  const {
    isActive,
    registerData,
    loginData,
    handleRegisterChange,
    handleLoginChange,
    handleRegisterSubmit,
    handleLoginSubmit,
    handleRegisterClick,
    handleLoginClick
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
    // 2. Xóa prop data-theme, CSS biến tự xử lý
    <div className={styles.authPageWrapper}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      <div className={`${styles.container} ${isActive ? styles.active : ''}`} id="container">
        
        {/* --- FORM ĐĂNG KÝ (SIGN UP) --- */}
        <div className={`${styles.formContainer} ${styles.signUp}`}>
          <form onSubmit={handleRegisterSubmit}>
            <h1>{t('Auth:signup.title')}</h1>
            
            <input 
              name="email" 
              type="email" 
              placeholder={t('Auth:placeholders.email')} 
              value={registerData.email} 
              onChange={handleRegisterChange} 
              required 
            />
            <input 
              name="username" 
              type="text" 
              placeholder={t('Auth:placeholders.username')} 
              value={registerData.username} 
              onChange={handleRegisterChange} 
              required 
            />
            <input 
              name="password" 
              type="password" 
              placeholder={t('Auth:placeholders.password')} 
              value={registerData.password} 
              onChange={handleRegisterChange} 
              required 
            />
            <input 
              name="confirm_password" 
              type="password" 
              placeholder={t('Auth:placeholders.confirm_password')} 
              value={registerData.confirm_password} 
              onChange={handleRegisterChange} 
              required 
            />
            
            <div className={styles.terms}>
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">{t('Auth:signup.terms')}</label>
            </div>
            
            <button type="submit">{t('Auth:signup.submit')}</button>
          </form>
        </div>

        {/* --- FORM ĐĂNG NHẬP (SIGN IN) --- */}
        <div className={`${styles.formContainer} ${styles.signIn}`}>
          <form onSubmit={handleLoginSubmit}>
            <h1>{t('Auth:signin.title')}</h1>
            
            <div className={styles.socialIcons}>
              <a href="#" className="icon"><FontAwesomeIcon icon={faGooglePlusG} /></a>
              <a href="#" className="icon"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" className="icon"><FontAwesomeIcon icon={faGithub} /></a>
              <a href="#" className="icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
            </div>
            
            <span>{t('Auth:signin.divider')}</span>
            
            <input 
              name="email" 
              type="email" 
              placeholder={t('Auth:placeholders.email')} 
              value={loginData.email} 
              onChange={handleLoginChange} 
              required 
            />
            <input 
              name="password" 
              type="password" 
              placeholder={t('Auth:placeholders.password')} 
              value={loginData.password} 
              onChange={handleLoginChange} 
              required 
            />
            
            <a href="#">{t('Auth:signin.forgot_password')}</a>
            <button type="submit">{t('Auth:signin.submit')}</button>
          </form>
        </div>

        {/* --- OVERLAY ANIMATION --- */}
        <div className={styles.toggleContainer}>
          <div className={styles.toggle}>
            
            {/* Panel Trái: Về Login */}
            <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
              <h1>{t('Auth:toggle.welcome_back')}</h1>
              <button className={styles.hidden} onClick={handleLoginClick}>
                {t('Auth:toggle.to_signin')}
              </button>
            </div>
            
            {/* Panel Phải: Qua Register */}
            <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
              <h1>{t('Auth:toggle.hello_friend')}</h1>
              <button className={styles.hidden} onClick={handleRegisterClick}>
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