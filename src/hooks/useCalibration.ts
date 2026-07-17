import { useState, useCallback } from 'react';
import {
  type PanelType,
  type PanelRect,
  type CalibrationState,
  type SavedCalibration,
  STORAGE_KEY,
} from '../types';
import { getDefaultRect } from '../utils/calibrationUtils';

const DEFAULT_STATE: CalibrationState = {
  screenshotUrl: null,
  screenshotSize: { width: 1080, height: 2400 },
  enabledPanels: ['buttons', 'brightness'],
  panelRects: {},
};

export function useCalibration() {
  const [state, setState] = useState<CalibrationState>(DEFAULT_STATE);

  // ── Screenshot ────────────────────────────────────────────────────────────
  const setScreenshot = useCallback((url: string, width: number, height: number) => {
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
      ) as Partial<Record<PanelType, PanelRect>>,
    }));
  }, []);

  const clearScreenshot = useCallback(() => {
    setState((prev) => ({ ...prev, screenshotUrl: null }));
  }, []);

  // ── Enabled Panels ────────────────────────────────────────────────────────
  const togglePanel = useCallback((id: PanelType) => {
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
  const updateRect = useCallback((id: PanelType, rect: PanelRect) => {
    setState((prev) => ({
      ...prev,
      panelRects: { ...prev.panelRects, [id]: rect },
    }));
  }, []);

  const resetRect = useCallback((id: PanelType) => {
    setState((prev) => ({
      ...prev,
      panelRects: {
        ...prev.panelRects,
        [id]: getDefaultRect(id, prev.screenshotSize.width, prev.screenshotSize.height),
      },
    }));
  }, []);

  // ── Persistence ───────────────────────────────────────────────────────────
  /** Save calibration rects to localStorage (NOT the screenshot URL) */
  const saveCalibration = useCallback(
    (label?: string): boolean => {
      try {
        const save: SavedCalibration = {
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

  const loadCalibration = useCallback((): SavedCalibration | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SavedCalibration;
    } catch {
      return null;
    }
  }, []);

  const applySavedCalibration = useCallback((saved: SavedCalibration) => {
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

  const hasSavedCalibration = useCallback((): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
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
