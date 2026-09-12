import {
  Clock,
  Download,
  FileBox,
  FileCode,
  FolderSync,
  History as HistoryIcon,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import React from 'react';
import { translations } from '../../i18n/translations';
import { AppSettings, HistoryOperation } from '../../types';
import { getStyleClasses, getThemeClasses } from '../../utils/themeStyles';

interface HistoryTabProps {
  history: HistoryOperation[];
  onRepeatOperation: (op: HistoryOperation) => void;
  onClearHistory: () => void;
  settings: AppSettings;
}

export function HistoryTab({
  history,
  onRepeatOperation,
  onClearHistory,
  settings,
}: HistoryTabProps) {
  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  const exportHistoryJson = () => {
    const data = {
      operations: history.map((op) => ({
        date: op.date,
        files: op.fileNames,
        types: op.types,
        pack_version: op.packVersion,
        output_zip: op.outputZipName,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'respsoa_history.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className={`p-5 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HistoryIcon className={`h-5 w-5 ${themeCls.accentText}`} />
            <span>{t.historyTitle}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {t.historySubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={exportHistoryJson}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded transition-colors"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span>{t.exportHistoryBtn}</span>
              </button>
              <button
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 rounded transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t.clearHistoryBtn}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className={`flex flex-col items-center justify-center p-12 text-center border border-dashed border-neutral-800 ${themeCls.cardBg} ${styleCls.cardShape}`}>
          <Clock className="h-12 w-12 text-neutral-600 mb-3" />
          <h4 className="text-sm font-bold text-neutral-300 mb-1">{t.emptyHistory}</h4>
          <p className="text-xs text-neutral-500 max-w-sm">
            После первой успешной сборки ресурспака здесь появится запись с деталями, списком файлов и возможностью повтора в 1 клик.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((op) => (
            <div
              key={op.id}
              className={`p-4 border border-neutral-800 ${themeCls.cardBg} ${styleCls.cardShape} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {op.outputZipName}
                  </span>
                  <span className="text-xs text-neutral-300 font-semibold">
                    Версия MC: {op.packVersion}
                  </span>
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(op.date).toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 text-[11px] text-neutral-400">
                  <span className="text-neutral-500">Файлы ({op.fileNames.length}):</span>
                  {op.fileNames.slice(0, 5).map((fn, i) => (
                    <span key={i} className="font-mono bg-neutral-900 px-1.5 py-0.5 rounded text-neutral-300">
                      {fn}
                    </span>
                  ))}
                  {op.fileNames.length > 5 && (
                    <span className="text-neutral-500">+{op.fileNames.length - 5} ещё</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onRepeatOperation(op)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold ${themeCls.accentBg} ${styleCls.buttonShape}`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{t.repeatOperationBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
