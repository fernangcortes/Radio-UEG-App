import React from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Youtube,
  Radio,
  Sparkles,
  Info,
  MessageSquareHeart,
  BatteryCharging,
  Zap,
  Clock,
  Share2,
  ChevronRight,
  RefreshCw,
  Palette,
} from 'lucide-react';
import { DesignThemeConfig, ScheduleProgram } from '../types';
import { UserPreferences } from '../lib/storageService';
import {
  SoundwaveVisualizer,
  WaveWatermarkBackdrop,
} from './RadioWaveGraphic';

interface LivePlayerViewProps {
  theme: DesignThemeConfig;
  activeProgram: ScheduleProgram;
  nextProgram: ScheduleProgram;
  simulatedLabel?: string;
  isPlaying: boolean;
  isBuffering: boolean;
  isReconnecting: boolean;
  liveTrackTitle: string;
  metadataSource: 'zeno-live' | 'schedule';
  volume: number;
  isMuted: boolean;
  prefs: UserPreferences;
  whatsappNumber: string;
  onTogglePlay: () => void;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
  onUpdatePrefs: (prefs: UserPreferences) => void;
  onOpenProgramDetails: (program: ScheduleProgram) => void;
  onNavigateTab: (tab: 'ao-vivo' | 'programacao' | 'noticias' | 'redes') => void;
  onOpenDesignStudio: () => void;
}

