import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AppConfig, AppID } from '../../types';
import { APPS } from '../../constants';
import { Battery, Wifi, LayoutGrid, ChevronUp } from 'lucide-react';

interface DockProps {
  onOpenApp: (appId: AppID) => void;
  openApps: AppID[];
}

const Dock: React.FC<DockProps> = ({ onOpenApp, openApps }) => {
  const mouseX = useMotionValue(Infinity);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[1000] pointer-events-none">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="pointer-events-auto h-16 bg-[#0a0a14]/60 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center px-4 gap-6 shadow-2xl relative"
      >
        {/* Start / Launcher Trigger */}
        <div className="flex items-center justify-center">
            <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 hover:scale-105 hover:shadow-purple-500/40 transition-all active:scale-95 group">
                <LayoutGrid size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* Apps */}
        <div className="flex items-center gap-2">
            {Object.values(APPS).map((app) => (
            <DockIcon 
                key={app.id} 
                app={app} 
                mouseX={mouseX} 
                onClick={() => onOpenApp(app.id)}
                isOpen={openApps.includes(app.id)}
            />
            ))}
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* System Status Tray */}
        <div className="flex items-center gap-4 text-white/80">
            <div className="flex flex-col items-end text-xs mr-2 cursor-pointer hover:text-white transition-colors">
                <span className="font-bold">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-white/40">{time.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="hover:text-cyan-400 cursor-pointer transition-colors"><Wifi size={18} /></div>
                <div className="hover:text-green-400 cursor-pointer transition-colors"><Battery size={18} /></div>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                   <ChevronUp size={16} />
                </div>
            </div>
        </div>

      </motion.div>
    </div>
  );
};

const DockIcon: React.FC<{ app: AppConfig, mouseX: any, onClick: () => void, isOpen: boolean }> = ({ app, mouseX, onClick, isOpen }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [45, 60, 45]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square relative flex items-center justify-center cursor-pointer group"
      onClick={onClick}
    >
      <motion.div 
        className={`
            w-full h-full rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300
            ${isOpen 
                ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                : 'bg-transparent border-transparent hover:bg-white/5'}
            border
        `}
      >
        <div className="p-2.5 w-full h-full text-white/80 group-hover:text-white transition-colors">
            {app.icon}
        </div>
      </motion.div>
      
      {/* Active Indicator - Sci-Fi style */}
      {isOpen && (
        <div className="absolute -bottom-2 w-full flex justify-center">
            <div className="w-6 h-[2px] bg-cyan-400 shadow-[0_0_8px_cyan]" />
        </div>
      )}
      
      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1a1a2e] border border-purple-500/30 rounded-md text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
        {app.title}
        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a1a2e] border-b border-r border-purple-500/30 rotate-45"></div>
      </div>
    </motion.div>
  );
};

export default Dock;