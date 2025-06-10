import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Custom Components
import MainToolbar from '@/components/editor/MainToolbar';
import Sidebar from '@/components/layout/Sidebar'; // Note: This is custom Sidebar, not shadcn
import LayerTreeItemComponent, { LayerTreeItemProps as CustomLayerTreeItemProps } from '@/components/editor/LayerTreeItem';
import InteractiveCanvas from '@/components/editor/InteractiveCanvas';
import DynamicPropertiesPanel, { SelectedObjectProperties } from '@/components/editor/DynamicPropertiesPanel';
// AdvancedColorPicker is used within DynamicPropertiesPanel, but can be imported if needed directly.
// import AdvancedColorPicker from '@/components/editor/AdvancedColorPicker';

// Shadcn UI Components
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { FileText, FolderOpen, Save, Upload, Download, Settings, HelpCircle, Home, ChevronLeft, Search } from 'lucide-react';

// Extended LayerTreeItemProps for page state management
interface PageLayerTreeItem extends CustomLayerTreeItemProps {
  children?: PageLayerTreeItem[];
}

const initialLayersData: PageLayerTreeItem[] = [
  { id: 'group1', name: 'Header Elements', type: 'group', isVisible: true, isSelected: false, isGroup: true, isExpanded: true, onToggleVisibility: () => {}, onSelect: () => {}, onToggleExpand: () => {},
    children: [
      { id: 'layer1', name: 'Logo.svg', type: 'image', isVisible: true, isSelected: false, depth: 1, onToggleVisibility: () => {}, onSelect: () => {} },
      { id: 'layer2', name: 'Welcome Text', type: 'text', isVisible: true, isSelected: false, depth: 1, onToggleVisibility: () => {}, onSelect: () => {} },
    ]
  },
  { id: 'shape1', name: 'Background Rect', type: 'shape', isVisible: true, isSelected: false, onToggleVisibility: () => {}, onSelect: () => {} },
];

