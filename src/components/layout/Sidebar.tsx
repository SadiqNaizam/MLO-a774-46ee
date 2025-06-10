import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"; // Example shadcn import

interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, className, title }) => {
  console.log("Rendering Sidebar component");
  return (
    <aside className={`w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col p-4 space-y-4 ${className}`}>
      {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
      <ScrollArea className="flex-grow">
        {children || <p className="text-sm text-gray-500">Sidebar Content</p>}
      </ScrollArea>
    </aside>
  );
}

export default Sidebar;