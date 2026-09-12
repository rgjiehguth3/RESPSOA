import { useEffect, useRef } from 'react';
import { StyleId, ThemeId } from '../types';
import { getAssetsForTheme, MinecraftItemAsset } from '../utils/minecraftAssets';

interface BackgroundCanvasProps {
  theme: ThemeId;
  style: StyleId;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  assetIndex: number;
  color: string;
  wobbleSpeed: number;
  wobblePhase: number;
}

export function BackgroundCanvas({ theme, style }: BackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Preload Minecraft food / theme assets
    const themeAssets = getAssetsForTheme(theme);
    const loadedImages: HTMLImageElement[] = [];

    themeAssets.forEach((asset) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = asset.url;
      loadedImages.push(img);
    });

    const isMinimal = style === 'minimal';
    const particleCount = isMinimal ? 10 : style === 'modern' ? 32 : 24;

    const getColorsForTheme = (t: ThemeId) => {
      if (t === 'warm-sunset') {
        return ['#f59e0b', '#fb7185', '#f43f5e', '#fbbf24', '#fdba74'];
      }
      if (t === 'forest-night') {
        return ['#10b981', '#34d399', '#059669', '#6ee7b7', '#047857'];
      }
      return ['#8b5cf6', '#a855f7', '#06b6d4', '#22d3ee', '#c084fc'];
    };

    const colors = getColorsForTheme(theme);

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const isWarmSunset = theme === 'warm-sunset';
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        // In warm-sunset, food gently falls down
        vx: (Math.random() - 0.5) * 0.3,
        vy: isWarmSunset ? 0.4 + Math.random() * 0.6 : (Math.random() - 0.5) * 0.4 + 0.25,
        size: isWarmSunset ? 22 + Math.random() * 14 : 18 + Math.random() * 14,
        rotation: (Math.random() - 0.5) * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        opacity: 0.2 + Math.random() * 0.4,
        assetIndex: Math.floor(Math.random() * Math.max(1, themeAssets.length)),
        color: colors[Math.floor(Math.random() * colors.length)],
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobblePhase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      // Pixel art crisp rendering
      ctx.imageSmoothingEnabled = false;
      time += 0.02;

      for (const p of particles) {
        p.wobblePhase += p.wobbleSpeed;
        const sway = Math.sin(p.wobblePhase) * 0.4;
        p.x += p.vx + sway;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Wrap around bounds
        if (p.y > height + 50) {
          p.y = -50;
          p.x = Math.random() * width;
        } else if (p.y < -50) {
          p.y = height + 50;
        }

        if (p.x > width + 50) p.x = -50;
        else if (p.x < -50) p.x = width + 50;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        const img = loadedImages[p.assetIndex];
        const s = p.size;

        if (img && img.complete && img.naturalWidth > 0) {
          // Draw real Minecraft food item
          ctx.drawImage(img, -s / 2, -s / 2, s, s);
        } else {
          // Fallback pixel art icon while image is downloading
          ctx.fillStyle = p.color;
          ctx.fillRect(-s / 2, -s / 2, s, s);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, style]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ opacity: 0.85 }}
    />
  );
}
