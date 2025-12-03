import React, { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState, AppConfig } from '../../types';
import { THEME } from '../../constants';

interface WindowFrameProps {
  windowState: WindowState;
  appConfig: AppConfig;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  children: React.ReactNode;
}

const WindowFrame: React.FC<WindowFrameProps> = ({
  windowState,
  appConfig,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children
}) => {
  const dragControls = useDragControls();

  if (windowState.isMinimized) return null;

  return (
    <motion.div
      drag={!windowState.isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={{ scale: 0.95, opacity: 0, y: 10 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        x: windowState.isMaximized ? 0 : windowState.x,
        y: windowState.isMaximized ? 0 : windowState.y,
        width: windowState.isMaximized ? '100vw' : windowState.width,
        height: windowState.isMaximized ? 'calc(100vh - 96px)' : windowState.height, // Account for new floating dock
        zIndex: windowState.zIndex,
        borderRadius: windowState.isMaximized ? 0 : 8,
      }}
      exit={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        position: windowState.isMaximized ? 'fixed' : 'absolute',
        top: windowState.isMaximized ? 0 : 0,
        left: windowState.isMaximized ? 0 : 0,
        backgroundColor: THEME.colors.glass,
      }}
      onPointerDown={() => onFocus(windowState.id)}
      className={`
        flex flex-col overflow-hidden backdrop-blur-3xl
        transition-shadow duration-300
        ${isActive 
          ? 'shadow-[0_0_30px_rgba(168,85,247,0.15)] border border-purple-500/30' 
          : 'shadow-2xl border border-white/5'}
      `}
    >
      {/* Sci-Fi Title Bar */}
      <div 
        onPointerDown={(e) => {
          dragControls.start(e);
          onFocus(windowState.id);
        }}
        className={`
          h-9 flex items-center justify-between px-3 select-none cursor-grab active:cursor-grabbing
          border-b border-white/5
          ${isActive ? 'bg-white/5' : 'bg-transparent'}
        `}
      >
        {/* Title / App Icon */}
        <div className="flex items-center gap-2 text-white/60">
           <div className="w-4 h-4 opacity-70">{appConfig.icon}</div>
           <span className="text-xs font-semibold tracking-wide uppercase">{windowState.title}</span>
        </div>

        {/* Window Controls - Right Aligned & Geometric */}
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }}
            className="w-8 h-6 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:bg-white/5 transition-all rounded-sm"
          >
            <Minus size={12} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMaximize(windowState.id); }}
            className="w-8 h-6 flex items-center justify-center text-white/40 hover:text-purple-400 hover:bg-white/5 transition-all rounded-sm"
          >
            {windowState.isMaximized ? <Square size={10} /> : <Maximize2 size={10} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
            className="w-8 h-6 flex items-center justify-center text-white/40 hover:text-rose-500 hover:bg-red-500/10 transition-all rounded-sm"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative bg-[#050510]/60">
        {children}
      </div>
    </motion.div>
  );
};

export default WindowFrame;