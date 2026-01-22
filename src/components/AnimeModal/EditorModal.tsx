// src/components/EditorModal/EditorModal.tsx
import React from 'react';
import styles from './EditorModal.module.css'; // Import Module CSS
import EditorModalHeader from './EditorModalHeader';
import EditorModalForm from './EditorModalForm';
import EditorModalFooter from './EditorModalFooter';
import { useEditorModal, type EditorModalProps } from '@umamusumeenjoyer/shared-logic';
// Xóa import useTheme

const EditorModal: React.FC<EditorModalProps> = ({ 
  anime, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  initialData 
}) => {
  
  const {
    formData,
    isEditMode,
    handleChange,
    toggleFavorite,
    handleSaveClick,
    handleDeleteClick
  } = useEditorModal(anime, initialData, onSave, onDelete, onClose);

  // Xóa const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        
        <EditorModalHeader 
          anime={anime}
          onClose={onClose}
          onSave={handleSaveClick}
          isFavorite={formData.isFavorite}
          toggleFavorite={toggleFavorite}
        />

        <div className={styles.body}>
          <EditorModalForm 
            formData={formData}
            handleChange={handleChange}
            isEditMode={isEditMode}
          />
          
          {isEditMode && <EditorModalFooter onDelete={handleDeleteClick} />}
        </div>
      
      </div>
    </div>
  );
};

export default EditorModal;