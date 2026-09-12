import { StyleId, ThemeId } from '../types';

export function getThemeClasses(theme: ThemeId): {
  bgBase: string;
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  cardActiveBorder: string;
  accentText: string;
  accentBg: string;
  accentBgHover: string;
  badgeBg: string;
  badgeText: string;
  glowShadow: string;
  headerGrad: string;
} {
  switch (theme) {
    case 'warm-sunset':
      return {
        bgBase: 'bg-[#181112] text-[#fef2f2]',
        pageBg: 'bg-[#140e10]',
        cardBg: 'bg-[#24171a]/85 backdrop-blur-md',
        cardBorder: 'border-[#fb7185]/20',
        cardActiveBorder: 'border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.3)]',
        accentText: 'text-[#f59e0b]',
        accentBg: 'bg-gradient-to-r from-[#f43f5e] to-[#f59e0b] text-neutral-950 font-bold',
        accentBgHover: 'hover:brightness-110',
        badgeBg: 'bg-[#fb7185]/20',
        badgeText: 'text-[#fca5a5]',
        glowShadow: 'shadow-[0_4px_20px_rgba(244,63,94,0.25)]',
        headerGrad: 'from-[#f43f5e]/20 via-[#f59e0b]/10 to-transparent',
      };
    case 'forest-night':
      return {
        bgBase: 'bg-[#0b1411] text-[#ecfdf5]',
        pageBg: 'bg-[#09100d]',
        cardBg: 'bg-[#12241d]/85 backdrop-blur-md',
        cardBorder: 'border-[#10b981]/25',
        cardActiveBorder: 'border-[#34d399] shadow-[0_0_15px_rgba(52,211,153,0.35)]',
        accentText: 'text-[#34d399]',
        accentBg: 'bg-gradient-to-r from-[#059669] to-[#10b981] text-neutral-950 font-bold',
        accentBgHover: 'hover:brightness-110',
        badgeBg: 'bg-[#10b981]/20',
        badgeText: 'text-[#6ee7b7]',
        glowShadow: 'shadow-[0_4px_20px_rgba(16,185,129,0.25)]',
        headerGrad: 'from-[#059669]/25 via-[#10b981]/10 to-transparent',
      };
    case 'purple-cyan':
    default:
      return {
        bgBase: 'bg-[#0d0f1d] text-[#f8fafc]',
        pageBg: 'bg-[#090b14]',
        cardBg: 'bg-[#161a2f]/85 backdrop-blur-md',
        cardBorder: 'border-[#8b5cf6]/25',
        cardActiveBorder: 'border-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.4)]',
        accentText: 'text-[#22d3ee]',
        accentBg: 'bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-neutral-950 font-bold',
        accentBgHover: 'hover:brightness-110',
        badgeBg: 'bg-[#8b5cf6]/25',
        badgeText: 'text-[#c4b5fd]',
        glowShadow: 'shadow-[0_4px_20px_rgba(139,92,246,0.3)]',
        headerGrad: 'from-[#8b5cf6]/25 via-[#06b6d4]/10 to-transparent',
      };
  }
}

export function getStyleClasses(style: StyleId): {
  buttonShape: string;
  cardShape: string;
  blurLevel: string;
  shadowType: string;
} {
  switch (style) {
    case 'classic':
      return {
        buttonShape: 'rounded-md shadow-sm transition-all',
        cardShape: 'rounded-lg shadow-md',
        blurLevel: 'backdrop-blur-sm',
        shadowType: 'shadow-black/40',
      };
    case 'modern':
      return {
        buttonShape: 'rounded-none border border-white/20 uppercase tracking-wider backdrop-blur-md transition-all active:scale-[0.98]',
        cardShape: 'rounded-none border-t-2',
        blurLevel: 'backdrop-blur-xl bg-opacity-70',
        shadowType: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.45)]',
      };
    case 'nature':
      return {
        buttonShape: 'rounded-2xl transition-all shadow-md active:scale-95',
        cardShape: 'rounded-2xl',
        blurLevel: 'backdrop-blur-md',
        shadowType: 'shadow-lg',
      };
    case 'minimal':
    default:
      return {
        buttonShape: 'rounded-sm border border-neutral-700 transition-none',
        cardShape: 'rounded-sm border',
        blurLevel: 'backdrop-blur-none',
        shadowType: 'shadow-none',
      };
  }
}
