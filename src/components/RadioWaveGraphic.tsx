import React from 'react';
import { DesignThemeConfig } from '../types';

/**
 * Exact 19-bar vertical soundwave heights from the official Rádio UEG Educativa logo
 * (normalized 0..100)
 */
export const RADIO_UEG_WAVE_BARS = [
  24, 46, 98, 36, 68, 26, 46, 30, 42, 60, 42, 34, 86, 46, 28, 42, 54, 34, 24,
];

const CRIALAB_5_COLORS = [
  '#C91854',
  '#C91854',
  '#C91854',
  '#C91854',
  '#E84136',
  '#E84136',
  '#E84136',
  '#F7AD1C',
  '#F7AD1C',
  '#F7AD1C',
  '#F7AD1C',
  '#9BA538',
  '#9BA538',
  '#9BA538',
  '#9BA538',
  '#158481',
  '#158481',
  '#158481',
  '#158481',
];

export function getBarColor(
  index: number,
  palette: DesignThemeConfig['wavePalette'],
  accentPrimary: string,
  isDark: boolean
): string {
  if (palette === 'crialab-5') {
    return CRIALAB_5_COLORS[index % CRIALAB_5_COLORS.length];
  }
  if (palette === 'teal-mono') {
    return index % 3 === 0 ? accentPrimary : isDark ? '#8CE0C4' : '#0F5E5C';
  }
  if (palette === 'charcoal-gold') {
    return index === 2 || index === 9 || index === 12
      ? '#F7AD1C'
      : isDark
      ? '#E4E4E7'
      : '#27272A';
  }
  // ruby-coral
  return index % 2 === 0 ? '#C91854' : '#E84136';
}

interface RadioLogoMarkProps {
  theme: DesignThemeConfig;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RadioLogoMark: React.FC<RadioLogoMarkProps> = ({
  theme,
  animated = false,
  size = 'md',
}) => {
  const heightClass = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-14' : 'h-10';

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <svg
        viewBox="0 0 250 118"
        className={`${heightClass} w-auto overflow-visible`}
        aria-label="Rádio UEG Educativa"
      >
        <g transform="translate(2, 2)">
          {RADIO_UEG_WAVE_BARS.map((h, i) => {
            const barH = Math.round((h / 100) * 68);
            const y = i === 2 ? 0 : i === 12 ? 6 : Math.round((68 - barH) * 0.72);
            const fill = getBarColor(
              i,
              theme.wavePalette,
              theme.accentPrimary,
              theme.isDark
            );
            return (
              <rect
                key={i}
                x={i * 12.8}
                y={y}
                width={6.5}
                height={barH}
                rx={3.25}
                fill={fill}
                className={animated ? 'wave-bar-animated' : ''}
                style={
                  animated
                    ? { animationDelay: `${(i % 7) * 0.12}s` }
                    : undefined
                }
              />
            );
          })}
        </g>

        <text
          x="2"
          y="82"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="15"
          fontWeight="700"
          fill={theme.textSecondary}
        >
          Rádio
        </text>
        <text
          x="1"
          y="113"
          fontFamily="'Space Grotesk', sans-serif"
          fontSize="35"
          fontWeight="800"
          fill={theme.textPrimary}
          letterSpacing="-1"
        >
          UEG
        </text>
        <text
          x="80"
          y="112"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="32"
          fontWeight="500"
          fill={theme.accentPrimary}
          letterSpacing="-0.5"
        >
          Educativa
        </text>
      </svg>
    </div>
  );
};

interface SoundwaveVisualizerProps {
  theme: DesignThemeConfig;
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

export const SoundwaveVisualizer: React.FC<SoundwaveVisualizerProps> = ({
  theme,
  isPlaying,
  barCount = 37,
  className = 'h-12',
}) => {
  const bars = Array.from({ length: barCount }, (_, idx) => {
    const baseHeight = RADIO_UEG_WAVE_BARS[idx % RADIO_UEG_WAVE_BARS.length];
    return baseHeight;
  });

  return (
    <div
      className={`flex items-center justify-center gap-[4px] w-full ${className}`}
      aria-hidden="true"
    >
      {bars.map((h, i) => {
        const color = getBarColor(
          i % RADIO_UEG_WAVE_BARS.length,
          theme.wavePalette,
          theme.accentPrimary,
          theme.isDark
        );
        return (
          <span
            key={i}
            className=" rounded-full transition-all duration-300"
            style={{
              width: '4.5px',
              height: `${Math.max(18, h)}%`,
              backgroundColor: color,
              opacity: isPlaying ? 0.92 : 0.38,
              transform: isPlaying
                ? undefined
                : 'scaleY(0.65)',
              animation: isPlaying
                ? `wave-pulse ${0.75 + (i % 5) * 0.14}s ease-in-out ${(i % 7) * 0.09}s infinite`
                : 'none',
            }}
          />
        );
      })}
    </div>
  );
};

export const WaveWatermarkBackdrop: React.FC<{
  theme: DesignThemeConfig;
  opacity?: number;
}> = ({ theme, opacity = 0.07 }) => {
  if (theme.wavePresence === 'minimal') return null;

  return (
    <div
      className="pointer-events-none select-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-1.5 px-3 overflow-hidden h-28"
      style={{ opacity }}
      aria-hidden="true"
    >
      {Array.from({ length: 38 }).map((_, i) => {
        const h = RADIO_UEG_WAVE_BARS[i % RADIO_UEG_WAVE_BARS.length];
        const color = getBarColor(
          i % RADIO_UEG_WAVE_BARS.length,
          theme.wavePalette,
          theme.accentPrimary,
          theme.isDark
        );
        return (
          <div
            key={i}
            className="flex-1 rounded-t-full"
            style={{
              height: `${h}%`,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
};
