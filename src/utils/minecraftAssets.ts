/**
 * Direct official Minecraft Java Edition item textures
 * Sourced directly from extracted game assets mirror with CORS support.
 */

export interface MinecraftItemAsset {
  id: string;
  name: string;
  nameRu: string;
  url: string;
  themes: Array<'warm-sunset' | 'forest-night' | 'purple-cyan'>;
}

const BASE_URL = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.21/assets/minecraft/textures/item';

export const MINECRAFT_FOOD_ASSETS: MinecraftItemAsset[] = [
  // Warm Sunset palette foods
  {
    id: 'golden_apple',
    name: 'Golden Apple',
    nameRu: 'Золотое яблоко',
    url: `${BASE_URL}/golden_apple.png`,
    themes: ['warm-sunset', 'purple-cyan'],
  },
  {
    id: 'apple',
    name: 'Apple',
    nameRu: 'Яблоко',
    url: `${BASE_URL}/apple.png`,
    themes: ['warm-sunset', 'forest-night'],
  },
  {
    id: 'carrot',
    name: 'Carrot',
    nameRu: 'Морковь',
    url: `${BASE_URL}/carrot.png`,
    themes: ['warm-sunset'],
  },
  {
    id: 'golden_carrot',
    name: 'Golden Carrot',
    nameRu: 'Золотая морковь',
    url: `${BASE_URL}/golden_carrot.png`,
    themes: ['warm-sunset'],
  },
  {
    id: 'bread',
    name: 'Bread',
    nameRu: 'Хлеб',
    url: `${BASE_URL}/bread.png`,
    themes: ['warm-sunset'],
  },
  {
    id: 'cookie',
    name: 'Cookie',
    nameRu: 'Печенье',
    url: `${BASE_URL}/cookie.png`,
    themes: ['warm-sunset'],
  },

  // Forest Night palette foods and items
  {
    id: 'sweet_berries',
    name: 'Sweet Berries',
    nameRu: 'Сладкие ягоды',
    url: `${BASE_URL}/sweet_berries.png`,
    themes: ['forest-night'],
  },
  {
    id: 'glow_berries',
    name: 'Glow Berries',
    nameRu: 'Светящиеся ягоды',
    url: `${BASE_URL}/glow_berries.png`,
    themes: ['forest-night', 'warm-sunset'],
  },
  {
    id: 'melon_slice',
    name: 'Melon Slice',
    nameRu: 'Ломтик арбуза',
    url: `${BASE_URL}/melon_slice.png`,
    themes: ['forest-night'],
  },

  // Purple Cyan palette foods and crystals
  {
    id: 'chorus_fruit',
    name: 'Chorus Fruit',
    nameRu: 'Плод хоруса',
    url: `${BASE_URL}/chorus_fruit.png`,
    themes: ['purple-cyan'],
  },
  {
    id: 'amethyst_shard',
    name: 'Amethyst Shard',
    nameRu: 'Осколок аметиста',
    url: `${BASE_URL}/amethyst_shard.png`,
    themes: ['purple-cyan'],
  },
  {
    id: 'nether_star',
    name: 'Nether Star',
    nameRu: 'Звезда Незера',
    url: `${BASE_URL}/nether_star.png`,
    themes: ['purple-cyan'],
  },
  {
    id: 'ender_pearl',
    name: 'Ender Pearl',
    nameRu: 'Жемчуг Края',
    url: `${BASE_URL}/ender_pearl.png`,
    themes: ['purple-cyan'],
  },
];

export function getAssetsForTheme(theme: 'warm-sunset' | 'forest-night' | 'purple-cyan'): MinecraftItemAsset[] {
  return MINECRAFT_FOOD_ASSETS.filter((item) => item.themes.includes(theme));
}
