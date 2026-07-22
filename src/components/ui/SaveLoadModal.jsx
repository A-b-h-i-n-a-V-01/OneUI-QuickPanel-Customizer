import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Upload, Trash2, X, Clock, Layers } from 'lucide-react';

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
    setSaveMsg(ok ? '✓ Profile saved successfully!' : '✗ Save failed — storage limit exceeded.');
    if (ok) setTimeout(() => setSaveMsg(null), 2500);
  };

  const handleApply = () => {
    if (saved) {
      onApply(saved);
      onClose();
    }
  };

  const handleDelete = () => {
    if (confirm('Delete this saved profile? This action cannot be undone.')) {
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
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 16, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-heavy rounded-3xl p-6 sm:p-7 w-full max-w-lg border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#4F8CFF]/10 text-[#4F8CFF]">
                  <Layers size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">Device Profiles</h2>
                  <p className="text-xs text-gray-300">Save & load Quick Panel calibrations</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 mb-6 p-1.5 bg-black/40 border border-white/5 rounded-2xl">
              {[
                { id: 'save', label: 'Save Profile' },
                { id: 'load', label: 'Saved Profiles' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                    tab === t.id
                      ? 'bg-[#4F8CFF] text-white shadow-lg shadow-[#4F8CFF]/20 font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Save Tab Content */}
            {tab === 'save' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-medium mb-2 block">
                    Profile Name <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. Galaxy S24 Ultra — Dark Theme"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-[#4F8CFF] focus:ring-1 focus:ring-[#4F8CFF] transition-all"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="btn-primary w-full justify-center py-3 text-sm font-semibold rounded-xl"
                >
                  <Save size={16} /> Save Current Calibration
                </button>
                {saveMsg && (
                  <p
                    className={`text-xs text-center font-medium ${
                      saveMsg.startsWith('✓') ? 'text-[#34C97A]' : 'text-red-400'
                    }`}
                  >
                    {saveMsg}
                  </p>
                )}
              </div>
            )}

            {/* Load Tab Content */}
            {tab === 'load' && (
              <div className="flex flex-col gap-3">
                {saved ? (
                  <div className="glass-light rounded-2xl p-4 border border-white/10 bg-white/[0.03]">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#4F8CFF]/10 text-[#4F8CFF] mt-0.5">
                        <Clock size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {saved.label ?? 'Default Calibration Profile'}
                        </p>
                        <p className="text-xs text-gray-300 mt-1 tabular-nums">
                          Saved {new Date(saved.savedAt).toLocaleDateString()} ·{' '}
                          {saved.enabledPanels.length} panel{saved.enabledPanels.length !== 1 ? 's' : ''} ·{' '}
                          {saved.screenshotWidth}×{saved.screenshotHeight}px
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 mt-5">
                      <button
                        onClick={handleApply}
                        className="btn-primary flex-1 justify-center text-xs font-semibold py-2.5 rounded-xl"
                      >
                        <Upload size={14} /> Load Profile
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                        title="Delete Profile"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 px-4 rounded-2xl bg-black/20 border border-dashed border-white/10">
                    <Save size={32} className="mx-auto mb-3 text-gray-500 opacity-40" />
                    <p className="text-sm font-semibold text-gray-200">No saved profiles found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Switch to the <span className="text-[#4F8CFF] font-medium">Save Profile</span> tab to save your current calibration settings.
                    </p>
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
