import React, { useState } from 'react';
import {
  X,
  Database,
  Download,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  FileSpreadsheet,
  Radio,
} from 'lucide-react';
import { NewsArticle, RadioConfig, ScheduleProgram } from '../types';
import {
  exportScheduleToCSV,
  resetAllToDefaults,
  saveSupabaseCreds,
} from '../lib/storageService';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleProgram[];
  news: NewsArticle[];
  config: RadioConfig;
  onUpdateSchedule: (next: ScheduleProgram[]) => void;
  onUpdateNews: (next: NewsArticle[]) => void;
  onUpdateConfig: (next: RadioConfig) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  schedule,
  news,
  config,
  onUpdateSchedule,
  onUpdateNews,
  onUpdateConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'grade' | 'noticias' | 'stream'>('grade');
  const [savedBanner, setSavedBanner] = useState<string>('');

  // Quick new News state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<NewsArticle['category']>('Cultura');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');

  // Supabase optional connection
  const [sbUrl, setSbUrl] = useState('');
  const [sbKey, setSbKey] = useState('');

  if (!isOpen) return null;

  const notifySaved = (msg: string) => {
    setSavedBanner(msg);
    setTimeout(() => setSavedBanner(''), 3500);
  };

  const handleDownloadCSV = () => {
    const csv = exportScheduleToCSV(schedule);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grade-programacao-radio-ueg.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;
    const item: NewsArticle = {
      id: `news-${Date.now()}`,
      title: newTitle.trim(),
      summary: newSummary.trim(),
      content: newContent.trim() || newSummary.trim(),
      category: newCategory,
      date: 'Agora mesmo',
      readTime: '2 min',
      author: 'Redação Rádio UEG • CriaLab',
      imageUrl: '/assets/programs/sintonia-cover.png',
    };
    onUpdateNews([item, ...news]);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    notifySaved('Notícia publicada imediatamente no aplicativo!');
  };

  const handleProgramTimeChange = (
    id: string,
    field: 'startTime' | 'endTime' | 'title',
    value: string
  ) => {
    const updated = schedule.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    onUpdateSchedule(updated);
    notifySaved('Grade de programação atualizada em tempo real!');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1E1230] border border-white/15 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full crialab-colorbar" />

        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8CE0C4] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                Autonomia para a Equipe • Sem Depender de Código
              </span>
              <h2 className="text-xl font-extrabold text-white font-display mt-0.5">
                Gestão da Grade, Notícias & Supabase
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {savedBanner && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{savedBanner}</span>
            </div>
          )}

          {/* Sub-navigation */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <button
              onClick={() => setActiveTab('grade')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                activeTab === 'grade'
                  ? 'bg-[#158481] text-white'
                  : 'bg-white/5 text-slate-300'
              }`}
            >
              1. Grade de Programação ({schedule.length})
            </button>
            <button
              onClick={() => setActiveTab('noticias')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                activeTab === 'noticias'
                  ? 'bg-[#C91854] text-white'
                  : 'bg-white/5 text-slate-300'
              }`}
            >
              2. Publicar Notícias ({news.length})
            </button>
            <button
              onClick={() => setActiveTab('stream')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                activeTab === 'stream'
                  ? 'bg-[#F7AD1C] text-black'
                  : 'bg-white/5 text-slate-300'
              }`}
            >
              3. Stream Zeno & Supabase
            </button>
          </div>

          {/* TAB 1: GRADE DE PROGRAMAÇÃO */}
          {activeTab === 'grade' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-black/25 p-3.5 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-300">
                  Edite títulos ou horários diretamente abaixo ou exporte a planilha compatível com o Google Drive/Excel da rádio.
                </div>
                <button
                  onClick={handleDownloadCSV}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Baixar Planilha CSV</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {schedule.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-3 rounded-2xl bg-black/30 border border-white/10 flex flex-col sm:flex-row sm:items-center gap-2.5"
                  >
                    <input
                      type="text"
                      value={prog.title}
                      onChange={(e) =>
                        handleProgramTimeChange(prog.id, 'title', e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={prog.startTime}
                        onChange={(e) =>
                          handleProgramTimeChange(prog.id, 'startTime', e.target.value)
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F7AD1C]"
                      />
                      <span className="text-xs text-slate-400">até</span>
                      <input
                        type="time"
                        value={prog.endTime}
                        onChange={(e) =>
                          handleProgramTimeChange(prog.id, 'endTime', e.target.value)
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F7AD1C]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: NOTÍCIAS */}
          {activeTab === 'noticias' && (
            <div className="space-y-4">
              <form
                onSubmit={handleAddNews}
                className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3"
              >
                <div className="text-xs font-bold text-[#F7AD1C] uppercase">
                  Nova Matéria Cultural / CriaLab
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Título da notícia..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(e.target.value as NewsArticle['category'])
                    }
                    className="px-3 py-2 rounded-xl bg-[#251737] border border-white/10 text-xs text-white"
                  >
                    <option value="Cultura">Cultura</option>
                    <option value="CriaLab">CriaLab</option>
                    <option value="Na Rádio">Na Rádio</option>
                    <option value="Institucional">Institucional</option>
                  </select>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Resumo curto (subtítulo da capa)..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
                <textarea
                  rows={3}
                  placeholder="Texto completo da matéria..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C91854] hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar Notícia no App</span>
                </button>
              </form>

              <div className="space-y-2 max-h-52 overflow-y-auto">
                {news.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-black/25 border border-white/10 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[#8CE0C4] uppercase">
                        {n.category} • {n.date}
                      </span>
                      <div className="text-xs font-semibold text-white truncate">
                        {n.title}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onUpdateNews(news.filter((item) => item.id !== n.id));
                        notifySaved('Notícia removida.');
                      }}
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STREAM & SUPABASE */}
          {activeTab === 'stream' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="text-xs font-bold text-[#8CE0C4] uppercase flex items-center gap-1.5">
                  <Radio className="w-4 h-4" />
                  URL do Stream de Áudio (Zeno.fm / Servidor Próprio)
                </div>
                <input
                  type="text"
                  value={config.streamUrl}
                  onChange={(e) => {
                    onUpdateConfig({ ...config, streamUrl: e.target.value });
                    notifySaved('URL do Stream atualizada!');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
                <p className="text-[11px] text-slate-400">
                  Padrão Zeno atual: <code>https://stream.zeno.fm/rario-ueg-educativa</code>. Quando migrarem para o servidor próprio ou RadioDJ, basta trocar este link aqui.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="text-xs font-bold text-[#F7AD1C] uppercase flex items-center gap-1.5">
                  <Database className="w-4 h-4" />
                  Sincronização em Nuvem (Supabase CriaLab)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="SUPABASE_URL (https://xxx.supabase.co)"
                    value={sbUrl}
                    onChange={(e) => setSbUrl(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                  <input
                    type="password"
                    placeholder="SUPABASE_ANON_KEY"
                    value={sbKey}
                    onChange={(e) => setSbKey(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    saveSupabaseCreds(sbUrl, sbKey);
                    notifySaved('Credenciais do Supabase salvas!');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#158481] text-white text-xs font-bold cursor-pointer"
                >
                  Salvar Conexão Supabase
                </button>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                resetAllToDefaults();
                window.location.reload();
              }}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Dados Originais da Demo</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#158481] text-white text-xs font-bold cursor-pointer"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
