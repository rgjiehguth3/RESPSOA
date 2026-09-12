import { FitMode, SizePresetId } from '../types';

export const SIZE_PRESETS: Record<SizePresetId, { width: number; height: number; label: string; desc: string }> = {
  // Квадрат (1:1) — ТЗ 4.1
  'square-16': { width: 16, height: 16, label: '16×16', desc: 'Квадрат (иконка/текстура)' },
  'square-32': { width: 32, height: 32, label: '32×32', desc: 'Квадрат (HD иконка)' },
  'square-64': { width: 64, height: 64, label: '64×64', desc: 'Квадрат (GUI/блок)' },
  'square-128': { width: 128, height: 128, label: '128×128', desc: 'Квадрат (логотип)' },
  'square-256': { width: 256, height: 256, label: '256×256', desc: 'Квадрат (стандарт)' },
  'square-512': { width: 512, height: 512, label: '512×512', desc: 'Квадрат (HD)' },

  // Префикс (прямоугольник) — ТЗ 4.1
  'prefix-48-16': { width: 48, height: 16, label: '48×16', desc: 'Префикс (3:1)' },
  'prefix-64-16': { width: 64, height: 16, label: '64×16', desc: 'Префикс (4:1)' },
  'prefix-96-16': { width: 96, height: 16, label: '96×16', desc: 'Префикс (6:1)' },
  'prefix-128-16': { width: 128, height: 16, label: '128×16', desc: 'Префикс (8:1)' },
  'prefix-192-16': { width: 192, height: 16, label: '192×16', desc: 'Префикс (12:1)' },
  'prefix-256-16': { width: 256, height: 16, label: '256×16', desc: 'Префикс (16:1)' },

  // Дополнительные пресеты
  'logo-standard': { width: 256, height: 256, label: '256×256', desc: 'Логотипы (Standard)' },
  'logo-small': { width: 128, height: 128, label: '128×128', desc: 'Мелкие иконки' },
  'logo-wide': { width: 256, height: 128, label: '256×128', desc: 'Широкие баннеры' },
  'logo-tall': { width: 128, height: 256, label: '128×256', desc: 'Вертикальные' },
  'logo-hd': { width: 512, height: 512, label: '512×512', desc: 'HD-логотипы' },
  'logo-4k': { width: 1024, height: 1024, label: '1024×1024', desc: 'Максимум (4K)' },
  'custom': { width: 256, height: 256, label: 'Custom', desc: 'Свой размер' },
  'original': { width: 0, height: 0, label: 'Original', desc: 'Исходный размер' },
};

// Unicode chars sequence: ① ... ⓿, then Ⓐ ... Ⓩ
export const UNICODE_CHARS_PRIMARY = [
  '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩',
  '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⓴',
  '➀', '➁', '➂', '➃', '➄', '➅', '➆', '➇', '➈', '➉',
  '⓿',
];

export const UNICODE_CHARS_SECONDARY = [
  'Ⓐ', 'Ⓑ', 'Ⓒ', 'Ⓓ', 'Ⓔ', 'Ⓕ', 'Ⓖ', 'Ⓗ', 'Ⓘ', 'Ⓙ',
  'Ⓚ', 'Ⓛ', 'Ⓜ', 'Ⓝ', 'Ⓞ', 'Ⓟ', 'Ⓠ', 'Ⓡ', 'Ⓢ', 'Ⓣ',
  'Ⓤ', 'Ⓥ', 'Ⓦ', 'Ⓧ', 'Ⓨ', 'Ⓩ',
];

