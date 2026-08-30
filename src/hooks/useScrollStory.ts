import { useState, useEffect } from 'react';

export function useScrollStory() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    const onScroll = () => {
      const current = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollY(current);
      setScrollProgress(max > 0 ? current / max : 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      mediaQuery.removeEventListener('change', handler);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return {
    scrollY,
    scrollProgress,
    prefersReducedMotion
  };
}
