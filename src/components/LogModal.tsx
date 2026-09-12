import { CheckCircle, Info, Terminal, Trash2, X, XCircle } from 'lucide-react';
import React from 'react';
import { translations } from '../i18n/translations';
import { AppSettings, LogEntry } from '../types';
import { getStyleClasses, getThemeClasses } from '../utils/themeStyles';

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  onClearLogs: () => void;
  settings: AppSettings;
}

export function LogModal({
  isOpen,
  onClose,
  logs,
  onClearLogs,
  settings,
}: LogModalProps) {
  if (!isOpen) return null;

  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-3xl overflow-hidden border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} shadow-2xl flex flex-col h-[65vh]`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950/90">
          <div className="flex items-center gap-2">
            <Terminal className={`h-5 w-5 ${themeCls.accentText}`} />
            <h3 className="text-sm font-bold text-white">{t.logsTitle}</h3>
            <span className="text-xs font-mono text-neutral-500">({logs.length})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearLogs}
              title={t.clearLogsBtn}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-rose-400 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{t.clearLogsBtn}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Log Entries */}
        <div className="flex-1 p-4 overflow-y-auto bg-neutral-950/90 font-mono text-xs space-y-1.5 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-center text-neutral-600 py-12">
              Журнал операций пуст
            </div>
          ) : (
            logs.map((log) => {
              let color = 'text-neutral-300';
              let Icon = Info;
              if (log.level === 'success') {
                color = 'text-emerald-400';
                Icon = CheckCircle;
              } else if (log.level === 'warn') {
                color = 'text-amber-400';
                Icon = Info;
              } else if (log.level === 'error') {
                color = 'text-rose-400';
                Icon = XCircle;
              }
              return (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-neutral-500 shrink-0 select-none">[{log.timestamp}]</span>
                  <Icon className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${color}`} />
                  <span className={color}>{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
