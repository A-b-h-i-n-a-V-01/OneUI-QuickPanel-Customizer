import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Eye } from 'lucide-react';
import { WallpaperCanvas } from '../components/editor/WallpaperCanvas';
import { PhoneMockup } from '../components/phone/PhoneMockup';
import { PANEL_META } from '../types';



export const PreviewPage = ({
  wallpaperUrl,
  screenshotSize,
  transform,
  filters,
  panelRects,
  enabledPanels,
  onNext,
  onBack,
}) => {
  const canvasRef = useRef(null);
  const PHONE_WIDTH = 300;

  return (
    <div className="flex-1 flex flex-col gap-5 max-w-4xl mx-auto w-full px-6 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#4F8CFF] text-xs font-bold uppercase tracking-wider mb-1">Step 6</p>
        <h2 className="text-2xl font-black text-white">Preview</h2>
        <p className="text-gray-400 text-sm mt-1">
          This is how your wallpaper will appear behind the calibrated Quick Panel regions.
          The panel outlines show where each region is positioned.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Phone mockup preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-4"
        >
          <PhoneMockup width={PHONE_WIDTH}>
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
              showPanelOutlines={true}
              containerWidth={PHONE_WIDTH - 28}
              containerHeight={Math.round((PHONE_WIDTH - 28) * (screenshotSize.height / screenshotSize.width))}
              onTransformChange={() => {}}
              previewMode={true}
            />
          </PhoneMockup>

          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/3 px-4 py-2 rounded-full border border-white/5">
            <Eye size={13} />
            Quick Panel Background Preview
          </div>
        </motion.div>

        {/* Panel summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex-1 flex flex-col gap-3"
        >
          <p className="text-sm font-bold text-white mb-1">Calibrated Panels</p>
          {enabledPanels.map((id) => {
            const rect = panelRects[id];
            const meta = PANEL_META[id];
            return (
              <div
                key={id}
                className="glass-light rounded-xl px-4 py-3 border border-white/5 flex items-center gap-3"
              >
                <span className="text-xl flex-shrink-0">{meta.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{meta.label}</p>
                  {rect ? (
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {Math.round(rect.width)}×{Math.round(rect.height)}px at ({Math.round(rect.x)}, {Math.round(rect.y)})
                    </p>
                  ) : (
                    <p className="text-xs text-amber-400">Not calibrated</p>
                  )}
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${rect ? 'bg-[#34C97A]' : 'bg-amber-400'}`}
                />
              </div>
            );
          })}

          <div className="glass-light rounded-xl p-3 border border-white/5 text-xs text-gray-400 mt-2 leading-relaxed">
            <strong className="text-gray-300">Looks good?</strong> Click "Export PNGs" to download individual
            PNG files for each panel. Import them into Samsung Good Lock → QuickStar.
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft size={15} /> Back to Editor
        </button>
        <button onClick={onNext} className="btn-primary">
          Export PNGs <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
