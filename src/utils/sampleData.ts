import { ContentType, PackItem } from '../types';
import { textToDataUrl } from './encoding';

function createPixelCanvas(drawFn: (ctx: CanvasRenderingContext2D) => void, w = 32, h = 32): string {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  drawFn(ctx);
  return canvas.toDataURL('image/png');
}

// Generate an audible short sound clip as data URI (chime/ding)
function createAudioData(): { file: File; dataUrl: string } {
  // Simple wav header + sine wave burst
  const sampleRate = 22050;
  const duration = 0.4;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // WAV header
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Synthesize soft chime (880Hz -> 1320Hz)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = 660 + 440 * (1 - t / duration);
    const env = Math.exp(-6 * t);
    const sample = Math.sin(2 * Math.PI * freq * t) * env;
    view.setInt16(44 + i * 2, sample * 0x7000, true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  const file = new File([blob], 'level_up_bell.wav', { type: 'audio/wav' });
  
  // Safe base64 binary encoding for Data URL
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const dataUrl = `data:audio/wav;base64,${window.btoa(binary)}`;

  return { file, dataUrl };
}

export function createDemoPackItems(): PackItem[] {
  // 1. Logo 1: Diamond Crown Logo
  const logo1Data = createPixelCanvas((ctx) => {
    // Shield
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(4, 4, 24, 24);
    // Gold crown
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(8, 14, 16, 8);
    ctx.fillRect(8, 10, 4, 4);
    ctx.fillRect(14, 8, 4, 6);
    ctx.fillRect(20, 10, 4, 4);
    // Diamond gem
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(14, 16, 4, 4);
  }, 32, 32);

  // 2. Logo 2: Enchanted Ruby Logo
  const logo2Data = createPixelCanvas((ctx) => {
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(4, 4, 24, 24);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(10, 10, 12, 12);
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(12, 12, 4, 4);
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(16, 16, 6, 6);
  }, 32, 32);

  // 3. Prefix: [VIP] Star
  const prefixData = createPixelCanvas((ctx) => {
    ctx.fillStyle = '#10b981';
    ctx.fillRect(2, 6, 28, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('VIP★', 4, 19);
  }, 32, 32);

  // 4. Food: Golden Apple
  const foodData = createPixelCanvas((ctx) => {
    // Apple stalk
    ctx.fillStyle = '#78350f';
    ctx.fillRect(15, 6, 2, 4);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(17, 7, 3, 2);
    // Gold body
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(10, 10, 12, 14);
    ctx.fillRect(8, 12, 16, 10);
    // Highlights
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(10, 12, 4, 4);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(14, 22, 6, 2);
  }, 32, 32);

  // 5. Block: Amethyst Crystal Block
  const blockData = createPixelCanvas((ctx) => {
    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(4, 4, 24, 24);
    ctx.fillStyle = '#c4b5fd';
    ctx.fillRect(10, 8, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 10, 4, 4);
  }, 32, 32);

  // 6. Sound: Level up bell
  const soundItem = createAudioData();

  // 7. Lang: Custom Russian translations
  const langText = JSON.stringify(
    {
      'menu.singleplayer': 'Одиночная игра [RESPSOA]',
      'menu.multiplayer': 'Серверы сообщества',
      'item.minecraft.diamond_sword': 'Клинок Архитектора',
      'respsoa.welcome': 'Ресурспак успешно активирован!',
    },
    null,
    2
  );
  const langBlob = new Blob([langText], { type: 'application/json' });
  const langDataUrl = textToDataUrl(langText, 'application/json');

  // 8. 3D Model: Custom Item Model
  const modelText = JSON.stringify(
    {
      parent: 'item/generated',
      textures: {
        layer0: 'item/diamond_sword',
      },
    },
    null,
    2
  );
  const modelBlob = new Blob([modelText], { type: 'application/json' });
  const modelDataUrl = textToDataUrl(modelText, 'application/json');

  return [
    {
      id: 'demo-1',
      name: 'diamond_crown.png',
      file: null,
      dataUrl: logo1Data,
      type: 'bitmap' as ContentType,
      chars: '①',
      ascent: 30,
      height: 35,
      sizePreset: 'logo-standard',
      customWidth: 256,
      customHeight: 256,
      cornerRadius: 0,
      enableRounding: false,
      fitMode: 'contain',
      targetFilename: 'logo1.png',
      sizeBytes: 1240,
      originalWidth: 256,
      originalHeight: 256,
    },
    {
      id: 'demo-2',
      name: 'ruby_emblem.png',
      file: null,
      dataUrl: logo2Data,
      type: 'bitmap' as ContentType,
      chars: '②',
      ascent: 30,
      height: 35,
      sizePreset: 'logo-standard',
      customWidth: 256,
      customHeight: 256,
      cornerRadius: 16,
      enableRounding: true,
      fitMode: 'contain',
      targetFilename: 'logo2.png',
      sizeBytes: 1310,
      originalWidth: 256,
      originalHeight: 256,
    },
    {
      id: 'demo-3',
      name: 'prefix_vip.png',
      file: null,
      dataUrl: prefixData,
      type: 'prefix' as ContentType,
      chars: '③',
      ascent: 7,
      height: 9,
      sizePreset: 'original',
      customWidth: 32,
      customHeight: 32,
      cornerRadius: 0,
      enableRounding: false,
      fitMode: 'contain',
      targetFilename: 'prefix_vip.png',
      sizeBytes: 890,
      originalWidth: 32,
      originalHeight: 32,
    },
    {
      id: 'demo-4',
      name: 'golden_apple_glow.png',
      file: null,
      dataUrl: foodData,
      type: 'food' as ContentType,
      chars: '④',
      ascent: 7,
      height: 9,
      sizePreset: 'original',
      customWidth: 32,
      customHeight: 32,
      cornerRadius: 0,
      enableRounding: false,
      fitMode: 'contain',
      targetFilename: 'golden_apple.png',
      sizeBytes: 950,
      originalWidth: 32,
      originalHeight: 32,
    },
    {
      id: 'demo-5',
      name: 'amethyst_block.png',
      file: null,
      dataUrl: blockData,
      type: 'block' as ContentType,
      chars: '⑤',
      ascent: 7,
      height: 9,
      sizePreset: 'original',
      customWidth: 32,
      customHeight: 32,
      cornerRadius: 0,
      enableRounding: false,
      fitMode: 'contain',
      targetFilename: 'amethyst_block.png',
      sizeBytes: 1100,
      originalWidth: 32,
      originalHeight: 32,
    },
    {
      id: 'demo-6',
      name: 'level_up_bell.wav',
      file: soundItem.file,
      dataUrl: soundItem.dataUrl,
      type: 'sound' as ContentType,
      chars: '⑥',
      ascent: 7,
      height: 9,
      sizePreset: 'original',
      customWidth: 0,
      customHeight: 0,
      cornerRadius: 0,
      enableRounding: false,
      fitMode: 'contain',
      targetFilename: 'level_up_bell.ogg',
      sizeBytes: 18450,
    },
    {
      id: 'demo-7',
      name: 'ru_ru.json',
      file: new File([langBlob], 'ru_ru.json', { type: 'application/json' }),
      dataUrl: langDataUrl,
      type: 'lang' as ContentType,
      chars: '⑦',
      ascent: 7,
      height: 9,
      sizePreset: 'original',
      customWidth: 0,
      customHeight: 0,
      cornerRadius: 0,
      enableRounding: false,
      fitMode: 'contain',
      targetFilename: 'ru_ru.json',
      sizeBytes: 320,
    },
    {
      id: 'demo-8',
      name: 'custom_sword.json',
      file: new File([modelBlob], 'custom_sword.json', { type: 'application/json' }),
      dataUrl: modelDataUrl,
      type: 'model' as ContentType,
      chars: '⑧',
      ascent: 7,
      height: 9,
      sizePreset: 'original',
      customWidth: 0,
      customHeight: 0,
      cornerRadius: 0,
      enableRounding: false,
      fitMode: 'contain',
      targetFilename: 'custom_sword.json',
      sizeBytes: 180,
    },
  ];
}
