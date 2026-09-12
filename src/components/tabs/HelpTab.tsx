import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Keyboard,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import React from 'react';
import { translations } from '../../i18n/translations';
import { AppSettings } from '../../types';
import { getStyleClasses, getThemeClasses } from '../../utils/themeStyles';
import { MINECRAFT_VERSIONS } from '../../utils/versionMapper';

interface HelpTabProps {
  settings: AppSettings;
}

export function HelpTab({ settings }: HelpTabProps) {
  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  const hotkeys = [
    { key: 'Ctrl + S', desc: 'Собрать и скачать .zip ресурспака' },
    { key: 'Ctrl + O', desc: 'Открыть проводник для выбора файлов' },
    { key: 'Ctrl + Z', desc: 'Отменить последнее действие со списком' },
    { key: 'Delete / Backspace', desc: 'Удалить выбранный элемент' },
    { key: 'Ctrl + Shift + J', desc: 'Быстрый переход в Редактор JSON' },
    { key: 'Ctrl + 1 .. 6', desc: 'Переключение между 6 основными вкладками' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className={`p-5 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape}`}>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className={`h-5 w-5 ${themeCls.accentText}`} />
          <span>{t.helpTitle}</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Руководство по созданию кастомных логотипов, звуков, шрифтов и текстур в RESPSOA для Minecraft Java Edition.
        </p>
      </div>

      {/* Step-by-Step Guide */}
      <div className={`p-5 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} space-y-4`}>
        <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <span>Как создать свой первый ресурспак за 3 шага</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 space-y-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs">
              1
            </span>
            <h4 className="font-bold text-xs text-neutral-200">Загрузите изображения или звуки</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Перетащите ваши картинки (JPG, PNG, WebP) в зону загрузки. RESPSOA автоматически преобразует их в формат Minecraft и пронумерует: <code className="text-amber-300 font-mono">logo1.png</code>, <code className="text-amber-300 font-mono">logo2.png</code>.
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 space-y-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
              2
            </span>
            <h4 className="font-bold text-xs text-neutral-200">Настройте символы и параметры</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Для логотипов задаются Unicode-символы (<code className="text-amber-300 font-mono">①, ②</code>) и параметры ascent/height (по умолчанию 30/35 для лого и 7/9 для префиксов).
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 space-y-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs">
              3
            </span>
            <h4 className="font-bold text-xs text-neutral-200">Соберите и установите в игру</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Нажмите «Собрать ресурспак», скачайте ZIP-архив и поместите его в папку <code className="text-neutral-300 font-mono">.minecraft/resourcepacks</code>. Готово!
            </p>
          </div>
        </div>
      </div>

      {/* FAQ & Hotkeys in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAQ */}
        <div className={`p-5 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} space-y-4`}>
          <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-rose-400" />
            <span>{t.helpFaqTitle}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="rounded border border-neutral-800/80 bg-neutral-950/40 p-3">
              <h5 className="font-bold text-amber-300 mb-1">{t.faq1Q}</h5>
              <p className="text-neutral-400 leading-relaxed">{t.faq1A}</p>
            </div>

            <div className="rounded border border-neutral-800/80 bg-neutral-950/40 p-3">
              <h5 className="font-bold text-emerald-300 mb-1">{t.faq2Q}</h5>
              <p className="text-neutral-400 leading-relaxed">{t.faq2A}</p>
            </div>

            <div className="rounded border border-neutral-800/80 bg-neutral-950/40 p-3">
              <h5 className="font-bold text-cyan-300 mb-1">{t.faq3Q}</h5>
              <p className="text-neutral-400 leading-relaxed">{t.faq3A}</p>
            </div>
          </div>
        </div>

        {/* Hotkeys */}
        <div className={`p-5 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} space-y-4`}>
          <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-amber-400" />
            <span>{t.hotkeysTitle}</span>
          </h3>

          <div className="space-y-2 text-xs">
            {hotkeys.map((hk, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded border border-neutral-800/80 bg-neutral-950/40"
              >
                <kbd className="px-2 py-1 font-mono font-bold text-amber-300 bg-neutral-900 border border-neutral-700 rounded text-[11px]">
                  {hk.key}
                </kbd>
                <span className="text-neutral-300 text-right">{hk.desc}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-500">
            Горячие клавиши активны в любой вкладке приложения.
          </div>
        </div>
      </div>

      {/* Minecraft Versions Table Reference */}
      <div className={`p-5 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} space-y-3`}>
        <div className="flex items-center gap-2 text-sm font-bold text-neutral-100">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span>Таблица версий Minecraft (1.16.5 – 26.2)</span>
        </div>
        <p className="text-xs text-neutral-400">
          Справочная таблица значений pack_format для различных релизов Minecraft Java Edition:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {MINECRAFT_VERSIONS.map((v) => (
            <div
              key={v.version}
              className="p-2.5 rounded border border-neutral-800 bg-neutral-950/50 flex flex-col justify-between"
            >
              <span className="font-semibold text-xs text-neutral-200">{v.version}</span>
              <span className="font-mono text-[11px] text-amber-400 mt-1">
                {v.isNewSchema ? `min/max: ${v.packFormat}` : `pack_format: ${v.packFormat}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