const EditorPage = () => {
  const navigate = useNavigate();
  const { fileId } = useParams<{ fileId?: string }>();
  console.log(`EditorPage loaded for fileId: ${fileId || 'new file'}`);

  const [layers, setLayers] = useState<PageLayerTreeItem[]>(initialLayersData);
  const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
  const [currentTool, setCurrentTool] = useState<string>('select');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const selectedObject = React.useMemo(() => {
    if (selectedObjectIds.length === 1) {
      // Find the selected object in a potentially nested structure
      const findObject = (items: PageLayerTreeItem[], id: string): PageLayerTreeItem | null => {
        for (const item of items) {
          if (item.id === id) return item;
          if (item.children) {
            const foundChild = findObject(item.children, id);
            if (foundChild) return foundChild;
          }
        }
        return null;
      };
      const obj = findObject(layers, selectedObjectIds[0]);
      if (obj) {
        return { // Map to SelectedObjectProperties
          id: obj.id,
          type: obj.type,
          x: Math.random() * 100, // Placeholder
          y: Math.random() * 100, // Placeholder
          width: 50 + Math.random() * 100, // Placeholder
          height: 50 + Math.random() * 100, // Placeholder
          fillColor: '#aabbcc', // Placeholder
          strokeColor: '#333333', // Placeholder
          strokeWidth: 1, // Placeholder
          opacity: 1, // Placeholder
          rotation: 0, // Placeholder
        } as SelectedObjectProperties;
      }
    }
    return null;
  }, [selectedObjectIds, layers]);

  const handleToolSelect = (toolId: string) => {
    console.log("Tool selected:", toolId);
    setCurrentTool(toolId);
  };

  const handleLayerPropertyChange = (objectId: string, property: string, value: any) => {
    console.log(`Property change for ${objectId}: ${property} = ${value}`);
    // Update layers state - This would be a complex operation in a real app
    // For now, just log. In a real app, you'd update the specific layer's property.
    // Example: find the layer and update its corresponding value, then setLayers(...).
  };

  const toggleVisibility = useCallback((id: string) => {
    // Placeholder: implement actual logic
    console.log("Toggle visibility for", id);
    setLayers(prev => prev.map(l => l.id === id ? {...l, isVisible: !l.isVisible} : l));
  }, []);

  const handleSelectLayer = useCallback((id: string, shiftKey: boolean) => {
    // Placeholder: implement actual logic
    console.log("Select layer", id, "Shift:", shiftKey);
    setSelectedObjectIds(prev => {
        if (shiftKey) {
            return prev.includes(id) ? prev.filter(selId => selId !== id) : [...prev, id];
        }
        return [id];
    });
  }, []);
  
  const toggleExpand = useCallback((id: string) => {
    // Placeholder: implement actual logic
    console.log("Toggle expand for", id);
     setLayers(prevLayers => 
        prevLayers.map(layer => 
            layer.id === id && layer.isGroup ? { ...layer, isExpanded: !layer.isExpanded } : layer
        )
    );
  }, []);


  const renderLayerItems = (items: PageLayerTreeItem[], currentDepth = 0): React.ReactNode[] => {
    return items.flatMap(item => {
      const itemNode = (
        <ContextMenuTrigger key={item.id}>
          <LayerTreeItemComponent
            {...item}
            depth={currentDepth}
            isSelected={selectedObjectIds.includes(item.id)}
            onToggleVisibility={() => toggleVisibility(item.id)}
            onSelect={(id, shift) => handleSelectLayer(id, shift)}
            onToggleExpand={item.isGroup ? () => toggleExpand(item.id) : undefined}
          />
        </ContextMenuTrigger>
      );
      const childrenNodes = item.isGroup && item.isExpanded && item.children 
        ? renderLayerItems(item.children, currentDepth + 1)
        : [];
      return [itemNode, ...childrenNodes];
    });
  };


  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col h-screen bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        {/* Top Menu Bar */}
        <Menubar className="rounded-none border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New File <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
              <MenubarItem>Open File... <MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Save <MenubarShortcut>⌘S</MenubarShortcut></MenubarItem>
              <MenubarItem>Save As...</MenubarItem>
              <MenubarSeparator />
              <DialogTrigger asChild><MenubarItem onSelect={() => setIsExportDialogOpen(true)}>Export... <MenubarShortcut>⌘E</MenubarShortcut></MenubarItem></DialogTrigger>
              <MenubarSeparator />
              <MenubarItem onClick={() => navigate('/dashboard')}>Back to Dashboard</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu><MenubarTrigger>Edit</MenubarTrigger>{/* ... */}</MenubarMenu>
          <MenubarMenu><MenubarTrigger>View</MenubarTrigger>{/* ... */}</MenubarMenu>
          <MenubarMenu><MenubarTrigger>Object</MenubarTrigger>{/* ... */}</MenubarMenu>
          <MenubarMenu><MenubarTrigger>Help</MenubarTrigger>{/* ... */}</MenubarMenu>
        </Menubar>

        {/* Main Toolbar for Tools */}
        <MainToolbar onToolSelect={handleToolSelect} />

        <div className="flex flex-grow overflow-hidden">
          {/* Left Sidebar: Layers Panel */}
          <Sidebar title="Layers & Assets" className="bg-white dark:bg-gray-850 border-r dark:border-gray-700 w-72">
             <div className="p-2 border-b dark:border-gray-700">
                <Input placeholder="Search layers..." className="h-8" />
            </div>
            <ScrollArea className="flex-grow p-2">
                <ContextMenu> {/* ContextMenu for general layer actions */}
                    <ContextMenuContent>
                        <ContextMenuItem>New Layer</ContextMenuItem>
                        <ContextMenuItem>New Group</ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem>Delete Selected</ContextMenuItem>
                    </ContextMenuContent>
                    {/* Layers will be rendered here */}
                    {renderLayerItems(layers)}
                </ContextMenu>
                 {/* Example Accordion usage if needed for multiple sections */}
                <Accordion type="single" collapsible className="w-full mt-4">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Assets</AccordionTrigger>
                        <AccordionContent>
                        Placeholder for reusable components or assets.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ScrollArea>
          </Sidebar>

          {/* Center: Interactive Canvas */}
          <main className="flex-grow flex flex-col relative bg-gray-300 dark:bg-gray-700">
            <InteractiveCanvas backgroundColor="bg-gray-400 dark:bg-gray-600">
              {/* Selected tool: {currentTool}, Zoom: {zoomLevel}% */}
              {/* Render selected objects or drawing guides here */}
            </InteractiveCanvas>
            {/* Canvas Controls (Zoom, Pan - placeholder) */}
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-2 rounded shadow-lg flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => setZoomLevel(z => Math.max(10, z - 10))}><Search className="h-4 w-4 rotate-90" />-</Button></TooltipTrigger>
                <TooltipContent><p>Zoom Out</p></TooltipContent>
              </Tooltip>
              <Input type="number" value={zoomLevel} onChange={e => setZoomLevel(parseInt(e.target.value))} className="w-16 h-8 text-center" /> %
               <Tooltip>
                <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => setZoomLevel(z => Math.min(500, z + 10))}><Search className="h-4 w-4 rotate-90"/>+</Button></TooltipTrigger>
                <TooltipContent><p>Zoom In</p></TooltipContent>
              </Tooltip>
            </div>
          </main>

          {/* Right Sidebar: Properties Panel */}
          <Sidebar title="Properties" className="bg-white dark:bg-gray-850 border-l dark:border-gray-700 w-80">
            <ScrollArea className="flex-grow">
              <DynamicPropertiesPanel
                selectedObject={selectedObject}
                onPropertyChange={handleLayerPropertyChange}
              />
              {/* Example direct use of other components */}
              <div className="p-4 mt-4 border-t dark:border-gray-700">
                <h3 className="text-sm font-semibold mb-2">Canvas Options</h3>
                <Select defaultValue="light" onValueChange={(value) => console.log("Canvas theme changed:", value)}>
                    <SelectTrigger><SelectValue placeholder="Canvas Theme" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light Grid</SelectItem>
                        <SelectItem value="dark">Dark Grid</SelectItem>
                        <SelectItem value="none">No Grid</SelectItem>
                    </SelectContent>
                </Select>
                <div className="mt-2">
                    <label className="text-xs">Grid Opacity</label>
                    <Slider defaultValue={[50]} max={100} step={1} onValueChange={(value) => console.log("Grid opacity:", value[0])}/>
                </div>
              </div>
            </ScrollArea>
          </Sidebar>
        </div>

        {/* Export Dialog */}
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Design</DialogTitle>
              <DialogDescription>Choose your export format and settings.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Export options form elements here */}
              <Select defaultValue="svg">
                <SelectTrigger><SelectValue placeholder="Format" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="svg">SVG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPEG</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" defaultValue="1" label="Scale" /> X
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => { console.log("Exporting..."); setIsExportDialogOpen(false); }}>Export</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default EditorPage;