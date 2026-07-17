import React, { useState } from 'react';
import { Download, Package, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PANEL_META } from '../../types';
import { exportPanelPNGs } from '../../utils/exportUtils';



export const ExportPanel = ({
  enabledPanels,
  panelRects,
  stageRef,
  stageScale,
}) => {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = async () => {
    if (!stageRef.current) return;
    const stage = stageRef.current.getStage();
    if (!stage) return;
    setExporting(true);
    setDone(false);
    try {
      await exportPanelPNGs(stage, panelRects, enabledPanels, stageScale);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Panel list */}
      <div className="flex flex-col gap-2">
        {enabledPanels.map((id) => {
          const meta = PANEL_META[id];
          const rect = panelRects[id];
          return (
            <div
              key={id}
              className="glass-light rounded-xl px-4 py-3 border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{meta.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{meta.label}</p>
                  <p className="text-xs text-gray-500">
                    {rect
                      ? `${Math.round(rect.width)}×${Math.round(rect.height)}px`
                      : 'Not calibrated'}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                {id === 'buttons'    && 'ButtonPanel.png'}
                {id === 'brightness' && 'Brightness.png'}
                {id === 'volume'     && 'Volume.png'}
                {id === 'media'      && 'MediaPlayer.png'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Export button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleExport}
        disabled={exporting || enabledPanels.length === 0}
        className="btn-primary w-full justify-center py-4 text-base"
      >
        {done ? (
          <><CheckCircle size={18} /> Exported!</>
        ) : exporting ? (
          <><Package size={18} /> Exporting…</>
        ) : (
          <><Download size={18} /> Export PNGs</>
        )}
      </motion.button>

      {done && (
        <p className="text-center text-xs text-[#34C97A] font-semibold">
          {enabledPanels.length} PNG{enabledPanels.length !== 1 ? 's' : ''} downloaded to your Downloads folder.
        </p>
      )}

      {/* TODO notice */}
      <div className="glass-light rounded-xl p-3 border border-amber-500/20 text-xs text-amber-400 leading-relaxed">
        <strong>⚠ TODO:</strong> Samsung One UI import integration is planned for a future release.
        For now, manually import these PNGs into Samsung's Good Lock → QuickStar module.
      </div>
    </div>
  );
};