export const LivePlayerView: React.FC<LivePlayerViewProps> = ({
  theme,
  activeProgram,
  nextProgram,
  simulatedLabel,
  isPlaying,
  isBuffering,
  isReconnecting,
  liveTrackTitle,
  volume,
  isMuted,
  prefs,
  whatsappNumber,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
  onUpdatePrefs,
  onOpenProgramDetails,
  onNavigateTab,
  onOpenDesignStudio,
}) => {
  const handleShare = async () => {
    const shareData = {
      title: 'Rádio UEG Educativa • Ao Vivo',
      text: `Estou ouvindo "${activeProgram.title}" na Rádio UEG Educativa!`,
      url: window.location.origin,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // canceled
      }
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      alert('Link da Rádio UEG copiado para a área de transferência!');
    }
  };

  const whatsappDirectUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Olá Rádio UEG! Estou ouvindo "${activeProgram.title}" pelo aplicativo e gostaria de mandar uma mensagem/pergunta:`
  )}`;

  // Modo Só Som / Economia de Bateria ([44:55])
  if (prefs.ecoAudioOnlyMode) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <div
          className="rounded-3xl p-6 shadow-xl relative overflow-hidden border"
          style={{
            backgroundColor: theme.bgSurface,
            borderColor: theme.borderColor,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: theme.accentPrimary }}
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              Modo Só Som • Economia Ativa
            </span>
            <button
              onClick={() => onUpdatePrefs({ ...prefs, ecoAudioOnlyMode: false })}
              className="text-xs font-bold underline cursor-pointer"
              style={{ color: theme.accentPrimary }}
            >
              Voltar ao Player Completo
            </button>
          </div>

          <div className="flex items-center gap-4 my-4">
            <button
              onClick={onTogglePlay}
              className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition transform active:scale-95 shrink-0 cursor-pointer"
              style={{ backgroundColor: theme.accentPrimary }}
              aria-label={isPlaying ? 'Pausar Rádio' : 'Tocar Rádio'}
            >
              {isBuffering ? (
                <RefreshCw className="w-8 h-8 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-9 h-9 fill-current" />
              ) : (
                <Play className="w-9 h-9 fill-current ml-1" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                style={{ color: theme.accentPrimary }}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                No Ar • {activeProgram.startTime}–{activeProgram.endTime}
              </div>
              <h2 className="text-xl font-extrabold truncate mt-0.5">
                {activeProgram.title}
              </h2>
              <p
                className="text-xs truncate mt-1"
                style={{ color: theme.textSecondary }}
              >
                {liveTrackTitle || activeProgram.subtitle}
              </p>
            </div>
          </div>

          <SoundwaveVisualizer
            theme={theme}
            isPlaying={isPlaying}
            barCount={29}
            className="h-9 my-2"
          />

          <p
            className="text-xs leading-relaxed rounded-2xl p-3 border mt-3"
            style={{
              backgroundColor: theme.bgElevated,
              borderColor: theme.borderColor,
              color: theme.textSecondary,
            }}
          >
            Você pode bloquear a tela do celular ou minimizar o navegador: o controle de
            <strong> Play/Pause</strong> fica fixo na barra de notificações do seu aparelho.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 pt-3 pb-8 space-y-5">
      {/* Simulated Scenario Banner */}
      {simulatedLabel && (
        <div
          className="rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs border shadow-sm"
          style={{
            backgroundColor: theme.bgSurface,
            borderColor: '#F7AD1C',
          }}
        >
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-[#D98A00] shrink-0" />
            <span>
              Cenário Demonstrativo: <strong>{simulatedLabel}</strong>
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#F7AD1C]/25 font-bold">
            Demo
          </span>
        </div>
      )}

      {/* Main Hero Player Card — Branco Marfim + Ondas da Logo */}
      <div
        className="relative rounded-3xl border shadow-xl overflow-hidden transition-colors"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.borderColor,
        }}
      >
        {/* Top colorful CriaLab 5-color signature strip */}
        <div className="h-1.5 w-full crialab-colorbar" />

        {/* Architectural Soundwave Watermark in the background */}
        <WaveWatermarkBackdrop theme={theme} opacity={theme.isDark ? 0.09 : 0.06} />

        <div className="relative z-10 p-5 sm:p-6">
          {/* Status Header */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E84136]/12 border border-[#E84136]/30 text-xs font-extrabold text-[#C91854]">
              <span className="w-2 h-2 rounded-full bg-[#E84136] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#E84136] -ml-4" />
              <span>
                AO VIVO • {activeProgram.sourceOrg || activeProgram.category}
              </span>
            </div>

            <div
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
                color: theme.textSecondary,
              }}
            >
              <Clock
                className="w-3.5 h-3.5"
                style={{ color: theme.accentPrimary }}
              />
              <span>
                {activeProgram.startTime} às {activeProgram.endTime}
              </span>
            </div>
          </div>

          {/* Player Layout Variations */}
          {theme.playerStyle === 'compact-studio' ? (
            /* Layout 3: Compact Horizontal Studio */
            <div
              className="p-4 rounded-2xl border flex items-center gap-4"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
              }}
            >
              <img
                src={activeProgram.coverUrl}
                alt={activeProgram.title}
                className="w-24 h-24 rounded-2xl object-cover border shadow-md shrink-0"
                style={{ borderColor: theme.borderColor }}
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-extrabold font-display leading-tight">
                  {activeProgram.title}
                </h1>
                <p
                  className="text-xs mt-1 line-clamp-2"
                  style={{ color: theme.textSecondary }}
                >
                  {activeProgram.subtitle}
                </p>
                <div className="mt-2">
                  <SoundwaveVisualizer
                    theme={theme}
                    isPlaying={isPlaying}
                    barCount={23}
                    className="h-7"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Layout 1 (Editorial com Ondas) & Layout 2 (Vinil Circular) */
            <div className="flex flex-col items-center">
              <div
                className={`relative group mx-auto w-full max-w-[275px] aspect-square overflow-hidden shadow-xl border-2 transition-all ${
                  theme.playerStyle === 'vinyl-waves'
                    ? 'rounded-full p-2'
                    : 'rounded-2xl'
                }`}
                style={{
                  borderColor: theme.borderColor,
                  backgroundColor: theme.bgElevated,
                }}
              >
                <img
                  src={activeProgram.coverUrl}
                  alt={activeProgram.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    theme.playerStyle === 'vinyl-waves'
                      ? `rounded-full ${isPlaying ? 'animate-spin-slow' : ''}`
                      : isPlaying
                      ? 'scale-[1.02]'
                      : 'scale-100'
                  }`}
                />

                {theme.playerStyle === 'vinyl-waves' && (
                  <div
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full border-4 shadow-inner"
                    style={{
                      backgroundColor: theme.bgPrimary,
                      borderColor: theme.accentPrimary,
                    }}
                  />
                )}

                {theme.playerStyle !== 'vinyl-waves' && (
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white">
                      <Radio className="w-3.5 h-3.5 text-[#F7AD1C]" />
                      <span className="text-[11px] font-bold tracking-wide">
                        {isReconnecting
                          ? 'Reconectando...'
                          : isBuffering
                          ? 'Conectando ao estúdio...'
                          : isPlaying
                          ? 'No Ar • Sinal Zeno HD'
                          : 'Pronto para tocar'}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenProgramDetails(activeProgram)}
                      className="p-2 rounded-xl bg-black/75 hover:bg-black text-white backdrop-blur-md transition cursor-pointer"
                      title="Ver Ficha Técnica do Programa"
                    >
                      <Info className="w-4 h-4 text-[#F7AD1C]" />
                    </button>
                  </div>
                )}
              </div>

              {/* Signature Rádio UEG Educativa Soundwave Equalizer right below cover */}
              {theme.wavePresence !== 'minimal' && (
                <div className="w-full max-w-sm mt-5 px-2">
                  <SoundwaveVisualizer
                    theme={theme}
                    isPlaying={isPlaying}
                    barCount={38}
                    className="h-11"
                  />
                </div>
              )}

              {/* Program Title & Subtitle */}
              <div className="mt-3 text-center space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
                  {activeProgram.title}
                </h1>
                <p
                  className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed"
                  style={{ color: theme.textSecondary }}
                >
                  {activeProgram.subtitle}
                </p>

                {liveTrackTitle && (
                  <div className="pt-1.5">
                    <span
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border"
                      style={{
                        backgroundColor: theme.bgElevated,
                        borderColor: theme.borderColor,
                        color: theme.accentPrimary,
                      }}
                    >
                      🎵 Tocando agora: {liveTrackTitle}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DYNAMIC YOUTUBE LIVE BUTTON — Appears prominently when activeProgram.hasLiveVideo is true ([16:51]) */}
          {activeProgram.hasLiveVideo && (
            <div className="mt-4">
              <a
                href={
                  activeProgram.youtubeLiveUrl ||
                  'https://www.youtube.com/@radiouegeducativa'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#C91854] to-[#E84136] hover:brightness-105 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md transition transform active:scale-[0.99]"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <Youtube className="w-5 h-5" />
                <span>Este programa tem imagem! Assistir no YouTube</span>
              </a>
            </div>
          )}

          {/* Primary Play / Pause & Volume Controls */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={handleShare}
              className="p-3.5 rounded-2xl border transition cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
                color: theme.textPrimary,
              }}
              title="Compartilhar Rádio UEG"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={onTogglePlay}
              className="flex-1 py-4 px-6 rounded-2xl text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg transition transform active:scale-[0.98] cursor-pointer hover:brightness-105"
              style={{ backgroundColor: theme.accentPrimary }}
            >
              {isBuffering ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Conectando...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="w-6 h-6 fill-current" />
                  <span>Pausar Transmissão</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  <span>Ouvir Rádio Ao Vivo</span>
                </>
              )}
            </button>

            <button
              onClick={onToggleMute}
              className="p-3.5 rounded-2xl border transition cursor-pointer hover:opacity-80"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
                color: theme.textPrimary,
              }}
              title={isMuted ? 'Ativar som' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-[#E84136]" />
              ) : (
                <Volume2
                  className="w-5 h-5"
                  style={{ color: theme.accentPrimary }}
                />
              )}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="mt-3 flex items-center gap-3 px-2">
            <span
              className="text-[11px] font-semibold w-12"
              style={{ color: theme.textSecondary }}
            >
              Volume
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-lg cursor-pointer"
              style={{ accentColor: theme.accentPrimary }}
            />
            <span
              className="text-[11px] font-bold w-9 text-right"
              style={{ color: theme.textSecondary }}
            >
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Quick Action Strip */}
          <div
            className="mt-5 pt-4 border-t grid grid-cols-3 gap-2"
            style={{ borderColor: theme.borderColor }}
          >
            <button
              onClick={() => onOpenProgramDetails(activeProgram)}
              className="py-2.5 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer hover:opacity-85"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
              }}
            >
              <Info
                className="w-4 h-4 shrink-0"
                style={{ color: theme.accentPrimary }}
              />
              <span className="truncate">Ficha Técnica</span>
            </button>

            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition hover:opacity-85"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
                color: theme.accentPrimary,
              }}
            >
              <MessageSquareHeart className="w-4 h-4 shrink-0" />
              <span className="truncate">
                {activeProgram.id === 'papo-reitor'
                  ? 'Pergunte ao Reitor'
                  : 'Mandar Recado'}
              </span>
            </a>

            <button
              onClick={onOpenDesignStudio}
              className="py-2.5 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer hover:opacity-85"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
                color: theme.accentSecondary,
              }}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span className="truncate">Personalizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Listening Mode Toggles ([44:50]) */}
      <div
        className="rounded-2xl border p-4 space-y-3 shadow-sm"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.borderColor,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="p-2 rounded-xl text-white"
            style={{ backgroundColor: theme.accentPrimary }}
          >
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider">
              Modo Rápido • Praticidade e Bateria
            </h3>
            <p className="text-[11px]" style={{ color: theme.textSecondary }}>
              Configure como o aplicativo funciona ao tocar no ícone
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <label
            className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition"
            style={{
              backgroundColor: theme.bgElevated,
              borderColor: theme.borderColor,
            }}
          >
            <div>
              <div className="text-xs font-bold">Tocar Direto ao Abrir</div>
              <div
                className="text-[11px]"
                style={{ color: theme.textSecondary }}
              >
                Inicia o som em 1 clique
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.autoplayOnOpen}
              onChange={(e) =>
                onUpdatePrefs({ ...prefs, autoplayOnOpen: e.target.checked })
              }
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: theme.accentPrimary }}
            />
          </label>

          <label
            className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition"
            style={{
              backgroundColor: theme.bgElevated,
              borderColor: theme.borderColor,
            }}
          >
            <div>
              <div className="text-xs font-bold">Modo Só Som (Compacto)</div>
              <div
                className="text-[11px]"
                style={{ color: theme.textSecondary }}
              >
                Economiza bateria e tela
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.ecoAudioOnlyMode}
              onChange={(e) =>
                onUpdatePrefs({ ...prefs, ecoAudioOnlyMode: e.target.checked })
              }
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: theme.accentPrimary }}
            />
          </label>
        </div>
      </div>

      {/* Next Up on the Schedule Card */}
      <div
        className="rounded-2xl border p-4 flex items-center justify-between gap-3 shadow-sm"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.borderColor,
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={nextProgram.coverUrl}
            alt={nextProgram.title}
            className="w-12 h-12 rounded-xl object-cover border shrink-0"
            style={{ borderColor: theme.borderColor }}
          />
          <div className="min-w-0">
            <div
              className="text-[11px] font-extrabold uppercase tracking-wider"
              style={{ color: theme.accentSecondary }}
            >
              A Seguir • {nextProgram.startTime}
            </div>
            <div className="text-sm font-bold truncate">
              {nextProgram.title}
            </div>
            <div
              className="text-xs truncate"
              style={{ color: theme.textSecondary }}
            >
              {nextProgram.subtitle}
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('programacao')}
          className="px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1 shrink-0 transition cursor-pointer"
          style={{
            backgroundColor: theme.bgElevated,
            borderColor: theme.borderColor,
            color: theme.accentPrimary,
          }}
        >
          <span>Grade</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
