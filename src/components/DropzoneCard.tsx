import React from 'react';
import { useDropzone } from 'react-dropzone';
import { CheckCircle, Trash2 } from 'lucide-react';

interface DropzoneCardProps {
  onFileSelect: (file: File) => void;
  title: string;
  description: string;
  previewUrl: string | null;
  onClear: () => void;
  icon: React.ReactNode;
}

export const DropzoneCard: React.FC<DropzoneCardProps> = ({
  onFileSelect,
  title,
  description,
  previewUrl,
  onClear,
  icon,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false,
  });

  return (
    <div className="w-full">
      {previewUrl ? (
        <div className="relative group rounded-2xl overflow-hidden bg-[#181A20] border border-white/5 flex flex-col p-4 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">
                <CheckCircle size={18} />
              </span>
              <span className="text-sm font-semibold text-white truncate max-w-[180px]">{title} Loaded</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
              title="Remove image"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-[#0d0e12]">
            <img src={previewUrl} alt={title} className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
              <span className="text-xs text-white/80 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                Click bin to remove
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[160px] ${
            isDragActive
              ? 'border-[#4F8CFF] bg-[#4F8CFF]/5 scale-[0.98]'
              : 'border-white/10 bg-[#181A20]/40 hover:border-[#4F8CFF]/50 hover:bg-[#181A20]/80'
          }`}
        >
          <input {...getInputProps()} />
          <div className={`p-3 rounded-2xl mb-3 transition-colors duration-300 ${isDragActive ? 'bg-[#4F8CFF]/20 text-[#4F8CFF]' : 'bg-white/5 text-gray-400'}`}>
            {icon}
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
          <p className="text-xs text-gray-400 max-w-[220px]">{description}</p>
        </div>
      )}
    </div>
  );
};
