import {
  Archive,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { translations } from '../../i18n/translations';
import { AppSettings, PackItem } from '../../types';
import { getStyleClasses, getThemeClasses } from '../../utils/themeStyles';
import { getVersionInfo, MINECRAFT_VERSIONS } from '../../utils/versionMapper';
import { AnimeMascot } from '../AnimeDecorations';
import { DropZone } from '../DropZone';
import { ItemCard } from '../ItemCard';
import { ItemSettingsPanel } from '../ItemSettingsPanel';

interface ResourcePackTabProps {
  items: PackItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onUpdateItem: (id: string, updated: Partial<PackItem>) => void;
  onDeleteItem: (id: string) => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  onAddFiles: (files: File[]) => void;
  onLoadDemo: () => void;
  onClearAll: () => void;
  onOutdatedLangDetected: (file: File) => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export function ResourcePackTab({
  items,
  selectedItemId,
  onSelectItem,
  onUpdateItem,
  onDeleteItem,
  onMoveItem,
  onAddFiles,
  onLoadDemo,
  onClearAll,
  onOutdatedLangDetected,
  settings,
  onUpdateSettings,
}: ResourcePackTabProps) {
  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  const selectedItem = items.find((i) => i.id === selectedItemId) || null;
  const versionInfo = getVersionInfo(settings.minecraftVersion);

  return (
    <div className="space-y-5">
      {/* ⚠️ Top Bar: Minecraft Version Selection (Mandatory Section 3.4) */}
      <div
        className={`p-4 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} flex flex-wrap items-center justify-between gap-4 shadow-lg`}
      >
        <div className="flex items-center gap-3.5">
          <AnimeMascot theme={settings.theme} size="md" mood="cheer" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" />
                {t.selectVersionLabel || 'Версия Minecraft:'}
              </span>
              {versionInfo.isNewSchema ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <CheckCircle2 className="h-3 w-3" />
                  min/max_format: {versionInfo.minFormat} (1.21.9+)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  pack_format: {versionInfo.packFormat}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              pack.mcmeta сгенерируется строго по стандарту для выбранной версии
            </p>
          </div>
        </div>

        {/* Version Selector Dropdown & Pack Name */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-950/80 border border-neutral-700/60 rounded-lg px-3 py-1.5 shadow-inner">
            <span className="text-xs text-neutral-400 font-medium">Версия:</span>
            <select
              value={settings.minecraftVersion}
              onChange={(e) => onUpdateSettings({ minecraftVersion: e.target.value })}
              className="bg-transparent text-xs font-bold text-amber-300 outline-none cursor-pointer pr-2"
            >
              {MINECRAFT_VERSIONS.map((v) => (
                <option key={v.version} value={v.version} className="bg-neutral-900 text-white">
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-neutral-950/80 border border-neutral-700/60 rounded-lg px-3 py-1.5 shadow-inner">
            <span className="text-xs text-neutral-400 font-medium">Имя пака:</span>
            <input
              type="text"
              value={settings.packName}
              onChange={(e) => onUpdateSettings({ packName: e.target.value })}
              placeholder="respack"
              className="bg-transparent text-xs font-bold text-neutral-100 outline-none w-28 sm:w-36"
            />
          </div>
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Dropzone & Upload Actions (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <DropZone
            onAddFiles={onAddFiles}
            onLoadDemo={onLoadDemo}
            onClearAll={onClearAll}
            itemsCount={items.length}
            settings={settings}
            onOutdatedLangDetected={onOutdatedLangDetected}
          />

          {/* Quick Tips */}
          <div
            className={`p-4 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} text-xs text-neutral-400 space-y-2`}
          >
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Авто-нумерация и структура</span>
            </div>
            <p className="leading-relaxed">
              Картинки шрифтов кладутся в{' '}
              <code className="text-amber-300 font-mono">textures/font/logo*.png</code>, а список
              провайдеров генерируется в{' '}
              <code className="text-amber-300 font-mono">font/default.json</code>.
            </p>
          </div>
        </div>

        {/* Center Column: Items List with Thumbnails & Drag/Reorder (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-neutral-100">
                {t.itemsCount} ({items.length})
              </h3>
            </div>
            {items.length > 1 && (
              <span className="text-[11px] text-neutral-400 italic">{t.reorderHint}</span>
            )}
          </div>

          {items.length === 0 ? (
            <div
              className={`flex flex-col items-center justify-center p-12 text-center border border-dashed border-neutral-800 ${themeCls.cardBg} ${styleCls.cardShape}`}
            >
              <Archive className="h-12 w-12 text-neutral-600 mb-3 animate-bounce" />
              <h4 className="text-sm font-bold text-neutral-200 mb-1">{t.emptyItemsTitle}</h4>
              <p className="text-xs text-neutral-400 max-w-sm mb-4">{t.emptyItemsDesc}</p>
              <button
                onClick={onLoadDemo}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold ${themeCls.accentBg} ${themeCls.accentBgHover} ${styleCls.buttonShape}`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t.loadDemoBtn}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 scrollbar-thin">
              {items.map((item, idx) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={idx}
                  isSelected={item.id === selectedItemId}
                  onSelect={() => onSelectItem(item.id)}
                  onDelete={() => onDeleteItem(item.id)}
                  onMoveUp={() => onMoveItem(idx, idx - 1)}
                  onMoveDown={() => onMoveItem(idx, idx + 1)}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < items.length - 1}
                  settings={settings}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Item Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 sticky top-20">
          <ItemSettingsPanel
            item={selectedItem}
            onUpdateItem={(updated) => selectedItem && onUpdateItem(selectedItem.id, updated)}
            onDelete={() => selectedItem && onDeleteItem(selectedItem.id)}
            settings={settings}
          />
        </div>
      </div>
    </div>
  );
}
