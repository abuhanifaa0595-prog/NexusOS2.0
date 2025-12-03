import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { AppID, WindowState } from './types';
import { APPS } from './constants';
import Dock from './components/Taskbar/Dock';
import WindowFrame from './components/Window/WindowFrame';
import LoginScreen from './components/System/LoginScreen';
import { Cloud, Cpu, Thermometer, Calendar } from 'lucide-react';
import { Kernel } from './services/Kernel'; // Initialize Kernel

type SystemPhase = 'boot' | 'login' | 'desktop';

const App: React.FC = () => {
  const [phase, setPhase] = useState<SystemPhase>('boot');
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);

  useEffect(() => {
    // Boot sequence simulation
    setTimeout(() => setPhase('login'), 2500);
  }, []);

  const handleLogin = () => {
    setPhase('desktop');
  };

  const openApp = useCallback((appId: AppID) => {
    const appConfig = APPS[appId];
    
    const existing = windows.find(w => w.appId === appId);
    if (!appConfig.allowMultiple && existing) {
      if (existing.isMinimized) {
        setWindows(prev => prev.map(w => w.id === existing.id ? { ...w, isMinimized: false } : w));
      }
      bringToFront(existing.id);
      return;
    }

    const newWindow: WindowState = {
      id: uuidv4(),
      appId,
      title: appConfig.title,
      x: 100 + (windows.length * 40),
      y: 80 + (windows.length * 40),
      width: appConfig.defaultWidth,
      height: appConfig.defaultHeight,
      zIndex: zIndexCounter + 1,
      isMinimized: false,
      isMaximized: false,
    };

    setWindows(prev => [...prev, newWindow]);
    setZIndexCounter(prev => prev + 1);
    setActiveWindowId(newWindow.id);
  }, [windows, zIndexCounter]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    bringToFront(id);
  }, []);

  const bringToFront = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zIndexCounter + 1, isMinimized: false } : w));
    setZIndexCounter(prev => prev + 1);
    setActiveWindowId(id);
  }, [zIndexCounter]);

  // Boot Screen
  if (phase === 'boot') {
    return (
      <div className="h-screen w-screen bg-[#050510] flex flex-col items-center justify-center text-white z-[9999] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin mb-8 shadow-[0_0_30px_rgba(168,85,247,0.4)]" />
            <h1 className="text-4xl font-black tracking-[0.4em] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 animate-pulse">NEXUS</h1>
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <p className="text-cyan-500/50 text-[10px] mt-4 tracking-widest uppercase">Initializing Core Systems...</p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (phase === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Desktop
  return (
    <div 
      className="h-screen w-screen relative overflow-hidden bg-cover bg-center select-none bg-[#0a0a0f]"
      style={{ 
        backgroundImage: 'url(https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop)',
      }}
    >
      {/* Dark Overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* Desktop Widgets - Left Side */}
      <div className="absolute top-8 left-8 flex flex-col gap-4 z-0 pointer-events-auto">
         {/* Widget 1: Weather */}
         <div className="w-48 bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-white hover:bg-black/30 transition-colors cursor-default group">
            <div className="flex items-center gap-3 mb-2">
                <Cloud className="text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Neo-Tokyo</span>
            </div>
            <div className="text-3xl font-light mb-1">24°C</div>
            <div className="text-xs text-white/50">Light Rain • Humidity 65%</div>
         </div>

         {/* Widget 2: System */}
         <div className="w-48 bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-white hover:bg-black/30 transition-colors cursor-default group">
            <div className="flex items-center gap-3 mb-3">
                <Cpu className="text-purple-400 group-hover:rotate-180 transition-transform duration-700" />
                <span className="font-bold">System</span>
            </div>
            <div className="space-y-2">
                <div>
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                        <span>CPU</span>
                        <span>32%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[32%]" />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                        <span>GPU</span>
                        <span>84%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 w-[84%]" />
                    </div>
                </div>
            </div>
         </div>

         {/* Widget 3: Date */}
         <div className="w-48 bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-white hover:bg-black/30 transition-colors cursor-default flex items-center gap-4">
             <div className="text-3xl font-bold text-white/80">{new Date().getDate()}</div>
             <div className="flex flex-col text-xs font-medium text-white/60 uppercase tracking-wider">
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
                <span>{new Date().toLocaleDateString('en-US', { month: 'long' })}</span>
             </div>
         </div>
      </div>

      {/* Window Manager Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <AnimatePresence>
          {windows.map(win => {
            const AppComp = APPS[win.appId].component;
            return (
              <div key={win.id} className="pointer-events-auto">
                  <WindowFrame
                    windowState={win}
                    appConfig={APPS[win.appId]}
                    isActive={activeWindowId === win.id}
                    onClose={closeWindow}
                    onMinimize={minimizeWindow}
                    onMaximize={maximizeWindow}
                    onFocus={bringToFront}
                  >
                    <AppComp windowId={win.id} isActive={activeWindowId === win.id} />
                  </WindowFrame>
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Floating Dock - Bottom */}
      <Dock 
        onOpenApp={openApp} 
        openApps={Array.from(new Set(windows.map(w => w.appId)))}
      />
    </div>
  );
};

export default App;
