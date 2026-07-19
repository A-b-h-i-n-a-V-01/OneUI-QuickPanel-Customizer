import { useState, useCallback, useEffect } from 'react';
import { PAGE_ORDER } from '../types';

export function useAppState() {
  const getPageFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    return PAGE_ORDER.includes(hash) ? hash : 'home';
  };

  const [currentPage, setCurrentPage] = useState(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((page) => {
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goNext = useCallback(() => {
    const idx = PAGE_ORDER.indexOf(currentPage);
    if (idx < PAGE_ORDER.length - 1) {
      navigateTo(PAGE_ORDER[idx + 1]);
    }
  }, [currentPage, navigateTo]);

  const goPrev = useCallback(() => {
    const idx = PAGE_ORDER.indexOf(currentPage);
    if (idx > 0) {
      navigateTo(PAGE_ORDER[idx - 1]);
    }
  }, [currentPage, navigateTo]);

  const stepNumber = PAGE_ORDER.indexOf(currentPage) + 1;
  const totalSteps = PAGE_ORDER.length;

  return { currentPage, navigateTo, goNext, goPrev, stepNumber, totalSteps };
}
