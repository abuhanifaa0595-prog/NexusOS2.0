import React, { useState, useEffect } from 'react';
import { Wifi, Bluetooth, Monitor, User, Volume2, Moon, Shield, Cpu, Globe, WifiOff, VolumeX, Activity, RefreshCw, AlertCircle } from 'lucide-react';
import { WindowProps } from '../../types';
import { Kernel } from '../../services/Kernel';

const SystemSettings: React.FC<WindowProps> = () => {
  // Load initial configuration from Kernel
  const [config, setConfig] = useState(Kernel.settings.get());

  // Save to Kernel whenever config changes
  useEffect(() => {
    Kernel.settings.update(config);
  }, [config]);

  // Simulated Live Metrics
  const [metrics, setMetrics] = useState({ cpu: 15, ram: 45, storage: 70 });

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 25) + 5,
        ram: Math.floor(Math.random() * 10) + 40,
        storage: 70
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Toggle Handlers
  const handlers = {
    wifi: () => setConfig(prev => ({ ...prev, wifi: !prev.wifi })),
    bluetooth: () => setConfig(prev => ({ ...prev, bluetooth: !prev.bluetooth })),
    display: () => setConfig(prev => ({ ...prev, displayRes: (prev.displayRes + 1) % 3 })),
    audio: () => setConfig(prev => ({ ...prev, isMuted: !prev.isMuted })),
    security: () => setConfig(prev => ({ ...prev, security: !prev.security })),
    perf: () => setConfig(prev => ({ ...prev, performance: (prev.performance + 1) % 3 })),
    lang: () => setConfig(prev => ({ ...prev, language: (prev.language + 1) % 4 })),
    theme: () => setConfig(prev => ({ ...prev, theme: (prev.theme + 1) % 2 })),
    account: () => setConfig(prev => ({ ...prev, account: prev.account === 'Administrator' ? 'Guest User' : 'Administrator' })),
  };

  // Option Maps
  const resMap = ['4K HDR @ 144Hz', '1440p @ 240Hz', '1080p @ 360Hz'];
  const perfMap = ['Power Saver', 'Balanced', 'Overclocked'];
  const langMap = ['English (US)', 'Español', '日本語', 'Français'];
  const themeMap = ['Neon Dark', 'Cyber Light'];

  return (
    <div className="flex flex-col h-full bg-[#050510] text-white overflow-y-auto p-6 md:p-8 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#050510]/95 backdrop-blur-xl py-2 z-10 border-b border-white/5 pb-4">
        <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">System Configuration</h1>
            <p className="text-slate-400 text-sm mt-1">Nexus Core v2.4.0 // {config.account}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-600 p-[2px] shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <User size={20} className="text-white" />
            </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <SettingTile 
          icon={config.wifi ? <Wifi /> : <WifiOff />} 
          title="Network" 
          status={config.wifi ? "Connected: Nexus_5G" : "Offline"} 
          color={config.wifi ? "text-cyan-400" : "text-slate-500"}
          isActive={config.wifi}
          onClick={handlers.wifi}
        />
        <SettingTile 
          icon={<Bluetooth />} 
          title="Bluetooth" 
          status={config.bluetooth ? "3 Devices Paired" : "Disabled"} 
          color={config.bluetooth ? "text-blue-400" : "text-slate-500"}
          isActive={config.bluetooth}
          onClick={handlers.bluetooth}
        />
        <SettingTile 
          icon={<Monitor />} 
          title="Display" 
          status={resMap[config.displayRes]} 
          color="text-purple-400"
          isActive={true}
          onClick={handlers.display}
        />
        <SettingTile 
          icon={config.isMuted ? <VolumeX /> : <Volume2 />} 
          title="Audio" 
          status={config.isMuted ? "Muted" : `Volume: ${config.volume}%`} 
          color={config.isMuted ? "text-red-400" : "text-rose-400"}
          isActive={!config.isMuted}
          onClick={handlers.audio}
        />
        <SettingTile 
          icon={config.security ? <Shield /> : <AlertCircle />} 
          title="Security" 
          status={config.security ? "Firewall Active" : "Protection Off"} 
          color={config.security ? "text-green-400" : "text-orange-500"}
          isActive={config.security}
          onClick={handlers.security}
        />
        <SettingTile 
          icon={<Cpu />} 
          title="Performance" 
          status={perfMap[config.performance]} 
          color="text-yellow-400"
          isActive={true}
          onClick={handlers.perf}
        />
        <SettingTile 
          icon={<Globe />} 
          title="Language" 
          status={langMap[config.language]} 
          color="text-orange-400"
          isActive={true}
          onClick={handlers.lang}
        />
        <SettingTile 
          icon={<RefreshCw />} 
          title="Account" 
          status={config.account} 
          color="text-indigo-400"
          isActive={true}
          onClick={handlers.account}
        />
        <SettingTile 
          icon={<Moon />} 
          title="Theme" 
          status={themeMap[config.theme]} 
          color="text-slate-300"
          isActive={true}
          onClick={handlers.theme}
        />
      </div>

      {/* Resource Monitor */}
      <div className="mt-auto bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={100} />
        </div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10">
          <Activity size={14} className="text-cyan-400" /> 
          Real-time Diagnostics
        </h2>
        <div className="space-y-6 relative z-10">
            <StatBar label="CPU Load" value={`${metrics.cpu}%`} percent={metrics.cpu} color="bg-cyan-500" />
            <StatBar label="Memory" value={`${(metrics.ram / 100 * 64).toFixed(1)} GB`} percent={metrics.ram} color="bg-purple-500" />
            <StatBar label="Storage" value="2.1TB Free" percent={metrics.storage} color="bg-green-500" />
        </div>
      </div>

    </div>
  );
};

const SettingTile = ({ icon, title, status, color, isActive, onClick }: any) => (
    <button 
      onClick={onClick}
      className={`
        relative overflow-hidden text-left w-full
        bg-white/5 border transition-all duration-300 rounded-xl p-4 group
        ${isActive 
          ? 'border-white/20 hover:bg-white/10 hover:border-white/30 shadow-lg shadow-black/20' 
          : 'border-transparent opacity-60 hover:opacity-80 bg-black/20'}
      `}
    >
        <div className={`mb-3 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ${color}`}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className="font-semibold text-sm tracking-wide text-gray-100">{title}</div>
        <div className={`text-xs mt-1 transition-colors ${isActive ? 'text-slate-400' : 'text-slate-600'}`}>{status}</div>
        
        {/* Active Indicator Glow */}
        {isActive && (
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none`} />
        )}
    </button>
);

const StatBar = ({ label, value, percent, color }: any) => (
    <div className="flex items-center gap-4 text-xs">
        <div className="w-16 text-slate-400 font-medium">{label}</div>
        <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div 
              className={`h-full ${color} transition-all duration-1000 ease-out`} 
              style={{ width: `${percent}%`, boxShadow: `0 0 10px ${color}` }} 
            />
        </div>
        <div className="w-16 text-right text-slate-300 font-mono">{value}</div>
    </div>
);

export default SystemSettings;
