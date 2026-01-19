// src/features/character/CharacterPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './CharacterPage.module.css';

// Hooks & Types & Components
import { useCharacter } from '@umamusumeenjoyer/shared-logic';
import { Spoiler } from './Spoiler'; 
import AnimeCard from '../../components/AnimeCard/AnimeCard'; // Import AnimeCard
import CharacterPageSkeleton from './CharacterPageSkeleton';

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['CharacterPage', 'common']);
  const { character, loading, error, cleanDescription } = useCharacter(id);

  const renderDescriptionWithSpoilers = (text: string) => {
    const parts = text.split(/(~!|!~)/g);
    let isSpoilerContent = false;
    return parts.map((part, index) => {
      if (part === '~!' || part === '!~') {
        if (part === '~!') isSpoilerContent = true;
        if (part === '!~') isSpoilerContent = false;
        return null;
      }
      return isSpoilerContent ? (
        <Spoiler key={index}>{part}</Spoiler>
      ) : (
        <span key={index}>{part}</span>
      );
    });
  };

  if (loading) return (<CharacterPageSkeleton></CharacterPageSkeleton>);
  if (error) return <div className={styles.loading}>{t('common:error', { message: error })}</div>;
  if (!character) return <div className={styles.loading}>{t('error.not_found')}</div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        <div className={styles.mainContent}>
          {/* Cột trái: Ảnh */}
          <div className={styles.leftColumn}>
            <img 
              src={character.image} 
              alt={character.name_full} 
              className={styles.characterImage} 
            />
          </div>

          {/* Cột phải: Thông tin */}
          <div className={styles.rightColumn}>
            <h1 className={styles.characterName}>{character.name_full}</h1>
            <p className={styles.nativeName}>{character.name_native}</p>
            <div className={styles.description}>
              {renderDescriptionWithSpoilers(cleanDescription)}
            </div>
          </div>
        </div>

        {/* Media Section - Sử dụng AnimeCard */}
        <div className={styles.mediaSection}>
          <h2>{t('sections.media_appearances')}</h2>
          
          <div className={styles.mediaGrid}>
            {character.media.map((item) => (
              <AnimeCard key={item.id} anime={item} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CharacterPage;