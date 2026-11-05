import React from 'react';
import {
  X,
  Smartphone,
  QrCode,
  Download,
  Zap,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface InstallQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onTriggerInstall: () => void;
}

export const InstallQrModal: React.FC<InstallQrModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall,
}) => {
  if (!isOpen) return null;

  const appUrl = window.location.origin;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&bgcolor=1E1230&color=8CE0C4&data=${encodeURIComponent(
    appUrl
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1E1230] border border-white/15 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full crialab-colorbar" />

        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F7AD1C]">
                Instalação Instantânea • Sem Loja / Sem Burocracia
              </span>
              <h3 className="text-xl font-extrabold text-white font-display mt-0.5">
                Instalar App • Kit Calouro UEG
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Como alinhado na reunião, o aplicativo usa tecnologia <strong>PWA</strong>: instala direto na tela inicial do celular com ícone próprio, pré-carrega as animações para abrir instantaneamente e funciona antes mesmo da publicação na Play Store/Apple.
          </p>

          {/* QR Code for Matrícula / Divulgação nos Câmpus ([25:20]) */}
          <div className="rounded-2xl bg-black/35 border border-white/10 p-4 flex flex-col items-center text-center gap-2.5">
            <img
              src={qrImageUrl}
              alt="QR Code Rádio UEG"
              className="w-40 h-40 rounded-xl border border-white/15 p-2 bg-[#1E1230]"
            />
            <div className="text-xs font-bold text-[#8CE0C4] flex items-center gap-1.5">
              <QrCode className="w-4 h-4" />
              <span>Escaneie na Matrícula ou nos Câmpus</span>
            </div>
            <span className="text-[11px] text-slate-400 break-all">{appUrl}</span>
          </div>

          {/* Direct Install Button or Instructions */}
          {deferredPrompt ? (
            <button
              onClick={onTriggerInstall}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#158481] hover:bg-[#199d99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Instalar Aplicativo Agora (1 Clique)</span>
            </button>
          ) : (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 space-y-2 text-xs text-slate-200">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#F7AD1C]" />
                <span>Como instalar no seu celular:</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8CE0C4] shrink-0 mt-0.5" />
                <span>
                  <strong>No Android (Chrome):</strong> Toque no menu <strong>⋮</strong> e selecione <em>"Instalar aplicativo"</em> ou <em>"Adicionar à tela inicial"</em>.
                </span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8CE0C4] shrink-0 mt-0.5" />
                <span>
                  <strong>No iPhone (Safari):</strong> Toque em <strong>Compartilhar</strong> e depois em <em>"Adicionar à Tela de Início"</em>.
                </span>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-[#158481]/15 border border-[#158481]/30 p-3 flex items-center gap-2.5 text-[11px] text-[#8CE0C4]">
            <Zap className="w-4 h-4 shrink-0 text-[#F7AD1C]" />
            <span>
              <strong>Atalho Inteligente:</strong> Segurando o ícone do app instalado no Android, o ouvinte também pode escolher <em>"Ouvir Só Som"</em> para abrir já tocando!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
