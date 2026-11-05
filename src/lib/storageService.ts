import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  DEFAULT_CHECKLIST,
  DEFAULT_NEWS,
  DEFAULT_PODCASTS,
  DEFAULT_RADIO_CONFIG,
  DEFAULT_SCHEDULE,
  DEFAULT_TEAM,
} from '../data/radioData';
import {
  ChecklistTaskItem,
  DayOfWeek,
  DesignThemeConfig,
  NewsArticle,
  PodcastShow,
  RadioConfig,
  ScheduleProgram,
  SimulationScenarioId,
  TeamMember,
} from '../types';

const STORAGE_KEYS = {
  SCHEDULE: 'radio_ueg_schedule_v2',
  NEWS: 'radio_ueg_news_v2',
  PODCASTS: 'radio_ueg_podcasts_v2',
  TEAM: 'radio_ueg_team_v2',
  CHECKLIST: 'radio_ueg_checklist_v2',
  CONFIG: 'radio_ueg_config_v2',
  PREFS: 'radio_ueg_user_prefs_v2',
  THEME: 'radio_ueg_theme_ivory_v1',
  SUPABASE_CREDS: 'radio_ueg_supabase_creds_v2',
};

export const DEFAULT_THEME_CONFIG: DesignThemeConfig = {
  presetId: 'marfim-crialab',
  bgPrimary: '#FAF7F0',       // Branco Marfim Quente
  bgSurface: '#FFFFFF',       // Branco Alabastro (Cards)
  bgElevated: '#F3EFE6',      // Areia Marfim Suave
  textPrimary: '#18181B',     // Grafite Profundo
  textSecondary: '#57534E',   // Cinza Quente Editorial
  borderColor: '#E6DFD3',     // Borda Marfim
  accentPrimary: '#158481',   // Teal Oficial CriaLab
  accentSecondary: '#C91854', // Rubi Oficial CriaLab
  wavePalette: 'crialab-5',
  wavePresence: 'full',
  playerStyle: 'editorial-waves',
  cardRadius: 'rounded-3xl',
  isDark: false,
};

export const THEME_PRESETS: Array<{
  label: string;
  subtitle: string;
  config: DesignThemeConfig;
}> = [
  {
    label: 'Branco Marfim • CriaLab (Padrão)',
    subtitle: 'Fundo marfim #FAF7F0, cards alvos e ondas nas 5 cores CriaLab',
    config: DEFAULT_THEME_CONFIG,
  },
  {
    label: 'Creme Editorial Quente',
    subtitle: 'Tom papel de livro #F5EFE6 com acento Rubi e Teal',
    config: {
      ...DEFAULT_THEME_CONFIG,
      presetId: 'creme-editorial',
      bgPrimary: '#F5EFE6',
      bgSurface: '#FDFBF7',
      bgElevated: '#EBE3D5',
      textPrimary: '#1C1917',
      textSecondary: '#57534E',
      borderColor: '#DDD3C2',
      accentPrimary: '#C91854',
      accentSecondary: '#158481',
      isDark: false,
    },
  },
  {
    label: 'Areia Minimalista & Oliva',
    subtitle: 'Suave #F2F0EA com destaque Teal e Verde CriaLab',
    config: {
      ...DEFAULT_THEME_CONFIG,
      presetId: 'areia-suave',
      bgPrimary: '#F2F0EA',
      bgSurface: '#FFFFFF',
      bgElevated: '#E7E4DC',
      textPrimary: '#18181B',
      textSecondary: '#52525B',
      borderColor: '#DCD8CE',
      accentPrimary: '#158481',
      accentSecondary: '#9BA538',
      isDark: false,
    },
  },
  {
    label: 'Branco Galeria (Clean)',
    subtitle: 'Contraste máximo #F8FAFC para leitura e artes vibrantes',
    config: {
      ...DEFAULT_THEME_CONFIG,
      presetId: 'branco-galeria',
      bgPrimary: '#F8FAFC',
      bgSurface: '#FFFFFF',
      bgElevated: '#F1F5F9',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      borderColor: '#E2E8F0',
      accentPrimary: '#158481',
      accentSecondary: '#E84136',
      isDark: false,
    },
  },
  {
    label: 'Modo Noturno Grafite (Sem Roxo)',
    subtitle: 'Estúdio escuro neutro #121316 com ondas luminosas',
    config: {
      ...DEFAULT_THEME_CONFIG,
      presetId: 'grafite-noturno',
      bgPrimary: '#121316',
      bgSurface: '#1B1D22',
      bgElevated: '#24272E',
      textPrimary: '#F4F4F5',
      textSecondary: '#A1A1AA',
      borderColor: '#2E323B',
      accentPrimary: '#158481',
      accentSecondary: '#F7AD1C',
      isDark: true,
    },
  },
];

