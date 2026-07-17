import { type PanelType, type PanelRect } from '../types';

/** Ordered vertical stack positions for each panel in a 1080-wide screenshot.
 *  These are sensible Samsung One UI defaults — the user calibrates over them. */
const PANEL_DEFAULTS: Record<PanelType, { yFraction: number; heightFraction: number }> = {
  buttons:    { yFraction: 0.08, heightFraction: 0.17 },
  brightness: { yFraction: 0.26, heightFraction: 0.055 },
  volume:     { yFraction: 0.32, heightFraction: 0.055 },
  media:      { yFraction: 0.39, heightFraction: 0.095 },
};

export function getDefaultRect(
  id: PanelType,
  screenshotWidth: number,
  screenshotHeight: number
): PanelRect {
  const { yFraction, heightFraction } = PANEL_DEFAULTS[id];
  const margin = screenshotWidth * 0.04;
  return {
    id,
    x: margin,
    y: screenshotHeight * yFraction,
    width: screenshotWidth - margin * 2,
    height: screenshotHeight * heightFraction,
    cornerRadius: 28,
  };
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Returns the display label order for enabled panels */
export const PANEL_ORDER: PanelType[] = ['buttons', 'brightness', 'volume', 'media'];

export function orderedEnabledPanels(enabled: PanelType[]): PanelType[] {
  return PANEL_ORDER.filter((p) => enabled.includes(p));
}
