import JSZip from 'jszip';
import { AppSettings, LogEntry, PackItem } from '../types';
import { convertAudioFile, generateSoundsJson } from './audioProcessor';
import { dataUrlToText } from './encoding';
import { generateDefaultPackIcon, processImageToPng } from './imageProcessor';
import { generatePackMcmeta } from './versionMapper';

export interface BuildProgress {
  percent: number;
  currentStep: string;
  isComplete: boolean;
  error?: string;
  zipBlob?: Blob;
  stats?: {
    totalFiles: number;
    sizeBytes: number;
    durationMs: number;
  };
}

export function generateDefaultFontJson(
  items: PackItem[],
  namespace = 'minecraft'
): string {
  const providers = items
    .filter((item) => item.type === 'bitmap' || item.type === 'prefix')
    .map((item) => {
      return {
        type: 'bitmap',
        file: `${namespace}:font/${item.targetFilename}`,
        ascent: item.ascent,
        height: item.height,
        chars: [item.chars],
      };
    });

  return JSON.stringify({ providers }, null, 2);
}

export async function buildResourcePackZip(
  items: PackItem[],
  settings: AppSettings,
  onProgress: (progress: BuildProgress) => void,
  customDefaultJsonOverride?: string | null,
  onLog?: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
): Promise<{
  zipBlob: Blob;
  defaultJson: string;
  packMcmeta: string;
  soundsJson: string;
  stats: {
    totalFiles: number;
    sizeBytes: number;
    durationMs: number;
  };
}> {
  const startTime = performance.now();
  const zip = new JSZip();

  const log = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    if (onLog) onLog(entry);
  };

  log({ level: 'info', message: `Инициализация сборки ресурспака: ${settings.packName}...` });
  onProgress({ percent: 5, currentStep: 'Подготовка структуры папок...', isComplete: false });

  // 1. Generate pack.mcmeta
  const packMcmeta = generatePackMcmeta(settings.minecraftVersion, `${settings.packName} (RESPSOA)`);
  zip.file('pack.mcmeta', packMcmeta);
  log({ level: 'info', message: `Сгенерирован pack.mcmeta для версии ${settings.minecraftVersion}` });

  // 2. Add pack.png
  onProgress({ percent: 15, currentStep: 'Генерация иконки pack.png...', isComplete: false });
  let packPngDataUrl = settings.customPackPngDataUrl;
  const customIconItem = items.find(i => i.type === 'pack_icon');
  if (customIconItem) {
    packPngDataUrl = customIconItem.dataUrl;
  }
  if (!packPngDataUrl) {
    packPngDataUrl = generateDefaultPackIcon();
  }
  const packPngBase64 = packPngDataUrl.split(',')[1];
  zip.file('pack.png', packPngBase64, { base64: true });
  log({ level: 'info', message: 'Добавлена иконка pack.png в корень ресурспака' });

  // 3. Process font items (bitmap / prefix) and generate default.json
  const fontItems = items.filter(i => i.type === 'bitmap' || i.type === 'prefix');
  const defaultJson = customDefaultJsonOverride || generateDefaultFontJson(fontItems, settings.namespace);
  const fontFolder = zip.folder('assets/minecraft/font')!;
  fontFolder.file('default.json', defaultJson);
  log({ level: 'info', message: `Сгенерирован assets/minecraft/font/default.json (${fontItems.length} провайдеров)` });

  // 4. Process each item according to type
  const soundEntries: Array<{ soundKey: string; relativePath: string }> = [];
  const totalItems = items.length;
  let processedCount = 0;

  for (let i = 0; i < totalItems; i++) {
    const item = items[i];
    const itemNum = i + 1;
    const progressPercent = 20 + Math.floor((itemNum / Math.max(1, totalItems)) * 65);
    
    onProgress({
      percent: progressPercent,
      currentStep: `Обработка [${itemNum}/${totalItems}]: ${item.name} (${item.type})...`,
      isComplete: false,
    });

    try {
      if (item.type === 'bitmap' || item.type === 'prefix') {
        // Font image: MUST be placed in textures/font/ (Section 6.1)
        const texturesFontFolder = zip.folder('assets/minecraft/textures/font')!;
        const converted = await processImageToPng(item.dataUrl, {
          preset: item.type === 'prefix' ? 'original' : item.sizePreset,
          customWidth: item.customWidth,
          customHeight: item.customHeight,
          fitMode: item.fitMode,
          enableRounding: item.type === 'prefix' ? false : item.enableRounding,
          cornerRadius: item.cornerRadius,
        });
        texturesFontFolder.file(item.targetFilename, converted.blob);
        log({ level: 'success', message: `Сконвертировано ${item.name} -> textures/font/${item.targetFilename} (${converted.width}x${converted.height}, char: ${item.chars})` });
      } else if (item.type === 'block') {
        const blockFolder = zip.folder('assets/minecraft/textures/block')!;
        const converted = await processImageToPng(item.dataUrl, {
          preset: item.sizePreset === 'original' ? 'original' : item.sizePreset,
          customWidth: item.customWidth,
          customHeight: item.customHeight,
          fitMode: item.fitMode,
          enableRounding: item.enableRounding,
          cornerRadius: item.cornerRadius,
        });
        blockFolder.file(item.targetFilename, converted.blob);
        log({ level: 'info', message: `Текстура блока сохранена: textures/block/${item.targetFilename}` });
      } else if (item.type === 'item' || item.type === 'food') {
        const itemFolder = zip.folder('assets/minecraft/textures/item')!;
        const converted = await processImageToPng(item.dataUrl, {
          preset: item.sizePreset === 'original' ? 'original' : item.sizePreset,
          customWidth: item.customWidth,
          customHeight: item.customHeight,
          fitMode: item.fitMode,
          enableRounding: item.enableRounding,
          cornerRadius: item.cornerRadius,
        });
        itemFolder.file(item.targetFilename, converted.blob);
        log({ level: 'info', message: `Текстура предмета сохранена: textures/item/${item.targetFilename}` });
      } else if (item.type === 'gui') {
        const guiFolder = zip.folder('assets/minecraft/textures/gui')!;
        const converted = await processImageToPng(item.dataUrl, {
          preset: item.sizePreset === 'original' ? 'original' : item.sizePreset,
          customWidth: item.customWidth,
          customHeight: item.customHeight,
          fitMode: item.fitMode,
          enableRounding: item.enableRounding,
          cornerRadius: item.cornerRadius,
        });
        guiFolder.file(item.targetFilename, converted.blob);
        log({ level: 'info', message: `GUI текстура сохранена: textures/gui/${item.targetFilename}` });
      } else if (item.type === 'particle') {
        const partFolder = zip.folder('assets/minecraft/particles')!;
        const converted = await processImageToPng(item.dataUrl, {
          preset: 'original',
          fitMode: 'contain',
          enableRounding: false,
          cornerRadius: 0,
        });
        partFolder.file(item.targetFilename, converted.blob);
        zip.folder('assets/minecraft/textures/particle')!.file(item.targetFilename, converted.blob);
        log({ level: 'info', message: `Частица сохранена: particles/${item.targetFilename}` });
      } else if (item.type === 'sound') {
        const soundsFolder = zip.folder('assets/minecraft/sounds')!;
        if (item.file && item.file.size > 0) {
          const convertedAudio = await convertAudioFile(item.file);
          soundsFolder.file(item.targetFilename, convertedAudio.blob);
        } else if (item.dataUrl) {
          try {
            const resp = await fetch(item.dataUrl);
            const blob = await resp.blob();
            soundsFolder.file(item.targetFilename, blob);
          } catch {
            const base64Data = item.dataUrl.includes(',') ? item.dataUrl.split(',')[1] : item.dataUrl;
            soundsFolder.file(item.targetFilename, base64Data, { base64: true });
          }
        }
        const soundKey = item.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9_]/g, '_');
        soundEntries.push({
          soundKey: `custom.${soundKey}`,
          relativePath: `minecraft:sounds/${item.targetFilename}`,
        });
        log({ level: 'success', message: `Звук сконвертирован: sounds/${item.targetFilename} (ключ custom.${soundKey})` });
      } else if (item.type === 'lang') {
        const langFolder = zip.folder('assets/minecraft/lang')!;
        // Ensure json extension
        const cleanName = item.targetFilename.endsWith('.json') ? item.targetFilename : `${item.targetFilename}.json`;
        if (item.file) {
          const text = await item.file.text();
          langFolder.file(cleanName, text);
        } else {
          langFolder.file(cleanName, dataUrlToText(item.dataUrl));
        }
        log({ level: 'info', message: `Файл локализации добавлен: lang/${cleanName}` });
      } else if (item.type === 'model') {
        const modelsFolder = zip.folder('assets/minecraft/models')!;
        if (item.file) {
          const text = await item.file.text();
          modelsFolder.file(item.targetFilename, text);
        } else {
          modelsFolder.file(item.targetFilename, dataUrlToText(item.dataUrl));
        }
        log({ level: 'info', message: `3D-модель добавлена: models/${item.targetFilename}` });
      }
      processedCount++;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      log({ level: 'error', message: `Ошибка при обработке ${item.name}: ${errMsg}` });
    }
  }

  // 5. Generate sounds.json if sound items exist
  let soundsJson = '{}';
  if (soundEntries.length > 0) {
    soundsJson = generateSoundsJson(soundEntries);
    zip.folder('assets/minecraft')!.file('sounds.json', soundsJson);
    log({ level: 'info', message: `Сгенерирован assets/minecraft/sounds.json (${soundEntries.length} звуков)` });
  }

  // 6. Zip compression
  onProgress({ percent: 90, currentStep: 'Сжатие ZIP-архива...', isComplete: false });
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const durationMs = Math.round(performance.now() - startTime);
  log({
    level: 'success',
    message: `Ресурспак успешно скомпилирован за ${durationMs}ms! Размер: ${(zipBlob.size / 1024).toFixed(1)} KB`,
  });

  onProgress({
    percent: 100,
    currentStep: 'Сборка завершена!',
    isComplete: true,
    zipBlob,
    stats: {
      totalFiles: processedCount + 3, // pack.mcmeta, pack.png, default.json
      sizeBytes: zipBlob.size,
      durationMs,
    },
  });

  return {
    zipBlob,
    defaultJson,
    packMcmeta,
    soundsJson,
    stats: {
      totalFiles: processedCount + 3,
      sizeBytes: zipBlob.size,
      durationMs,
    },
  };
}
