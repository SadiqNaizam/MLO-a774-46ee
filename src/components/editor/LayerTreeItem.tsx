import React from 'react';
import { Eye, EyeOff, ChevronDown, ChevronRight, GripVertical } from 'lucide-react'; // Example icons
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'; // For selection

interface LayerTreeItemProps {
  id: string;
  name: string;
  type: 'group' | 'shape' | 'image' | 'text'; // Example types
  isVisible: boolean;
  isSelected: boolean;
  isGroup?: boolean;
  isExpanded?: boolean; // For groups
  depth?: number; // For indentation
  onToggleVisibility: (id: string) => void;
  onSelect: (id: string, shiftKey: boolean) => void;
  onToggleExpand?: (id: string) => void; // For groups
  // onDragStart, onDragOver, onDrop etc. for reordering
}

const LayerTreeItem: React.FC<LayerTreeItemProps> = ({
  id,
  name,
  // type, // Not used in this basic example, but good for icons or styling
  isVisible,
  isSelected,
  isGroup,
  isExpanded,
  depth = 0,
  onToggleVisibility,
  onSelect,
  onToggleExpand,
}) => {
  console.log("Rendering LayerTreeItem component:", name);

  const handleSelect = (event: React.MouseEvent) => {
    onSelect(id, event.shiftKey);
  };

  return (
    <div
      className={`flex items-center p-1.5 pr-2 space-x-2 text-sm hover:bg-gray-100 rounded ${isSelected ? 'bg-blue-100 hover:bg-blue-200' : ''}`}
      style={{ paddingLeft: `${depth * 1.25 + 0.375}rem` }} // 0.375rem is base padding (p-1.5)
      onClick={handleSelect}
    >
      <GripVertical size={14} className="text-gray-400 cursor-grab flex-shrink-0" />
      {isGroup && (
        <Button variant="ghost" size="icon-xs" onClick={(e) => { e.stopPropagation(); onToggleExpand?.(id); }} className="h-5 w-5">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </Button>
      )}
      {!isGroup && <div className="w-5 flex-shrink-0"></div> /* Placeholder for non-groups */}

      {/* <Checkbox
        checked={isSelected}
        onCheckedChange={() => onSelect(id, false)} // Simplified selection for checkbox
        onClick={(e) => e.stopPropagation()}
        className="mr-2"
        aria-label={`Select ${name}`}
      /> */}

      <span className="flex-grow truncate" title={name}>{name}</span>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={(e) => { e.stopPropagation(); onToggleVisibility(id); }}
        title={isVisible ? "Hide layer" : "Show layer"}
        className="h-5 w-5"
      >
        {isVisible ? <Eye size={14} /> : <EyeOff size={14} className="text-gray-400" />}
      </Button>
    </div>
  );
}

export default LayerTreeItem;