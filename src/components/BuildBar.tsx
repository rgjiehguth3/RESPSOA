import { Archive, Terminal, Zap } from 'lucide-react';
import React from 'react';
import { translations } from '../i18n/translations';
import { AppSettings } from '../types';
import { BuildProgress } from '../utils/packBuilder';
import { getStyleClasses, getThemeClasses } from '../utils/themeStyles';

interface BuildBarProps {
  isBuilding: boolean;
  progress: BuildProgress;
  onBuild: () => void;
  onToggleLogs: () => void;
  itemsCount: number;
  settings: AppSettings;
}

export function BuildBar({
  isBuilding,
  progress,
  onBuild,
  onToggleLogs,
  itemsCount,
  settings,
}: BuildBarProps) {
  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  return (
    <div className={`sticky bottom-0 z-30 border-t ${themeCls.cardBorder} bg-neutral-950/90 backdrop-blur-md p-3`}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        {/* Left: Log Toggle & Quick Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLogs}
            className="flex items-center gap-1.5 rounded border border-neutral-800 bg-neutral-900/90 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <Terminal className="h-3.5 w-3.5 text-amber-400" />
            <span>{t.showLogsBtn}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
            <span>{settings.packName}</span>
            <span className="text-neutral-600">•</span>
            <span className="text-amber-400 font-mono font-semibold">{settings.minecraftVersion}</span>
          </div>
        </div>

        {/* Center: Live Progress Bar when building */}
        {isBuilding && (
          <div className="flex-1 max-w-md flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-300 truncate font-mono">{progress.currentStep}</span>
              <span className="text-amber-400 font-bold ml-2">{progress.percent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className={`h-full transition-all duration-300 ${themeCls.accentBg}`}
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Right: Big Build Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBuild}
            disabled={isBuilding || itemsCount === 0}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-extrabold transition-all shadow-lg ${
              isBuilding || itemsCount === 0
                ? 'opacity-40 cursor-not-allowed bg-neutral-800 text-neutral-500'
                : `${themeCls.accentBg} ${themeCls.accentBgHover} text-black cursor-pointer hover:scale-[1.02] active:scale-[0.98]`
            } ${styleCls.buttonShape}`}
          >
            {isBuilding ? (
              <>
                <Zap className="h-4 w-4 animate-spin" />
                <span>{t.buildingPack}</span>
              </>
            ) : (
              <>
                <Archive className="h-4 w-4" />
                <span>{t.buildPackBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
