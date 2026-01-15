// src/components/MainContent/Characters_section/CharactersSection.tsx
import React from 'react';
import CharacterCard from './CharacterCard';
import { useAnimeCharacters } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import styles from './CharactersSection.module.css';

// 1. Cập nhật Interface Props
interface CharactersSectionProps {
  data: any[]; // Tốt nhất nên thay 'any' bằng 'Character[]'
}

const CharactersSection: React.FC<CharactersSectionProps> = ({ data }) => {
  const { t } = useTranslation('CharactersSection'); 
  
  // 2. Truyền data vào hook (Hook này chỉ làm nhiệm vụ cắt mảng slice(0,6))
  const { characters } = useAnimeCharacters(data);

  // 3. Xóa logic check loading
  
  if (!characters || characters.length === 0) {
    return <p>{t('characters.no_info')}</p>;
  }

  return (
    <div className={styles.charactersGrid}>
      {characters.map((char: any) => (
        <CharacterCard key={char.id} character={char} />
      ))}
    </div>
  );
};

export default CharactersSection;