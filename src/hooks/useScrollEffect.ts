import { useEffect, useState } from 'react';

export const useScrollEffect = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  let lastScroll = 0;

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll <= 0) {
        setScrollDirection(null);
        setIsScrolled(false);
        return;
      }
      
      setIsScrolled(true);
      if (currentScroll > lastScroll) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { isScrolled, scrollDirection };
}; 