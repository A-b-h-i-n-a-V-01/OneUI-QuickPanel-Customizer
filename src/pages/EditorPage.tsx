import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { WallpaperCanvas, type WallpaperCanvasRef } from '../components/editor/WallpaperCanvas';
import { Toolbar } from '../components/editor/Toolbar';
import { PhoneMockup } from '../components/phone/PhoneMockup';
import { type WallpaperTransform, type WallpaperFilters, type PanelType, type PanelRect } from '../types';

interface EditorPageProps {
  wallpaperUrl: string;
  screenshotUrl: string | null;
  screenshotSize: { width: number; height: number };
  transform: WallpaperTransform;
  filters: WallpaperFilters;
  panelRects: Partial<Record<PanelType, PanelRect>>;
  enabledPanels: PanelType[];
  onUpdateTransform: (t: Partial<WallpaperTransform>) => void;
  onUpdateFilter: <K extends keyof WallpaperFilters>(key: K, value: WallpaperFilters[K]) => void;
  onTransformChange: (t: WallpaperTransform) => void;
  onNext: () => void;
  onBack: () => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({
  wallpaperUrl,
  screenshotUrl,
  screenshotSize,
  transform,
  filters,
  panelRects,
  onUpdateTransform,
  onUpdateFilter,
  onTransformChange,
  onNext,
  onBack,
}) => {
  const canvasRef = useRef<WallpaperCanvasRef>(null);
  const [screenshotOpacity, setScreenshotOpacity] = useState(0.55);
  const [showOutlines, setShowOutlines] = useState(true);

  const PHONE_WIDTH = 280;

  return (
    <div className="flex-1 flex flex-col gap-4 max-w-6xl mx-auto w-full px-6 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#4F8CFF] text-xs font-bold uppercase tracking-wider mb-1">Step 5</p>
        <h2 className="text-2xl font-black text-white">Wallpaper Editor</h2>
        <p className="text-gray-400 text-sm mt-1">
          Drag to pan, scroll to zoom, and use the toolbar to apply filters. The panel outlines show calibrated regions.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">
        {/* Phone preview + canvas */}
        <div className="flex justify-center lg:justify-start flex-shrink-0 flex-col items-center gap-3">
          <PhoneMockup width={PHONE_WIDTH}>
            <WallpaperCanvas
              ref={canvasRef}
              wallpaperUrl={wallpaperUrl}
              screenshotUrl={screenshotUrl}
              screenshotSize={screenshotSize}
              screenshotOpacity={screenshotOpacity}
              transform={transform}
              filters={filters}
              panelRects={panelRects}
              showPanelOutlines={showOutlines}
              containerWidth={PHONE_WIDTH - 28}
              containerHeight={Math.round((PHONE_WIDTH - 28) * (screenshotSize.height / screenshotSize.width))}
              onTransformChange={onTransformChange}
            />
          </PhoneMockup>

          {/* Quick toggles */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowOutlines((v) => !v)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-fast ${
                showOutlines
                  ? 'bg-[#4F8CFF]/15 border-[#4F8CFF]/35 text-[#4F8CFF]'
                  : 'bg-white/5 border-white/8 text-gray-500'
              }`}
            >
              {showOutlines ? '⊡' : '⊟'} Panel Outlines
            </button>
          </div>

          {/* Screenshot overlay opacity */}
          <div className="w-full max-w-[252px] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Screenshot overlay</span>
              <span className="text-[#4F8CFF] font-mono font-semibold">
                {Math.round(screenshotOpacity * 100)}%
              </span>
            </div>
            <input
              type="range" min={0} max={1} step={0.01}
              value={screenshotOpacity}
              onChange={(e) => setScreenshotOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex-1 overflow-y-auto">
          <Toolbar
            transform={transform}
            filters={filters}
            onUpdateTransform={onUpdateTransform}
            onUpdateFilter={onUpdateFilter}
            onCenter={() => canvasRef.current?.center()}
            onReset={() => canvasRef.current?.reset()}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft size={15} /> Back
        </button>
        <button onClick={onNext} className="btn-primary">
          Preview Result <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
