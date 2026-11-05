import React, { useEffect, useState } from 'react';
import {
  Radio,
  CalendarClock,
  Newspaper,
  Share2,
  Download,
  Settings,
  Sparkles,
  Play,
  Pause,
  RefreshCw,
  FileSpreadsheet,
  Palette,
} from 'lucide-react';
import {
  applyThemeCssVars,
  getActiveProgram,
  loadChecklist,
  loadNews,
  loadPodcasts,
  loadRadioConfig,
  loadSchedule,
  loadTeam,
  loadThemeConfig,
  loadUserPreferences,
  saveChecklist,
  saveNews,
  saveRadioConfig,
  saveSchedule,
  saveThemeConfig,
  saveUserPreferences,
  UserPreferences,
} from './lib/storageService';
import {
  ChecklistTaskItem,
  DesignThemeConfig,
  NewsArticle,
  PodcastShow,
  RadioConfig,
  ScheduleProgram,
  SimulationScenarioId,
  TeamMember,
} from './types';
import { useRadioPlayer } from './hooks/useRadioPlayer';
import { LivePlayerView } from './components/LivePlayerView';
import { ScheduleView } from './components/ScheduleView';
import { NewsView } from './components/NewsView';
import { RedesHubView } from './components/RedesHubView';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { InstallQrModal } from './components/InstallQrModal';
import { AdminModal } from './components/AdminModal';
import { TeamChecklistModal } from './components/TeamChecklistModal';
import { DesignStudioDrawer } from './components/DesignStudioDrawer';
import { RadioLogoMark } from './components/RadioWaveGraphic';

