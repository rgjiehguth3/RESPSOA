import JSZip from 'jszip';
import {
  Download,
  FolderArchive,
  ImageIcon,
  Sparkles,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { translations } from '../../i18n/translations';
import { AppSettings, FitMode, SizePresetId } from '../../types';
import {
  SIZE_PRESETS,
  processImageToPng,
} from '../../utils/imageProcessor';
import { getStyleClasses, getThemeClasses } from '../../utils/themeStyles';

interface ImageConverterTabProps {
  settings: AppSettings;
}

interface ConvertedItem {
  id: string;
  name: string;
  originalUrl: string;
  convertedUrl?: string;
  convertedBlob?: Blob;
  width?: number;
  height?: number;
  isProcessing: boolean;
}

export function ImageConverterTab({ settings }: ImageConverterTabProps) {
  const [items, setItems] = useState<ConvertedItem[]>([]);
  const [preset, setPreset] = useState<SizePresetId>(settings.defaultSizePreset);
  const [customWidth, setCustomWidth] = useState<number>(256);
  const [customHeight, setCustomHeight] = useState<number>(256);
  const [fitMode, setFitMode] = useState<FitMode>(settings.defaultFitMode);
  const [enableRounding, setEnableRounding] = useState<boolean>(false);
  const [cornerRadius, setCornerRadius] = useState<number>(settings.defaultCornerRadius || 16);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  const handleAddFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: ConvertedItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      const url = URL.createObjectURL(file);
      newItems.push({
        id: `img-${Date.now()}-${i}`,
        name: file.name,
        originalUrl: url,
        isProcessing: false,
      });
    }
    setItems((prev) => [...prev, ...newItems]);
  };

  const processAll = async () => {
    setIsBatchProcessing(true);
    const updated = [...items];

    for (let i = 0; i < updated.length; i++) {
      updated[i].isProcessing = true;
      setItems([...updated]);

      try {
        const result = await processImageToPng(updated[i].originalUrl, {
          preset,
          customWidth,
          customHeight,
          fitMode,
          enableRounding,
          cornerRadius,
          forceUpscale: false,
        });

        updated[i].convertedUrl = result.dataUrl;
        updated[i].convertedBlob = result.blob;
        updated[i].width = result.width;
        updated[i].height = result.height;
        updated[i].isProcessing = false;
      } catch (err) {
        console.error('Failed to convert image:', err);
        updated[i].isProcessing = false;
      }
    }

    setItems([...updated]);
    setIsBatchProcessing(false);
  };

  const downloadSingle = (item: ConvertedItem) => {
    if (!item.convertedBlob && !item.convertedUrl) return;
    const a = document.createElement('a');
    a.href = item.convertedUrl || URL.createObjectURL(item.convertedBlob!);
    const cleanName = item.name.replace(/\.[^/.]+$/, '');
    a.download = `${cleanName}_converted.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllZip = async () => {
    const zip = new JSZip();
    let count = 0;

    for (const item of items) {
      if (item.convertedBlob) {
        const cleanName = item.name.replace(/\.[^/.]+$/, '');
        zip.file(`${cleanName}.png`, item.convertedBlob);
        count++;
      }
    }

    if (count === 0) return;

    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'converted_images_png.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className={`p-5 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className={`h-5 w-5 ${themeCls.accentText}`} />
              {t.converterTitle}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              {t.converterSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold ${themeCls.accentBg} ${styleCls.buttonShape}`}
            >
              <UploadCloud className="h-4 w-4" />
              <span>Загрузить картинки</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleAddFiles(e.target.files)}
            />
          </div>
        </div>
      </div>

      {/* Configuration Bar */}
      <div className={`p-4 border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end`}>
        {/* Preset */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            {t.propSizePreset}
          </label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as SizePresetId)}
            className="w-full rounded bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-200 outline-none cursor-pointer"
          >
            <optgroup label="Квадрат (1:1)">
              <option value="square-16">16×16 — Иконка / Текстура</option>
              <option value="square-32">32×32 — HD Иконка</option>
              <option value="square-64">64×64 — GUI / Блок</option>
              <option value="square-128">128×128 — Логотип</option>
              <option value="square-256">256×256 — Стандарт (256x256)</option>
              <option value="square-512">512×512 — HD Логотип (512x512)</option>
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
              <option value="custom">Кастомный размер (Ш × В)</option>
              <option value="original">Оригинальный размер</option>
            </optgroup>
          </select>
        </div>

        {/* Custom WxH if selected */}
        {preset === 'custom' ? (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Ширина</label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(parseInt(e.target.value, 10) || 16)}
                className="w-full rounded bg-neutral-900 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Высота</label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(parseInt(e.target.value, 10) || 16)}
                className="w-full rounded bg-neutral-900 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-200"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {t.propFitMode}
            </label>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setFitMode('contain')}
                className={`px-2 py-1.5 text-xs rounded border text-center transition-colors ${
                  fitMode === 'contain'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
              >
                {t.fitModeContain}
              </button>
              <button
                type="button"
                onClick={() => setFitMode('cover')}
                className={`px-2 py-1.5 text-xs rounded border text-center transition-colors ${
                  fitMode === 'cover'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
              >
                {t.fitModeCover}
              </button>
            </div>
          </div>
        )}

        {/* Rounding */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={enableRounding}
                onChange={(e) => setEnableRounding(e.target.checked)}
                className="rounded border-neutral-700 text-amber-500 focus:ring-0"
              />
              <span>{t.propCornerRounding}</span>
            </label>
            <span className="font-mono text-xs text-amber-400 font-bold">
              {enableRounding ? `${cornerRadius}px` : 'Выкл'}
            </span>
          </div>
          {enableRounding && (
            <input
              type="range"
              min="0"
              max="128"
              value={cornerRadius}
              onChange={(e) => setCornerRadius(parseInt(e.target.value, 10) || 0)}
              className="w-full accent-amber-500"
            />
          )}
        </div>

        {/* Process Button */}
        <div>
          <button
            onClick={processAll}
            disabled={items.length === 0 || isBatchProcessing}
            className={`w-full py-2 text-xs font-bold flex items-center justify-center gap-2 ${
              items.length === 0
                ? 'opacity-40 bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : `${themeCls.accentBg} ${themeCls.accentBgHover}`
            } ${styleCls.buttonShape}`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{isBatchProcessing ? 'Обработка...' : 'Применить и конвертировать'}</span>
          </button>
        </div>
      </div>

      {/* Items Grid / Empty State */}
      {items.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-neutral-800 ${themeCls.cardBg} ${styleCls.cardShape} cursor-pointer hover:border-neutral-600 transition-colors`}
        >
          <ImageIcon className="h-12 w-12 text-neutral-600 mb-3" />
          <h4 className="text-sm font-bold text-neutral-300 mb-1">{t.dropConverterHint}</h4>
          <p className="text-xs text-neutral-500 max-w-sm">
            Поддерживаются любые форматы (PNG, JPG, WebP, GIF, BMP). Всё мгновенно конвертируется в PNG без потери качества.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">
              Загружено картинок: {items.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadAllZip}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white ${styleCls.buttonShape}`}
              >
                <FolderArchive className="h-3.5 w-3.5" />
                <span>{t.convertAndDownloadAllBtn}</span>
              </button>
              <button
                onClick={() => setItems([])}
                className="text-xs text-neutral-500 hover:text-rose-400 px-2 py-1"
              >
                Очистить
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <div
                key={it.id}
                className={`p-4 border border-neutral-800 ${themeCls.cardBg} ${styleCls.cardShape} flex flex-col justify-between gap-3`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-neutral-200 truncate" title={it.name}>
                    {it.name}
                  </span>
                  <button
                    onClick={() => setItems((prev) => prev.filter((x) => x.id !== it.id))}
                    className="text-neutral-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-around gap-2 py-2 border-y border-neutral-800/80 bg-neutral-950/40 rounded p-2">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-neutral-500">До</span>
                    <div className="h-20 w-20 flex items-center justify-center overflow-hidden bg-neutral-900 rounded border border-neutral-800">
                      <img src={it.originalUrl} alt="Original" className="max-h-full max-w-full object-contain" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-amber-400 font-semibold">После (PNG)</span>
                    <div className="h-20 w-20 flex items-center justify-center overflow-hidden bg-neutral-900 rounded border border-amber-500/30">
                      {it.convertedUrl ? (
                        <img src={it.convertedUrl} alt="Converted" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-neutral-600 text-center px-1">Нажмите применить</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-neutral-400">
                    {it.width && it.height ? `${it.width}×${it.height} px` : 'Готов к конвертации'}
                  </span>

                  {it.convertedUrl && (
                    <button
                      onClick={() => downloadSingle(it)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{t.downloadPngBtn}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
