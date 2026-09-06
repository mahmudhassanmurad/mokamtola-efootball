import React, { useRef, useEffect, useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Share2, X, Check, Copy, Download, MessageCircle, Send, Twitter } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { shareModal, closeShareModal, settings } = useTournament();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!shareModal?.isOpen) return;

    // Generate 1200x630 high resolution social share preview image on Canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    // Draw background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0b0f19');
    bgGrad.addColorStop(0.5, '#111827');
    bgGrad.addColorStop(1, '#052e16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative soccer pitch / esports lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.lineWidth = 3;
    // Outer border
    ctx.strokeRect(40, 40, width - 80, height - 80);
    // Center circle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 160, 0, Math.PI * 2);
    ctx.stroke();
    // Center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 40);
    ctx.lineTo(width / 2, height - 40);
    ctx.stroke();

    // Tournament Header Branding
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 28px sans-serif';
    ctx.letterSpacing = '4px';
    ctx.textAlign = 'center';
    ctx.fillText('★ ' + (settings.tournamentTitle || 'PES TOURNAMENT') + ' ★', width / 2, 95);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(settings.subtitle || 'Official eFootball Championship Series', width / 2, 130);

    // Dynamic Card Content based on type
    if (shareModal.type === 'match' && shareModal.match) {
      const match = shareModal.match;
      const homeName = shareModal.homePlayer?.displayName || 'Player A';
      const awayName = shareModal.awayPlayer?.displayName || 'Player B';
      const homeTeam = shareModal.homePlayer?.teamName || '';
      const awayTeam = shareModal.awayPlayer?.teamName || '';

      // Match Round Badge
      ctx.fillStyle = '#1e293b';
      ctx.roundRect(width / 2 - 120, 160, 240, 42, 21);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(match.roundName.toUpperCase() + ' RESULT', width / 2, 187);

      // Home Player Box (Left)
      ctx.fillStyle = '#0f172a';
      ctx.roundRect(100, 230, 400, 260, 20);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(homeName, 300, 330);

      ctx.fillStyle = '#10b981';
      ctx.font = '600 22px sans-serif';
      ctx.fillText(homeTeam, 300, 370);

      // Score Center
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 110px sans-serif';
      const scoreText = `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`;
      ctx.fillText(scoreText, width / 2, 380);

      // Away Player Box (Right)
      ctx.fillStyle = '#0f172a';
      ctx.roundRect(700, 230, 400, 260, 20);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(awayName, 900, 330);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 22px sans-serif';
      ctx.fillText(awayTeam, 900, 370);

      // Venue / pitch footer
      ctx.fillStyle = '#64748b';
      ctx.font = '18px sans-serif';
      ctx.fillText(`Venue: ${match.pitch || 'Official Stadium'} | Date: ${match.scheduledDate}`, width / 2, 530);

    } else if (shareModal.type === 'player' && shareModal.player) {
      const p = shareModal.player;

      // Player Name Header
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 48px sans-serif';
      ctx.fillText(p.displayName, width / 2, 240);

      ctx.fillStyle = '#10b981';
      ctx.font = '600 28px sans-serif';
      ctx.fillText(`${p.teamName} | ${p.fullName}`, width / 2, 290);

      // Stats Pills
      const pillWidth = 260;
      const startX = width / 2 - pillWidth;
      ctx.fillStyle = '#0f172a';
      ctx.roundRect(startX - 140, 340, 240, 120, 16);
      ctx.fill();
      ctx.roundRect(startX + 140, 340, 240, 120, 16);
      ctx.fill();
      ctx.roundRect(startX + 420, 340, 240, 120, 16);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 16px sans-serif';
      ctx.fillText('STATUS', startX - 20, 380);
      ctx.fillText('TOURNAMENT', startX + 260, 380);
      ctx.fillText('REPRESENTING', startX + 540, 380);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(p.status.toUpperCase(), startX - 20, 425);
      ctx.fillText('Season 1', startX + 260, 425);
      ctx.fillText(p.teamName, startX + 540, 425);

    } else {
      // General or Tournament Title
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(shareModal.title, width / 2, 280);

      if (shareModal.subtitle) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '24px sans-serif';
        ctx.fillText(shareModal.subtitle, width / 2, 340);
      }

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Official Standings & Match Updates Available Live', width / 2, 420);
    }

    // Footer Watermark
    ctx.fillStyle = '#475569';
    ctx.font = '16px sans-serif';
    ctx.fillText('PES Tournament Platform • Public Tournament Hub • No Login Required to View', width / 2, 570);

    // Save as data URL for preview and download
    try {
      setPreviewDataUrl(canvas.toDataURL('image/png'));
    } catch {
      // ignore
    }
  }, [shareModal, settings]);

  if (!shareModal || !shareModal.isOpen) return null;

  const encodedUrl = encodeURIComponent(shareModal.url || window.location.href);
  const shareText = encodeURIComponent(`${shareModal.title} - ${shareModal.subtitle || 'PES Tournament Platform'}`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareModal.url || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadImage = () => {
    if (!previewDataUrl) return;
    const a = document.createElement('a');
    a.href = previewDataUrl;
    a.download = `pes-tournament-share-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Share to Social Media</h3>
              <p className="text-xs text-slate-400">Generate 1200x630 Facebook image & direct links</p>
            </div>
          </div>
          <button
            onClick={closeShareModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Card Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Generated Facebook 1200×630 Preview Card
            </label>
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner aspect-[1200/630]">
              <canvas ref={canvasRef} className="w-full h-full object-contain block" />
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={handleDownloadImage}
                className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1.5 rounded-lg hover:bg-emerald-900/60 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download 1200×630 Image
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Share to Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#4599ff] border border-[#1877F2]/40 rounded-xl font-medium text-sm transition-colors"
              >
                <span className="font-bold text-base leading-none">f</span>
                Facebook
              </a>

              {/* Messenger */}
              <a
                href={`fb-messenger://share/?link=${encodedUrl}&app_id=123456`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#00B2FF]/20 hover:bg-[#00B2FF]/30 text-[#38c8ff] border border-[#00B2FF]/40 rounded-xl font-medium text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Messenger
              </a>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#46e680] border border-[#25D366]/40 rounded-xl font-medium text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodedUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#229ED9]/20 hover:bg-[#229ED9]/30 text-[#50b9ec] border border-[#229ED9]/40 rounded-xl font-medium text-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                Telegram
              </a>

              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl font-medium text-sm transition-colors"
              >
                <Twitter className="w-4 h-4" />
                X (Twitter)
              </a>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-medium text-sm transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 flex justify-between items-center text-xs text-slate-400">
          <span>Anyone with this link can view the page without logging in</span>
          <button
            onClick={closeShareModal}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
