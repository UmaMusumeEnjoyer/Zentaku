import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['NotFound']);


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
        <div className={styles.centerNumber}>{t('NotFound:title')}</div>

        {/* Name Tag */}
        <div className={styles.nameTag}>
          {t('NotFound:nameTag')}
        </div>

        {/* Dialogue Box */}
        <div className={styles.dialogueBox}>
          <div className={styles.dialogueText}>
            <div className={styles.dialogueLine}>
              {t('NotFound:dialogue.user')}
            </div>
            <div className={styles.dialogueLine}>
              {t('NotFound:dialogue.chan')}
            </div>
          </div>

          <div className={styles.choicesContainer}>

            <button className={styles.choiceBtn} onClick={handleGoHome}>
              {t('NotFound:buttons.goHome')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
