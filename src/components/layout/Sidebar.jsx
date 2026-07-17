import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home, Upload, Layers, Sliders, Image, Eye, Download,
  Save, CheckCircle, Circle, Dot
} from 'lucide-react';
import { PANEL_META, PAGE_ORDER } from '../../types';
import { SaveLoadModal } from '../ui/SaveLoadModal';




const PAGE_META = {
  home:              { label: 'Home',            icon: <Home size={15} />,      short: 'Home' },
  upload:            { label: 'Upload Screenshot', icon: <Upload size={15} />,   short: 'Screenshot' },
  'panel-select':    { label: 'Select Panels',   icon: <Layers size={15} />,    short: 'Panels' },
  calibration:       { label: 'Calibration',     icon: <Sliders size={15} />,   short: 'Calibrate' },
  'wallpaper-upload':{ label: 'Upload Wallpaper',icon: <Image size={15} />,     short: 'Wallpaper' },
  editor:            { label: 'Wallpaper Editor',icon: <Sliders size={15} />,   short: 'Editor' },
  preview:           { label: 'Preview',         icon: <Eye size={15} />,       short: 'Preview' },
  export:            { label: 'Export PNGs',     icon: <Download size={15} />,  short: 'Export' },
};

export const Sidebar = ({
  currentPage,
  enabledPanels,
  completedPages,
  onNavigate,
  onSave,
  onLoad,
  onApply,
  onDelete,
  isOpen = false,
  onClose,
}) => {
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const sidebarContent = ({ showClose = false } = {}) => (
    <div className="glass-heavy border-r border-white/5 flex flex-col w-56 h-full flex-shrink-0 min-h-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#3770E0] flex items-center justify-center font-black text-white text-sm shadow-lg shadow-[#4F8CFF]/30">
            UI
          </div>
          <div>
            <p className="text-sm font-black text-white leading-tight">DIY OneUI</p>
            <p className="text-[9px] text-gray-500 font-medium tracking-wide uppercase">Quick Panel Editor</p>
          </div>
        </div>
        {showClose && onClose && (
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg text-gray-400">
            ✕
          </button>
        )}
      </div>

      {/* Navigation Steps */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider px-2 mb-2">Workflow</p>
          {PAGE_ORDER.map((page) => {
            const meta = PAGE_META[page];
            const isActive = currentPage === page;
            const isDone = completedPages.has(page);

            return (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`
                  relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left w-full transition-fast
                  ${isActive
                    ? 'bg-[#4F8CFF]/15 text-white border border-[#4F8CFF]/30'
                    : isDone
                    ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                    : 'text-gray-600 hover:text-gray-400 hover:bg-white/3'
                  }
                `}
              >
                {/* Status icon */}
                <span className={isDone ? 'text-[#34C97A]' : isActive ? 'text-[#4F8CFF]' : 'text-gray-700'}>
                  {isDone ? <CheckCircle size={14} /> : isActive ? meta.icon : <Circle size={14} />}
                </span>
                <span className="text-xs font-semibold flex-1 truncate">{meta.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#4F8CFF] rounded-r"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Enabled Panels */}
        {enabledPanels.length > 0 && (
          <div className="px-4 py-4 border-t border-white/5">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-3">Enabled Panels</p>
            <div className="flex flex-col gap-1.5">
              {enabledPanels.map((id) => (
                <div key={id} className="flex items-center gap-2">
                  <Dot size={16} className="text-[#4F8CFF] flex-shrink-0" />
                  <span className="text-xs text-gray-400">{PANEL_META[id].label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={() => setSaveModalOpen(true)}
            className="btn-secondary w-full justify-center text-xs py-2.5"
          >
            <Save size={13} /> Save Calibration
          </button>
        </div>
      </div>
  );

  return (
    <>
      {/* Desktop view */}
      <aside className="hidden md:flex flex-col flex-shrink-0 w-56 h-full">
        {sidebarContent()}
      </aside>

      {/* Mobile Drawer view */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 flex md:hidden"
          style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ x: -220 }}
            animate={{ x: 0 }}
            exit={{ x: -220 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full w-56 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent({ showClose: true })}
          </motion.div>
        </div>
      )}

      <SaveLoadModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={onSave}
        onLoad={onLoad}
        onApply={onApply}
        onDelete={onDelete}
      />
    </>
  );
};
