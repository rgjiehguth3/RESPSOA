import {
  Box,
  Check,
  FileCode,
  FileVolume,
  Languages,
  Layers,
  RotateCcw,
  Sliders,
  Sparkles,
  Tag,
  Trash2,
  Utensils,
} from 'lucide-react';
import React from 'react';
import { translations } from '../i18n/translations';
import { AppSettings, ContentType, FitMode, PackItem, SizePresetId } from '../types';
import {
  SIZE_PRESETS,
  UNICODE_CHARS_PRIMARY,
  UNICODE_CHARS_SECONDARY,
} from '../utils/imageProcessor';
import { getStyleClasses, getThemeClasses } from '../utils/themeStyles';

interface ItemSettingsPanelProps {
  item: PackItem | null;
  onUpdateItem: (updated: Partial<PackItem>) => void;
  onDelete: () => void;
  settings: AppSettings;
}

export function ItemSettingsPanel({
  item,
  onUpdateItem,
  onDelete,
  settings,
}: ItemSettingsPanelProps) {
  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  if (!item) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center border border-dashed border-neutral-800 ${themeCls.cardBg} ${styleCls.cardShape} min-h-[380px]`}>
        <Sliders className="h-10 w-10 text-neutral-600 mb-3 animate-pulse" />
        <h4 className="text-sm font-semibold text-neutral-300 mb-1">{t.inspectorTitle}</h4>
        <p className="text-xs text-neutral-500 max-w-xs">{t.selectAnItemPrompt}</p>
      </div>
    );
  }

  const contentTypes: Array<{ type: ContentType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { type: 'bitmap', label: t.typeBadgeBitmap, icon: Tag },
    { type: 'prefix', label: t.typeBadgePrefix, icon: Sparkles },
    { type: 'food', label: t.typeBadgeFood, icon: Utensils },
    { type: 'sound', label: t.typeBadgeSound, icon: FileVolume },
    { type: 'block', label: t.typeBadgeBlock, icon: Box },
    { type: 'item', label: t.typeBadgeItem, icon: Layers },
    { type: 'gui', label: t.typeBadgeGui, icon: Layers },
    { type: 'lang', label: t.typeBadgeLang, icon: Languages },
    { type: 'model', label: t.typeBadgeModel, icon: FileCode },
    { type: 'particle', label: t.typeBadgeParticle, icon: Sparkles },
    { type: 'pack_icon', label: t.typeBadgePackIcon, icon: Tag },
  ];

  const isFontItem = item.type === 'bitmap' || item.type === 'prefix';
  const isImageItem = item.type !== 'sound' && item.type !== 'lang' && item.type !== 'model';

  const handleTypeChange = (newType: ContentType) => {
    let newAscent = item.ascent;
    let newHeight = item.height;
    let newPreset = item.sizePreset;

    if (newType === 'bitmap') {
      newAscent = settings.defaultAscentLogo;
      newHeight = settings.defaultHeightLogo;
      newPreset = 'logo-standard';
    } else if (newType === 'prefix') {
      newAscent = settings.defaultAscentPrefix;
      newHeight = settings.defaultHeightPrefix;
      newPreset = 'original';
    }

    onUpdateItem({
      type: newType,
      ascent: newAscent,
      height: newHeight,
      sizePreset: newPreset,
    });
  };

  return (
    <div className={`flex flex-col gap-4 p-4 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} ${styleCls.blurLevel}`}>
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-2">
          <Sliders className={`h-4 w-4 ${themeCls.accentText}`} />
          <h3 className="text-sm font-bold text-neutral-100">{t.inspectorTitle}</h3>
        </div>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-500/10 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{t.deleteItem}</span>
        </button>
      </div>

      {/* Target Filename */}
      <div>
        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
          {t.propTargetName}
        </label>
        <input
          type="text"
          value={item.targetFilename}
          onChange={(e) => onUpdateItem({ targetFilename: e.target.value })}
          className="w-full rounded bg-neutral-950 px-2.5 py-1.5 text-xs text-neutral-100 font-mono border border-neutral-800 focus:border-amber-500 outline-none"
        />
      </div>

      {/* Content Type Selector */}
      <div>
        <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5">
          {t.propType}
        </label>
        <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
          {contentTypes.map((ct) => {
            const Icon = ct.icon;
            const isSelected = item.type === ct.type;
            return (
              <button
                key={ct.type}
                type="button"
                onClick={() => handleTypeChange(ct.type)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-left border rounded transition-all ${
                  isSelected
                    ? `${themeCls.accentBg} font-bold border-transparent`
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <Icon className="h-3 w-3 shrink-0" />
                <span className="truncate">{ct.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font specific fields: chars, ascent, height */}
      {isFontItem && (
        <div className="flex flex-col gap-3 rounded-lg border border-neutral-800/80 bg-neutral-950/40 p-3">
          <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Параметры шрифта (default.json)
          </span>

          {/* Chars Dropdown / Manual */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-neutral-400">
                {t.propChars}
              </label>
              <span className="text-[10px] text-neutral-500">Unicode glyph</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={item.chars}
                onChange={(e) => onUpdateItem({ chars: e.target.value })}
                className="flex-1 rounded bg-neutral-900 border border-neutral-800 px-2 py-1.5 text-xs text-amber-300 font-mono font-bold outline-none"
              >
                <optgroup label="Первичные (① ... ⓿)">
                  {UNICODE_CHARS_PRIMARY.map((ch) => (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Вторичные (Ⓐ ... Ⓩ)">
                  {UNICODE_CHARS_SECONDARY.map((ch) => (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* Manual input */}
              <input
                type="text"
                maxLength={4}
                value={item.chars}
                onChange={(e) => onUpdateItem({ chars: e.target.value })}
                className="w-14 text-center rounded bg-neutral-900 border border-neutral-800 py-1.5 text-xs text-amber-300 font-mono font-bold outline-none"
                placeholder="Свой"
              />
            </div>
          </div>

          {/* Ascent & Height */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                {t.propAscent}
              </label>
              <input
                type="number"
                value={item.ascent}
                onChange={(e) => onUpdateItem({ ascent: parseInt(e.target.value, 10) || 0 })}
                className="w-full rounded bg-neutral-900 border border-neutral-800 px-2 py-1 text-xs text-neutral-200 font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                {t.propHeight}
              </label>
              <input
                type="number"
                value={item.height}
                onChange={(e) => onUpdateItem({ height: parseInt(e.target.value, 10) || 1 })}
                className="w-full rounded bg-neutral-900 border border-neutral-800 px-2 py-1 text-xs text-neutral-200 font-mono outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Image manipulation fields: Presets, Rounding, FitMode */}
      {isImageItem && (
        <div className="flex flex-col gap-3 rounded-lg border border-neutral-800/80 bg-neutral-950/40 p-3">
          <span className="text-[11px] font-bold text-neutral-300">
            Обработка изображения
          </span>

          {/* Size Preset */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
              {t.propSizePreset}
            </label>
            <select
              value={item.sizePreset}
              onChange={(e) => onUpdateItem({ sizePreset: e.target.value as SizePresetId })}
              className="w-full rounded bg-neutral-900 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-200 outline-none cursor-pointer"
            >
              <optgroup label="Квадрат (1:1)">
                <option value="square-16">16×16 — Иконка / Текстура</option>
                <option value="square-32">32×32 — HD Иконка</option>
                <option value="square-64">64×64 — GUI / Блок</option>
                <option value="square-128">128×128 — Логотип</option>
                <option value="square-256">256×256 — Стандарт (256x256)</option>
                <option value="square-512">512×512 — HD (512x512)</option>
              </optgroup>
              <optgroup label="Префикс (прямоугольник)">
                <option value="prefix-48-16">48×16 (3:1)</option>
                <option value="prefix-64-16">64×16 (4:1)</option>
                <option value="prefix-96-16">96×16 (6:1)</option>
                <option value="prefix-128-16">128×16 (8:1)</option>
                <option value="prefix-192-16">192×16 (12:1)</option>
                <option value="prefix-256-16">256×16 (16:1)</option>
              </optgroup>
              <optgroup label="Особые">
                <option value="custom">Кастомный размер</option>
                <option value="original">Исходный размер</option>
              </optgroup>
            </select>
          </div>

          {/* Custom dimensions if chosen */}
          {item.sizePreset === 'custom' && (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Ширина (px)"
                value={item.customWidth || 256}
                onChange={(e) => onUpdateItem({ customWidth: parseInt(e.target.value, 10) || 16 })}
                className="rounded bg-neutral-900 border border-neutral-800 px-2 py-1 text-xs text-neutral-200 outline-none"
              />
              <input
                type="number"
                placeholder="Высота (px)"
                value={item.customHeight || 256}
                onChange={(e) => onUpdateItem({ customHeight: parseInt(e.target.value, 10) || 16 })}
                className="rounded bg-neutral-900 border border-neutral-800 px-2 py-1 text-xs text-neutral-200 outline-none"
              />
            </div>
          )}

          {/* Fit Mode */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
              {t.propFitMode}
            </label>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => onUpdateItem({ fitMode: 'contain' })}
                className={`px-2 py-1 text-[11px] rounded border text-center transition-colors ${
                  item.fitMode === 'contain'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
              >
                {t.fitModeContain}
              </button>
              <button
                type="button"
                onClick={() => onUpdateItem({ fitMode: 'cover' })}
                className={`px-2 py-1 text-[11px] rounded border text-center transition-colors ${
                  item.fitMode === 'cover'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
              >
                {t.fitModeCover}
              </button>
            </div>
          </div>

          {/* Corner Rounding with anti-aliasing */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.enableRounding}
                  onChange={(e) => onUpdateItem({ enableRounding: e.target.checked })}
                  className="rounded border-neutral-700 text-amber-500 focus:ring-0"
                />
                <span>{t.propCornerRounding}</span>
              </label>
              <span className="font-mono text-xs font-bold text-amber-400">
                {item.enableRounding ? `${item.cornerRadius}px` : 'Выкл'}
              </span>
            </div>

            {item.enableRounding && (
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="128"
                  value={item.cornerRadius}
                  onChange={(e) => onUpdateItem({ cornerRadius: parseInt(e.target.value, 10) || 0 })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Preview Before / After */}
      {isImageItem && (
        <div className="rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3">
          <span className="block text-[11px] font-semibold text-neutral-400 mb-2">
            {t.previewBeforeAfter}
          </span>
          <div className="flex items-center justify-around gap-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-neutral-500">До</span>
              <div className="h-16 w-16 overflow-hidden rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center p-1">
                <img src={item.dataUrl} alt="Before" className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-amber-400 font-semibold">После (в паке)</span>
              <div className="h-16 w-16 overflow-hidden bg-neutral-900 border border-amber-500/40 flex items-center justify-center p-1"
                   style={{ borderRadius: item.enableRounding ? `${Math.min(24, item.cornerRadius / 2)}px` : '0px' }}>
                <img src={item.dataUrl} alt="After" className="max-h-full max-w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
