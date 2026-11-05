import React, { useState } from 'react';
import {
  Palette,
  X,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Waves,
  Layout,
  Sun,
  Moon,
} from 'lucide-react';
import { DesignThemeConfig } from '../types';
import { THEME_PRESETS, DEFAULT_THEME_CONFIG } from '../lib/storageService';

interface DesignStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: DesignThemeConfig;
  onChangeTheme: (next: DesignThemeConfig) => void;
}

export const DesignStudioDrawer: React.FC<DesignStudioDrawerProps> = ({
  isOpen,
  onClose,
  theme,
  onChangeTheme,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyConfig = async () => {
    await navigator.clipboard.writeText(JSON.stringify(theme, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[var(--app-surface)] border-l border-[var(--app-border)] shadow-2xl flex flex-col text-[var(--app-text)]">
      <div className="h-1.5 w-full crialab-colorbar shrink-0" />

      {/* Header */}
      <div className="p-4 border-b border-[var(--app-border)] flex items-center justify-between bg-[var(--app-elevated)]">
        <div className="flex items-center gap-2">
          <div
            className="p-2 rounded-xl text-white"
            style={{ backgroundColor: theme.accentPrimary }}
          >
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold font-display">
              Estúdio de Design Interativo
            </h3>
            <p className="text-[11px] text-[var(--app-text-muted)]">
              Construa o visual ao vivo • Rádio UEG & CriaLab
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-black/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 overflow-y-auto space-y-5 flex-1 text-xs">
        {/* 1. Theme Presets (Branco Marfim default!) */}
        <div className="space-y-2">
          <label className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-[var(--app-text-muted)]">
            <Sun className="w-3.5 h-3.5" />
            1. Base de Cor (Branco Marfim & Variações)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {THEME_PRESETS.map((preset) => {
              const active = theme.presetId === preset.config.presetId;
              return (
                <button
                  key={preset.config.presetId}
                  onClick={() =>
                    onChangeTheme({
                      ...preset.config,
                      wavePalette: theme.wavePalette,
                      wavePresence: theme.wavePresence,
                      playerStyle: theme.playerStyle,
                    })
                  }
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                    active
                      ? 'ring-2 ring-[var(--app-accent)] border-transparent font-bold'
                      : 'border-[var(--app-border)] hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: preset.config.bgPrimary,
                    color: preset.config.textPrimary,
                  }}
                >
                  <div>
                    <div className="text-xs font-extrabold">{preset.label}</div>
                    <div
                      className="text-[10px]"
                      style={{ color: preset.config.textSecondary }}
                    >
                      {preset.subtitle}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className="w-5 h-5 rounded-full border border-black/15"
                      style={{ backgroundColor: preset.config.bgPrimary }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-black/15"
                      style={{ backgroundColor: preset.config.bgSurface }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-black/15"
                      style={{ backgroundColor: preset.config.accentPrimary }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Fine-tune HEX colors */}
        <div className="space-y-2 pt-2 border-t border-[var(--app-border)]">
          <label className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-[var(--app-text-muted)]">
            <Sparkles className="w-3.5 h-3.5" />
            2. Ajuste Fino das Cores (Clique para testar)
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <label className="p-2.5 rounded-xl bg-[var(--app-elevated)] border border-[var(--app-border)] flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-bold text-[11px]">Fundo (Marfim)</div>
                <div className="text-[10px] text-[var(--app-text-muted)]">
                  {theme.bgPrimary}
                </div>
              </div>
              <input
                type="color"
                value={theme.bgPrimary}
                onChange={(e) =>
                  onChangeTheme({
                    ...theme,
                    presetId: 'custom',
                    bgPrimary: e.target.value,
                  })
                }
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              />
            </label>

            <label className="p-2.5 rounded-xl bg-[var(--app-elevated)] border border-[var(--app-border)] flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-bold text-[11px]">Cards / Superfície</div>
                <div className="text-[10px] text-[var(--app-text-muted)]">
                  {theme.bgSurface}
                </div>
              </div>
              <input
                type="color"
                value={theme.bgSurface}
                onChange={(e) =>
                  onChangeTheme({
                    ...theme,
                    presetId: 'custom',
                    bgSurface: e.target.value,
                  })
                }
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              />
            </label>

            <label className="p-2.5 rounded-xl bg-[var(--app-elevated)] border border-[var(--app-border)] flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-bold text-[11px]">Destaque 1</div>
                <div className="text-[10px] text-[var(--app-text-muted)]">
                  {theme.accentPrimary}
                </div>
              </div>
              <input
                type="color"
                value={theme.accentPrimary}
                onChange={(e) =>
                  onChangeTheme({
                    ...theme,
                    presetId: 'custom',
                    accentPrimary: e.target.value,
                  })
                }
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              />
            </label>

            <label className="p-2.5 rounded-xl bg-[var(--app-elevated)] border border-[var(--app-border)] flex items-center justify-between cursor-pointer">
              <div>
                <div className="font-bold text-[11px]">Destaque 2</div>
                <div className="text-[10px] text-[var(--app-text-muted)]">
                  {theme.accentSecondary}
                </div>
              </div>
              <input
                type="color"
                value={theme.accentSecondary}
                onChange={(e) =>
                  onChangeTheme({
                    ...theme,
                    presetId: 'custom',
                    accentSecondary: e.target.value,
                  })
                }
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              />
            </label>
          </div>

          {/* Quick CriaLab Accent Swatches */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-[var(--app-text-muted)]">
              Cores CriaLab:
            </span>
            {[
              { hex: '#158481', name: 'Teal' },
              { hex: '#C91854', name: 'Rubi' },
              { hex: '#E84136', name: 'Coral' },
              { hex: '#D98A00', name: 'Âmbar' },
              { hex: '#7D8726', name: 'Oliva' },
              { hex: '#18181B', name: 'Grafite' },
            ].map((sw) => (
              <button
                key={sw.hex}
                onClick={() =>
                  onChangeTheme({ ...theme, accentPrimary: sw.hex })
                }
                className="w-6 h-6 rounded-full border border-black/20 transition transform hover:scale-110 cursor-pointer"
                style={{ backgroundColor: sw.hex }}
                title={`Usar ${sw.name} como cor principal`}
              />
            ))}
          </div>
        </div>

        {/* 3. Estilo das Ondas da Logo */}
        <div className="space-y-2 pt-2 border-t border-[var(--app-border)]">
          <label className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-[var(--app-text-muted)]">
            <Waves className="w-3.5 h-3.5" />
            3. Estilo das Ondas Sonoras (Logo Rádio UEG)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'crialab-5', label: '5 Cores CriaLab' },
              { id: 'teal-mono', label: 'Teal Institucional' },
              { id: 'charcoal-gold', label: 'Grafite & Âmbar' },
              { id: 'ruby-coral', label: 'Rubi & Coral' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() =>
                  onChangeTheme({
                    ...theme,
                    wavePalette: opt.id as DesignThemeConfig['wavePalette'],
                  })
                }
                className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                  theme.wavePalette === opt.id
                    ? 'bg-[var(--app-accent)] text-white border-transparent'
                    : 'bg-[var(--app-elevated)] border-[var(--app-border)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {[
              { id: 'full', label: 'Ondas Fortes' },
              { id: 'medium', label: 'Equilibrado' },
              { id: 'minimal', label: 'Discreto' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() =>
                  onChangeTheme({
                    ...theme,
                    wavePresence: p.id as DesignThemeConfig['wavePresence'],
                  })
                }
                className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                  theme.wavePresence === p.id
                    ? 'border-[var(--app-accent)] font-bold bg-[var(--app-elevated)]'
                    : 'border-[var(--app-border)] opacity-75'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Formato do Player */}
        <div className="space-y-2 pt-2 border-t border-[var(--app-border)]">
          <label className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-[var(--app-text-muted)]">
            <Layout className="w-3.5 h-3.5" />
            4. Layout do Player Ao Vivo
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              {
                id: 'editorial-waves',
                label: 'Editorial com Ondas da Logo (Recomendado)',
                desc: 'Capa quadrada + equalizador de 37 barras da Rádio UEG',
              },
              {
                id: 'vinyl-waves',
                label: 'Estúdio Circular / Vinil Acústico',
                desc: 'Capa circular giratória com ondas sonoras integradas',
              },
              {
                id: 'compact-studio',
                label: 'Horizontal Direto (Ultra Compacto)',
                desc: 'Player horizontal focado em acesso imediato e grade abaixo',
              },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() =>
                  onChangeTheme({
                    ...theme,
                    playerStyle: st.id as DesignThemeConfig['playerStyle'],
                  })
                }
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                  theme.playerStyle === st.id
                    ? 'bg-[var(--app-accent)] text-white border-transparent'
                    : 'bg-[var(--app-elevated)] border-[var(--app-border)]'
                }`}
              >
                <div className="font-bold text-xs">{st.label}</div>
                <div
                  className={`text-[10px] ${
                    theme.playerStyle === st.id
                      ? 'text-white/85'
                      : 'text-[var(--app-text-muted)]'
                  }`}
                >
                  {st.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[var(--app-border)] bg-[var(--app-elevated)] flex items-center justify-between gap-2">
        <button
          onClick={() => onChangeTheme(DEFAULT_THEME_CONFIG)}
          className="px-3 py-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Padrão Marfim</span>
        </button>

        <button
          onClick={handleCopyConfig}
          className="flex-1 py-2 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          style={{ backgroundColor: theme.accentPrimary }}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar JSON do Tema</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
