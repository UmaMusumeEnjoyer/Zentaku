// src/components/MainContent/Characters_section/CharacterCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Character } from '@umamusumeenjoyer/shared-logic';
// 1. Import CSS Module
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const voiceActor = character.voice_actors?.[0];

  return (
    // 2. Sử dụng class từ module
    <div className={styles.characterCard}>
      {/* Link Character */}
      <Link to={`/character/${character.id}`} className={styles.cardLink}>
        <div className={styles.personInfo}>
          <img 
            src={character.image} 
            alt={character.name_full} 
            className={styles.personAvatar} 
          />
          <div className={styles.personDetails}>
            <p className={styles.personName}>{character.name_full}</p>
            <p className={styles.personRole}>{character.role}</p>
          </div>
        </div>
      </Link>

      {/* Link Voice Actor */}
      {voiceActor && (
        <Link to={`/staff/${voiceActor.id}`} className={`${styles.cardLink} ${styles.vaPart}`}>
          <div className={`${styles.personInfo} ${styles.vaInfo}`}>
            <div className={`${styles.personDetails} ${styles.vaDetails}`}>
              <p className={styles.personName}>{voiceActor.name_full}</p>
              <p className={styles.personRole}>{voiceActor.language}</p>
            </div>
            <img 
              src={voiceActor.image} 
              alt={voiceActor.name_full} 
              className={styles.personAvatar} 
            />
          </div>  
        </Link>
      )}
    </div>
  );
};

export default CharacterCard;