export function getCharForIndex(index: number): { char: string; isExceeded: boolean } {
  if (index < UNICODE_CHARS_PRIMARY.length) {
    return { char: UNICODE_CHARS_PRIMARY[index], isExceeded: false };
  }
  const secondaryIndex = index - UNICODE_CHARS_PRIMARY.length;
  if (secondaryIndex < UNICODE_CHARS_SECONDARY.length) {
    return { char: UNICODE_CHARS_SECONDARY[secondaryIndex], isExceeded: true };
  }
  return { char: String.fromCharCode(0x24b6 + (index % 50)), isExceeded: true };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

export async function processImageToPng(
  sourceUrl: string,
  options: {
    preset: SizePresetId;
    customWidth?: number;
    customHeight?: number;
    fitMode: FitMode;
    enableRounding: boolean;
    cornerRadius: number;
    forceUpscale?: boolean;
  }
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number }> {
  const img = await loadImage(sourceUrl);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  let targetW = origW;
  let targetH = origH;

  if (options.preset !== 'original') {
    if (options.preset === 'custom') {
      targetW = options.customWidth && options.customWidth > 0 ? options.customWidth : origW;
      targetH = options.customHeight && options.customHeight > 0 ? options.customHeight : origH;
    } else {
      const presetInfo = SIZE_PRESETS[options.preset];
      if (presetInfo) {
        targetW = presetInfo.width;
        targetH = presetInfo.height;
      }
    }
  }

  // If original is smaller and not forced to upscale
  if (!options.forceUpscale && options.preset !== 'custom' && options.preset !== 'original') {
    if (origW < targetW && origH < targetH && options.fitMode === 'contain') {
      targetW = origW;
      targetH = origH;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Apply corner rounding clip if enabled
  if (options.enableRounding && options.cornerRadius > 0) {
    const r = Math.min(options.cornerRadius, Math.min(targetW, targetH) / 2);
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(targetW - r, 0);
    ctx.quadraticCurveTo(targetW, 0, targetW, r);
    ctx.lineTo(targetW, targetH - r);
    ctx.quadraticCurveTo(targetW, targetH, targetW - r, targetH);
    ctx.lineTo(r, targetH);
    ctx.quadraticCurveTo(0, targetH, 0, targetH - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.clip();
  }

  // Draw according to fit mode
  if (options.fitMode === 'contain') {
    const scale = Math.min(targetW / origW, targetH / origH);
    const drawW = origW * scale;
    const drawH = origH * scale;
    const offsetX = (targetW - drawW) / 2;
    const offsetY = (targetH - drawH) / 2;
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  } else {
    // Cover / Crop center
    const scale = Math.max(targetW / origW, targetH / origH);
    const drawW = origW * scale;
    const drawH = origH * scale;
    const offsetX = (targetW - drawW) / 2;
    const offsetY = (targetH - drawH) / 2;
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Failed to create image blob'));
      const dataUrl = canvas.toDataURL('image/png');
      resolve({ blob, dataUrl, width: targetW, height: targetH });
    }, 'image/png');
  });
}

// Generate default 256x256 pack.png icon for Minecraft
export function generateDefaultPackIcon(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark stone / obsidian textured background
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#14141e');
  grad.addColorStop(0.5, '#1e1b2e');
  grad.addColorStop(1, '#0f0f18');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Border frame (Minecraft stone brick border style)
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 244, 244);

  ctx.strokeStyle = '#713f12';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, 236, 236);

  // Inner glow circle
  const glow = ctx.createRadialGradient(128, 120, 20, 128, 120, 100);
  glow.addColorStop(0, 'rgba(234, 179, 8, 0.4)');
  glow.addColorStop(0.7, 'rgba(217, 70, 239, 0.2)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(128, 120, 90, 0, Math.PI * 2);
  ctx.fill();

  // Minecraft Pixelated Diamond / Sword Emblem
  ctx.save();
  ctx.translate(128, 110);
  ctx.rotate(Math.PI / 4);

  // Outer diamond
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(-36, -36, 72, 72);

  // Inner highlight diamond
  ctx.fillStyle = '#67e8f9';
  ctx.fillRect(-24, -24, 48, 48);

  // Center core
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-12, -12, 24, 24);
  ctx.restore();

  // Top header text "MINECRAFT"
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText('JAVA EDITION', 128, 44);

  // Center Title "RESPSOA"
  ctx.font = '900 32px "Plus Jakarta Sans", monospace';
  ctx.fillStyle = '#000000';
  ctx.fillText('RESPSOA', 128 + 2, 202 + 2); // shadow
  ctx.fillStyle = '#facc15';
  ctx.fillText('RESPSOA', 128, 202);

  // Subtitle "RESOURCE PACK"
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('RESOURCE PACK', 128, 226);

  return canvas.toDataURL('image/png');
}
