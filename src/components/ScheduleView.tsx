import React, { useState } from 'react';
import {
  Clock,
  Info,
  Youtube,
  Users,
  Award,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import {
  DayOfWeek,
  DesignThemeConfig,
  ScheduleProgram,
  TeamMember,
} from '../types';
import { WaveWatermarkBackdrop } from './RadioWaveGraphic';

interface ScheduleViewProps {
  theme: DesignThemeConfig;
  schedule: ScheduleProgram[];
  activeProgram: ScheduleProgram;
  team: TeamMember[];
  onSelectProgram: (program: ScheduleProgram) => void;
  onOpenTeamSpreadsheet: () => void;
}

const DAY_LABELS: { day: DayOfWeek; short: string; full: string }[] = [
  { day: 1, short: 'Seg', full: 'Segunda-feira' },
  { day: 2, short: 'Ter', full: 'Terça-feira' },
  { day: 3, short: 'Qua', full: 'Quarta-feira' },
  { day: 4, short: 'Qui', full: 'Quinta-feira' },
  { day: 5, short: 'Sex', full: 'Sexta-feira' },
  { day: 6, short: 'Sáb', full: 'Sábado' },
  { day: 0, short: 'Dom', full: 'Domingo' },
];

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  theme,
  schedule,
  activeProgram,
  team,
  onSelectProgram,
  onOpenTeamSpreadsheet,
}) => {
  const today = new Date().getDay() as DayOfWeek;
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(today);
  const [showExpediente, setShowExpediente] = useState(false);

  const filteredPrograms = schedule
    .filter((p) => p.days.includes(selectedDay))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="max-w-2xl mx-auto px-4 pt-3 pb-10 space-y-5">
      {/* Header Banner */}
      <div
        className="relative rounded-3xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden shadow-sm"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.borderColor,
        }}
      >
        <WaveWatermarkBackdrop theme={theme} opacity={0.07} />

        <div className="relative z-10">
          <span
            className="text-xs font-extrabold uppercase tracking-widest"
            style={{ color: theme.accentPrimary }}
          >
            Grade Oficial • 24 Horas (UEG Atual, Acervo & Parcerias)
          </span>
          <h2 className="text-2xl font-extrabold font-display mt-0.5">
            Programação Rádio UEG
          </h2>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
            Toque em qualquer programa para abrir a <strong>Ficha Técnica</strong> ou acesse a <strong>Planilha da Equipe</strong>.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenTeamSpreadsheet}
            className="px-3.5 py-2.5 rounded-2xl text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer shadow"
            style={{ backgroundColor: theme.accentPrimary }}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Planilha & Checklist</span>
          </button>

          <button
            onClick={() => setShowExpediente((v) => !v)}
            className="px-3.5 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            style={{
              backgroundColor: theme.bgElevated,
              borderColor: theme.borderColor,
            }}
          >
            <Users
              className="w-4 h-4"
              style={{ color: theme.accentSecondary }}
            />
            <span>{showExpediente ? 'Ver Grade' : 'Expediente'}</span>
          </button>
        </div>
      </div>

      {/* Expediente / Créditos Gerais Section */}
      {showExpediente ? (
        <div
          className="rounded-3xl border p-5 sm:p-6 space-y-5 shadow-sm"
          style={{
            backgroundColor: theme.bgSurface,
            borderColor: theme.borderColor,
          }}
        >
          <div
            className="flex items-center justify-between border-b pb-4"
            style={{ borderColor: theme.borderColor }}
          >
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: theme.accentSecondary }}
              >
                Cartela Institucional
              </span>
              <h3 className="text-xl font-bold mt-0.5">
                Expediente • Rádio UEG Educativa & CriaLab
              </h3>
              <p
                className="text-xs mt-1"
                style={{ color: theme.textSecondary }}
              >
                Universidade Estadual de Goiás • Câmpus Metropolitano (Unidade Goiânia-Laranjeiras)
              </p>
            </div>
            <Award
              className="w-8 h-8 shrink-0"
              style={{ color: theme.accentPrimary }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {team.map((member) => (
              <div
                key={member.id}
                className="p-3.5 rounded-2xl border flex flex-col justify-between"
                style={{
                  backgroundColor: theme.bgElevated,
                  borderColor: theme.borderColor,
                }}
              >
                <span
                  className="text-[10px] font-extrabold uppercase tracking-wider"
                  style={{ color: theme.accentPrimary }}
                >
                  {member.area}
                </span>
                <div className="text-sm font-bold mt-1">{member.name}</div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  {member.role}
                </div>
              </div>
            ))}
          </div>

          <div
            className="pt-3 border-t flex flex-wrap items-center justify-between gap-4"
            style={{ borderColor: theme.borderColor }}
          >
            <img
              src="/assets/brand/logo-crialab-color.png"
              alt="CriaLab UEG"
              className="h-12 object-contain"
            />
            <button
              onClick={() => setShowExpediente(false)}
              className="px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer"
              style={{ backgroundColor: theme.accentPrimary }}
            >
              Voltar para a Programação
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Day of Week Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {DAY_LABELS.map((item) => {
              const isSelected = selectedDay === item.day;
              const isToday = today === item.day;
              return (
                <button
                  key={item.day}
                  onClick={() => setSelectedDay(item.day)}
                  className="px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer border"
                  style={
                    isSelected
                      ? {
                          backgroundColor: theme.accentPrimary,
                          color: '#ffffff',
                          borderColor: theme.accentPrimary,
                        }
                      : {
                          backgroundColor: theme.bgSurface,
                          color: theme.textPrimary,
                          borderColor: theme.borderColor,
                        }
                  }
                >
                  <span>{item.short}</span>
                  {isToday && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : 'bg-[#158481]/15 text-[#158481]'
                      }`}
                    >
                      Hoje
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Schedule Timeline List */}
          <div className="space-y-3">
            {filteredPrograms.map((prog) => {
              const isCurrent = activeProgram.id === prog.id;
              return (
                <div
                  key={`${prog.id}-${prog.startTime}`}
                  onClick={() => onSelectProgram(prog)}
                  className="group rounded-2xl p-4 border transition cursor-pointer flex items-center gap-3.5 shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: isCurrent
                      ? theme.bgElevated
                      : theme.bgSurface,
                    borderColor: isCurrent
                      ? theme.accentPrimary
                      : theme.borderColor,
                  }}
                >
                  <div
                    className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border"
                    style={{ borderColor: theme.borderColor }}
                  >
                    <img
                      src={prog.coverUrl}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    {prog.hasLiveVideo && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-extrabold"
                        style={{ color: theme.accentPrimary }}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {prog.startTime} – {prog.endTime}
                      </span>

                      {prog.sourceOrg && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                          style={{
                            backgroundColor: theme.bgElevated,
                            borderColor: theme.borderColor,
                            color: theme.textSecondary,
                          }}
                        >
                          {prog.sourceOrg}
                        </span>
                      )}

                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/15 text-red-600 border border-red-500/30">
                          <Radio className="w-3 h-3 animate-pulse" />
                          No Ar
                        </span>
                      )}

                      {prog.hasLiveVideo && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C91854]/15 text-[#C91854] border border-[#C91854]/30">
                          <Youtube className="w-3 h-3" />
                          Áudio + Vídeo
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold truncate mt-1">
                      {prog.title}
                    </h3>
                    <p
                      className="text-xs truncate mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      {prog.subtitle}
                    </p>
                    <p
                      className="text-[11px] truncate mt-1 font-medium"
                      style={{ color: theme.textSecondary }}
                    >
                      Ficha: {prog.credits.apresentacao}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span
                      className="p-2 rounded-xl border transition"
                      style={{
                        backgroundColor: theme.bgElevated,
                        borderColor: theme.borderColor,
                        color: theme.accentPrimary,
                      }}
                    >
                      <Info className="w-4 h-4" />
                    </span>
                    <span
                      className="text-[10px] hidden sm:inline font-medium"
                      style={{ color: theme.textSecondary }}
                    >
                      Ficha técnica
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
