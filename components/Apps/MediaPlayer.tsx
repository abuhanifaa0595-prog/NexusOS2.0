import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react';
import { WindowProps } from '../../types';
import { motion } from 'framer-motion';

const MediaPlayer: React.FC<WindowProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="h-full bg-black/90 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background Blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 to-blue-900/40 blur-3xl" />
        
        {/* Vinyl Art */}
        <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-64 h-64 rounded-full bg-neutral-900 border-4 border-neutral-800 shadow-2xl flex items-center justify-center relative z-10"
        >
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-4 rounded-full border border-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/5" />
            
            {/* Album Cover */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center overflow-hidden">
                <div className="w-2 h-2 bg-black rounded-full" />
            </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="h-40 bg-white/5 backdrop-blur-md border-t border-white/10 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-end">
            <div>
                <h3 className="font-bold text-lg">Stellar Drift</h3>
                <p className="text-white/50 text-sm">Neon Void</p>
            </div>
            <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-1 bg-rose-500/80 rounded-full animate-pulse`} style={{ height: isPlaying ? Math.random() * 20 + 10 : 5, animationDuration: '0.5s' }} />
                ))}
            </div>
        </div>

        {/* Progress */}
        <div className="group cursor-pointer">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: `${progress}%` }} />
            </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-6">
            <Shuffle size={16} className="text-white/40 hover:text-white cursor-pointer" />
            <SkipBack size={24} className="hover:text-white cursor-pointer" />
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
                {isPlaying ? <Pause fill="black" /> : <Play fill="black" className="ml-1" />}
            </button>
            <SkipForward size={24} className="hover:text-white cursor-pointer" />
            <Repeat size={16} className="text-white/40 hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
