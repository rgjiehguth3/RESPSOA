import {
  ArrowDown,
  ArrowUp,
  Box,
  FileCode,
  FileVolume,
  Languages,
  Layers,
  Sparkles,
  Tag,
  Trash2,
  Utensils,
} from 'lucide-react';
import React from 'react';
import { translations } from '../i18n/translations';
import { AppSettings, ContentType, PackItem } from '../types';
import { getStyleClasses, getThemeClasses } from '../utils/themeStyles';

interface ItemCardProps {
  key?: string;
  item: PackItem;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  settings: AppSettings;
}

export function ItemCard({
  item,
  index,
  isSelected,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  settings,
}: ItemCardProps) {
  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'bitmap':
        return <Tag className="h-3.5 w-3.5 text-amber-400" />;
      case 'prefix':
        return <Sparkles className="h-3.5 w-3.5 text-emerald-400" />;
      case 'food':
        return <Utensils className="h-3.5 w-3.5 text-orange-400" />;
      case 'sound':
        return <FileVolume className="h-3.5 w-3.5 text-cyan-400" />;
      case 'block':
        return <Box className="h-3.5 w-3.5 text-amber-600" />;
      case 'item':
        return <Layers className="h-3.5 w-3.5 text-indigo-400" />;
      case 'gui':
        return <Layers className="h-3.5 w-3.5 text-purple-400" />;
      case 'lang':
        return <Languages className="h-3.5 w-3.5 text-rose-400" />;
      case 'model':
        return <FileCode className="h-3.5 w-3.5 text-blue-400" />;
      default:
        return <Tag className="h-3.5 w-3.5 text-neutral-400" />;
    }
  };

  const isImage = item.type !== 'sound' && item.type !== 'lang' && item.type !== 'model';

  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center justify-between gap-3 p-3 border transition-all cursor-pointer ${
        isSelected
          ? `${themeCls.cardActiveBorder} bg-neutral-900/90 shadow-md`
          : 'border-neutral-800/80 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/60'
      } ${styleCls.cardShape}`}
    >
      {/* Index & Reorder handle */}
      <div className="flex flex-col items-center justify-center gap-0.5 pr-1 border-r border-neutral-800/80">
        <button
          disabled={!canMoveUp}
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          title={t.moveUp}
          className="p-1 text-neutral-500 hover:text-neutral-200 disabled:opacity-20 disabled:hover:text-neutral-500 transition-colors"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <span className="text-[10px] font-mono font-bold text-neutral-400">
          #{index + 1}
        </span>
        <button
          disabled={!canMoveDown}
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          title={t.moveDown}
          className="p-1 text-neutral-500 hover:text-neutral-200 disabled:opacity-20 disabled:hover:text-neutral-500 transition-colors"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Thumbnail */}
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-neutral-950 border border-neutral-800">
        {isImage ? (
          <img
            src={item.dataUrl}
            alt={item.name}
            className="h-full w-full object-contain p-0.5"
            style={{
              borderRadius: item.enableRounding ? `${Math.min(12, item.cornerRadius / 2)}px` : '0px',
            }}
          />
        ) : item.type === 'sound' ? (
          <FileVolume className="h-6 w-6 text-cyan-400" />
        ) : item.type === 'lang' ? (
          <Languages className="h-6 w-6 text-rose-400" />
        ) : (
          <FileCode className="h-6 w-6 text-blue-400" />
        )}
      </div>

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-semibold text-xs text-neutral-100 truncate" title={item.name}>
            {item.name}
          </span>
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800/60 px-1 py-0.2 rounded">
            → {item.targetFilename}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400">
          <span className="flex items-center gap-1">
            {getTypeIcon(item.type)}
            <span className="capitalize">{item.type}</span>
          </span>

          {(item.type === 'bitmap' || item.type === 'prefix') && (
            <span className="flex items-center gap-1 font-mono font-bold text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/20">
              char: {item.chars}
            </span>
          )}

          {(item.type === 'bitmap' || item.type === 'prefix') && (
            <span className="text-neutral-500 text-[10px]">
              {item.ascent}/{item.height}
            </span>
          )}

          {item.enableRounding && item.cornerRadius > 0 && (
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 rounded border border-emerald-500/20">
              R:{item.cornerRadius}px
            </span>
          )}
        </div>
      </div>

      {/* Quick delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title={t.deleteItem}
        className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
