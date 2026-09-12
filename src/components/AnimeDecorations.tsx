import React from 'react';
import { ThemeId } from '../types';

interface AnimeMascotProps {
  theme: ThemeId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  mood?: 'happy' | 'cheer' | 'sparkle' | 'craft';
}

/**
 * High-fidelity theme-coordinated Anime Chibi Mascots for RESPSOA:
 * - warm-sunset: Hina (Warm pink/peach hair, golden ribbon, amber eyes, Minecraft Golden Apple)
 * - forest-night: Sora (Emerald/mint hair, leaf hairpin, nature elf ears, glow berry charm)
 * - purple-cyan: Lumi (Lavender violet & cyan gradient hair, celestial star clips, neon visor/eyes)
 */
export function AnimeMascot({
  theme,
  size = 'md',
  className = '',
  mood = 'happy',
}: AnimeMascotProps) {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const dimMap = {
    sm: 28,
    md: 40,
    lg: 56,
    xl: 80,
  };

  const dim = dimMap[size];

  if (theme === 'warm-sunset') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${sizeMap[size]} ${className} drop-shadow-md select-none`}
        width={dim}
        height={dim}
        aria-label="Anime Mascot Hina (Warm Sunset)"
      >
        <defs>
          <linearGradient id="hinaHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="hinaGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <radialGradient id="hinaEye" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
        </defs>

        {/* Back Hair */}
        <path
          d="M 20 45 Q 10 70 24 85 Q 35 90 40 85 Q 26 70 28 50 Z"
          fill="url(#hinaHair)"
        />
        <path
          d="M 80 45 Q 90 70 76 85 Q 65 90 60 85 Q 74 70 72 50 Z"
          fill="url(#hinaHair)"
        />

        {/* Head Base */}
        <circle cx="50" cy="50" r="32" fill="#fff1f2" />

        {/* Blushing Cheeks */}
        <ellipse cx="32" cy="58" rx="6" ry="3.5" fill="#fda4af" opacity="0.75" />
        <ellipse cx="68" cy="58" rx="6" ry="3.5" fill="#fda4af" opacity="0.75" />

        {/* Eyes */}
        <g>
          {/* Left Eye */}
          <ellipse cx="36" cy="48" rx="6" ry="8" fill="url(#hinaEye)" />
          <circle cx="34" cy="45" r="2.5" fill="#ffffff" />
          <circle cx="38" cy="52" r="1.2" fill="#ffffff" />
          {/* Upper Eyelash */}
          <path
            d="M 28 44 Q 36 38 44 44"
            stroke="#831843"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Right Eye */}
          <ellipse cx="64" cy="48" rx="6" ry="8" fill="url(#hinaEye)" />
          <circle cx="62" cy="45" r="2.5" fill="#ffffff" />
          <circle cx="66" cy="52" r="1.2" fill="#ffffff" />
          {/* Upper Eyelash */}
          <path
            d="M 56 44 Q 64 38 72 44"
            stroke="#831843"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Cute Smile */}
        {mood === 'cheer' || mood === 'sparkle' ? (
          <path
            d="M 44 60 Q 50 67 56 60 Z"
            fill="#f43f5e"
            stroke="#be123c"
            strokeWidth="1"
          />
        ) : (
          <path
            d="M 45 59 Q 50 63 55 59"
            stroke="#9f1239"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Front Hair Bangs */}
        <path
          d="M 20 40 Q 30 18 50 18 Q 70 18 80 40 Q 70 32 58 35 Q 50 25 42 35 Q 30 32 20 40 Z"
          fill="url(#hinaHair)"
        />
        <path
          d="M 35 34 Q 42 48 40 50 Q 38 46 32 40 Z"
          fill="url(#hinaHair)"
        />
        <path
          d="M 65 34 Q 58 48 60 50 Q 62 46 68 40 Z"
          fill="url(#hinaHair)"
        />

        {/* Golden Ribbon / Hairclip */}
        <path
          d="M 68 24 L 78 18 L 74 28 Z"
          fill="url(#hinaGold)"
        />
        <path
          d="M 68 24 L 78 30 L 74 20 Z"
          fill="url(#hinaGold)"
        />
        <circle cx="68" cy="24" r="3" fill="#fbbf24" />

        {/* Mini Minecraft Golden Apple accessory */}
        <g transform="translate(68, 64) scale(0.65)">
          <rect x="0" y="2" width="16" height="14" fill="#fbbf24" rx="3" />
          <rect x="2" y="0" width="12" height="18" fill="#fbbf24" rx="3" />
          <rect x="7" y="-4" width="2" height="4" fill="#78350f" />
          <rect x="9" y="-3" width="3" height="2" fill="#22c55e" />
          <rect x="3" y="4" width="4" height="4" fill="#fef08a" />
          <circle cx="16" cy="0" r="2" fill="#ffffff" opacity="0.8" />
        </g>
      </svg>
    );
  }

  if (theme === 'forest-night') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${sizeMap[size]} ${className} drop-shadow-md select-none`}
        width={dim}
        height={dim}
        aria-label="Anime Mascot Sora (Forest Night)"
      >
        <defs>
          <linearGradient id="soraHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <radialGradient id="soraEye" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#064e3b" />
          </radialGradient>
        </defs>

        {/* Elf Ears */}
        <path
          d="M 22 48 Q 6 36 12 56 Q 20 54 24 52 Z"
          fill="#f0fdf4"
          stroke="#059669"
          strokeWidth="1"
        />
        <path
          d="M 78 48 Q 94 36 88 56 Q 80 54 76 52 Z"
          fill="#f0fdf4"
          stroke="#059669"
          strokeWidth="1"
        />

        {/* Back Hair */}
        <path
          d="M 18 42 Q 8 68 20 84 Q 30 88 36 82 Q 24 66 26 48 Z"
          fill="url(#soraHair)"
        />
        <path
          d="M 82 42 Q 92 68 80 84 Q 70 88 64 82 Q 76 66 74 48 Z"
          fill="url(#soraHair)"
        />

        {/* Head Base */}
        <circle cx="50" cy="50" r="32" fill="#f0fdf4" />

        {/* Mint Cheeks */}
        <ellipse cx="32" cy="58" rx="6" ry="3" fill="#6ee7b7" opacity="0.6" />
        <ellipse cx="68" cy="58" rx="6" ry="3" fill="#6ee7b7" opacity="0.6" />

        {/* Eyes */}
        <g>
          {/* Left Eye */}
          <ellipse cx="36" cy="48" rx="6" ry="8" fill="url(#soraEye)" />
          <circle cx="34" cy="45" r="2.5" fill="#ffffff" />
          <circle cx="38" cy="52" r="1.2" fill="#ffffff" />
          <path
            d="M 28 44 Q 36 38 44 44"
            stroke="#064e3b"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Right Eye */}
          <ellipse cx="64" cy="48" rx="6" ry="8" fill="url(#soraEye)" />
          <circle cx="62" cy="45" r="2.5" fill="#ffffff" />
          <circle cx="66" cy="52" r="1.2" fill="#ffffff" />
          <path
            d="M 56 44 Q 64 38 72 44"
            stroke="#064e3b"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Gentle Smile */}
        <path
          d="M 45 60 Q 50 64 55 60"
          stroke="#064e3b"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Front Hair Bangs */}
        <path
          d="M 20 40 Q 30 18 50 18 Q 70 18 80 40 Q 72 32 60 34 Q 50 24 40 34 Q 28 32 20 40 Z"
          fill="url(#soraHair)"
        />
        <path
          d="M 36 34 Q 44 48 42 50 Q 40 46 34 38 Z"
          fill="url(#soraHair)"
        />
        <path
          d="M 64 34 Q 56 48 58 50 Q 60 46 66 38 Z"
          fill="url(#soraHair)"
        />

        {/* Nature Flower & Vine Hairpin */}
        <circle cx="70" cy="24" r="4" fill="#fb7185" />
        <circle cx="66" cy="21" r="3" fill="#fda4af" />
        <circle cx="74" cy="21" r="3" fill="#fda4af" />
        <circle cx="70" cy="28" r="3" fill="#fda4af" />
        <circle cx="70" cy="24" r="2" fill="#fef08a" />
        {/* Little Vine */}
        <path
          d="M 74 24 Q 82 22 84 30"
          stroke="#059669"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="84" cy="30" r="1.5" fill="#34d399" />
      </svg>
    );
  }

  // purple-cyan theme (Lumi)
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeMap[size]} ${className} drop-shadow-md select-none`}
      width={dim}
      height={dim}
      aria-label="Anime Mascot Lumi (Purple Cyan)"
    >
      <defs>
        <linearGradient id="lumiHair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <radialGradient id="lumiEye" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b0764" />
        </radialGradient>
      </defs>

      {/* Cyber/Magical Twintails */}
      <path
        d="M 18 42 Q 6 60 14 80 Q 24 85 28 78 Q 20 62 24 46 Z"
        fill="url(#lumiHair)"
      />
      <path
        d="M 82 42 Q 94 60 86 80 Q 76 85 72 78 Q 80 62 76 46 Z"
        fill="url(#lumiHair)"
      />

      {/* Head Base */}
      <circle cx="50" cy="50" r="32" fill="#faf5ff" />

      {/* Lavender Cheeks */}
      <ellipse cx="32" cy="58" rx="6" ry="3.5" fill="#d8b4fe" opacity="0.7" />
      <ellipse cx="68" cy="58" rx="6" ry="3.5" fill="#d8b4fe" opacity="0.7" />

      {/* Eyes */}
      <g>
        {/* Left Eye */}
        <ellipse cx="36" cy="48" rx="6" ry="8" fill="url(#lumiEye)" />
        <circle cx="34" cy="45" r="2.5" fill="#ffffff" />
        <circle cx="38" cy="52" r="1.2" fill="#ffffff" />
        <path
          d="M 28 44 Q 36 38 44 44"
          stroke="#4c1d95"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Right Eye */}
        <ellipse cx="64" cy="48" rx="6" ry="8" fill="url(#lumiEye)" />
        <circle cx="62" cy="45" r="2.5" fill="#ffffff" />
        <circle cx="66" cy="52" r="1.2" fill="#ffffff" />
        <path
          d="M 56 44 Q 64 38 72 44"
          stroke="#4c1d95"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Cheerful Mouth */}
      <path
        d="M 44 60 Q 50 66 56 60"
        stroke="#4c1d95"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Front Hair Bangs */}
      <path
        d="M 20 40 Q 30 18 50 18 Q 70 18 80 40 Q 72 32 60 34 Q 50 24 40 34 Q 28 32 20 40 Z"
        fill="url(#lumiHair)"
      />
      <path
        d="M 36 34 Q 44 48 42 50 Q 40 46 34 38 Z"
        fill="url(#lumiHair)"
      />
      <path
        d="M 64 34 Q 56 48 58 50 Q 60 46 66 38 Z"
        fill="url(#lumiHair)"
      />

      {/* Cyber/Magical Star Hairpin */}
      <polygon
        points="70,18 73,23 78,24 74,27 75,32 70,29 65,32 66,27 62,24 67,23"
        fill="#22d3ee"
      />
      <circle cx="70" cy="25" r="2" fill="#ffffff" />
    </svg>
  );
}

/**
 * Animated cute speech bubble badge for header / banner
 */
export function AnimeSpeechBadge({
  theme,
  text,
}: {
  theme: ThemeId;
  text: string;
}) {
  const borderColor =
    theme === 'warm-sunset'
      ? 'border-pink-500/40 text-pink-300 bg-pink-950/40'
      : theme === 'forest-night'
      ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40'
      : 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40';

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium backdrop-blur-sm shadow-sm ${borderColor}`}
    >
      <AnimeMascot theme={theme} size="sm" />
      <span className="truncate">{text}</span>
    </div>
  );
}
