// ─── Panel Types ──────────────────────────────────────────────────────────────
export type PanelType = 'buttons' | 'brightness' | 'volume' | 'media';

export interface PanelMeta {
  id: PanelType;
  label: string;
  description: string;
  icon: string;           // emoji or lucide icon name
  defaultHeight: number;  // native px tall in a 1080-wide screenshot
}

// ─── Calibration ──────────────────────────────────────────────────────────────
export interface PanelRect {
  id: PanelType;
  x: number;
  y: number;
  width: number;
  height: number;
  cornerRadius: number;
}

/** Only rects are persisted to localStorage (not the image data URL) */
export interface SavedCalibration {
  version: 1;
  screenshotWidth: number;
  screenshotHeight: number;
  enabledPanels: PanelType[];
  panelRects: Partial<Record<PanelType, PanelRect>>;
  savedAt: string; // ISO timestamp
  label?: string;
}

export interface CalibrationState {
  screenshotUrl: string | null;
  screenshotSize: { width: number; height: number };
  enabledPanels: PanelType[];
  panelRects: Partial<Record<PanelType, PanelRect>>;
}

// ─── Wallpaper ────────────────────────────────────────────────────────────────
export interface WallpaperTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number; // degrees
}

export interface WallpaperFilters {
  blur: number;        // 0–20 (px)
  opacity: number;     // 0–1
  brightness: number;  // 0.5–2
  contrast: number;    // 0.5–2
  saturation: number;  // 0–2
}

export interface WallpaperState {
  wallpaperUrl: string | null;
  transform: WallpaperTransform;
  filters: WallpaperFilters;
}

// ─── App Navigation ───────────────────────────────────────────────────────────
export type AppPage =
  | 'home'
  | 'upload'
  | 'panel-select'
  | 'calibration'
  | 'wallpaper-upload'
  | 'editor'
  | 'preview'
  | 'export';

export const PAGE_ORDER: AppPage[] = [
  'home',
  'upload',
  'panel-select',
  'calibration',
  'wallpaper-upload',
  'editor',
  'preview',
  'export',
];

// ─── Constants ────────────────────────────────────────────────────────────────
export const PANEL_META: Record<PanelType, PanelMeta> = {
  buttons: {
    id: 'buttons',
    label: 'Button Panel',
    description: 'The grid of quick-setting toggle buttons',
    icon: '⊞',
    defaultHeight: 280,
  },
  brightness: {
    id: 'brightness',
    label: 'Brightness Slider',
    description: 'The brightness adjustment slider bar',
    icon: '☀',
    defaultHeight: 90,
  },
  volume: {
    id: 'volume',
    label: 'Volume Slider',
    description: 'The volume adjustment slider bar',
    icon: '🔊',
    defaultHeight: 90,
  },
  media: {
    id: 'media',
    label: 'Media Player',
    description: 'The Now Playing / media control card',
    icon: '♫',
    defaultHeight: 160,
  },
};

export const STORAGE_KEY = 'diy-oneui-v1';
