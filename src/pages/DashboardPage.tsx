import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Search, Settings, Users, LogOut } from 'lucide-react';

// Mock data for design files
const mockFiles = [
  { id: '1', name: 'My Awesome Icon.svg', type: 'SVG', lastModified: '2024-07-28', thumbnailUrl: 'https://via.placeholder.com/150/8A2BE2/FFFFFF?Text=IconSVG' },
  { id: '2', name: 'Company Logo Final.png', type: 'PNG', lastModified: '2024-07-27', thumbnailUrl: 'https://via.placeholder.com/150/32CD32/FFFFFF?Text=LogoPNG' },
  { id: '3', name: 'Website Banner Ad.jpg', type: 'JPEG', lastModified: '2024-07-26', thumbnailUrl: 'https://via.placeholder.com/150/FFD700/000000?Text=BannerJPG' },
  { id: '4', name: 'Mobile App Mockup.fig', type: 'FIGMAISH', lastModified: '2024-07-25', thumbnailUrl: 'https://via.placeholder.com/150/FF69B4/FFFFFF?Text=AppUI' },
  { id: '5', name: 'Presentation Slides.ppt', type: 'PPT', lastModified: '2024-07-24', thumbnailUrl: 'https://via.placeholder.com/150/FFA500/FFFFFF?Text=Slides' },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  console.log('DashboardPage loaded');

  const filteredFiles = mockFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    // Clear auth state here
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b dark:border-gray-800">
        <NavigationMenu className="max-w-full justify-between px-4 h-16">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/dashboard">
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " font-bold text-lg"}>
                  DesignPlatform
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} title="Profile & Settings">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </NavigationMenu>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <Sidebar title="Navigation" className="h-full">
          <nav className="flex flex-col space-y-2">
            <Button variant="ghost" className="justify-start" onClick={() => navigate('/dashboard')}>My Files</Button>
            <Button variant="ghost" className="justify-start">Shared with me</Button>
            <Button variant="ghost" className="justify-start">Team Spaces</Button>
            <Button variant="ghost" className="justify-start">Trash</Button>
          </nav>
        </Sidebar>

        <main className="flex-grow p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">My Files</h1>
            <Button onClick={() => navigate('/editor')} size="lg">
              <PlusCircle className="mr-2 h-5 w-5" /> New File
            </Button>
          </div>

          <div className="mb-6 relative">
            <Input
              type="search"
              placeholder="Search files..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {filteredFiles.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-280px)]"> {/* Adjust height as needed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredFiles.map(file => (
                  <Card key={file.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/editor/${file.id}`)}>
                    <CardContent className="p-0 aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                       <img src={file.thumbnailUrl} alt={file.name} className="object-cover w-full h-full" />
                    </CardContent>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base font-medium truncate" title={file.name}>{file.name}</CardTitle>
                      <CardDescription className="text-xs">Last modified: {file.lastModified}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No files found matching your search, or no files yet.</p>
              <Button onClick={() => navigate('/editor')} className="mt-4">Create Your First File</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;