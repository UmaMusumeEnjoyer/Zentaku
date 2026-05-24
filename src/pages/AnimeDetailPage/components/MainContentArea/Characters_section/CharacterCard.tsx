// src/components/MainContent/Characters_section/CharacterCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Character } from '@umamusumeenjoyer/shared-logic';
// 1. Import CSS Module
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character: edge }) => {
  const node = (edge as any).node || edge;
  const role = (edge as any).role || node.role;
  const voiceActors = (edge as any).voiceActors || node.voiceActors || node.voice_actors;
  const voiceActor = voiceActors?.[0];

  return (
    // 2. Sử dụng class từ module
    <div className={styles.characterCard}>
      {/* Link Character */}
      <Link to={`/character/${node.id}`} className={styles.cardLink}>
        <div className={styles.personInfo}>
          <img 
            src={node.image?.large || node.image || node.image_url} 
            alt={node.name?.full || node.name_full} 
            className={styles.personAvatar} 
          />
          <div className={styles.personDetails}>
            <p className={styles.personName}>{node.name?.full || node.name_full}</p>
            <p className={styles.personRole}>{role}</p>
          </div>
        </div>
      </Link>

      {/* Link Voice Actor */}
      {voiceActor && (
        <Link to={`/staff/${voiceActor.id}`} className={`${styles.cardLink} ${styles.vaPart}`}>
          <div className={`${styles.personInfo} ${styles.vaInfo}`}>
            <div className={`${styles.personDetails} ${styles.vaDetails}`}>
              <p className={styles.personName}>{voiceActor.name?.full || voiceActor.name_full}</p>
              <p className={styles.personRole}>{voiceActor.languageV2 || voiceActor.language}</p>
            </div>
            <img 
              src={voiceActor.image?.large || voiceActor.image || voiceActor.image_url} 
              alt={voiceActor.name?.full || voiceActor.name_full} 
              className={styles.personAvatar} 
            />
          </div>  
        </Link>
      )}
    </div>
  );
};

export default CharacterCard;