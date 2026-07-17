import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PartyPopper } from 'lucide-react';
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
  const PHONE_WIDTH = 220;

  const stageScale = Math.min(
    (PHONE_WIDTH - 28) / screenshotSize.width,
    (Math.round((PHONE_WIDTH - 28) * (screenshotSize.height / screenshotSize.width))) / screenshotSize.height
  );

  return (
    <div className="flex-1 flex flex-col gap-5 max-w-4xl mx-auto w-full px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <PartyPopper size={28} className="text-[#4F8CFF]" />
        <div>
          <p className="text-[#4F8CFF] text-xs font-bold uppercase tracking-wider mb-0.5">Step 7</p>
          <h2 className="text-2xl font-black text-white">Export PNGs</h2>
        </div>
      </motion.div>

      <p className="text-gray-400 text-sm">
        Download individual PNG files for each calibrated panel. Import them into Samsung Good Lock →{' '}
        <strong className="text-gray-300">QuickStar</strong> to apply your custom background.
      </p>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Hidden canvas for export */}
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

        {/* Mini preview */}
        <div className="flex-shrink-0 flex flex-col items-center gap-3">
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
              showPanelOutlines={true}
              containerWidth={PHONE_WIDTH - 28}
              containerHeight={Math.round((PHONE_WIDTH - 28) * (screenshotSize.height / screenshotSize.width))}
              onTransformChange={() => {}}
              previewMode={true}
            />
          </PhoneMockup>
        </div>

        {/* Export panel */}
        <div className="flex-1">
          <ExportPanel
            enabledPanels={enabledPanels}
            panelRects={panelRects}
            stageRef={canvasRef}
            stageScale={stageScale}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft size={15} /> Back to Preview
        </button>
        <button onClick={onStartOver} className="btn-secondary text-xs">
          Start Over
        </button>
      </div>
    </div>
  );
};
