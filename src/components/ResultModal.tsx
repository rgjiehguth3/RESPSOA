import { CheckCircle2, Download, Eye, FileArchive, X } from 'lucide-react';
import React from 'react';
import { translations } from '../i18n/translations';
import { AppSettings } from '../types';
import { BuildProgress } from '../utils/packBuilder';
import { getStyleClasses, getThemeClasses } from '../utils/themeStyles';
import { AnimeMascot } from './AnimeDecorations';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: BuildProgress;
  onDownloadZip: () => void;
  onViewJson: () => void;
  settings: AppSettings;
}

export function ResultModal({
  isOpen,
  onClose,
  progress,
  onDownloadZip,
  onViewJson,
  settings,
}: ResultModalProps) {
  if (!isOpen) return null;

  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  const stats = progress.stats;
  const sizeKb = stats ? (stats.sizeBytes / 1024).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-lg overflow-hidden border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} shadow-2xl`}>
        {/* Top Banner */}
        <div className={`p-6 text-center border-b border-neutral-800 bg-gradient-to-b ${themeCls.headerGrad}`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-3">
            <AnimeMascot theme={settings.theme} size="lg" mood="cheer" />
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>

          <h3 className="text-xl font-black text-white">
            {t.resultTitle}
          </h3>
          <p className="text-xs text-neutral-300 mt-1 max-w-md mx-auto">
            {t.resultDesc}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
              <span className="text-[11px] text-neutral-400 block mb-0.5">{t.statsZipSize}</span>
              <span className="text-lg font-mono font-bold text-amber-400">{sizeKb} KB</span>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
              <span className="text-[11px] text-neutral-400 block mb-0.5">{t.statsFilesCount}</span>
              <span className="text-lg font-mono font-bold text-neutral-100">{stats?.totalFiles || 0}</span>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
              <span className="text-[11px] text-neutral-400 block mb-0.5">{t.statsTargetVersion}</span>
              <span className="text-sm font-mono font-bold text-neutral-200">{settings.minecraftVersion}</span>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
              <span className="text-[11px] text-neutral-400 block mb-0.5">{t.packNameLabel}</span>
              <span className="text-sm font-mono font-semibold text-neutral-200 truncate block">
                {settings.packName}.zip
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-neutral-800 bg-neutral-950/90">
          <button
            onClick={onViewJson}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-300 border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-colors ${styleCls.buttonShape}`}
          >
            <Eye className="h-4 w-4 text-cyan-400" />
            <span>{t.viewJsonBtn}</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={onClose}
              className={`w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors ${styleCls.buttonShape}`}
            >
              {t.doneBtn}
            </button>

            <button
              onClick={onDownloadZip}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold ${themeCls.accentBg} ${themeCls.accentBgHover} shadow-lg ${styleCls.buttonShape}`}
            >
              <Download className="h-4 w-4" />
              <span>{t.downloadZipBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
