import React, { ReactNode } from 'react';

export enum AppID {
  FINDER = 'finder',
  SETTINGS = 'settings',
  TERMINAL = 'terminal',
  BROWSER = 'browser',
  NEXUS_AI = 'nexus_ai',
  MEDIA_PLAYER = 'media_player',
  APP_STORE = 'app_store',
  CALCULATOR = 'calculator'
}

export interface AppConfig {
  id: AppID;
  title: string;
  icon: ReactNode;
  component: React.FC<WindowProps>;
  defaultWidth: number;
  defaultHeight: number;
  allowMultiple?: boolean;
}

export interface WindowState {
  id: string;
  appId: AppID;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
}

export interface WindowProps {
  windowId: string;
  isActive: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  date?: string;
  children?: FileItem[];
  content?: string; // For mock file content
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  appId: AppID;
}

export interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  glass: string;
  glassBorder: string;
}

export interface SystemConfig {
  wifi: boolean;
  bluetooth: boolean;
  displayRes: number;
  volume: number;
  isMuted: boolean;
  security: boolean;
  performance: number;
  language: number;
  theme: number;
  account: string;
}
