import React from 'react';
import {
  X,
  Clock,
  Youtube,
  Headphones,
  Users,
  Mic,
  Settings,
  Award,
  Sparkles,
} from 'lucide-react';
import { ScheduleProgram } from '../types';

interface ProgramDetailModalProps {
  program: ScheduleProgram | null;
  onClose: () => void;
  onSimulateNow?: (programId: string) => void;
}

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  onClose,
}) => {
  if (!program) return null;

  const daysFormatted =
    program.days.length === 7
      ? 'Todos os dias (Seg a Dom)'
      : program.days.map((d) => DAY_NAMES[d]).join(', ');

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1E1230] border border-white/15 rounded-3xl max-w-lg w-full max-h-[88vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover */}
        <div className="relative h-52 w-full bg-[#160D24]">
          <img
            src={program.coverUrl}
            alt={program.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1230] via-black/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#158481] text-white shadow">
              {program.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/70 text-[#F7AD1C] border border-white/15 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {program.startTime} às {program.endTime}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <div className="text-xs font-semibold text-[#8CE0C4]">
              Exibição: {daysFormatted}
            </div>
            <h2 className="text-2xl font-extrabold text-white font-display mt-0.5">
              {program.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {program.subtitle}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-black/25 p-3.5 rounded-2xl border border-white/10">
            {program.description}
          </p>

          {/* Ficha Técnica Completa ([48:35]) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F7AD1C] flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Ficha Técnica do Programa
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase font-bold text-[#8CE0C4] flex items-center gap-1">
                  <Mic className="w-3 h-3" /> Apresentação
                </div>
                <div className="text-xs font-semibold text-white mt-1">
                  {program.credits.apresentacao}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase font-bold text-[#8CE0C4] flex items-center gap-1">
                  <Users className="w-3 h-3" /> Produção
                </div>
                <div className="text-xs font-semibold text-white mt-1">
                  {program.credits.producao}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase font-bold text-[#8CE0C4] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Direção / Coordenação
                </div>
                <div className="text-xs font-semibold text-white mt-1">
                  {program.credits.direcao}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase font-bold text-[#8CE0C4] flex items-center gap-1">
                  <Settings className="w-3 h-3" /> Operação Técnica
                </div>
                <div className="text-xs font-semibold text-white mt-1">
                  {program.credits.tecnica}
                </div>
              </div>
            </div>
          </div>

          {/* Direct Links to YouTube / Spotify if available */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            {program.hasLiveVideo && program.youtubeLiveUrl && (
              <a
                href={program.youtubeLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#E84136] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <Youtube className="w-4 h-4" />
                <span>Assistir no YouTube</span>
              </a>
            )}
            {program.spotifyUrl && (
              <a
                href={program.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <Headphones className="w-4 h-4" />
                <span>Ouvir no Spotify</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white cursor-pointer ml-auto"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
