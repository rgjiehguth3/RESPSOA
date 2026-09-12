import {
  Bookmark,
  Check,
  Globe,
  Image as ImageIcon,
  Layers,
  Palette,
  RotateCcw,
  Sliders,
  Sparkles,
  Upload,
} from 'lucide-react';
import React, { useRef } from 'react';
import { translations } from '../../i18n/translations';
import { AppSettings, FitMode, SizePresetId, StyleId, ThemeId } from '../../types';
import { SIZE_PRESETS, generateDefaultPackIcon } from '../../utils/imageProcessor';
import { getStyleClasses, getThemeClasses } from '../../utils/themeStyles';
import { MINECRAFT_VERSIONS } from '../../utils/versionMapper';

interface SettingsTabProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  onApplyProfile: (profileName: string) => void;
}

export function SettingsTab({
  settings,
  updateSettings,
  onApplyProfile,
}: SettingsTabProps) {
  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);
  const packIconInputRef = useRef<HTMLInputElement | null>(null);

  const themes: Array<{ id: ThemeId; title: string; color: string }> = [
    { id: 'warm-sunset', title: t.themeWarmSunset, color: 'from-rose-500 to-amber-500' },
    { id: 'forest-night', title: t.themeForestNight, color: 'from-emerald-600 to-teal-400' },
    { id: 'purple-cyan', title: t.themePurpleCyan, color: 'from-purple-500 to-cyan-400' },
  ];

  const styles: Array<{ id: StyleId; title: string }> = [
    { id: 'classic', title: t.styleClassic },
    { id: 'modern', title: t.styleModern },
    { id: 'nature', title: t.styleNature },
    { id: 'minimal', title: t.styleMinimal },
  ];

  const handleCustomPackIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        updateSettings({ customPackPngDataUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPackIcon = () => {
    updateSettings({ customPackPngDataUrl: null });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className={`p-5 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape}`}>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sliders className={`h-5 w-5 ${themeCls.accentText}`} />
          <span>{t.settingsTitle}</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Настройте поведение генератора, версии Minecraft, стилистику и параметры скругления углов.
        </p>
      </div>

      {/* Profiles Quick Switcher */}
      <div className={`p-5 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} space-y-3`}>
        <div className="flex items-center gap-2 text-sm font-bold text-neutral-100">
          <Bookmark className="h-4 w-4 text-amber-400" />
          <span>{t.settingsProfilesSection}</span>
        </div>
        <p className="text-xs text-neutral-400">{t.profilesHint}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => onApplyProfile('logos')}
            className={`p-3 text-left rounded-lg border transition-all ${
              settings.activeProfile === 'logos'
                ? 'border-amber-400 bg-amber-500/15 text-white'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
            }`}
          >
            <div className="font-bold text-xs">{t.profileLogos}</div>
            <div className="text-[10px] text-neutral-400 mt-1">
              Размер 256x256, ascent 30, height 35
            </div>
          </button>

          <button
            onClick={() => onApplyProfile('prefixes')}
            className={`p-3 text-left rounded-lg border transition-all ${
              settings.activeProfile === 'prefixes'
                ? 'border-amber-400 bg-amber-500/15 text-white'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
            }`}
          >
            <div className="font-bold text-xs">{t.profilePrefixes}</div>
            <div className="text-[10px] text-neutral-400 mt-1">
              Оригинальный размер, ascent 7, height 9
            </div>
          </button>

          <button
            onClick={() => onApplyProfile('sounds')}
            className={`p-3 text-left rounded-lg border transition-all ${
              settings.activeProfile === 'sounds'
                ? 'border-amber-400 bg-amber-500/15 text-white'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
            }`}
          >
            <div className="font-bold text-xs">{t.profileSounds}</div>
            <div className="text-[10px] text-neutral-400 mt-1">
              Версия 1.21.9+, sounds.json
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Themes & Styles */}
        <div className={`p-5 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} space-y-4`}>
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-100">
            <Palette className="h-4 w-4 text-rose-400" />
            <span>{t.settingsThemeSection}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Цветовая тема:
            </label>
            <div className="space-y-2">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => updateSettings({ theme: th.id })}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                    settings.theme === th.id
                      ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                      : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-3.5 w-3.5 rounded-full bg-gradient-to-r ${th.color}`} />
                    <span className="text-xs">{th.title}</span>
                  </div>
                  {settings.theme === th.id && <Check className="h-4 w-4 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Стиль оформления интерфейса:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((st) => (
                <button
                  key={st.id}
                  onClick={() => updateSettings({ style: st.id })}
                  className={`p-2 rounded border text-left text-xs transition-all ${
                    settings.style === st.id
                      ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                      : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:bg-neutral-900'
                  }`}
                >
                  <span className="block font-medium">{st.title.split(' ')[0]}</span>
                  <span className="text-[10px] text-neutral-500 truncate block">
                    {st.title.slice(st.title.indexOf('('))}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Language toggle in settings */}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-neutral-400" />
              Язык приложения:
            </span>
            <div className="flex rounded-md border border-neutral-800 bg-neutral-900 p-0.5">
              <button
                onClick={() => updateSettings({ language: 'ru' })}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  settings.language === 'ru' ? 'bg-amber-500 text-black' : 'text-neutral-400'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => updateSettings({ language: 'en' })}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  settings.language === 'en' ? 'bg-amber-500 text-black' : 'text-neutral-400'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Minecraft Version & Pack metadata */}
        <div className={`p-5 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} space-y-4`}>
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-100">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>{t.settingsVersionSection}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              {t.targetVersionLabel}
            </label>
            <select
              value={settings.minecraftVersion}
              onChange={(e) => updateSettings({ minecraftVersion: e.target.value })}
              className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs font-mono text-amber-300 outline-none"
            >
              {MINECRAFT_VERSIONS.map((v) => (
                <option key={v.version} value={v.version}>
                  {v.version} — {v.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-neutral-500 mt-1">{t.versionRangeHint}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              {t.packNameLabel}
            </label>
            <input
              type="text"
              value={settings.packName}
              onChange={(e) => updateSettings({ packName: e.target.value })}
              className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-200 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              {t.namespaceLabel}
            </label>
            <input
              type="text"
              value={settings.namespace}
              onChange={(e) => updateSettings({ namespace: e.target.value })}
              className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-200 outline-none font-mono"
            />
          </div>

          {/* pack.png icon settings */}
          <div className="pt-2 border-t border-neutral-800">
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Иконка ресурспака (pack.png):
            </label>
            <div className="flex items-center gap-3">
              <img
                src={settings.customPackPngDataUrl || generateDefaultPackIcon()}
                alt="Pack Icon Preview"
                className="h-16 w-16 rounded border border-neutral-700 bg-neutral-950 p-1 object-contain"
              />
              <div className="flex flex-col gap-1.5">
                <input
                  ref={packIconInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleCustomPackIcon}
                />
                <button
                  type="button"
                  onClick={() => packIconInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Загрузить свою иконку</span>
                </button>
                {settings.customPackPngDataUrl && (
                  <button
                    type="button"
                    onClick={handleResetPackIcon}
                    className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-amber-400"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Сбросить на стандартную (256x256)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Default Presets & Fonts */}
      <div className={`p-5 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} grid grid-cols-1 md:grid-cols-2 gap-6`}>
        {/* Image Defaults */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-100">
            <ImageIcon className="h-4 w-4 text-emerald-400" />
            <span>{t.settingsImageSection}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">
              {t.defaultPresetLabel}
            </label>
            <select
              value={settings.defaultSizePreset}
              onChange={(e) => updateSettings({ defaultSizePreset: e.target.value as SizePresetId })}
              className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-200 outline-none"
            >
              {Object.entries(SIZE_PRESETS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label} — {val.desc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-400">
                {t.defaultRoundingLabel}
              </label>
              <span className="font-mono text-xs text-amber-400">
                {settings.defaultCornerRadius}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="64"
              value={settings.defaultCornerRadius}
              onChange={(e) => updateSettings({ defaultCornerRadius: parseInt(e.target.value, 10) || 0 })}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">
              {t.propFitMode}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ defaultFitMode: 'contain' })}
                className={`py-1.5 text-xs rounded border text-center transition-colors ${
                  settings.defaultFitMode === 'contain'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
              >
                {t.fitModeContain}
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ defaultFitMode: 'cover' })}
                className={`py-1.5 text-xs rounded border text-center transition-colors ${
                  settings.defaultFitMode === 'cover'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
              >
                {t.fitModeCover}
              </button>
            </div>
          </div>
        </div>

        {/* Font Defaults */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-100">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{t.settingsJsonSection}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                {t.ascentPrefixLabel}
              </label>
              <input
                type="number"
                value={settings.defaultAscentPrefix}
                onChange={(e) => updateSettings({ defaultAscentPrefix: parseInt(e.target.value, 10) || 0 })}
                className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-200 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                {t.heightPrefixLabel}
              </label>
              <input
                type="number"
                value={settings.defaultHeightPrefix}
                onChange={(e) => updateSettings({ defaultHeightPrefix: parseInt(e.target.value, 10) || 1 })}
                className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-200 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                {t.ascentLogoLabel}
              </label>
              <input
                type="number"
                value={settings.defaultAscentLogo}
                onChange={(e) => updateSettings({ defaultAscentLogo: parseInt(e.target.value, 10) || 0 })}
                className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-200 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                {t.heightLogoLabel}
              </label>
              <input
                type="number"
                value={settings.defaultHeightLogo}
                onChange={(e) => updateSettings({ defaultHeightLogo: parseInt(e.target.value, 10) || 1 })}
                className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-200 outline-none font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
