import React from 'react';
import {
  ZoomIn, RotateCw, AlignCenter, RefreshCw,
  Sun, Contrast, Droplets, Eye, Wind,
} from 'lucide-react';
import { type WallpaperFilters, type WallpaperTransform } from '../../types';

interface ToolbarProps {
  transform: WallpaperTransform;
  filters: WallpaperFilters;
  onUpdateTransform: (t: Partial<WallpaperTransform>) => void;
  onUpdateFilter: <K extends keyof WallpaperFilters>(key: K, value: WallpaperFilters[K]) => void;
  onCenter: () => void;
  onReset: () => void;
}

interface SliderRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display?: string;
  onChange: (v: number) => void;
}

const SliderRow: React.FC<SliderRowProps> = ({
  icon, label, value, min, max, step, display, onChange,
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
        {icon} {label}
      </span>
      <span className="text-xs font-mono text-[#4F8CFF] font-semibold">
        {display ?? value.toFixed(2)}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full"
    />
  </div>
);

export const Toolbar: React.FC<ToolbarProps> = ({
  transform,
  filters,
  onUpdateTransform,
  onUpdateFilter,
  onCenter,
  onReset,
}) => {
  return (
    <div className="glass rounded-2xl p-4 border border-white/5 flex flex-col gap-5">
      {/* Transform Controls */}
      <div>
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-3">Transform</p>
        <div className="flex flex-col gap-3">
          <SliderRow
            icon={<ZoomIn size={13} />}
            label="Zoom"
            value={transform.scale}
            min={0.1}
            max={5}
            step={0.01}
            display={`×${transform.scale.toFixed(2)}`}
            onChange={(v) => onUpdateTransform({ scale: v })}
          />
          <SliderRow
            icon={<RotateCw size={13} />}
            label="Rotate"
            value={transform.rotation}
            min={-180}
            max={180}
            step={1}
            display={`${transform.rotation}°`}
            onChange={(v) => onUpdateTransform({ rotation: v })}
          />
        </div>

        {/* Quick action buttons */}
        <div className="flex gap-2 mt-3">
          <button onClick={onCenter} className="btn-secondary flex-1 justify-center text-xs py-2">
            <AlignCenter size={13} /> Center
          </button>
          <button onClick={onReset} className="btn-secondary flex-1 justify-center text-xs py-2">
            <RefreshCw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="border-t border-white/5 pt-4">
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-3">Filters</p>
        <div className="flex flex-col gap-3">
          <SliderRow
            icon={<Eye size={13} />}
            label="Opacity"
            value={filters.opacity}
            min={0}
            max={1}
            step={0.01}
            display={`${Math.round(filters.opacity * 100)}%`}
            onChange={(v) => onUpdateFilter('opacity', v)}
          />
          <SliderRow
            icon={<Sun size={13} />}
            label="Brightness"
            value={filters.brightness}
            min={0.2}
            max={2}
            step={0.01}
            onChange={(v) => onUpdateFilter('brightness', v)}
          />
          <SliderRow
            icon={<Contrast size={13} />}
            label="Contrast"
            value={filters.contrast}
            min={0.2}
            max={2}
            step={0.01}
            onChange={(v) => onUpdateFilter('contrast', v)}
          />
          <SliderRow
            icon={<Droplets size={13} />}
            label="Saturation"
            value={filters.saturation}
            min={0}
            max={2}
            step={0.01}
            onChange={(v) => onUpdateFilter('saturation', v)}
          />
          <SliderRow
            icon={<Wind size={13} />}
            label="Blur"
            value={filters.blur}
            min={0}
            max={20}
            step={0.5}
            display={`${filters.blur}px`}
            onChange={(v) => onUpdateFilter('blur', v)}
          />
        </div>
      </div>
    </div>
  );
};
