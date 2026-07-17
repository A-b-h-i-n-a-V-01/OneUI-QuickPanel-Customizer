import { useState, useCallback } from 'react';
import {
  type WallpaperState,
  type WallpaperTransform,
  type WallpaperFilters,
} from '../types';

const DEFAULT_TRANSFORM: WallpaperTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
};

const DEFAULT_FILTERS: WallpaperFilters = {
  blur: 0,
  opacity: 1,
  brightness: 1,
  contrast: 1,
  saturation: 1,
};

export function useWallpaper() {
  const [state, setState] = useState<WallpaperState>({
    wallpaperUrl: null,
    transform: DEFAULT_TRANSFORM,
    filters: DEFAULT_FILTERS,
  });

  const setWallpaper = useCallback((url: string) => {
    setState((prev) => ({ ...prev, wallpaperUrl: url }));
  }, []);

  const clearWallpaper = useCallback(() => {
    setState((prev) => ({ ...prev, wallpaperUrl: null, transform: DEFAULT_TRANSFORM }));
  }, []);

  const setTransform = useCallback((transform: WallpaperTransform) => {
    setState((prev) => ({ ...prev, transform }));
  }, []);

  const updateTransform = useCallback((partial: Partial<WallpaperTransform>) => {
    setState((prev) => ({ ...prev, transform: { ...prev.transform, ...partial } }));
  }, []);

  const setFilters = useCallback((filters: WallpaperFilters) => {
    setState((prev) => ({ ...prev, filters }));
  }, []);

  const updateFilter = useCallback(<K extends keyof WallpaperFilters>(
    key: K,
    value: WallpaperFilters[K]
  ) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
    }));
  }, []);

  const resetTransform = useCallback(() => {
    setState((prev) => ({ ...prev, transform: DEFAULT_TRANSFORM }));
  }, []);

  const resetFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: DEFAULT_FILTERS }));
  }, []);

  /**
   * Compute a CSS filter string from current filter values.
   * Used when rendering a DOM image preview.
   */
  const cssFilter = `blur(${state.filters.blur}px) brightness(${state.filters.brightness}) contrast(${state.filters.contrast}) saturate(${state.filters.saturation}) opacity(${state.filters.opacity})`;

  return {
    state,
    setWallpaper,
    clearWallpaper,
    setTransform,
    updateTransform,
    setFilters,
    updateFilter,
    resetTransform,
    resetFilters,
    cssFilter,
  };
}
