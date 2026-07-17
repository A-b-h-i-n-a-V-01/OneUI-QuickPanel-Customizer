import { useState, useCallback } from 'react';


const DEFAULT_TRANSFORM = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
};

const DEFAULT_FILTERS = {
  blur: 0,
  opacity: 1,
  brightness: 1,
  contrast: 1,
  saturation: 1,
};

export function useWallpaper() {
  const [state, setState] = useState({
    wallpaperUrl: null,
    transform: DEFAULT_TRANSFORM,
    filters: DEFAULT_FILTERS,
  });

  const setWallpaper = useCallback((url) => {
    setState((prev) => ({ ...prev, wallpaperUrl: url }));
  }, []);

  const clearWallpaper = useCallback(() => {
    setState((prev) => ({ ...prev, wallpaperUrl: null, transform: DEFAULT_TRANSFORM }));
  }, []);

  const setTransform = useCallback((transform) => {
    setState((prev) => ({ ...prev, transform }));
  }, []);

  const updateTransform = useCallback((partial) => {
    setState((prev) => ({ ...prev, transform: { ...prev.transform, ...partial } }));
  }, []);

  const setFilters = useCallback((filters) => {
    setState((prev) => ({ ...prev, filters }));
  }, []);

  const updateFilter = useCallback((key, value) => {
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
