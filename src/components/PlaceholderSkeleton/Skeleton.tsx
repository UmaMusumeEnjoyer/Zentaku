import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className = '',
  style,
}) => {
  
  const inlineStyles: React.CSSProperties = {
    width,
    height,
    borderRadius,
    ...style,
  };

  // Kết hợp class từ module và class từ props (nếu có)
  const combinedClassName = `${styles.skeletonLoader} ${className}`.trim();

  return (
    <div 
      className={combinedClassName} 
      style={inlineStyles}
      aria-hidden="true"
    />
  );
};

export default Skeleton;