export function loadThemeConfig(): DesignThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    if (raw) return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_THEME_CONFIG;
}

export function saveThemeConfig(theme: DesignThemeConfig) {
  localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
}

export function applyThemeCssVars(theme: DesignThemeConfig) {
  const root = document.documentElement;
  root.style.setProperty('--app-bg', theme.bgPrimary);
  root.style.setProperty('--app-surface', theme.bgSurface);
  root.style.setProperty('--app-elevated', theme.bgElevated);
  root.style.setProperty('--app-text', theme.textPrimary);
  root.style.setProperty('--app-text-muted', theme.textSecondary);
  root.style.setProperty('--app-border', theme.borderColor);
  root.style.setProperty('--app-accent', theme.accentPrimary);
  root.style.setProperty('--app-accent-2', theme.accentSecondary);
}

export interface UserPreferences {
  autoplayOnOpen: boolean;
  ecoAudioOnlyMode: boolean;
}

export function loadUserPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    autoplayOnOpen: false,
    ecoAudioOnlyMode: false,
  };
}

export function saveUserPreferences(prefs: UserPreferences) {
  localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
}

export function loadSchedule(): ScheduleProgram[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return DEFAULT_SCHEDULE;
}

export function saveSchedule(schedule: ScheduleProgram[]) {
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
}

export function loadNews(): NewsArticle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NEWS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return DEFAULT_NEWS;
}

export function saveNews(news: NewsArticle[]) {
  localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
}

export function loadPodcasts(): PodcastShow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PODCASTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return DEFAULT_PODCASTS;
}

export function loadTeam(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEAM);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return DEFAULT_TEAM;
}

export function saveTeam(team: TeamMember[]) {
  localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
}

export function loadChecklist(): ChecklistTaskItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return DEFAULT_CHECKLIST;
}

export function saveChecklist(list: ChecklistTaskItem[]) {
  localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(list));
}

export function loadRadioConfig(): RadioConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (raw) return { ...DEFAULT_RADIO_CONFIG, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_RADIO_CONFIG;
}

export function saveRadioConfig(config: RadioConfig) {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
}

export function resetAllToDefaults() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}

export function getSupabaseClient(): SupabaseClient | null {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return createClient(envUrl, envKey);
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPABASE_CREDS);
    if (saved) {
      const { url, anonKey } = JSON.parse(saved);
      if (url && anonKey) return createClient(url, anonKey);
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveSupabaseCreds(url: string, anonKey: string) {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_CREDS, JSON.stringify({ url, anonKey }));
}

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10) || 0);
  return h * 60 + m;
}

