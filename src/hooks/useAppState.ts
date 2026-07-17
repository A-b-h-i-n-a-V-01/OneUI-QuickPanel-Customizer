import { useState, useCallback } from 'react';
import { type AppPage, PAGE_ORDER } from '../types';

export function useAppState() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  const navigateTo = useCallback((page: AppPage) => {
    setCurrentPage(page);
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
