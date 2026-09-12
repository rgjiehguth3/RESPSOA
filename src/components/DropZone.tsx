import { FileUp, FolderPlus, Sparkles, Trash2, UploadCloud } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { translations } from '../i18n/translations';
import { AppSettings, ContentType, PackItem } from '../types';
import { getCharForIndex } from '../utils/imageProcessor';
import { getStyleClasses, getThemeClasses } from '../utils/themeStyles';

interface DropZoneProps {
  onAddFiles: (files: File[]) => void;
  onLoadDemo: () => void;
  onClearAll: () => void;
  itemsCount: number;
  settings: AppSettings;
  onOutdatedLangDetected: (file: File) => void;
}

export function DropZone({
  onAddFiles,
  onLoadDemo,
  onClearAll,
  itemsCount,
  settings,
  onOutdatedLangDetected,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
    // reset
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFiles = (files: File[]) => {
    const validFiles: File[] = [];
    for (const f of files) {
      const ext = f.name.slice(f.name.lastIndexOf('.')).toLowerCase();
      if (ext === '.lang') {
        onOutdatedLangDetected(f);
      } else {
        validFiles.push(f);
      }
    }
    if (validFiles.length > 0) {
      onAddFiles(validFiles);
    }
  };

  return (
    <div className={`flex flex-col gap-3 p-4 ${themeCls.cardBg} border ${themeCls.cardBorder} ${styleCls.cardShape} ${styleCls.blurLevel}`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,audio/*,.json,.mcmeta"
      />

      {/* Main Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center p-6 text-center cursor-pointer border-2 border-dashed transition-all ${
          isDragging
            ? `${themeCls.cardActiveBorder} bg-white/10 scale-[1.01]`
            : 'border-neutral-700/80 hover:border-neutral-500 bg-neutral-900/40 hover:bg-neutral-900/70'
        } ${styleCls.cardShape}`}
      >
        <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-800/90 text-neutral-300 group-hover:scale-110 transition-transform ${themeCls.accentText}`}>
          <UploadCloud className="h-7 w-7" />
        </div>

        <h3 className="font-bold text-sm text-neutral-100 mb-1">
          {t.dropTitle}
        </h3>
        <p className="text-xs text-neutral-400 max-w-xs mb-3">
          {t.dropSubtitle}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className={`px-3.5 py-1.5 text-xs font-semibold ${themeCls.accentBg} ${themeCls.accentBgHover} ${styleCls.buttonShape}`}
        >
          <FolderPlus className="inline-block h-3.5 w-3.5 mr-1.5" />
          {t.browseFilesBtn}
        </button>
      </div>

      {/* Action shortcuts: Demo pack & Clear all */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={onLoadDemo}
          title="Загрузить тестовый набор (логотипы, звуки, модели)"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-amber-500/40 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition-colors ${styleCls.buttonShape}`}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>{t.loadDemoBtn}</span>
        </button>

        {itemsCount > 0 && (
          <button
            onClick={onClearAll}
            title={t.clearAllBtn}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 transition-colors ${styleCls.buttonShape}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t.clearAllBtn}</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
        <span>{t.itemsCount}:</span>
        <span className="font-bold text-neutral-200">{itemsCount}</span>
      </div>
    </div>
  );
}
