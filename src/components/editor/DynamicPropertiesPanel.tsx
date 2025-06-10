import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AdvancedColorPicker } from './AdvancedColorPicker'; // Assuming it will be in the same directory

// Example property structure for a selected object
interface SelectedObjectProperties {
  id: string;
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
  // ... other properties
}

interface DynamicPropertiesPanelProps {
  selectedObject: SelectedObjectProperties | null;
  onPropertyChange: (objectId: string, property: string, value: any) => void;
}

const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({
  selectedObject,
  onPropertyChange,
}) => {
  console.log("Rendering DynamicPropertiesPanel for object:", selectedObject?.id);

  if (!selectedObject) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No object selected.</p>
        </CardContent>
      </Card>
    );
  }

  const handleChange = (property: keyof SelectedObjectProperties, value: any) => {
    if (selectedObject) {
      onPropertyChange(selectedObject.id, property, value);
    }
  };

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>Properties: <span className="font-normal text-gray-700">{selectedObject.type} ({selectedObject.id.substring(0,6)})</span></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position and Size */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="prop-x">X</Label>
            <Input id="prop-x" type="number" value={selectedObject.x ?? ''} onChange={(e) => handleChange('x', parseFloat(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="prop-y">Y</Label>
            <Input id="prop-y" type="number" value={selectedObject.y ?? ''} onChange={(e) => handleChange('y', parseFloat(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="prop-width">Width</Label>
            <Input id="prop-width" type="number" value={selectedObject.width ?? ''} onChange={(e) => handleChange('width', parseFloat(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="prop-height">Height</Label>
            <Input id="prop-height" type="number" value={selectedObject.height ?? ''} onChange={(e) => handleChange('height', parseFloat(e.target.value))} />
          </div>
        </div>
        <div>
          <Label htmlFor="prop-rotation">Rotation</Label>
          <Input id="prop-rotation" type="number" value={selectedObject.rotation ?? ''} onChange={(e) => handleChange('rotation', parseFloat(e.target.value))} />
        </div>

        <Separator />

        {/* Appearance */}
        <div>
          <Label>Fill Color</Label>
          <AdvancedColorPicker
            color={selectedObject.fillColor || '#ffffff'}
            onChange={(newColor) => handleChange('fillColor', newColor)}
          />
        </div>
        <div>
          <Label>Stroke Color</Label>
          <AdvancedColorPicker
            color={selectedObject.strokeColor || '#000000'}
            onChange={(newColor) => handleChange('strokeColor', newColor)}
          />
        </div>
        <div>
          <Label htmlFor="prop-strokeWidth">Stroke Width</Label>
          <Input id="prop-strokeWidth" type="number" min="0" value={selectedObject.strokeWidth ?? ''} onChange={(e) => handleChange('strokeWidth', parseFloat(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="prop-opacity">Opacity (0-100)</Label>
          <Input id="prop-opacity" type="number" min="0" max="100" value={(selectedObject.opacity ?? 1) * 100} onChange={(e) => handleChange('opacity', parseFloat(e.target.value) / 100)} />
        </div>

        {/* Add more properties based on object type: text content, corner radius, etc. */}
      </CardContent>
    </Card>
  );
}

export default DynamicPropertiesPanel;