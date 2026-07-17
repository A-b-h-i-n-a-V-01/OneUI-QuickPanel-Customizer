

/** Ordered vertical stack positions for each panel in a 1080-wide screenshot.
 *  These are sensible Samsung One UI defaults — the user calibrates over them. */
const PANEL_DEFAULTS = {
  buttons:    { yFraction: 0.08, heightFraction: 0.17 },
  brightness: { yFraction: 0.26, heightFraction: 0.055 },
  volume:     { yFraction: 0.32, heightFraction: 0.055 },
  media:      { yFraction: 0.39, heightFraction: 0.095 },
};

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
    cornerRadius: height / 2,
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
