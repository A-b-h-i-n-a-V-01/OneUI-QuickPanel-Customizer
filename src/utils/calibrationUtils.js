

/** Ordered vertical stack positions for each panel in a 1080-wide screenshot.
 *  These are sensible Samsung One UI defaults — the user calibrates over them. */
const PANEL_DEFAULTS = {
  buttons:    { yFraction: 0.08, heightFraction: 0.17 },
  brightness: { yFraction: 0.26, heightFraction: 0.055 },
  volume:     { yFraction: 0.32, heightFraction: 0.055 },
  media:      { yFraction: 0.39, heightFraction: 0.095 },
};

/**
 * Per-panel corner radius matching real OneUI 8+ quick panel shapes.
 * - buttons:    Rounded rectangle (~28dp on 1080p). NOT a pill — it's a large grid area.
 * - brightness/volume: Pill-shaped thin slider bars (height / 2).
 * - media:      Card-like rounding (~20dp).
 */
export function getPanelCornerRadius(id, height, screenshotWidth) {
  const scale = screenshotWidth / 1080; // normalise to 1080p reference
  switch (id) {
    case 'buttons':    return Math.round(28 * scale);
    case 'brightness': return height / 2;
    case 'volume':     return height / 2;
    case 'media':      return Math.round(20 * scale);
    default:           return Math.round(20 * scale);
  }
}

export function getDefaultRect(
  id,
  screenshotWidth,
  screenshotHeight
) {
  const { yFraction, heightFraction } = PANEL_DEFAULTS[id];
  const margin = screenshotWidth * 0.04;
  const height = screenshotHeight * heightFraction;
  return {
    id,
    x: margin,
    y: screenshotHeight * yFraction,
    width: screenshotWidth - margin * 2,
    height,
    cornerRadius: getPanelCornerRadius(id, height, screenshotWidth),
  };
}

/** Clamp a value between min and max */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/** Returns the display label order for enabled panels */
export const PANEL_ORDER = ['buttons', 'brightness', 'volume', 'media'];

export function orderedEnabledPanels(enabled) {
  return PANEL_ORDER.filter((p) => enabled.includes(p));
}
