import React from 'react';
import { motion } from 'framer-motion';
import { type PanelType, type PanelMeta } from '../../types';

interface PanelCardProps {
  meta: PanelMeta;
  enabled: boolean;
  onToggle: (id: PanelType) => void;
}

export const PanelCard: React.FC<PanelCardProps> = ({ meta, enabled, onToggle }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(meta.id)}
      className={`
        relative w-full text-left rounded-2xl p-4 border transition-smooth cursor-pointer
        ${enabled
          ? 'bg-[#4F8CFF]/10 border-[#4F8CFF]/40 shadow-md shadow-[#4F8CFF]/10'
          : 'bg-white/[0.03] border-white/8 hover:border-white/15 hover:bg-white/5'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center text-xl
              ${enabled ? 'bg-[#4F8CFF]/20 text-[#4F8CFF]' : 'bg-white/5 text-gray-400'}
            `}
          >
            {meta.icon}
          </div>
          {/* Label */}
          <div>
            <p className={`text-sm font-bold leading-tight ${enabled ? 'text-white' : 'text-gray-300'}`}>
              {meta.label}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug max-w-[200px]">
              {meta.description}
            </p>
          </div>
        </div>

        {/* Toggle */}
        <div
          className={`toggle-track flex-shrink-0 ${enabled ? 'active' : ''}`}
          aria-checked={enabled}
          role="switch"
        >
          <div className="toggle-thumb" />
        </div>
      </div>

      {/* Active indicator dot */}
      {enabled && (
        <div className="absolute top-3 right-[68px] w-1.5 h-1.5 rounded-full bg-[#34C97A]" />
      )}
    </motion.button>
  );
};
