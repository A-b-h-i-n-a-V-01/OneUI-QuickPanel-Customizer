import type Konva from 'konva';
import { type PanelType, type PanelRect, PANEL_META } from '../types';

/**
 * Export individual panel regions as PNG files.
 *
 * TODO: In a future version, integrate with Samsung One UI Good Lock
 * or the One UI customization API to directly import these PNGs.
 *
 * For now this generates cropped PNGs from the Konva stage via toDataURL.
 */
export async function exportPanelPNGs(
  stage: Konva.Stage,
  panelRects: Partial<Record<PanelType, PanelRect>>,
  enabledPanels: PanelType[],
  stageScale: number
): Promise<void> {
  for (const panelId of enabledPanels) {
    const rect = panelRects[panelId];
    if (!rect) continue;

    // TODO: Apply clipping mask per panel for clean exports
    // TODO: Integrate Samsung One UI import flow when API is available
    const dataUrl = stage.toDataURL({
      x: rect.x * stageScale,
      y: rect.y * stageScale,
      width: rect.width * stageScale,
      height: rect.height * stageScale,
      pixelRatio: 1 / stageScale, // Export at native resolution
      mimeType: 'image/png',
    });

    downloadDataUrl(dataUrl, getPanelFileName(panelId));

    // Small delay between downloads to avoid browser blocking
    await new Promise((r) => setTimeout(r, 150));
  }
}

function getPanelFileName(id: PanelType): string {
  const names: Record<PanelType, string> = {
    buttons: 'ButtonPanel.png',
    brightness: 'Brightness.png',
    volume: 'Volume.png',
    media: 'MediaPlayer.png',
  };
  return names[id];
}

function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Generate a preview data URL for a single panel (used in the ExportPanel UI) */
export function getPanelPreviewUrl(
  stage: Konva.Stage,
  rect: PanelRect,
  stageScale: number
): string {
  // TODO: Add wallpaper composite rendering per panel
  return stage.toDataURL({
    x: rect.x * stageScale,
    y: rect.y * stageScale,
    width: rect.width * stageScale,
    height: rect.height * stageScale,
    pixelRatio: 1 / stageScale,
    mimeType: 'image/png',
  });
}

/** Human-readable labels for export panel */
export function getPanelLabel(id: PanelType): string {
  return PANEL_META[id].label;
}
