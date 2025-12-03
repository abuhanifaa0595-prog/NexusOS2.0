import React, { useState, useEffect } from 'react';
import { Folder, FileText, Image as ImageIcon, HardDrive, ChevronRight, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { WindowProps, FileItem } from '../../types';
import { Kernel } from '../../services/Kernel';

const FileManager: React.FC<WindowProps> = () => {
  // Path stores IDs of folders to navigate
  const [currentPathIds, setCurrentPathIds] = useState<string[]>([]);
  // We need to store names separately to display breadcrumbs since we only have IDs in path
  const [pathNames, setPathNames] = useState<string[]>([]);
  const [items, setItems] = useState<FileItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const refreshItems = () => {
    const files = Kernel.fs.getDirectory(currentPathIds);
    setItems([...files]); // Create copy to force re-render
  };

  useEffect(() => {
    refreshItems();
  }, [currentPathIds]);

  const handleDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPathIds([...currentPathIds, item.id]);
      setPathNames([...pathNames, item.name]);
    }
  };

  const handleNavigateUp = () => {
      if (currentPathIds.length > 0) {
          setCurrentPathIds(prev => prev.slice(0, -1));
          setPathNames(prev => prev.slice(0, -1));
      }
  };

  const handleBreadcrumbClick = (index: number) => {
      setCurrentPathIds(currentPathIds.slice(0, index + 1));
      setPathNames(pathNames.slice(0, index + 1));
  };

  const createFolder = () => {
    Kernel.fs.createFolder(currentPathIds, `New Folder ${items.length + 1}`);
    refreshItems();
  };

  const deleteItem = () => {
      if (selectedItem) {
          Kernel.fs.deleteItem(currentPathIds, selectedItem);
          setSelectedItem(null);
          refreshItems();
      }
  };

  return (
    <div className="flex flex-col h-full text-white bg-slate-900/50 backdrop-blur-xl">
      {/* Toolbar */}
      <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
         <button 
            onClick={handleNavigateUp}
            disabled={currentPathIds.length === 0}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
         >
            <ArrowLeft size={16} />
         </button>
         
         <div className="h-6 w-[1px] bg-white/10 mx-2" />

         <button 
            onClick={createFolder}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors text-xs font-medium border border-blue-500/30"
         >
            <Plus size={14} />
            <span>New Folder</span>
         </button>

         <button 
            onClick={deleteItem}
            disabled={!selectedItem}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors text-xs font-medium border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
         >
            <Trash2 size={14} />
            <span>Delete</span>
         </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-black/20 border-r border-white/5 p-4 flex flex-col gap-1">
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Locations</div>
            <SidebarItem 
                icon={<HardDrive size={16} />} 
                label="Nexus Drive" 
                active={currentPathIds.length === 0} 
                onClick={() => { setCurrentPathIds([]); setPathNames([]); }} 
            />
            {/* Mock favorites */}
            <div className="mt-4 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Favorites</div>
            <SidebarItem icon={<Folder size={16} />} label="Documents" onClick={() => {}} />
            <SidebarItem icon={<ImageIcon size={16} />} label="Images" onClick={() => {}} />
            <SidebarItem icon={<FileText size={16} />} label="System" onClick={() => {}} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
            {/* Breadcrumb */}
            <div className="h-10 border-b border-white/5 flex items-center px-4 text-sm text-gray-400">
                <span className="hover:text-white cursor-pointer" onClick={() => { setCurrentPathIds([]); setPathNames([]); }}>Home</span>
                {pathNames.map((name, i) => (
                    <React.Fragment key={i}>
                    <ChevronRight size={14} className="mx-1 opacity-50" />
                    <span 
                        className="hover:text-white cursor-pointer"
                        onClick={() => handleBreadcrumbClick(i)}
                    >{name}</span>
                    </React.Fragment>
                ))}
            </div>

            {/* Grid */}
            <div className="flex-1 p-4 grid grid-cols-4 gap-4 content-start overflow-y-auto" onClick={() => setSelectedItem(null)}>
                {items.map((item) => (
                    <div
                    key={item.id}
                    onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(item); }}
                    onClick={(e) => { e.stopPropagation(); setSelectedItem(item.id); }}
                    className={`
                        flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-200 border group
                        ${selectedItem === item.id 
                        ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                        : 'bg-white/5 border-transparent hover:bg-white/10'}
                    `}
                    >
                    <div className="w-12 h-12 flex items-center justify-center text-gray-200 transition-transform group-hover:scale-105">
                        {item.type === 'folder' ? (
                        <Folder size={40} className="fill-blue-400/20 text-blue-400" />
                        ) : item.name.endsWith('png') || item.name.endsWith('jpg') ? (
                        <ImageIcon size={40} className="text-purple-400" />
                        ) : (
                        <FileText size={40} className="text-gray-400" />
                        )}
                    </div>
                    <span className="text-xs text-center truncate w-full px-1 select-none">{item.name}</span>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="col-span-4 text-center text-gray-600 mt-10 flex flex-col items-center">
                        <Folder size={48} className="mb-2 opacity-20" />
                        <span>Folder is empty</span>
                    </div>
                )}
            </div>
            
            {/* Status Bar */}
            <div className="h-6 bg-black/20 text-xs text-gray-500 flex items-center px-4 border-t border-white/5 justify-between">
                <span>{items.length} items</span>
                <span>Free Space: 1024 PB</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-sm font-medium transition-colors
      ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
    `}
  >
    {icon}
    <span>{label}</span>
  </div>
);

export default FileManager;
