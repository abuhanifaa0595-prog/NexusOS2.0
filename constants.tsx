import React from 'react';
import { 
  Folder, 
  Settings, 
  Terminal, 
  Globe, 
  Bot, 
  Music, 
  ShoppingBag, 
  Calculator,
  Cpu,
  Search,
  LayoutGrid
} from 'lucide-react';
import { AppID, AppConfig, FileItem } from './types';
import FileManager from './components/Apps/FileManager';
import SystemSettings from './components/Apps/SystemSettings';
import TerminalApp from './components/Apps/TerminalApp';
import Browser from './components/Apps/Browser';
import NexusAI from './components/Apps/NexusAI';
import MediaPlayer from './components/Apps/MediaPlayer';
import AppStore from './components/Apps/AppStore';

export const THEME = {
  colors: {
    primary: '#a855f7', // Purple 500
    accent: '#06b6d4', // Cyan 500
    glass: 'rgba(10, 10, 20, 0.75)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    text: '#ffffff',
    textDim: '#94a3b8',
    neonGlow: '0 0 20px rgba(168, 85, 247, 0.4)',
  },
  animations: {
    spring: { type: "spring", stiffness: 300, damping: 30 },
    ease: { duration: 0.2, ease: "easeInOut" }
  }
};

export const APPS: Record<AppID, AppConfig> = {
  [AppID.NEXUS_AI]: {
    id: AppID.NEXUS_AI,
    title: 'Nexus AI',
    icon: <Bot className="w-full h-full text-purple-400" />,
    component: NexusAI,
    defaultWidth: 450,
    defaultHeight: 600,
    allowMultiple: false,
  },
  [AppID.FINDER]: {
    id: AppID.FINDER,
    title: 'Data Grid',
    icon: <Folder className="w-full h-full text-cyan-400" />,
    component: FileManager,
    defaultWidth: 900,
    defaultHeight: 550,
  },
  [AppID.BROWSER]: {
    id: AppID.BROWSER,
    title: 'HoloNet',
    icon: <Globe className="w-full h-full text-blue-400" />,
    component: Browser,
    defaultWidth: 1100,
    defaultHeight: 700,
  },
  [AppID.TERMINAL]: {
    id: AppID.TERMINAL,
    title: 'Terminal',
    icon: <Terminal className="w-full h-full text-green-400" />,
    component: TerminalApp,
    defaultWidth: 700,
    defaultHeight: 450,
  },
  [AppID.SETTINGS]: {
    id: AppID.SETTINGS,
    title: 'Sys Config',
    icon: <Settings className="w-full h-full text-gray-300" />,
    component: SystemSettings,
    defaultWidth: 800,
    defaultHeight: 550,
  },
  [AppID.MEDIA_PLAYER]: {
    id: AppID.MEDIA_PLAYER,
    title: 'Sonic',
    icon: <Music className="w-full h-full text-rose-500" />,
    component: MediaPlayer,
    defaultWidth: 800,
    defaultHeight: 500,
  },
  [AppID.APP_STORE]: {
    id: AppID.APP_STORE,
    title: 'Market',
    icon: <ShoppingBag className="w-full h-full text-yellow-400" />,
    component: AppStore,
    defaultWidth: 900,
    defaultHeight: 600,
  },
  [AppID.CALCULATOR]: {
    id: AppID.CALCULATOR,
    title: 'Calc',
    icon: <Calculator className="w-full h-full text-orange-400" />,
    component: () => <div className="flex items-center justify-center h-full text-white font-mono">CALC_MODULE_V2</div>, 
    defaultWidth: 320,
    defaultHeight: 450,
  }
};