import { useState, useCallback } from 'react';
import { STORAGE_KEY,  } from '../types';
import { getDefaultRect, getPanelCornerRadius } from '../utils/calibrationUtils';

const DEFAULT_STATE = {
  screenshotUrl: null,
  screenshotSize: { width: 1080, height: 2400 },
  enabledPanels: [],
  panelRects: {},
};

export function useCalibration() {
  const [state, setState] = useState(DEFAULT_STATE);

  // ── Screenshot ────────────────────────────────────────────────────────────
  const setScreenshot = useCallback((url, width, height) => {
    setState((prev) => ({
      ...prev,
      screenshotUrl: url,
      screenshotSize: { width, height },
      // Regenerate default rects for the new screenshot dimensions
      panelRects: Object.fromEntries(
        prev.enabledPanels.map((id) => [
          id,
          prev.panelRects[id] ?? getDefaultRect(id, width, height),
        ])
      ),
    }));
  }, []);

  const clearScreenshot = useCallback(() => {
    setState((prev) => ({ ...prev, screenshotUrl: null }));
  }, []);

  // ── Enabled Panels ────────────────────────────────────────────────────────
  const togglePanel = useCallback((id) => {
    setState((prev) => {
      const enabled = prev.enabledPanels.includes(id)
        ? prev.enabledPanels.filter((p) => p !== id)
        : [...prev.enabledPanels, id];

      // Add default rect for newly enabled panels
      const rects = { ...prev.panelRects };
      if (!prev.enabledPanels.includes(id)) {
        rects[id] =
          rects[id] ??
          getDefaultRect(id, prev.screenshotSize.width, prev.screenshotSize.height);
      }
      return { ...prev, enabledPanels: enabled, panelRects: rects };
    });
  }, []);

  // ── Panel Rects ───────────────────────────────────────────────────────────
  const updateRect = useCallback((id, rect) => {
    const adjustedRect = {
      ...rect,
      cornerRadius: getPanelCornerRadius(id, rect.height, rect.width + rect.x * 2),
    };
    setState((prev) => ({
      ...prev,
      panelRects: { ...prev.panelRects, [id]: adjustedRect },
    }));
  }, []);

  const resetRect = useCallback((id) => {
    setState((prev) => {
      const defaultRect = getDefaultRect(id, prev.screenshotSize.width, prev.screenshotSize.height);
      return {
        ...prev,
        panelRects: {
          ...prev.panelRects,
          [id]: defaultRect,
        },
      };
    });
  }, []);

  // ── Persistence ───────────────────────────────────────────────────────────
  /** Save calibration rects to localStorage (NOT the screenshot URL) */
  const saveCalibration = useCallback(
    (label) => {
      try {
        const save = {
          version: 1,
          screenshotWidth: state.screenshotSize.width,
          screenshotHeight: state.screenshotSize.height,
          enabledPanels: state.enabledPanels,
          panelRects: state.panelRects,
          savedAt: new Date().toISOString(),
          label,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
        return true;
      } catch {
        return false;
      }
    },
    [state]
  );

  const loadCalibration = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const applySavedCalibration = useCallback((saved) => {
    setState((prev) => ({
      ...prev,
      screenshotSize: { width: saved.screenshotWidth, height: saved.screenshotHeight },
      enabledPanels: saved.enabledPanels,
      panelRects: saved.panelRects,
    }));
  }, []);

  const deleteCalibration = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasSavedCalibration = useCallback(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }, []);

  return {
    state,
    setScreenshot,
    clearScreenshot,
    togglePanel,
    updateRect,
    resetRect,
    saveCalibration,
    loadCalibration,
    applySavedCalibration,
    deleteCalibration,
    hasSavedCalibration,
  };
}
