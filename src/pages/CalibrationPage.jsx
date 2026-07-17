import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, SkipForward, RefreshCw, CheckCircle } from 'lucide-react';
import { CalibrationCanvas } from '../components/calibration/CalibrationCanvas';
import { PhoneMockup } from '../components/phone/PhoneMockup';
import { PANEL_META } from '../types';
import { orderedEnabledPanels } from '../utils/calibrationUtils';



export const CalibrationPage = ({
  screenshotUrl,
  screenshotSize,
  enabledPanels,
  panelRects,
  onUpdateRect,
  onResetRect,
  onNext,
  onBack,
}) => {
  const panels = orderedEnabledPanels(enabledPanels);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const currentPanel = panels[currentIdx];
  const isLast = currentIdx === panels.length - 1;
  const meta = currentPanel ? PANEL_META[currentPanel] : null;

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
    else onBack();
  };

  const handleNext = () => {
    if (!isLast) setCurrentIdx((i) => i + 1);
    else onNext();
  };

  const handleSkip = () => {
    setSkipped((s) => new Set(s).add(currentPanel));
    handleNext();
  };

  const handleReset = () => {
    if (currentPanel) onResetRect(currentPanel);
  };

  if (!currentPanel || !meta) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <CheckCircle size={48} className="text-[#34C97A]" />
        <p className="text-xl font-bold text-white">No panels to calibrate.</p>
        <button onClick={onNext} className="btn-primary">Continue <ArrowRight size={16} /></button>
      </div>
    );
  }

  const PHONE_WIDTH = 300;

  return (
    <div className="flex-1 flex flex-col gap-5 max-w-5xl mx-auto w-full px-6 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#4F8CFF] text-xs font-bold uppercase tracking-wider mb-1">Step 3</p>
        <h2 className="text-2xl font-black text-white">Calibration Wizard</h2>
        <p className="text-gray-400 text-sm mt-1">
          Drag and resize the highlighted overlay to match each panel's exact position in your screenshot.
        </p>
      </motion.div>

      {/* Sub-step indicator */}
      <div className="flex items-center gap-3 flex-wrap">
        {panels.map((id, idx) => {
          const skip = skipped.has(id);
          const done = idx < currentIdx && !skip;
          const active = idx === currentIdx;
          return (
            <button
              key={id}
              onClick={() => setCurrentIdx(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-fast ${
                active
                  ? 'bg-[#4F8CFF]/20 border-[#4F8CFF]/50 text-white'
                  : skip
                  ? 'bg-white/5 border-white/8 text-gray-600 line-through'
                  : done
                  ? 'bg-[#34C97A]/10 border-[#34C97A]/30 text-[#34C97A]'
                  : 'bg-white/3 border-white/5 text-gray-600'
              }`}
            >
              {skip ? '⊘' : active ? '◉' : idx < currentIdx ? '✓' : '○'}{' '}
              {PANEL_META[id].label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Phone mockup + canvas */}
        <div className="order-2 lg:order-1 flex justify-center lg:justify-start flex-shrink-0">
          <div className="flex flex-col items-center gap-4">
            <PhoneMockup width={PHONE_WIDTH}>
              <CalibrationCanvas
                screenshotUrl={screenshotUrl}
                screenshotSize={screenshotSize}
                containerWidth={PHONE_WIDTH - 20}
                containerHeight={Math.round(PHONE_WIDTH * (19.5 / 9)) - 20}
                panelRects={panelRects}
                activePanelId={currentPanel}
                onUpdateRect={onUpdateRect}
              />
            </PhoneMockup>

            {/* Mobile Actions: directly under the mockup */}
            <div className="lg:hidden flex items-center justify-center gap-3 w-full px-2">
              <button onClick={handleReset} className="btn-secondary text-xs py-1.5 px-3 flex-1 flex items-center justify-center gap-1.5">
                <RefreshCw size={12} /> Reset
              </button>
              <button onClick={handleNext} className="btn-primary text-xs py-1.5 px-4 flex-[1.5] flex items-center justify-center gap-1.5">
                {isLast ? 'Finish' : 'Proceed'} <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Right panel info + instructions */}
        <div className="order-1 lg:order-2 flex-1 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPanel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="glass rounded-2xl p-5 border border-white/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#4F8CFF]/15 text-[#4F8CFF] flex items-center justify-center text-2xl">
                  {meta.icon}
                </div>
                <div>
                  <p className="font-black text-white text-base">{meta.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Step {currentIdx + 1} of {panels.length}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {meta.description}. Drag the{' '}
                <span className="text-[#4F8CFF] font-semibold">blue overlay</span> to match the panel
                position, then resize it from the handles to cover the exact area.
              </p>

              {/* Rect info */}
              {panelRects[currentPanel] && (
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 font-mono bg-white/3 rounded-xl p-3">
                  {(['x', 'y', 'width', 'height']).map((k) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-600">{k}</span>
                      <span className="text-gray-300">{Math.round(panelRects[currentPanel][k])}px</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Desktop-only action buttons inside card */}
              <div className="hidden lg:flex gap-2 mt-4">
                <button onClick={handleNext} className="btn-primary text-xs py-1.5 px-3 flex-initial">
                  {isLast ? 'Finish' : 'Proceed'}
                </button>
                <button onClick={handleReset} className="btn-secondary text-xs py-1.5 px-3">
                  <RefreshCw size={12} /> Reset
                </button>
                <button onClick={handleSkip} className="btn-ghost text-xs py-1.5 px-3">
                  <SkipForward size={12} /> Skip
                </button>
              </div>

              {/* Mobile-only Skip button remains accessible in the instructions card */}
              <div className="lg:hidden flex justify-end mt-4">
                <button onClick={handleSkip} className="btn-ghost text-xs py-1.5 px-3">
                  <SkipForward size={12} /> Skip
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="glass-light rounded-xl p-3 border border-white/5 text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-300">Tip:</strong> Drag from the center to move, and drag from the edges or corners to resize.
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="hidden lg:flex items-center justify-between pt-2 border-t border-white/5">
        <button onClick={handlePrev} className="btn-ghost">
          <ArrowLeft size={15} /> {currentIdx === 0 ? 'Back' : 'Previous Panel'}
        </button>
        <button onClick={handleNext} className="btn-primary">
          {isLast ? (
            <><CheckCircle size={16} /> Finish Calibration</>
          ) : (
            <>Next Panel <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
};
