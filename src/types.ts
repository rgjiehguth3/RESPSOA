export type ThemeId = 'warm-sunset' | 'forest-night' | 'purple-cyan';
export type StyleId = 'classic' | 'modern' | 'nature' | 'minimal';
export type Language = 'ru' | 'en';
export type NavTabId = 'pack' | 'converter' | 'json' | 'settings' | 'history' | 'help';

export type ContentType =
  | 'bitmap'
  | 'prefix'
  | 'food'
  | 'sound'
  | 'block'
  | 'item'
  | 'gui'
  | 'lang'
  | 'model'
  | 'particle'
  | 'pack_icon';

export type SizePresetId =
  | 'square-16'
  | 'square-32'
  | 'square-64'
  | 'square-128'
  | 'square-256'
  | 'square-512'
  | 'prefix-48-16'
  | 'prefix-64-16'
  | 'prefix-96-16'
  | 'prefix-128-16'
  | 'prefix-192-16'
  | 'prefix-256-16'
  | 'logo-standard'
  | 'logo-small'
  | 'logo-wide'
  | 'logo-tall'
  | 'logo-hd'
  | 'logo-4k'
  | 'custom'
  | 'original';

export type FitMode = 'contain' | 'cover';

export interface PackItem {
  id: string;
  name: string;
  file: File | null;
  dataUrl: string;
  type: ContentType;
  chars: string;
  ascent: number;
  height: number;
  sizePreset: SizePresetId;
  customWidth: number;
  customHeight: number;
  cornerRadius: number;
  enableRounding: boolean;
  fitMode: FitMode;
  targetFilename: string; // e.g. logo1.png, sound1.ogg
  sizeBytes: number;
  previewUrl?: string;
  originalWidth?: number;
  originalHeight?: number;
  isProcessing?: boolean;
}

export interface AppSettings {
  language: Language;
  theme: ThemeId;
  style: StyleId;
  showPreviewBeforeSave: boolean;
  showLogs: boolean;
  defaultSizePreset: SizePresetId;
  defaultCornerRadius: number;
  defaultFitMode: FitMode;
  defaultAscentPrefix: number;
  defaultHeightPrefix: number;
  defaultAscentLogo: number;
  defaultHeightLogo: number;
  packName: string;
  minecraftVersion: string;
  namespace: string;
  customPackPngDataUrl: string | null;
  activeProfile: string;
}

export interface SettingsProfile {
  id: string;
  name: string;
  description: string;
  settings: Partial<AppSettings>;
}

export interface HistoryOperation {
  id: string;
  date: string;
  filesCount: number;
  fileNames: string[];
  types: Record<string, ContentType>;
  packVersion: string;
  packName: string;
  outputZipName: string;
  sizeBytes: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface MinecraftVersionInfo {
  version: string;
  packFormat: number;
  isNewSchema: boolean;
  minFormat?: number;
  maxFormat?: number;
  label: string;
}
