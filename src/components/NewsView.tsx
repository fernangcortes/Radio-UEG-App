import React, { useState } from 'react';
import {
  Clock,
  Share2,
  X,
  Radio,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { DesignThemeConfig, NewsArticle, ScheduleProgram } from '../types';
import { WaveWatermarkBackdrop } from './RadioWaveGraphic';

interface NewsViewProps {
  theme: DesignThemeConfig;
  news: NewsArticle[];
  schedule: ScheduleProgram[];
  onOpenProgramDetails: (program: ScheduleProgram) => void;
}

const CATEGORIES: Array<'Todas' | NewsArticle['category']> = [
  'Todas',
  'Cultura',
  'CriaLab',
  'Na Rádio',
  'Institucional',
];

const CATEGORY_COLORS: Record<NewsArticle['category'], string> = {
  Cultura: 'bg-[#C91854] text-white',
  CriaLab: 'bg-[#158481] text-white',
  'Na Rádio': 'bg-[#E84136] text-white',
  Institucional: 'bg-[#9BA538] text-white',
};

export const NewsView: React.FC<NewsViewProps> = ({
  theme,
  news,
  schedule,
  onOpenProgramDetails,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<'Todas' | NewsArticle['category']>('Todas');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const filtered =
    selectedCategory === 'Todas'
      ? news
      : news.filter((n) => n.category === selectedCategory);

  const handleShareArticle = async (article: NewsArticle) => {
    const shareData = {
      title: article.title,
      text: `${article.title} — Rádio UEG Educativa`,
      url: window.location.origin,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // ignore
      }
    } else {
      await navigator.clipboard.writeText(`${article.title}\n${window.location.origin}`);
      alert('Notícia copiada para compartilhar!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-3 pb-10 space-y-5">
      {/* Header Banner */}
      <div
        className="relative rounded-3xl border p-5 overflow-hidden shadow-sm"
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.borderColor,
        }}
      >
        <WaveWatermarkBackdrop theme={theme} opacity={0.07} />
        <div className="relative z-10">
          <div
            className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest"
            style={{ color: theme.accentSecondary }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Jornalismo Cultural • CriaLab & Rádio UEG</span>
          </div>
          <h2 className="text-2xl font-extrabold font-display mt-1">
            Notícias & Destaques
          </h2>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
            Acontecimentos culturais da cidade e do estado, bastidores do CriaLab e novidades da programação.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition cursor-pointer border"
              style={
                active
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
              {cat}
            </button>
          );
        })}
      </div>

      {/* News Feed List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const relatedProg = item.relatedProgramId
            ? schedule.find((p) => p.id === item.relatedProgramId)
            : undefined;

          return (
            <article
              key={item.id}
              onClick={() => setActiveArticle(item)}
              className="group rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
              style={{
                backgroundColor: theme.bgSurface,
                borderColor: theme.borderColor,
              }}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-44 h-44 sm:h-auto relative overflow-hidden shrink-0 bg-black/10">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shadow ${
                      CATEGORY_COLORS[item.category]
                    }`}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div
                      className="flex items-center gap-2 text-[11px] font-semibold"
                      style={{ color: theme.textSecondary }}
                    >
                      <Clock
                        className="w-3.5 h-3.5"
                        style={{ color: theme.accentPrimary }}
                      />
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>Leitura: {item.readTime}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold mt-1.5 leading-snug">
                      {item.title}
                    </h3>

                    <p
                      className="text-xs mt-2 line-clamp-2 leading-relaxed"
                      style={{ color: theme.textSecondary }}
                    >
                      {item.summary}
                    </p>
                  </div>

                  <div
                    className="mt-4 pt-3 border-t flex items-center justify-between gap-2"
                    style={{ borderColor: theme.borderColor }}
                  >
                    <span
                      className="text-[11px] truncate font-medium"
                      style={{ color: theme.textSecondary }}
                    >
                      Por {item.author}
                    </span>

                    <div className="flex items-center gap-2">
                      {relatedProg && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProgramDetails(relatedProg);
                          }}
                          className="px-2.5 py-1 rounded-xl border text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          style={{
                            backgroundColor: theme.bgElevated,
                            borderColor: theme.borderColor,
                            color: theme.accentSecondary,
                          }}
                        >
                          <Radio className="w-3 h-3" />
                          <span>{relatedProg.title}</span>
                        </button>
                      )}
                      <span
                        className="inline-flex items-center gap-1 text-xs font-extrabold"
                        style={{ color: theme.accentPrimary }}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Ler</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="border rounded-3xl max-w-lg w-full max-h-[88vh] overflow-y-auto shadow-2xl"
            style={{
              backgroundColor: theme.bgSurface,
              borderColor: theme.borderColor,
              color: theme.textPrimary,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-52 w-full bg-black">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <span
                className={`absolute bottom-3 left-5 px-3 py-1 rounded-full text-xs font-bold uppercase shadow ${
                  CATEGORY_COLORS[activeArticle.category]
                }`}
              >
                {activeArticle.category}
              </span>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div
                className="text-xs flex items-center justify-between font-medium"
                style={{ color: theme.textSecondary }}
              >
                <span>{activeArticle.author}</span>
                <span>{activeArticle.date}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold leading-tight font-display">
                {activeArticle.title}
              </h2>

              <p
                className="text-sm font-bold leading-relaxed"
                style={{ color: theme.accentPrimary }}
              >
                {activeArticle.summary}
              </p>

              <div
                className="space-y-3 text-sm leading-relaxed pt-2 border-t"
                style={{
                  borderColor: theme.borderColor,
                  color: theme.textPrimary,
                }}
              >
                {activeArticle.content.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div
                className="pt-4 border-t flex items-center justify-between gap-3"
                style={{ borderColor: theme.borderColor }}
              >
                <button
                  onClick={() => handleShareArticle(activeArticle)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer"
                  style={{
                    backgroundColor: theme.bgElevated,
                    borderColor: theme.borderColor,
                  }}
                >
                  <Share2
                    className="w-4 h-4"
                    style={{ color: theme.accentPrimary }}
                  />
                  <span>Compartilhar Matéria</span>
                </button>

                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                  style={{ backgroundColor: theme.accentPrimary }}
                >
                  Fechar Leitura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
