import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search, Plus, X } from 'lucide-react';
import { WindowProps } from '../../types';

const Browser: React.FC<WindowProps> = () => {
  const [url, setUrl] = useState('https://nexus-os.demo');
  const [tabs, setTabs] = useState([{ id: 1, title: 'Welcome to Nebula', active: true }]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Tabs */}
      <div className="h-10 bg-slate-900 flex items-end px-2 gap-1 pt-2">
        {tabs.map(tab => (
          <div key={tab.id} className={`
            flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs max-w-[200px] group
            ${tab.active ? 'bg-slate-800 text-white' : 'bg-transparent text-gray-400 hover:bg-slate-800/50'}
          `}>
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="truncate flex-1">{tab.title}</span>
            <X size={12} className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-white" />
          </div>
        ))}
        <button className="p-1 hover:bg-white/10 rounded text-gray-400">
          <Plus size={16} />
        </button>
      </div>

      {/* URL Bar */}
      <div className="h-12 bg-slate-800 border-b border-white/5 flex items-center px-4 gap-3 text-gray-400">
        <div className="flex gap-2">
            <ArrowLeft size={16} className="hover:text-white cursor-pointer" />
            <ArrowRight size={16} className="hover:text-white cursor-pointer" />
            <RotateCw size={16} className="hover:text-white cursor-pointer" />
        </div>
        <div className="flex-1 bg-black/20 h-8 rounded-full flex items-center px-3 text-sm text-gray-300 border border-white/5 focus-within:ring-1 ring-blue-500">
            <Search size={14} className="mr-2" />
            <input 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                className="bg-transparent w-full outline-none" 
            />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-slate-50 overflow-hidden relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none select-none">
            <div className="text-6xl font-black text-slate-200 mb-4">NEBULA</div>
            <p>Secure. Fast. Decentralized.</p>
          </div>
          <iframe 
            src="https://www.wikipedia.org" 
            title="browser-frame"
            className="w-full h-full border-none opacity-90"
          />
      </div>
    </div>
  );
};

export default Browser;