type TabId = 'ao-vivo' | 'programacao' | 'noticias' | 'redes';

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('tab');
    if (t === 'programacao' || t === 'noticias' || t === 'redes') return t;
    return 'ao-vivo';
  });

  const [theme, setTheme] = useState<DesignThemeConfig>(() => loadThemeConfig());
  const [schedule, setSchedule] = useState<ScheduleProgram[]>(() => loadSchedule());
  const [news, setNews] = useState<NewsArticle[]>(() => loadNews());
  const [podcasts] = useState<PodcastShow[]>(() => loadPodcasts());
  const [team] = useState<TeamMember[]>(() => loadTeam());
  const [checklist, setChecklist] = useState<ChecklistTaskItem[]>(() =>
    loadChecklist()
  );
  const [config, setConfig] = useState<RadioConfig>(() => loadRadioConfig());
  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    const base = loadUserPreferences();
    const params = new URLSearchParams(window.location.search);
    if (params.get('eco') === '1') {
      return { ...base, ecoAudioOnlyMode: true };
    }
    return base;
  });

  // Live Scenario Simulator
  const [scenario, setScenario] = useState<SimulationScenarioId>('realtime');
  const [now, setNow] = useState<Date>(() => new Date());

  // Modals & Drawers
  const [selectedProgramModal, setSelectedProgramModal] =
    useState<ScheduleProgram | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isDesignStudioOpen, setIsDesignStudioOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('planilha') === '1';
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Apply CSS variables whenever theme changes
  useEffect(() => {
    applyThemeCssVars(theme);
  }, [theme]);

  // Refresh clock every 30s
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);

  // Capture PWA beforeinstallprompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleTriggerInstall = async () => {
    if (!deferredPrompt) {
      setIsInstallModalOpen(true);
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallModalOpen(false);
  };

  const { current: activeProgram, next: nextProgram, simulatedLabel } =
    getActiveProgram(schedule, scenario, now);

  const player = useRadioPlayer({
    streamUrl: config.streamUrl,
    zenoMountId: config.zenoMountId,
    activeProgram,
    autoplayOnOpen: prefs.autoplayOnOpen,
  });

  const handleUpdateTheme = (next: DesignThemeConfig) => {
    setTheme(next);
    saveThemeConfig(next);
  };

  const handleUpdatePrefs = (next: UserPreferences) => {
    setPrefs(next);
    saveUserPreferences(next);
  };

  const handleUpdateSchedule = (next: ScheduleProgram[]) => {
    setSchedule(next);
    saveSchedule(next);
  };

  const handleUpdateNews = (next: NewsArticle[]) => {
    setNews(next);
    saveNews(next);
  };

  const handleUpdateChecklist = (next: ChecklistTaskItem[]) => {
    setChecklist(next);
    saveChecklist(next);
  };

  const handleUpdateConfig = (next: RadioConfig) => {
    setConfig(next);
    saveRadioConfig(next);
  };

  const pendingChecklistCount = checklist.filter(
    (c) => c.status !== 'concluido'
  ).length;

  return (
    <div
      className="min-h-screen flex flex-col pb-24 transition-colors duration-200"
      style={{
        backgroundColor: theme.bgPrimary,
        color: theme.textPrimary,
      }}
    >
      {/* Top 5-color CriaLab Identity Strip */}
      <div className="h-1.5 w-full crialab-colorbar sticky top-0 z-40" />

      {/* Top Navigation Bar */}
      <header
        className="sticky top-1.5 z-30 backdrop-blur-xl border-b transition-colors"
        style={{
          backgroundColor: `${theme.bgSurface}E8`,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
          {/* Official Rádio UEG Soundwave Logo + CriaLab */}
          <button
            onClick={() => setActiveTab('ao-vivo')}
            className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
          >
            <RadioLogoMark
              theme={theme}
              animated={player.isPlaying}
              size="md"
            />
          </button>

          {/* Right Toolbar: Scenario Simulator + Design Studio + Planilha + Install + Admin */}
          <div className="flex items-center gap-1.5">
            {/* Live Presentation Scenario Selector */}
            <div
              className="relative flex items-center border rounded-xl px-2 py-1.5"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
              }}
            >
              <Sparkles
                className="w-3.5 h-3.5 mr-1 shrink-0"
                style={{ color: theme.accentSecondary }}
              />
              <select
                aria-label="Simular Cenário da Rádio"
                value={scenario}
                onChange={(e) =>
                  setScenario(e.target.value as SimulationScenarioId)
                }
                className="bg-transparent text-[11px] font-bold focus:outline-none cursor-pointer pr-1 max-w-[100px] sm:max-w-[150px] truncate"
                style={{ color: theme.textPrimary }}
              >
                <option value="realtime" style={{ backgroundColor: theme.bgSurface, color: theme.textPrimary }}>
                  Horário Real (Agora)
                </option>
                <option value="papo-reitor" style={{ backgroundColor: theme.bgSurface, color: theme.textPrimary }}>
                  Demo: Papo com o Reitor (Vídeo)
                </option>
                <option value="ueg-sintonia" style={{ backgroundColor: theme.bgSurface, color: theme.textPrimary }}>
                  Demo: UEG em Sintonia (Vídeo)
                </option>
                <option value="vida-pulsa" style={{ backgroundColor: theme.bgSurface, color: theme.textPrimary }}>
                  Demo: Vida Pulsa (10h)
                </option>
                <option value="sunset-vibes" style={{ backgroundColor: theme.bgSurface, color: theme.textPrimary }}>
                  Demo: Sunset Vibes (17h)
                </option>
                <option value="fabular" style={{ backgroundColor: theme.bgSurface, color: theme.textPrimary }}>
                  Demo: Podcast Fabular (19h)
                </option>
                <option value="madrugada-viva" style={{ backgroundColor: theme.bgSurface, color: theme.textPrimary }}>
                  Demo: Madrugada Viva (00h)
                </option>
              </select>
            </div>

            {/* Interactive Design Studio Button */}
            <button
              onClick={() => setIsDesignStudioOpen((v) => !v)}
              className="px-2.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition hover:brightness-105"
              style={{ backgroundColor: theme.accentSecondary }}
              title="Abrir Estúdio de Design Interativo (Cores, Marfim & Ondas)"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Design</span>
            </button>

            {/* Interactive Team Spreadsheet / Checklist Button */}
            <button
              onClick={() => setIsChecklistModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition hover:brightness-105"
              style={{ backgroundColor: theme.accentPrimary }}
              title="Abrir Planilha Interativa de Pendências da Equipe & Grade 24h"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Planilha</span>
              {pendingChecklistCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-black/25 text-[10px] text-white font-extrabold">
                  {pendingChecklistCount}
                </span>
              )}
            </button>

            {/* Install App / QR Code Matrícula Button */}
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="p-2 rounded-xl border cursor-pointer transition"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
                color: theme.textPrimary,
              }}
              title="Instalar Aplicativo / QR Code para Calouros"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Admin / Gestão Button */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="p-2 rounded-xl border cursor-pointer transition"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
                color: theme.textPrimary,
              }}
              title="Painel Gestor (Grade, Planilha CSV, Notícias & Supabase)"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'ao-vivo' && (
          <LivePlayerView
            theme={theme}
            activeProgram={activeProgram}
            nextProgram={nextProgram}
            simulatedLabel={simulatedLabel}
            isPlaying={player.isPlaying}
            isBuffering={player.isBuffering}
            isReconnecting={player.isReconnecting}
            liveTrackTitle={player.liveTrackTitle}
            metadataSource={player.metadataSource}
            volume={player.volume}
            isMuted={player.isMuted}
            prefs={prefs}
            whatsappNumber={config.whatsappNumber}
            onTogglePlay={player.togglePlay}
            onVolumeChange={player.setVolume}
            onToggleMute={() => player.setIsMuted(!player.isMuted)}
            onUpdatePrefs={handleUpdatePrefs}
            onOpenProgramDetails={(prog) => setSelectedProgramModal(prog)}
            onNavigateTab={setActiveTab}
            onOpenDesignStudio={() => setIsDesignStudioOpen(true)}
          />
        )}

        {activeTab === 'programacao' && (
          <ScheduleView
            theme={theme}
            schedule={schedule}
            activeProgram={activeProgram}
            team={team}
            onSelectProgram={(prog) => setSelectedProgramModal(prog)}
            onOpenTeamSpreadsheet={() => setIsChecklistModalOpen(true)}
          />
        )}

        {activeTab === 'noticias' && (
          <NewsView
            theme={theme}
            news={news}
            schedule={schedule}
            onOpenProgramDetails={(prog) => setSelectedProgramModal(prog)}
          />
        )}

        {activeTab === 'redes' && (
          <RedesHubView theme={theme} podcasts={podcasts} config={config} />
        )}
      </main>

      {/* Floating Persistent Mini-Player when outside 'Ao Vivo' tab */}
      {activeTab !== 'ao-vivo' && (
        <div className="fixed bottom-16 left-0 right-0 z-30 px-3 pb-2 pointer-events-none">
          <div
            className="max-w-lg mx-auto rounded-2xl backdrop-blur-xl border p-2.5 shadow-xl flex items-center justify-between gap-3 pointer-events-auto"
            style={{
              backgroundColor: `${theme.bgSurface}F2`,
              borderColor: theme.borderColor,
            }}
          >
            <div
              onClick={() => setActiveTab('ao-vivo')}
              className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
            >
              <img
                src={activeProgram.coverUrl}
                alt={activeProgram.title}
                className="w-10 h-10 rounded-xl object-cover border shrink-0"
                style={{ borderColor: theme.borderColor }}
              />
              <div className="min-w-0">
                <div
                  className="text-[10px] font-extrabold uppercase flex items-center gap-1"
                  style={{ color: theme.accentPrimary }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>No Ar • {activeProgram.title}</span>
                </div>
                <div
                  className="text-xs truncate font-medium"
                  style={{ color: theme.textSecondary }}
                >
                  {player.liveTrackTitle || activeProgram.subtitle}
                </div>
              </div>
            </div>

            <button
              onClick={player.togglePlay}
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 cursor-pointer"
              style={{ backgroundColor: theme.accentPrimary }}
              aria-label={player.isPlaying ? 'Pausar' : 'Ouvir'}
            >
              {player.isBuffering ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : player.isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Tab Navigation ([50:45]: Ao Vivo, Programação, Notícias, Redes) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t"
        style={{
          backgroundColor: `${theme.bgSurface}F2`,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-lg mx-auto grid grid-cols-4 px-2 py-1.5">
          {[
            { id: 'ao-vivo', label: 'Ao Vivo', icon: Radio },
            { id: 'programacao', label: 'Programação', icon: CalendarClock },
            { id: 'noticias', label: 'Notícias', icon: Newspaper },
            { id: 'redes', label: 'Redes', icon: Share2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className="flex flex-col items-center justify-center py-1.5 rounded-2xl transition cursor-pointer"
                style={{
                  color: active ? theme.accentPrimary : theme.textSecondary,
                  fontWeight: active ? 800 : 500,
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Interactive Design Studio Drawer */}
      <DesignStudioDrawer
        isOpen={isDesignStudioOpen}
        onClose={() => setIsDesignStudioOpen(false)}
        theme={theme}
        onChangeTheme={handleUpdateTheme}
      />

      {/* Modals */}
      <ProgramDetailModal
        program={selectedProgramModal}
        onClose={() => setSelectedProgramModal(null)}
      />

      <TeamChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
        checklist={checklist}
        schedule={schedule}
        onUpdateChecklist={handleUpdateChecklist}
      />

      <InstallQrModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onTriggerInstall={handleTriggerInstall}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        schedule={schedule}
        news={news}
        config={config}
        onUpdateSchedule={handleUpdateSchedule}
        onUpdateNews={handleUpdateNews}
        onUpdateConfig={handleUpdateConfig}
      />
    </div>
  );
}
export default App;
