// src/components/MainContent/Characters_section/CharacterCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Character } from '@umamusumeenjoyer/shared-logic';
// 1. Import CSS Module
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character: edge }) => {
  const { i18n } = useTranslation();
  const node = (edge as any).node || edge;
  const role = (edge as any).role || node.role;
  const voiceActors = (edge as any).voiceActors || node.voiceActors || node.voice_actors;
  const voiceActor = voiceActors?.[0];

  const getPersonName = (personNode: any) => {
    if (!personNode) return '';
    if (i18n.language === 'jp') {
      return personNode.name?.native || personNode.name_native || personNode.name?.full || personNode.name_full;
    }
    return personNode.name?.full || personNode.name_full;
  };

  return (
    // 2. Sử dụng class từ module
    <div className={styles.characterCard}>
      {/* Link Character */}
      <Link to={`/character/${node.id}`} className={styles.cardLink}>
        <div className={styles.personInfo}>
          <img 
            src={node.image?.large || node.image || node.image_url} 
            alt={getPersonName(node)} 
            className={styles.personAvatar} 
          />
          <div className={styles.personDetails}>
            <p className={styles.personName}>{getPersonName(node)}</p>
            <p className={styles.personRole}>{role}</p>
          </div>
        </div>
      </Link>

      {/* Link Voice Actor */}
      {voiceActor && (
        <Link to={`/staff/${voiceActor.id}`} className={`${styles.cardLink} ${styles.vaPart}`}>
          <div className={`${styles.personInfo} ${styles.vaInfo}`}>
            <div className={`${styles.personDetails} ${styles.vaDetails}`}>
              <p className={styles.personName}>{getPersonName(voiceActor)}</p>
              <p className={styles.personRole}>{voiceActor.languageV2 || voiceActor.language}</p>
            </div>
            <img 
              src={voiceActor.image?.large || voiceActor.image || voiceActor.image_url} 
              alt={getPersonName(voiceActor)} 
              className={styles.personAvatar} 
            />
          </div>  
        </Link>
      )}
    </div>
  );
};

export default CharacterCard;