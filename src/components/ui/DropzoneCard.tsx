import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, X } from 'lucide-react';

interface DropzoneCardProps {
  title: string;
  description: string;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  accept?: Record<string, string[]>;
  icon?: React.ReactNode;
  compact?: boolean;
}

export const DropzoneCard: React.FC<DropzoneCardProps> = ({
  title,
  description,
  previewUrl,
  onFileSelect,
  onClear,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
  icon,
  compact = false,
}) => {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFileSelect(accepted[0]);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  if (previewUrl) {
    return (
      <div className="glass-light rounded-2xl overflow-hidden border border-white/5 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-[#34C97A]" />
            <span className="text-sm font-semibold text-white">{title}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="p-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-fast"
            title="Remove"
          >
            <X size={14} />
          </button>
        </div>
        <div className={`relative bg-[#0d0e12] ${compact ? 'h-24' : 'h-40'}`}>
          <img
            src={previewUrl}
            alt={title}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        relative rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center
        text-center cursor-pointer transition-smooth
        ${compact ? 'min-h-[100px]' : 'min-h-[160px]'}
        ${isDragActive
          ? 'border-[#4F8CFF] bg-[#4F8CFF]/8 scale-[0.98]'
          : 'border-white/10 bg-white/[0.02] hover:border-[#4F8CFF]/50 hover:bg-[#4F8CFF]/5'
        }
      `}
    >
      <input {...getInputProps()} />
      <div
        className={`
          p-3 rounded-2xl mb-3 transition-smooth
          ${isDragActive ? 'bg-[#4F8CFF]/20 text-[#4F8CFF]' : 'bg-white/5 text-gray-400'}
        `}
      >
        {icon ?? <Upload size={22} />}
      </div>
      <p className="text-sm font-semibold text-white mb-1">{title}</p>
      <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">{description}</p>
      {isDragActive && (
        <p className="text-xs text-[#4F8CFF] font-semibold mt-2">Drop it here!</p>
      )}
    </div>
  );
};
