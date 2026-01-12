// src/components/MainContent/Characters_section/CharactersSection.tsx
import React from 'react';
import CharacterCard from './CharacterCard';
import { useAnimeCharacters } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
// 1. Import CSS Module
import styles from './CharactersSection.module.css';

interface CharactersSectionProps {
  animeId: number | string;
}

const CharactersSection: React.FC<CharactersSectionProps> = ({ animeId }) => {
  const { t } = useTranslation('CharactersSection'); 
  const { characters, loading } = useAnimeCharacters(animeId);

  if (loading) {
    return <div>{t('characters.loading')}</div>;
  }

  if (!characters || characters.length === 0) {
    return <p>{t('characters.no_info')}</p>;
  }

  return (
    // 2. Sử dụng class từ module
    <div className={styles.charactersGrid}>
      {characters.map((char) => (
        <CharacterCard key={char.id} character={char} />
      ))}
    </div>
  );
};

export default CharactersSection;