import { AlertTriangle, ArrowRight, FileJson, X } from 'lucide-react';
import React from 'react';
import { translations } from '../i18n/translations';
import { AppSettings } from '../types';
import { getStyleClasses, getThemeClasses } from '../utils/themeStyles';

interface OutdatedLangModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  onAutoConvert: (jsonFile: File, jsonContent: string) => void;
  settings: AppSettings;
}

export function OutdatedLangModal({
  isOpen,
  onClose,
  file,
  onAutoConvert,
  settings,
}: OutdatedLangModalProps) {
  if (!isOpen || !file) return null;

  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  const handleConvert = async () => {
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/);
      const jsonMap: Record<string, string> = {};

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex > 0) {
          const key = trimmed.substring(0, eqIndex).trim();
          const val = trimmed.substring(eqIndex + 1).trim();
          jsonMap[key] = val;
        }
      }

      const jsonStr = JSON.stringify(jsonMap, null, 2);
      const newName = file.name.replace(/\.lang$/i, '.json');
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const convertedFile = new File([blob], newName, { type: 'application/json' });

      onAutoConvert(convertedFile, jsonStr);
      onClose();
    } catch (e) {
      console.error('Failed to convert .lang to json:', e);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-md overflow-hidden border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} shadow-2xl p-6`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-neutral-400 hover:text-white rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">{t.langModalTitle}</h3>
            <span className="text-xs text-neutral-400 font-mono">{file.name}</span>
          </div>
        </div>

        <p className="text-xs text-neutral-300 mb-6 leading-relaxed">
          {t.langModalDesc}
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className={`px-3 py-1.5 text-xs text-neutral-400 hover:text-white ${styleCls.buttonShape}`}
          >
            {t.langCancelBtn}
          </button>

          <button
            onClick={handleConvert}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold ${themeCls.accentBg} ${styleCls.buttonShape}`}
          >
            <FileJson className="h-4 w-4" />
            <span>{t.langAutoConvertBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
