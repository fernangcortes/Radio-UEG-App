import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Circle,
  Plus,
  Trash2,
  FileSpreadsheet,
  Filter,
  Sparkles,
  Users,
  Calendar,
  ListChecks,
} from 'lucide-react';
import { ChecklistTaskItem, ScheduleProgram } from '../types';
import { exportChecklistToCSV, exportScheduleToCSV } from '../lib/storageService';

interface TeamChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: ChecklistTaskItem[];
  schedule: ScheduleProgram[];
  onUpdateChecklist: (next: ChecklistTaskItem[]) => void;
}

const AREAS: Array<'Todas' | ChecklistTaskItem['area']> = [
  'Todas',
  'Design & Identidade Visual',
  'Áudio, Streaming & Automação',
  'Editorial, Grade & Produção',
  'Distribuição, TI & Lojas',
];

const WEEKLY_MATRIX_ROWS: Array<{
  hour: string;
  seg: string;
  ter: string;
  qua: string;
  qui: string;
  sex: string;
  sab: string;
  dom: string;
}> = [
  {
    hour: '00h–06h',
    seg: 'Madrugada Viva (UEG)',
    ter: 'Madrugada Viva (UEG)',
    qua: 'Madrugada Viva (UEG)',
    qui: 'Madrugada Viva (UEG)',
    sex: 'Trilha da Meia-Noite (Câmara)',
    sab: 'Trilha / Madrugada Viva',
    dom: 'Trilha da Meia-Noite',
  },
  {
    hour: '06h–07h',
    seg: 'Programação Musical',
    ter: 'Nas Cordas da Viola (Senado)',
    qua: 'Cena Instrumental (EBC)',
    qui: 'Programação Musical',
    sex: 'Programação Musical',
    sab: 'Prosa Rural (Embrapa)',
    dom: 'Prosa Rural (Embrapa)',
  },
  {
    hour: '07h–08h',
    seg: 'Min. Economia + Repórter Nac.',
    ter: 'Min. Economia + Repórter Nac.',
    qua: 'Min. Economia + Repórter Nac.',
    qui: 'Brasil Regional + Repórter Nac.',
    sex: 'Som do Livro (UEG) + Rep. Nac.',
    sab: 'Nas Cordas da Viola / Blues',
    dom: 'Nas Cordas da Viola (Senado)',
  },
  {
    hour: '08h–09h',
    seg: 'Curta Musical (Senado)',
    ter: '🔴 PAPO COM O REITOR (Ao Vivo)',
    qua: 'Papo de Futuro (Câmara)',
    qui: 'Salão Verde (Câmara)',
    sex: 'Som do Livro + Sinal Verde',
    sab: 'Conversa com o Autor (EBC)',
    dom: 'Música do Mundo (EBC)',
  },
  {
    hour: '09h–10h',
    seg: 'Salão Verde + Min. Economia',
    ter: 'Sustentabilismo + Meia-hora Aê',
    qua: 'Drops Gramatical (Acervo UEG)',
    qui: 'Meia-hora Aê (UEG Atual)',
    sex: 'Drops Gramatical (Acervo UEG)',
    sab: 'Ciência no Rádio (UEG)',
    dom: 'Brasil Regional (Senado)',
  },
  {
    hour: '10h–12h',
    seg: '⭐ VIDA PULSA (UEG Atual)',
    ter: '⭐ VIDA PULSA (UEG Atual)',
    qua: '⭐ VIDA PULSA (UEG Atual)',
    qui: '⭐ VIDA PULSA (UEG Atual)',
    sex: '⭐ VIDA PULSA (UEG Atual)',
    sab: 'Sustentabilismo + Samba Terra',
    dom: 'Galeria Nacional / Ondas Negras',
  },
  {
    hour: '12h–14h',
    seg: 'Repórter Nacional + Improviso',
    ter: 'Repórter Nac. + Glossário do Bem',
    qua: 'Repórter Nacional + Música',
    qui: 'Repórter Nacional + Música',
    sex: 'Repórter Nac. + Conv. Elevador',
    sab: 'Trilha da História / Kalimba',
    dom: 'Samba da Terra / Capítulo Rock',
  },
  {
    hour: '14h–16h',
    seg: 'Sinal Verde + Drops Gramatical',
    ter: 'Programação Musical (Soul/Blues)',
    qua: '🔴 UEG EM SINTONIA + Ciência',
    qui: 'Estúdio Batuta + Sustentabilismo',
    sex: 'Festa do Disco (EBC)',
    sab: 'Sinal Verde + Rock Gyn (UEG)',
    dom: 'Festa do Disco + Capítulo Rock',
  },
  {
    hour: '16h–17h',
    seg: 'Conversa de Elevador (Câmara)',
    ter: 'Drops Gramatical (Acervo UEG)',
    qua: 'Sinal Verde (Rádio Senado)',
    qui: 'Programação Musical (Rock/Jazz)',
    sex: 'Papo de Futuro (Rádio Câmara)',
    sab: 'Educa Rap / Reggae',
    dom: 'No Balanço do Reggae',
  },
  {
    hour: '17h–19h',
    seg: '🌅 SUNSET VIBES (UEG Atual)',
    ter: '🌅 SUNSET VIBES (UEG Atual)',
    qua: '🌅 SUNSET VIBES (UEG Atual)',
    qui: '🌅 SUNSET VIBES (UEG Atual)',
    sex: 'Playlist do Zuza + Sunset Vibes',
    sab: 'Música do Mundo + Revista Serrote',
    dom: 'Sinal Verde + Galeria Nacional',
  },
  {
    hour: '19h–20h',
    seg: 'Programação Musical',
    ter: 'Curta Musical (19h30) + Fabular',
    qua: 'Glossário do Bem (Acervo UEG)',
    qui: 'Podcast Fabular / Especial',
    sex: 'Roda de Choro (Rádios EBC)',
    sab: '✊🏿 ONDAS NEGRAS (UEG Atual)',
    dom: 'Roda de Choro (EBC)',
  },
  {
    hour: '20h–22h',
    seg: 'Brasil Musicado + Rev. Serrote',
    ter: 'Inesquecíveis + Improviso',
    qua: 'A Volta ao Jazz + Festa do Disco',
    qui: 'Brasil Regional + Volta ao Jazz',
    sex: '🎸 ROCK GYN + Capítulo Rock',
    sab: 'Galeria Nacional + Zuza',
    dom: 'Música do Mundo + Cena Instrum.',
  },
  {
    hour: '22h–24h',
    seg: 'Na Trilha da História + Música',
    ter: 'Programação Musical Noturna',
    qua: 'Programação Musical (Jazz)',
    qui: 'Inesquecíveis + Música',
    sex: 'Música do Mundo + Improviso',
    sab: 'Capítulo Rock (Senado)',
    dom: 'Estúdio Batuta (Rádio Batuta)',
  },
];

