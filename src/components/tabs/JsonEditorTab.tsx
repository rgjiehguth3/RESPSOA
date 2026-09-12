import {
  AlertCircle,
  CheckCircle2,
  Code2,
  FileDown,
  FileUp,
  FolderSync,
  Plus,
  RotateCcw,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { translations } from '../../i18n/translations';
import { AppSettings, PackItem } from '../../types';
import { generateDefaultFontJson } from '../../utils/packBuilder';
import { getStyleClasses, getThemeClasses } from '../../utils/themeStyles';

interface JsonEditorTabProps {
  items: PackItem[];
  customDefaultJson: string | null;
  onSaveJsonToProject: (jsonStr: string) => void;
  settings: AppSettings;
}

export function JsonEditorTab({
  items,
  customDefaultJson,
  onSaveJsonToProject,
  settings,
}: JsonEditorTabProps) {
  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  const initialJson =
    customDefaultJson ||
    generateDefaultFontJson(items, settings.namespace);

  const [content, setContent] = useState<string>(initialJson);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    validate(content);
  }, [content]);

  const validate = (text: string) => {
    try {
      JSON.parse(text);
      setIsValid(true);
      setErrorMsg(null);
    } catch (e: unknown) {
      setIsValid(false);
      setErrorMsg(e instanceof Error ? e.message : 'Invalid JSON format');
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(content);
      setContent(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    const generated = generateDefaultFontJson(items, settings.namespace);
    setContent(generated);
  };

  const handleSave = () => {
    if (!isValid) return;
    onSaveJsonToProject(content);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleLoadFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = ev.target?.result;
      if (typeof res === 'string') {
        setContent(res);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInsertTemplate = () => {
    try {
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed.providers)) {
        parsed.providers = [];
      }
      const nextNum = parsed.providers.length + 1;
      parsed.providers.push({
        type: 'bitmap',
        file: `${settings.namespace}:font/logo${nextNum}.png`,
        ascent: settings.defaultAscentLogo,
        height: settings.defaultHeightLogo,
        chars: ['★'],
      });
      setContent(JSON.stringify(parsed, null, 2));
    } catch {
      // append fallback
      setContent(
        JSON.stringify(
          {
            providers: [
              {
                type: 'bitmap',
                file: `${settings.namespace}:font/logo1.png`,
                ascent: 30,
                height: 35,
                chars: ['①'],
              },
            ],
          },
          null,
          2
        )
      );
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleLoadFromFile}
      />

      {/* Top Header & Actions */}
      <div className={`p-4 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} flex flex-wrap items-center justify-between gap-3`}>
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className={`h-5 w-5 ${themeCls.accentText}`} />
            <span>{t.jsonEditorTitle}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {t.jsonEditorDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded transition-colors"
          >
            <FileUp className="h-3.5 w-3.5" />
            <span>{t.loadJsonFileBtn}</span>
          </button>

          <button
            onClick={handleInsertTemplate}
            title="Добавить новый bitmap-провайдер в массив providers"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Добавить провайдер</span>
          </button>

          <button
            onClick={handleFormat}
            disabled={!isValid}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 disabled:opacity-40 rounded transition-colors"
          >
            <FolderSync className="h-3.5 w-3.5" />
            <span>{t.formatJsonBtn}</span>
          </button>

          <button
            onClick={handleReset}
            title="Пересоздать JSON на основе текущих файлов во вкладке Ресурспак"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-400 hover:text-white px-2 py-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t.resetDefaultJsonBtn}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : `${themeCls.accentBg} ${themeCls.accentBgHover}`
            } ${styleCls.buttonShape}`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Сохранено в проект!</span>
              </>
            ) : (
              <>
                <FileDown className="h-3.5 w-3.5" />
                <span>{t.saveToProjectBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className={`border ${themeCls.cardBorder} rounded-lg overflow-hidden flex flex-col bg-neutral-950`}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/90 border-b border-neutral-800 text-xs">
          <div className="flex items-center gap-2">
            {isValid ? (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t.jsonValidStatus}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400 font-semibold truncate max-w-md">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {t.jsonInvalidStatus}: {errorMsg}
              </span>
            )}
          </div>

          <span className="text-[11px] font-mono text-neutral-400">
            assets/minecraft/font/default.json
          </span>
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          className="w-full h-[450px] p-4 font-mono text-xs text-amber-200/90 bg-neutral-950/95 leading-relaxed resize-y outline-none focus:ring-1 focus:ring-amber-500/50"
        />
      </div>
    </div>
  );
}
