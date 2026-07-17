import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { PanelCard } from '../components/ui/PanelCard';
import { PANEL_META } from '../types';
import { orderedEnabledPanels, PANEL_ORDER } from '../utils/calibrationUtils';



export const PanelSelectPage = ({
  enabledPanels,
  onToggle,
  onNext,
  onBack,
}) => {
  const ordered = orderedEnabledPanels(enabledPanels);

  return (
    <div className="flex-1 flex flex-col gap-6 max-w-2xl mx-auto w-full px-6 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#4F8CFF] text-xs font-bold uppercase tracking-wider mb-1">Step 2</p>
        <h2 className="text-2xl font-black text-white">Which Panels Are Visible?</h2>
        <p className="text-gray-400 text-sm mt-1">
          Enable only the panels that appear in your Samsung Quick Panel.
          You will calibrate each one individually in the next step.
        </p>
      </motion.div>

      {/* Panel Cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3"
      >
        {PANEL_ORDER.map((id, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + i * 0.06 }}
          >
            <PanelCard
              meta={PANEL_META[id]}
              enabled={enabledPanels.includes(id)}
              onToggle={onToggle}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Selection summary */}
      <div className="glass-light rounded-xl p-3 border border-white/5 text-xs">
        {ordered.length === 0 ? (
          <p className="text-amber-400 text-center font-semibold">
            ⚠ Enable at least one panel to continue.
          </p>
        ) : (
          <p className="text-gray-400 text-center">
            <span className="text-white font-bold">{ordered.length}</span> panel
            {ordered.length !== 1 ? 's' : ''} selected:{' '}
            <span className="text-gray-300">{ordered.map((id) => PANEL_META[id].label).join(', ')}</span>
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft size={15} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={enabledPanels.length === 0}
          className="btn-primary"
        >
          Next: Calibrate <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