export const TeamChecklistModal: React.FC<TeamChecklistModalProps> = ({
  isOpen,
  onClose,
  checklist,
  schedule,
  onUpdateChecklist,
}) => {
  const [viewMode, setViewMode] = useState<'checklist' | 'matriz'>('checklist');
  const [selectedArea, setSelectedArea] =
    useState<'Todas' | ChecklistTaskItem['area']>('Todas');
  const [statusFilter, setStatusFilter] =
    useState<'todos' | ChecklistTaskItem['status']>('todos');

  // New task form
  const [newTask, setNewTask] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newResp, setNewResp] = useState('');
  const [newArea, setNewArea] = useState<ChecklistTaskItem['area']>(
    'Editorial, Grade & Produção'
  );
  const [newPriority, setNewPriority] =
    useState<ChecklistTaskItem['priority']>('Alta (Sexta)');

  if (!isOpen) return null;

  const totalCount = checklist.length;
  const doneCount = checklist.filter((c) => c.status === 'concluido').length;
  const inProgressCount = checklist.filter((c) => c.status === 'andamento').length;
  const pendingCount = checklist.filter((c) => c.status === 'pendente').length;
  const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const filtered = checklist.filter((item) => {
    const matchArea = selectedArea === 'Todas' || item.area === selectedArea;
    const matchStatus = statusFilter === 'todos' || item.status === statusFilter;
    return matchArea && matchStatus;
  });

  const cycleStatus = (id: string) => {
    const order: ChecklistTaskItem['status'][] = ['pendente', 'andamento', 'concluido'];
    const next = checklist.map((item) => {
      if (item.id !== id) return item;
      const nextStatus = order[(order.indexOf(item.status) + 1) % order.length];
      return { ...item, status: nextStatus };
    });
    onUpdateChecklist(next);
  };

  const updateField = (
    id: string,
    field: keyof ChecklistTaskItem,
    value: string
  ) => {
    const next = checklist.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdateChecklist(next);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const item: ChecklistTaskItem = {
      id: `chk-${Date.now()}`,
      area: newArea,
      task: newTask.trim(),
      deliverable: newDeliverable.trim() || 'Definido pela equipe',
      responsible: newResp.trim() || 'Equipe Rádio UEG',
      priority: newPriority,
      status: 'pendente',
      notes: 'Adicionado na planilha interativa.',
    };
    onUpdateChecklist([item, ...checklist]);
    setNewTask('');
    setNewDeliverable('');
    setNewResp('');
  };

  const handleDownloadChecklistCSV = () => {
    const csv = exportChecklistToCSV(checklist);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'planilha-checklist-equipe-radio-ueg.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadScheduleCSV = () => {
    const csv = exportScheduleToCSV(schedule);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'planilha-grade-radio-ueg.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1A0F2B] border border-white/15 rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full crialab-colorbar shrink-0" />

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-[#211335]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8CE0C4]">
              <Sparkles className="w-3.5 h-3.5 text-[#F7AD1C]" />
              <span>Planilha Interativa da Equipe • Rádio UEG & CriaLab</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-0.5">
              Controle de Entregas & Matriz da Grade 24h
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Clique no status de qualquer linha para alternar entre <strong>Pendente → Em Andamento → Concluído</strong> ou edite os responsáveis e observações.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewMode('checklist')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                viewMode === 'checklist'
                  ? 'bg-[#158481] text-white shadow-lg'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <ListChecks className="w-4 h-4" />
              <span>1. Checklist de Pendências</span>
            </button>

            <button
              onClick={() => setViewMode('matriz')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                viewMode === 'matriz'
                  ? 'bg-[#C91854] text-white shadow-lg'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>2. Planilha da Grade (Seg–Dom)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer ml-1"
              title="Fechar Planilha"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {viewMode === 'checklist' ? (
            <>
              {/* KPI Summary & Progress Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    Progresso Geral
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-0.5">
                    {progressPercent}%
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#158481] to-[#8CE0C4] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() =>
                    setStatusFilter(statusFilter === 'concluido' ? 'todos' : 'concluido')
                  }
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    statusFilter === 'concluido'
                      ? 'bg-emerald-500/25 border-emerald-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                  }`}
                >
                  <div className="text-[11px] font-bold uppercase text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Concluídos
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-0.5">
                    {doneCount} <span className="text-xs font-normal text-slate-300">/ {totalCount}</span>
                  </div>
                </button>

                <button
                  onClick={() =>
                    setStatusFilter(statusFilter === 'andamento' ? 'todos' : 'andamento')
                  }
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    statusFilter === 'andamento'
                      ? 'bg-amber-500/25 border-amber-400'
                      : 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  <div className="text-[11px] font-bold uppercase text-amber-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Em Andamento
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-0.5">
                    {inProgressCount}
                  </div>
                </button>

                <button
                  onClick={() =>
                    setStatusFilter(statusFilter === 'pendente' ? 'todos' : 'pendente')
                  }
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    statusFilter === 'pendente'
                      ? 'bg-pink-500/25 border-pink-400'
                      : 'bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/20'
                  }`}
                >
                  <div className="text-[11px] font-bold uppercase text-pink-300 flex items-center gap-1">
                    <Circle className="w-3.5 h-3.5" /> Pendentes
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-0.5">
                    {pendingCount}
                  </div>
                </button>
              </div>

              {/* Filter Bar + Export CSV */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <Filter className="w-4 h-4 text-[#8CE0C4] mr-1 shrink-0" />
                  {AREAS.map((area) => (
                    <button
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition ${
                        selectedArea === area
                          ? 'bg-[#158481] text-white'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleDownloadChecklistCSV}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 shadow"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Baixar Planilha Excel (.CSV)</span>
                </button>
              </div>

              {/* Interactive Spreadsheet Table */}
              <div className="rounded-2xl border border-white/15 overflow-hidden bg-[#140B23]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[780px]">
                    <thead>
                      <tr className="bg-[#251737] text-[11px] font-extrabold uppercase tracking-wider text-[#8CE0C4] border-b border-white/10">
                        <th className="py-3 px-3.5 w-36">Status (Clique)</th>
                        <th className="py-3 px-3.5">Item / O que falta</th>
                        <th className="py-3 px-3.5 w-44">Responsável</th>
                        <th className="py-3 px-3.5 w-32">Prioridade</th>
                        <th className="py-3 px-3.5 w-64">Observações (Editável)</th>
                        <th className="py-3 px-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-xs">
                      {filtered.map((item) => {
                        const isDone = item.status === 'concluido';
                        const isProg = item.status === 'andamento';
                        return (
                          <tr
                            key={item.id}
                            className={`transition ${
                              isDone
                                ? 'bg-emerald-950/15 hover:bg-emerald-950/25'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            {/* Status Button */}
                            <td className="py-3 px-3.5 align-top">
                              <button
                                onClick={() => cycleStatus(item.id)}
                                className={`w-full py-1.5 px-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 border cursor-pointer transition ${
                                  isDone
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : isProg
                                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                                    : 'bg-pink-500/20 text-pink-200 border-pink-500/40'
                                }`}
                              >
                                {isDone ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                    <span>Concluído</span>
                                  </>
                                ) : isProg ? (
                                  <>
                                    <Clock className="w-3.5 h-3.5 shrink-0" />
                                    <span>Andamento</span>
                                  </>
                                ) : (
                                  <>
                                    <Circle className="w-3.5 h-3.5 shrink-0" />
                                    <span>Pendente</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Task & Deliverable */}
                            <td className="py-3 px-3.5 align-top">
                              <span className="inline-block text-[10px] font-bold uppercase text-[#F7AD1C] mb-0.5">
                                {item.area}
                              </span>
                              <div
                                className={`font-bold text-sm ${
                                  isDone ? 'line-through text-slate-400' : 'text-white'
                                }`}
                              >
                                {item.task}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                📦 Entregável: {item.deliverable}
                              </div>
                            </td>

                            {/* Editable Responsible */}
                            <td className="py-3 px-3.5 align-top">
                              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
                                <Users className="w-3.5 h-3.5 text-[#8CE0C4] shrink-0" />
                                <input
                                  type="text"
                                  value={item.responsible}
                                  onChange={(e) =>
                                    updateField(item.id, 'responsible', e.target.value)
                                  }
                                  className="bg-transparent text-xs font-semibold text-white w-full focus:outline-none"
                                />
                              </div>
                            </td>

                            {/* Priority Badge */}
                            <td className="py-3 px-3.5 align-top">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                                  item.priority === 'Alta (Sexta)'
                                    ? 'bg-[#C91854]/25 text-pink-200 border border-[#C91854]/40'
                                    : item.priority === 'Média'
                                    ? 'bg-[#158481]/25 text-[#8CE0C4] border border-[#158481]/40'
                                    : 'bg-white/10 text-slate-300'
                                }`}
                              >
                                {item.priority}
                              </span>
                            </td>

                            {/* Editable Notes */}
                            <td className="py-3 px-3.5 align-top">
                              <input
                                type="text"
                                value={item.notes}
                                onChange={(e) =>
                                  updateField(item.id, 'notes', e.target.value)
                                }
                                placeholder="Adicionar observação..."
                                className="w-full px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#8CE0C4]"
                              />
                            </td>

                            {/* Delete button */}
                            <td className="py-3 px-2 align-top">
                              <button
                                onClick={() =>
                                  onUpdateChecklist(
                                    checklist.filter((c) => c.id !== item.id)
                                  )
                                }
                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                                title="Remover linha"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add New Task Form */}
              <form
                onSubmit={handleAddTask}
                className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3"
              >
                <div className="text-xs font-bold uppercase text-[#F7AD1C] flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Nova Tarefa / Pendência na Planilha</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="O que precisa ser feito?"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Responsável (ex: Lucas, Ezequiel)"
                    value={newResp}
                    onChange={(e) => setNewResp(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                  <select
                    value={newArea}
                    onChange={(e) =>
                      setNewArea(e.target.value as ChecklistTaskItem['area'])
                    }
                    className="px-3 py-2 rounded-xl bg-[#251737] border border-white/10 text-xs text-white"
                  >
                    <option value="Design & Identidade Visual">Design & Artes</option>
                    <option value="Áudio, Streaming & Automação">Áudio & Automação</option>
                    <option value="Editorial, Grade & Produção">Editorial & Grade</option>
                    <option value="Distribuição, TI & Lojas">TI & Lojas</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#158481] hover:bg-[#199d99] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Incluir</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* VIEW MODE 2: MATRIZ DA GRADE SEMANAL (SEG A DOM) */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-black/25 p-3.5 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-200">
                  <strong>Espelho Oficial da Planilha da Grade (Segunda a Domingo • 00h às 24h)</strong> consolidando produções <strong>UEG Atual</strong>, <strong>Acervo UEG</strong> e parcerias (<strong>EBC, Rádio Câmara, Rádio Senado, Rádio Batuta, Embrapa</strong>).
                </div>
                <button
                  onClick={handleDownloadScheduleCSV}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Exportar Grade Completa (.CSV)</span>
                </button>
              </div>

              <div className="rounded-2xl border border-white/15 overflow-hidden bg-[#140B23]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[920px] text-xs">
                    <thead>
                      <tr className="bg-[#251737] text-[11px] font-extrabold uppercase tracking-wider text-[#F7AD1C] border-b border-white/10">
                        <th className="py-3 px-3 w-24">Faixa</th>
                        <th className="py-3 px-3">Segunda</th>
                        <th className="py-3 px-3">Terça</th>
                        <th className="py-3 px-3">Quarta</th>
                        <th className="py-3 px-3">Quinta</th>
                        <th className="py-3 px-3">Sexta</th>
                        <th className="py-3 px-3">Sábado</th>
                        <th className="py-3 px-3">Domingo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {WEEKLY_MATRIX_ROWS.map((row) => (
                        <tr key={row.hour} className="hover:bg-white/5">
                          <td className="py-2.5 px-3 font-extrabold text-[#8CE0C4] bg-black/30 whitespace-nowrap">
                            {row.hour}
                          </td>
                          {[row.seg, row.ter, row.qua, row.qui, row.sex, row.sab, row.dom].map(
                            (cell, i) => {
                              const isLive = cell.includes('🔴');
                              const isHighlight =
                                cell.includes('⭐') ||
                                cell.includes('🌅') ||
                                cell.includes('🎸') ||
                                cell.includes('✊🏿');
                              return (
                                <td
                                  key={i}
                                  className={`py-2.5 px-3 ${
                                    isLive
                                      ? 'bg-red-500/20 text-white font-extrabold border-l border-red-500/40'
                                      : isHighlight
                                      ? 'bg-[#158481]/15 text-[#8CE0C4] font-bold'
                                      : 'text-slate-200'
                                  }`}
                                >
                                  {cell}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
