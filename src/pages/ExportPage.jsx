import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PartyPopper, Eye, EyeOff } from 'lucide-react';
import { ExportPanel } from '../components/export/ExportPanel';
import { WallpaperCanvas } from '../components/editor/WallpaperCanvas';
import { PhoneMockup } from '../components/phone/PhoneMockup';

export const ExportPage = ({
  wallpaperUrl,
  screenshotSize,
  transform,
  filters,
  panelRects,
  enabledPanels,
  onBack,
  onStartOver,
}) => {
  const canvasRef = useRef(null);
  const [showOutlines, setShowOutlines] = useState(true);
  const PHONE_WIDTH = 250;

  const stageScale = Math.min(
    (PHONE_WIDTH - 28) / screenshotSize.width,
    (Math.round((PHONE_WIDTH - 28) * (screenshotSize.height / screenshotSize.width))) / screenshotSize.height
  );

  return (
    <div className="flex-1 flex flex-col gap-6 max-w-5xl mx-auto w-full px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2.5 rounded-2xl bg-[#4F8CFF]/10 text-[#4F8CFF]">
          <PartyPopper size={24} />
        </div>
        <div>
          <p className="text-[#4F8CFF] text-xs font-bold uppercase tracking-wider mb-0.5">Step 6 — Final Step</p>
          <h2 className="text-2xl font-black text-white">Preview & Export PNGs</h2>
        </div>
      </motion.div>

      <p className="text-gray-300 text-sm max-w-2xl leading-relaxed">
        Verify your custom Quick Panel wallpaper in the live preview mockup, then download individual PNGs for Samsung Good Lock →{' '}
        <strong className="text-white">QuickStar</strong>.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Hidden canvas for export rendering */}
        <div className="hidden">
          <WallpaperCanvas
            ref={canvasRef}
            wallpaperUrl={wallpaperUrl}
            screenshotUrl={null}
            screenshotSize={screenshotSize}
            screenshotOpacity={0}
            transform={transform}
            filters={filters}
            panelRects={panelRects}
            enabledPanels={enabledPanels}
            showPanelOutlines={false}
            containerWidth={PHONE_WIDTH - 28}
            containerHeight={Math.round((PHONE_WIDTH - 28) * (screenshotSize.height / screenshotSize.width))}
            onTransformChange={() => {}}
            previewMode={true}
          />
        </div>

        {/* Live Phone Mockup Preview */}
        <div className="flex-shrink-0 flex flex-col items-center gap-3 mx-auto lg:mx-0">
          <PhoneMockup width={PHONE_WIDTH}>
            <WallpaperCanvas
              wallpaperUrl={wallpaperUrl}
              screenshotUrl={null}
              screenshotSize={screenshotSize}
              screenshotOpacity={0}
              transform={transform}
              filters={filters}
              panelRects={panelRects}
              enabledPanels={enabledPanels}
              showPanelOutlines={showOutlines}
              containerWidth={PHONE_WIDTH - 28}
              containerHeight={Math.round((PHONE_WIDTH - 28) * (screenshotSize.height / screenshotSize.width))}
              onTransformChange={() => {}}
              previewMode={true}
            />
          </PhoneMockup>

          {/* Outline toggle button */}
          <button
            onClick={() => setShowOutlines((prev) => !prev)}
            className="flex items-center gap-2 text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all"
          >
            {showOutlines ? <Eye size={13} className="text-[#4F8CFF]" /> : <EyeOff size={13} className="text-gray-400" />}
            {showOutlines ? 'Panel Outlines: Visible' : 'Panel Outlines: Hidden'}
          </button>
        </div>

        {/* Export Panel & Download Options */}
        <div className="flex-1 w-full">
          <ExportPanel
            enabledPanels={enabledPanels}
            panelRects={panelRects}
            stageRef={canvasRef}
            stageScale={stageScale}
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
        <button onClick={onBack} className="btn-ghost flex items-center gap-2 text-sm text-gray-300 hover:text-white">
          <ArrowLeft size={16} /> Back to Editor
        </button>
        <button onClick={onStartOver} className="btn-secondary text-xs px-4 py-2 rounded-xl">
          Start Over
        </button>
      </div>
    </div>
  );
};
