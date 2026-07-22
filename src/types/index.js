// ─── Constants ────────────────────────────────────────────────────────────────
export const PAGE_ORDER = [
  'home',
  'upload',
  'panel-select',
  'calibration',
  'wallpaper-upload',
  'editor',
  'export',
];

export const PANEL_META = {
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