export function getActiveProgram(
  schedule: ScheduleProgram[],
  scenario: SimulationScenarioId,
  now: Date = new Date()
): { current: ScheduleProgram; next: ScheduleProgram; simulatedLabel?: string } {
  if (scenario !== 'realtime') {
    const mapId: Record<Exclude<SimulationScenarioId, 'realtime'>, { id: string; label: string }> = {
      'papo-reitor': { id: 'papo-reitor', label: 'Terça-feira • 08h15 (Papo com o Reitor Ao Vivo)' },
      'ueg-sintonia': { id: 'ueg-sintonia', label: 'Quarta-feira • 14h15 (UEG em Sintonia Ao Vivo)' },
      'vida-pulsa': { id: 'vida-pulsa', label: 'Manhã • 10h30 (Faixa Vida Pulsa)' },
      'sunset-vibes': { id: 'sunset-vibes', label: 'Fim de Tarde • 17h40 (Sunset Vibes)' },
      fabular: { id: 'faixa-19h-fabular-ondas', label: 'Noite • 19h15 (Podcast Fabular & Ondas Negras)' },
      'madrugada-viva': { id: 'madrugada-viva', label: 'Madrugada • 01h20 (Madrugada Viva)' },
    };
    const target = mapId[scenario];
    const found = schedule.find((p) => p.id === target.id) || schedule[0];
    const idx = schedule.indexOf(found);
    const next = schedule[(idx + 1) % schedule.length] || schedule[0];
    return { current: found, next, simulatedLabel: target.label };
  }

  const day = now.getDay() as DayOfWeek;
  const currentMins = now.getHours() * 60 + now.getMinutes();

  const todaysPrograms = schedule.filter((p) => p.days.includes(day));
  const matches = todaysPrograms.filter((p) => {
    const start = timeToMinutes(p.startTime);
    const end = timeToMinutes(p.endTime);
    return currentMins >= start && currentMins < end;
  });

  const sortedMatches = [...matches].sort((a, b) => {
    const score = (cat: ScheduleProgram['category']) => {
      if (cat === 'Ao Vivo') return 5;
      if (cat === 'Jornalismo') return 4;
      if (cat === 'Podcast / Temporada') return 3;
      if (cat === 'Interprograma') return 2;
      return 1;
    };
    return score(b.category) - score(a.category);
  });

  const current = sortedMatches[0] || schedule[0];

  const upcoming = todaysPrograms
    .filter((p) => timeToMinutes(p.startTime) > currentMins && p.id !== current.id)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  const next = upcoming[0] || todaysPrograms[0] || schedule[0];
  return { current, next };
}

export function exportScheduleToCSV(schedule: ScheduleProgram[]): string {
  const header = [
    'ID',
    'Programa',
    'Subtitulo',
    'Origem',
    'Categoria',
    'Dias (0=Dom..6=Sab)',
    'Inicio',
    'Fim',
    'VideoAoVivo',
    'Apresentacao',
    'Producao',
  ].join(';');

  const rows = schedule.map((p) =>
    [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.subtitle.replace(/"/g, '""')}"`,
      `"${(p.sourceOrg || 'UEG Atual').replace(/"/g, '""')}"`,
      p.category,
      p.days.join(','),
      p.startTime,
      p.endTime,
      p.hasLiveVideo ? 'SIM' : 'NAO',
      `"${p.credits.apresentacao.replace(/"/g, '""')}"`,
      `"${p.credits.producao.replace(/"/g, '""')}"`,
    ].join(';')
  );

  return [header, ...rows].join('\n');
}

export function exportChecklistToCSV(checklist: ChecklistTaskItem[]): string {
  const header = [
    'ID',
    'Area',
    'Tarefa / Pendencia',
    'Entregavel',
    'Responsavel',
    'Prioridade',
    'Status',
    'Observacoes',
  ].join(';');

  const rows = checklist.map((c) =>
    [
      c.id,
      `"${c.area}"`,
      `"${c.task.replace(/"/g, '""')}"`,
      `"${c.deliverable.replace(/"/g, '""')}"`,
      `"${c.responsible.replace(/"/g, '""')}"`,
      `"${c.priority}"`,
      c.status.toUpperCase(),
      `"${c.notes.replace(/"/g, '""')}"`,
    ].join(';')
  );

  return [header, ...rows].join('\n');
}
