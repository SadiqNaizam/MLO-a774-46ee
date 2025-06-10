import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input'; // shadcn input for hex
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // For a more complex picker UI

interface AdvancedColorPickerProps {
  color: string; // Current color in hex, rgb, or similar
  onChange: (newColor: string) => void;
  label?: string;
}

const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({
  color,
  onChange,
  label = "Color",
}) => {
  console.log("Rendering AdvancedColorPicker component with color:", color);
  const [internalColor, setInternalColor] = useState(color);

  useEffect(() => {
    setInternalColor(color);
  }, [color]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalColor(event.target.value);
    // Basic validation or conversion could happen here
    onChange(event.target.value);
  };

  // For a truly "advanced" picker, you'd integrate a library or build custom UI
  // with sliders for HSL/RGB, swatches, opacity, etc.
  // This is a simplified version using a popover and a text input.

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-10 h-10 p-0 border">
            <div
              className="w-full h-full rounded-sm"
              style={{ backgroundColor: internalColor }}
              title={`Current color: ${internalColor}`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          {/* Placeholder for a more complex color picker UI (e.g., react-color or custom) */}
          <div className="p-4 space-y-2">
            <p className="text-sm font-medium">{label}</p>
            <Input
              type="color"
              value={internalColor.startsWith('#') ? internalColor : '#000000'} // HTML color input requires hex
              onChange={handleInputChange}
              className="w-full h-8 p-0 border-none cursor-pointer"
            />
            <Input
              type="text"
              value={internalColor}
              onChange={handleInputChange}
              placeholder="#RRGGBB"
              className="mt-1"
            />
            <p className="text-xs text-gray-500">Using basic HTML color picker for now.</p>
          </div>
        </PopoverContent>
      </Popover>
      <Input
        type="text"
        value={internalColor}
        onChange={handleInputChange}
        placeholder="#RRGGBB or color name"
        className="flex-grow"
        aria-label={label}
      />
    </div>
  );
}

export default AdvancedColorPicker;