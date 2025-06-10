import React from 'react';
import { Button } from '@/components/ui/button'; // Example shadcn import
import { MousePointer, Pencil, Circle, Square, Type, Hand } from 'lucide-react'; // Example icons

interface Tool {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface MainToolbarProps {
  tools?: Tool[]; // Allow dynamic tools
  onToolSelect?: (toolId: string) => void; // Callback for tool selection
}

const MainToolbar: React.FC<MainToolbarProps> = ({ tools, onToolSelect }) => {
  console.log("Rendering MainToolbar component");

  const defaultTools: Tool[] = [
    { id: 'select', label: 'Select', icon: <MousePointer size={18} />, action: () => onToolSelect?.('select') },
    { id: 'draw-pencil', label: 'Pencil', icon: <Pencil size={18} />, action: () => onToolSelect?.('draw-pencil') },
    { id: 'draw-circle', label: 'Circle', icon: <Circle size={18} />, action: () => onToolSelect?.('draw-circle') },
    { id: 'draw-rect', label: 'Rectangle', icon: <Square size={18} />, action: () => onToolSelect?.('draw-rect') },
    { id: 'text', label: 'Text', icon: <Type size={18} />, action: () => onToolSelect?.('text') },
    { id: 'pan', label: 'Pan', icon: <Hand size={18} />, action: () => onToolSelect?.('pan') },
  ];

  const displayTools = tools || defaultTools;

  return (
    <div className="bg-gray-100 p-2 border-b border-gray-300 flex space-x-2 items-center justify-center">
      {displayTools.map((tool) => (
        <Button
          key={tool.id}
          variant="outline"
          size="icon"
          title={tool.label}
          onClick={tool.action}
          className="hover:bg-gray-200"
        >
          {tool.icon}
          <span className="sr-only">{tool.label}</span>
        </Button>
      ))}
      {/* Add more tools or groups of tools here */}
    </div>
  );
}

export default MainToolbar;