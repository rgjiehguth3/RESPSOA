import { MinecraftVersionInfo } from '../types';

export const MINECRAFT_VERSIONS: MinecraftVersionInfo[] = [
  {
    version: '26.2',
    packFormat: 88,
    isNewSchema: true,
    minFormat: 88,
    maxFormat: 88,
    label: '26.2 (min_format / max_format 88)',
  },
  {
    version: '26.1 / 26.1.1 / 26.1.2',
    packFormat: 84,
    isNewSchema: true,
    minFormat: 84,
    maxFormat: 84,
    label: '26.1 / 26.1.1 / 26.1.2 (min/max 84)',
  },
  {
    version: '1.21.11',
    packFormat: 75,
    isNewSchema: true,
    minFormat: 75,
    maxFormat: 75,
    label: '1.21.11 (min/max 75)',
  },
  {
    version: '1.21.9 / 1.21.10',
    packFormat: 69,
    isNewSchema: true,
    minFormat: 69,
    maxFormat: 69,
    label: '1.21.9 / 1.21.10 (min/max 69)',
  },
  {
    version: '1.21.7 / 1.21.8',
    packFormat: 64,
    isNewSchema: false,
    label: '1.21.7 / 1.21.8 (pack_format 64)',
  },
  {
    version: '1.21.6',
    packFormat: 63,
    isNewSchema: false,
    label: '1.21.6 (pack_format 63)',
  },
  {
    version: '1.21.5',
    packFormat: 55,
    isNewSchema: false,
    label: '1.21.5 (pack_format 55)',
  },
  {
    version: '1.21.4',
    packFormat: 46,
    isNewSchema: false,
    label: '1.21.4 (pack_format 46)',
  },
  {
    version: '1.21.2 / 1.21.3',
    packFormat: 42,
    isNewSchema: false,
    label: '1.21.2 / 1.21.3 (pack_format 42)',
  },
  {
    version: '1.21 / 1.21.1',
    packFormat: 34,
    isNewSchema: false,
    label: '1.21 / 1.21.1 (pack_format 34)',
  },
  {
    version: '1.20.5 / 1.20.6',
    packFormat: 32,
    isNewSchema: false,
    label: '1.20.5 / 1.20.6 (pack_format 32)',
  },
  {
    version: '1.20.3 / 1.20.4',
    packFormat: 22,
    isNewSchema: false,
    label: '1.20.3 / 1.20.4 (pack_format 22)',
  },
  {
    version: '1.20.2',
    packFormat: 18,
    isNewSchema: false,
    label: '1.20.2 (pack_format 18)',
  },
  {
    version: '1.20 / 1.20.1',
    packFormat: 15,
    isNewSchema: false,
    label: '1.20 / 1.20.1 (pack_format 15)',
  },
  {
    version: '1.19.4',
    packFormat: 13,
    isNewSchema: false,
    label: '1.19.4 (pack_format 13)',
  },
  {
    version: '1.19.3',
    packFormat: 12,
    isNewSchema: false,
    label: '1.19.3 (pack_format 12)',
  },
  {
    version: '1.19 / 1.19.1 / 1.19.2',
    packFormat: 9,
    isNewSchema: false,
    label: '1.19 / 1.19.1 / 1.19.2 (pack_format 9)',
  },
  {
    version: '1.18 / 1.18.1 / 1.18.2',
    packFormat: 8,
    isNewSchema: false,
    label: '1.18 / 1.18.1 / 1.18.2 (pack_format 8)',
  },
  {
    version: '1.17 / 1.17.1',
    packFormat: 7,
    isNewSchema: false,
    label: '1.17 / 1.17.1 (pack_format 7)',
  },
  {
    version: '1.16.5',
    packFormat: 6,
    isNewSchema: false,
    label: '1.16.5 (pack_format 6)',
  },
];

export function getVersionInfo(selectedVersion: string): MinecraftVersionInfo {
  const found = MINECRAFT_VERSIONS.find(
    (v) =>
      v.version === selectedVersion ||
      v.label.startsWith(selectedVersion) ||
      selectedVersion.startsWith(v.version.split(' ')[0])
  );
  return found || MINECRAFT_VERSIONS[3]; // Default to 1.21.9 / 1.21.10
}

export function generatePackMcmeta(
  selectedVersion: string,
  description = 'RESPSOA Resource Pack'
): string {
  const info = getVersionInfo(selectedVersion);
  if (info.isNewSchema) {
    return JSON.stringify(
      {
        pack: {
          min_format: info.minFormat ?? info.packFormat,
          max_format: info.maxFormat ?? info.packFormat,
          description,
        },
      },
      null,
      2
    );
  } else {
    return JSON.stringify(
      {
        pack: {
          pack_format: info.packFormat,
          description,
        },
      },
      null,
      2
    );
  }
}
