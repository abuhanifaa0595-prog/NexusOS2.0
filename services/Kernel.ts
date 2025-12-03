import { v4 as uuidv4 } from 'uuid';
import { FileItem, SystemConfig } from '../types';

const FS_STORAGE_KEY = 'nexus_fs_v1';
const SETTINGS_STORAGE_KEY = 'nexus_settings_v1';

const INITIAL_FILES: FileItem[] = [
  {
    id: uuidv4(),
    name: 'Sector_7',
    type: 'folder' as const,
    date: '2124-10-24',
    children: [
      { id: uuidv4(), name: 'Blueprint_X.cad', type: 'file' as const, size: '128 MB', date: '2124-10-24' },
      { id: uuidv4(), name: 'Log_Entry_404.txt', type: 'file' as const, size: '2 KB', date: '2124-10-22' },
    ]
  },
  {
    id: uuidv4(),
    name: 'Media_Core',
    type: 'folder' as const,
    date: '2124-10-20',
    children: [
      { id: uuidv4(), name: 'Nebula_Scan.raw', type: 'file' as const, size: '4.2 GB', date: '2124-10-20' },
      { id: uuidv4(), name: 'Avatar_Config.dat', type: 'file' as const, size: '15 MB', date: '2124-09-15' },
    ]
  },
  {
    id: uuidv4(),
    name: 'Root',
    type: 'folder' as const,
    date: 'Today',
    children: [
      { id: uuidv4(), name: 'kernel_panic.log', type: 'file' as const, size: '42 KB', date: 'Today' },
    ]
  }
];

// --- File System Subsystem ---

class VirtualFileSystem {
  private root: FileItem[];

  constructor() {
    const stored = localStorage.getItem(FS_STORAGE_KEY);
    if (stored) {
      this.root = JSON.parse(stored);
    } else {
      this.root = INITIAL_FILES;
      this.save();
    }
  }

  private save() {
    localStorage.setItem(FS_STORAGE_KEY, JSON.stringify(this.root));
  }

  // Recursive search to find parent array of an item
  private findParentArray(currentDir: FileItem[], pathIds: string[]): FileItem[] | null {
    if (pathIds.length === 0) return this.root;

    let current = this.root;
    // Traverse down to the last folder ID
    for (const id of pathIds) {
      const found = current.find(item => item.id === id && item.type === 'folder');
      if (found && found.children) {
        current = found.children;
      } else {
        return null; // Invalid path
      }
    }
    return current;
  }

  public getDirectory(pathIds: string[]): FileItem[] {
    if (pathIds.length === 0) return this.root;
    const parent = this.findParentArray(this.root, pathIds); // This logic needs to be slightly different for getDirectory
    
    // Simpler approach: Resolve the array representing the folder content
    let current = this.root;
    for (const id of pathIds) {
      const found = current.find(item => item.id === id);
      if (found && found.type === 'folder' && found.children) {
        current = found.children;
      } else {
        return [];
      }
    }
    return current;
  }

  public createFolder(pathIds: string[], name: string) {
    const dir = this.getDirectory(pathIds);
    const newFolder: FileItem = {
      id: uuidv4(),
      name,
      type: 'folder',
      children: [],
      date: new Date().toISOString().split('T')[0],
      size: '--'
    };
    dir.push(newFolder);
    this.save();
    return newFolder;
  }

  public createFile(pathIds: string[], name: string, content: string = '') {
    const dir = this.getDirectory(pathIds);
    const newFile: FileItem = {
      id: uuidv4(),
      name,
      type: 'file',
      content,
      date: new Date().toISOString().split('T')[0],
      size: '1 KB'
    };
    dir.push(newFile);
    this.save();
    return newFile;
  }

  public deleteItem(pathIds: string[], itemId: string) {
    const dir = this.getDirectory(pathIds);
    const index = dir.findIndex(i => i.id === itemId);
    if (index !== -1) {
      dir.splice(index, 1);
      this.save();
    }
  }
}

// --- Settings Subsystem ---

const DEFAULT_SETTINGS: SystemConfig = {
  wifi: true,
  bluetooth: true,
  displayRes: 0,
  volume: 85,
  isMuted: false,
  security: true,
  performance: 1,
  language: 0,
  theme: 0,
  account: 'Administrator'
};

class SettingsManager {
  private config: SystemConfig;

  constructor() {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    this.config = stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  }

  public get(): SystemConfig {
    return { ...this.config };
  }

  public update(newConfig: Partial<SystemConfig>) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.config));
  }
}

// --- Kernel Export ---

class KernelService {
  public fs: VirtualFileSystem;
  public settings: SettingsManager;

  constructor() {
    this.fs = new VirtualFileSystem();
    this.settings = new SettingsManager();
  }

  public authenticate(password: string): boolean {
    // Mock authentication
    return password === 'admin' || password === '1234';
  }
}

export const Kernel = new KernelService();