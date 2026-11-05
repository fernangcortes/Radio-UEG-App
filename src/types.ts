export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Dom, 1=Seg, ..., 6=Sab

export interface ProgramCredits {
  apresentacao: string;
  producao: string;
  direcao: string;
  tecnica: string;
  apoio?: string;
}

export interface ScheduleProgram {
  id: string;
  title: string;
  subtitle: string;
  category: 'Ao Vivo' | 'Musical' | 'Podcast / Temporada' | 'Interprograma' | 'Jornalismo' | 'Parceria Rede';
  sourceOrg?: 'UEG Atual' | 'Acervo UEG' | 'Rádios EBC' | 'Rádio Câmara' | 'Rádio Senado' | 'Rádio Batuta' | 'Embrapa / Parceiros';
  days: DayOfWeek[];
  startTime: string; // "08:00"
  endTime: string;   // "09:00"
  coverUrl: string;
  logoUrl?: string;
  accentColor: string;
  hasLiveVideo: boolean;
  youtubeLiveUrl?: string;
  spotifyUrl?: string;
  description: string;
  credits: ProgramCredits;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Cultura' | 'CriaLab' | 'Na Rádio' | 'Institucional';
  date: string;
  readTime: string;
  author: string;
  imageUrl: string;
  relatedProgramId?: string;
  audioUrl?: string;
  externalUrl?: string;
}

export interface PodcastShow {
  id: string;
  title: string;
  subtitle: string;
  seasonInfo: string;
  description: string;
  coverUrl: string;
  spotifyUrl: string;
  youtubeUrl: string;
  accentColor: string;
  partner?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  area: 'Coordenação' | 'Produção & Jornalismo' | 'Técnica & Desenvolvimento' | 'Bolsistas & Extensão';
}

export interface ChecklistTaskItem {
  id: string;
  area: 'Design & Identidade Visual' | 'Áudio, Streaming & Automação' | 'Editorial, Grade & Produção' | 'Distribuição, TI & Lojas';
  task: string;
  deliverable: string;
  responsible: string;
  priority: 'Alta (Sexta)' | 'Média' | 'Pós-Lançamento';
  status: 'concluido' | 'andamento' | 'pendente';
  notes: string;
}

export interface RadioConfig {
  stationName: string;
  slogan: string;
  streamUrl: string;
  m3uUrl?: string;
  plsUrl?: string;
  zenoMountId: string;
  whatsappNumber: string;
  youtubeChannelUrl: string;
  spotifyProfileUrl: string;
  instagramUrl: string;
  officialSiteUrl: string;
}

export interface DesignThemeConfig {
  presetId: 'marfim-crialab' | 'creme-editorial' | 'areia-suave' | 'branco-galeria' | 'grafite-noturno' | 'custom';
  bgPrimary: string;       // e.g. #FAF7F0 (Branco Marfim)
  bgSurface: string;       // e.g. #FFFFFF
  bgElevated: string;      // e.g. #F3EFE6
  textPrimary: string;     // e.g. #18181B
  textSecondary: string;   // e.g. #52525B
  borderColor: string;     // e.g. #E6DFD3
  accentPrimary: string;   // e.g. #158481 (Teal CriaLab)
  accentSecondary: string; // e.g. #C91854 (Rubi CriaLab)
  wavePalette: 'crialab-5' | 'teal-mono' | 'charcoal-gold' | 'ruby-coral';
  wavePresence: 'full' | 'medium' | 'minimal';
  playerStyle: 'editorial-waves' | 'vinyl-waves' | 'compact-studio';
  cardRadius: 'rounded-2xl' | 'rounded-3xl' | 'rounded-xl';
  isDark: boolean;
}

export type SimulationScenarioId =
  | 'realtime'
  | 'papo-reitor'
  | 'ueg-sintonia'
  | 'vida-pulsa'
  | 'sunset-vibes'
  | 'fabular'
  | 'madrugada-viva';
