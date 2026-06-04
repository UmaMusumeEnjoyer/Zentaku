import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.wrapper}>


      <div className={styles.vnContainer}>
        {/* Background Image downloaded to public/assets */}
        <img 
          src="/assets/nguyenkingform.jpg" 
          alt="Visual Novel Background" 
          className={styles.backgroundImage} 
        />

        {/* 404 Text */}
        <div className={styles.centerNumber}>404</div>

        {/* Name Tag */}
        <div className={styles.nameTag}>
          404 Page Not Found-Chan
        </div>

        {/* Dialogue Box */}
        <div className={styles.dialogueBox}>
          <div className={styles.dialogueText}>
            <div className={styles.dialogueLine}>
              You: Oh, hi 404-chan, have you seen my page?
            </div>
            <div className={styles.dialogueLine}>
              404-Chan: 404-chan? Calling me by my first name... I... I didn't realise we were so close user-kun...
            </div>
          </div>

          <div className={styles.choicesContainer}>

            <button className={styles.choiceBtn} onClick={handleGoHome}>
              Leave, and go home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
