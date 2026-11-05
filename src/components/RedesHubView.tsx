import React, { useState } from 'react';
import {
  Youtube,
  Headphones,
  Instagram,
  Globe,
  MessageSquareHeart,
  Send,
  ExternalLink,
  Mic2,
  CheckCircle2,
} from 'lucide-react';
import { DesignThemeConfig, PodcastShow, RadioConfig } from '../types';
import { WaveWatermarkBackdrop } from './RadioWaveGraphic';

interface RedesHubViewProps {
  theme: DesignThemeConfig;
  podcasts: PodcastShow[];
  config: RadioConfig;
}

export const RedesHubView: React.FC<RedesHubViewProps> = ({
  theme,
  podcasts,
  config,
}) => {
  const [messageType, setMessageType] = useState<'reitor' | 'musica' | 'recado'>('reitor');
  const [senderName, setSenderName] = useState('');
  const [campusOrCourse, setCampusOrCourse] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sentConfirmation, setSentConfirmation] = useState(false);

  const handleSendToStudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const labelMap = {
      reitor: 'PERGUNTE AO REITOR (Papo com o Reitor)',
      musica: 'PEDIDO MUSICAL • Rádio UEG',
      recado: 'RECADO AO ESTÚDIO • UEG em Sintonia',
    };

    const formatted = [
      `📻 *${labelMap[messageType]}*`,
      senderName ? `👤 *Nome:* ${senderName}` : '',
      campusOrCourse ? `🎓 *Câmpus/Curso:* ${campusOrCourse}` : '',
      `💬 *Mensagem:* ${messageText}`,
    ]
      .filter(Boolean)
      .join('\n');

    const waUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
      formatted
    )}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSentConfirmation(true);
    setTimeout(() => setSentConfirmation(false), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-3 pb-10 space-y-6">
      {/* Official Channels Hub */}
      <div
        className="relative rounded-3xl border p-5 overflow-hidden shadow-sm"
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
            Multiplataforma • CriaLab|UEG
          </span>
          <h2 className="text-2xl font-extrabold font-display mt-0.5">
            Canais Oficiais & Podcasts
          </h2>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
            Acesse diretamente nossas transmissões em vídeo no YouTube, temporadas no Spotify e fale ao vivo com o estúdio.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            <a
              href={config.youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl border flex flex-col justify-between gap-2 transition hover:shadow"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
              }}
            >
              <div className="flex items-center justify-between">
                <Youtube className="w-6 h-6 text-[#E84136]" />
                <ExternalLink
                  className="w-3.5 h-3.5"
                  style={{ color: theme.textSecondary }}
                />
              </div>
              <div>
                <div className="text-xs font-extrabold">YouTube</div>
                <div
                  className="text-[10px]"
                  style={{ color: theme.textSecondary }}
                >
                  Lives & Videocasts
                </div>
              </div>
            </a>

            <a
              href={config.spotifyProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl border flex flex-col justify-between gap-2 transition hover:shadow"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
              }}
            >
              <div className="flex items-center justify-between">
                <Headphones className="w-6 h-6 text-[#158481]" />
                <ExternalLink
                  className="w-3.5 h-3.5"
                  style={{ color: theme.textSecondary }}
                />
              </div>
              <div>
                <div className="text-xs font-extrabold">Spotify</div>
                <div
                  className="text-[10px]"
                  style={{ color: theme.textSecondary }}
                >
                  Podcasts & Séries
                </div>
              </div>
            </a>

            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl border flex flex-col justify-between gap-2 transition hover:shadow"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
              }}
            >
              <div className="flex items-center justify-between">
                <Instagram className="w-6 h-6 text-[#C91854]" />
                <ExternalLink
                  className="w-3.5 h-3.5"
                  style={{ color: theme.textSecondary }}
                />
              </div>
              <div>
                <div className="text-xs font-extrabold">Instagram</div>
                <div
                  className="text-[10px]"
                  style={{ color: theme.textSecondary }}
                >
                  @radioueg
                </div>
              </div>
            </a>

            <a
              href={config.officialSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl border flex flex-col justify-between gap-2 transition hover:shadow"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
              }}
            >
              <div className="flex items-center justify-between">
                <Globe className="w-6 h-6 text-[#9BA538]" />
                <ExternalLink
                  className="w-3.5 h-3.5"
                  style={{ color: theme.textSecondary }}
                />
              </div>
              <div>
                <div className="text-xs font-extrabold">Portal Rádio</div>
                <div
                  className="text-[10px]"
                  style={{ color: theme.textSecondary }}
                >
                  ueg.br/radio
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Podcasts Showcase Carousel */}
      <div className="space-y-3">
        <div className="px-1">
          <span
            className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: theme.accentSecondary }}
          >
            <Mic2 className="w-3.5 h-3.5" />
            Produções Originais por Temporada
          </span>
          <h3 className="text-lg font-extrabold font-display">
            Podcasts da Rádio UEG & CriaLab
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {podcasts.map((pod) => (
            <div
              key={pod.id}
              className="rounded-3xl border overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition"
              style={{
                backgroundColor: theme.bgSurface,
                borderColor: theme.borderColor,
              }}
            >
              <div className="p-4 flex items-start gap-3.5">
                <img
                  src={pod.coverUrl}
                  alt={pod.title}
                  className="w-20 h-20 rounded-2xl object-cover border shrink-0"
                  style={{ borderColor: theme.borderColor }}
                />
                <div className="min-w-0 flex-1">
                  <span
                    className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: theme.bgElevated,
                      borderColor: theme.borderColor,
                      color: theme.accentPrimary,
                    }}
                  >
                    {pod.seasonInfo}
                  </span>
                  <h4 className="text-base font-extrabold mt-1 truncate">
                    {pod.title}
                  </h4>
                  <p
                    className="text-xs font-bold truncate"
                    style={{ color: theme.accentSecondary }}
                  >
                    {pod.subtitle}
                  </p>
                  <p
                    className="text-[11px] mt-1 line-clamp-2"
                    style={{ color: theme.textSecondary }}
                  >
                    {pod.description}
                  </p>
                </div>
              </div>

              <div
                className="px-4 py-3 border-t flex items-center justify-between gap-2"
                style={{
                  backgroundColor: theme.bgElevated,
                  borderColor: theme.borderColor,
                }}
              >
                <a
                  href={pod.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  style={{ backgroundColor: theme.accentPrimary }}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Spotify</span>
                </a>
                <a
                  href={pod.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-[#E84136] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Listener Card: Pergunte ao Reitor / Mural do Estúdio */}
      <div
        className="rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.borderColor,
        }}
      >
        <div>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider"
            style={{ color: theme.accentPrimary }}
          >
            <MessageSquareHeart className="w-4 h-4" />
            Participação Direta do Ouvinte
          </span>
          <h3 className="text-xl font-extrabold font-display mt-0.5">
            Pergunte ao Reitor & Fale com o Estúdio
          </h3>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
            Tem dúvida para o programa <strong>Papo com o Reitor</strong> (terças às 8h), pauta do seu câmpus ou quer pedir música? Envie direto para a mesa do estúdio!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'reitor', label: 'Pergunte ao Reitor' },
            { id: 'recado', label: 'Recado / Pauta' },
            { id: 'musica', label: 'Pedir Música' },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setMessageType(btn.id as any)}
              className="py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer"
              style={
                messageType === btn.id
                  ? {
                      backgroundColor: theme.accentPrimary,
                      color: '#ffffff',
                      borderColor: theme.accentPrimary,
                    }
                  : {
                      backgroundColor: theme.bgElevated,
                      color: theme.textPrimary,
                      borderColor: theme.borderColor,
                    }
              }
            >
              {btn.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSendToStudio} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Seu nome"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
                color: theme.textPrimary,
              }}
            />
            <input
              type="text"
              placeholder="Câmpus / Curso (ex: Laranjeiras - Cinema)"
              value={campusOrCourse}
              onChange={(e) => setCampusOrCourse(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none"
              style={{
                backgroundColor: theme.bgElevated,
                borderColor: theme.borderColor,
                color: theme.textPrimary,
              }}
            />
          </div>

          <textarea
            rows={3}
            required
            placeholder={
              messageType === 'reitor'
                ? 'Escreva sua pergunta para o Reitor da UEG...'
                : messageType === 'musica'
                ? 'Qual música e artista você quer ouvir na Rádio UEG?'
                : 'Mande seu recado ou sugestão de pauta para o UEG em Sintonia...'
            }
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none"
            style={{
              backgroundColor: theme.bgElevated,
              borderColor: theme.borderColor,
              color: theme.textPrimary,
            }}
          />

          <div className="flex items-center justify-between gap-3">
            <span
              className="text-[11px] font-medium"
              style={{ color: theme.textSecondary }}
            >
              WhatsApp Estúdio: (62) 3522-5624
            </span>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow transition cursor-pointer"
              style={{ backgroundColor: theme.accentPrimary }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar para o Estúdio</span>
            </button>
          </div>

          {sentConfirmation && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Abriu no WhatsApp oficial da Rádio UEG Educativa!</span>
            </div>
          )}
        </form>
      </div>

      {/* Institutional Footer Strip */}
      <div
        className="rounded-3xl border p-5 flex flex-col items-center text-center gap-3"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.borderColor,
        }}
      >
        <img
          src="/assets/brand/logo-crialab-color.png"
          alt="CriaLab UEG"
          className="h-14 object-contain"
        />
        <p
          className="text-[11px] max-w-md font-medium"
          style={{ color: theme.textSecondary }}
        >
          Laboratório de Pesquisas Criativas e Inovação em Audiovisual (CriaLab|UEG) • Coordenação de Radioteledifusão da Universidade Estadual de Goiás.
        </p>
      </div>
    </div>
  );
};
