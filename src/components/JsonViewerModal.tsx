import { Check, Copy, FileCode, X } from 'lucide-react';
import React, { useState } from 'react';
import { translations } from '../i18n/translations';
import { AppSettings } from '../types';
import { getStyleClasses, getThemeClasses } from '../utils/themeStyles';

interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultJson: string;
  packMcmeta: string;
  soundsJson: string;
  settings: AppSettings;
}

export function JsonViewerModal({
  isOpen,
  onClose,
  defaultJson,
  packMcmeta,
  soundsJson,
  settings,
}: JsonViewerModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<'font' | 'mcmeta' | 'sounds'>('font');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  const getCurrentContent = () => {
    if (activeSubTab === 'font') return defaultJson;
    if (activeSubTab === 'mcmeta') return packMcmeta;
    return soundsJson;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-3xl overflow-hidden border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} shadow-2xl flex flex-col max-h-[85vh]`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <FileCode className={`h-5 w-5 ${themeCls.accentText}`} />
            <h3 className="text-sm font-bold text-white">{t.jsonModalTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sub-tabs & Copy Button */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveSubTab('font')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                activeSubTab === 'font'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.tabDefaultJson}
            </button>
            <button
              onClick={() => setActiveSubTab('mcmeta')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                activeSubTab === 'mcmeta'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.tabPackMcmeta}
            </button>
            <button
              onClick={() => setActiveSubTab('sounds')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                activeSubTab === 'sounds'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.tabSoundsJson}
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? t.copiedText : t.copyJsonBtn}</span>
          </button>
        </div>

        {/* Code Body */}
        <div className="flex-1 p-4 overflow-auto bg-neutral-950">
          <pre className="font-mono text-xs text-amber-200/90 leading-relaxed select-all">
            {getCurrentContent() || '// Нет данных'}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-1.5 text-xs font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 ${styleCls.buttonShape}`}
          >
            {t.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
