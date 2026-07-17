import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Upload, Trash2, X, Clock } from 'lucide-react';




export const SaveLoadModal = ({
  isOpen,
  onClose,
  onSave,
  onLoad,
  onApply,
  onDelete,
}) => {
  const [label, setLabel] = useState('');
  const [saveMsg, setSaveMsg] = useState(null);
  const [tab, setTab] = useState('save');

  const saved = onLoad();

  const handleSave = () => {
    const ok = onSave(label || undefined);
    setSaveMsg(ok ? '✓ Calibration saved!' : '✗ Save failed — storage may be full.');
    if (ok) setTimeout(() => setSaveMsg(null), 2500);
  };

  const handleApply = () => {
    if (saved) {
      onApply(saved);
      onClose();
    }
  };

  const handleDelete = () => {
    if (confirm('Delete saved calibration? This cannot be undone.')) {
      onDelete();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-heavy rounded-3xl p-6 w-full max-w-md border border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Calibration Storage</h2>
              <button onClick={onClose} className="btn-ghost p-2 rounded-xl">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5 p-1 bg-white/5 rounded-xl">
              {(['save', 'load']).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-fast capitalize ${
                    tab === t ? 'bg-[#4F8CFF] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t === 'save' ? 'Save' : 'Load / Delete'}
                </button>
              ))}
            </div>

            {tab === 'save' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-semibold mb-2 block">
                    Label (optional)
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. Galaxy S24 Ultra"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#4F8CFF] transition-fast"
                  />
                </div>
                <button onClick={handleSave} className="btn-primary w-full justify-center">
                  <Save size={16} /> Save Calibration
                </button>
                {saveMsg && (
                  <p
                    className={`text-xs text-center font-semibold ${
                      saveMsg.startsWith('✓') ? 'text-[#34C97A]' : 'text-red-400'
                    }`}
                  >
                    {saveMsg}
                  </p>
                )}
              </div>
            )}

            {tab === 'load' && (
              <div className="flex flex-col gap-3">
                {saved ? (
                  <div className="glass-light rounded-2xl p-4 border border-white/5">
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-[#4F8CFF] mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {saved.label ?? 'Saved Calibration'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Saved {new Date(saved.savedAt).toLocaleDateString()} ·{' '}
                          {saved.enabledPanels.length} panels ·{' '}
                          {saved.screenshotWidth}×{saved.screenshotHeight}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={handleApply} className="btn-primary flex-1 justify-center text-sm py-2.5">
                        <Upload size={14} /> Load
                      </button>
                      <button onClick={handleDelete} className="btn-danger px-4 py-2.5">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Save size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No saved calibration found.</p>
                    <p className="text-xs mt-1">Switch to Save tab to create one.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
