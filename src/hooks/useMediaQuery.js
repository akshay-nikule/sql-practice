import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e) => {
      setMatches(e.matches);
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 769px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 481px) and (max-width: 768px)');
}

export function useIsMobile() {
  return useMediaQuery('(max-width: 480px)');
}
