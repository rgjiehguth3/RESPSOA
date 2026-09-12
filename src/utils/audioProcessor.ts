export interface SoundEventDef {
  category?: string;
  sounds: Array<{
    name: string;
    stream?: boolean;
    weight?: number;
    volume?: number;
    pitch?: number;
  }>;
}

export function generateSoundsJson(soundFiles: Array<{ soundKey: string; relativePath: string }>): string {
  const result: Record<string, SoundEventDef> = {};

  for (const item of soundFiles) {
    // sound key e.g. "custom.sound1"
    const key = item.soundKey || 'custom.sound';
    // in minecraft, relative sound path doesn't include .ogg and starts from sound namespace
    const cleanPath = item.relativePath.replace(/^minecraft:sounds\//, '').replace(/\.ogg$/, '');
    result[key] = {
      category: 'master',
      sounds: [
        {
          name: cleanPath,
          stream: false,
        },
      ],
    };
  }

  return JSON.stringify(result, null, 2);
}

// Convert audio buffer to Ogg/Wav PCM blob that Minecraft can load reliably
export async function convertAudioFile(
  file: File
): Promise<{ blob: Blob; duration: number }> {
  // If already .ogg, we can preserve directly
  if (file.name.toLowerCase().endsWith('.ogg') || file.type === 'audio/ogg') {
    return {
      blob: file,
      duration: 1.0,
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const duration = audioBuffer.duration;

    // Encode to 16-bit PCM WAV container (universally decodable by Minecraft / browsers / sidecars)
    const wavBlob = audioBufferToWavBlob(audioBuffer);
    await audioCtx.close();

    return {
      blob: wavBlob,
      duration,
    };
  } catch (e) {
    console.warn('Audio decoding fallback:', e);
    return {
      blob: file,
      duration: 1.0,
    };
  }
}

function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  // Interleave channels
  const numSamples = buffer.length;
  const dataSize = numSamples * blockAlign;
  const bufferSize = 44 + dataSize;
  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);

  // Write WAV Header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM audio data
  let offset = 44;
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  for (let i = 0; i < numSamples; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = channels[channel][i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/ogg' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
