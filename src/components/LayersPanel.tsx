import React from 'react';
import { type ShapeConfig } from './OverlayShape';
import { ArrowUp, ArrowDown, Copy, Edit, Eye, EyeOff, Trash2 } from 'lucide-react';

interface LayersPanelProps {
  shapes: ShapeConfig[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  shapes,
  selectedId,
  onSelect,
  onRename,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
}) => {
  const handleRename = (id: string) => {
    const newName = prompt('Enter new name for this layer');
    if (newName) onRename(id, newName);
  };

  return (
    <div className="glass-card rounded-xl p-4 border border-white/5 max-h-[400px] overflow-y-auto">
      <h3 className="text-sm font-bold text-white mb-2">Layers</h3>
      <ul className="space-y-1">
        {shapes.map((shape, idx) => (
          <li
            key={shape.id}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
              selectedId === shape.id ? 'bg-[#4F8CFF]/20' : 'hover:bg-white/5'
            }`}
            onClick={() => onSelect(shape.id)}
          >
            <div className="flex items-center space-x-2">
              {shape.visible ? (
                <Eye size={16} className="text-gray-300" />
              ) : (
                <EyeOff size={16} className="text-gray-600" />
              )}
              <span className="text-xs font-medium text-white truncate max-w-[120px]">{shape.name}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <button onClick={(e) => { e.stopPropagation(); handleRename(shape.id); }} title="Rename">
                <Edit size={14} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDuplicate(shape.id); }} title="Duplicate">
                <Copy size={14} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(shape.id); }} title={shape.visible ? 'Hide' : 'Show'}>
                {shape.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); onMoveUp(shape.id); }} title="Bring Forward" disabled={idx === shapes.length - 1}>
                <ArrowUp size={14} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onMoveDown(shape.id); }} title="Send Backward" disabled={idx === 0}>
                <ArrowDown size={14} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(shape.id); }} title="Delete">
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
