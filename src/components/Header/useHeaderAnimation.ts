import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { TRANSPARENT_ROUTES } from '../../context/headerContext';

export const useHeaderAnimation = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  
  const location = useLocation();
  const lastScrollY = useRef(0);

  // Kiểm tra xem route hiện tại có nằm trong danh sách trong suốt không
  const isTransparentPage = TRANSPARENT_ROUTES.some(regex => 
    regex.test(location.pathname)
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Logic 1: Smart Hide (Ẩn khi cuộn xuống, hiện khi cuộn lên)
      if (currentScrollY > lastScrollY.current && currentScrollY > 70) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Logic 2: Kiểm tra đỉnh trang (cho hiệu ứng trong suốt)
      setIsAtTop(currentScrollY < 10);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers cho sự kiện chuột
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Quyết định trạng thái trong suốt:
  // Phải là trang cho phép AND đang ở đỉnh AND chuột không hover
  const isTransparent = isTransparentPage && isAtTop && !isHovered;

  return {
    isVisible,
    isTransparent,
    animationHandlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    }
  };
};