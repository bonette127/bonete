import React, { useState, useEffect, useRef } from 'react';
import { Cake, Sparkles, Heart, Send, X, Gift, Calendar, PartyPopper, Music, Flame, CheckCircle2 } from 'lucide-react';
import { BONETTE_PROFILE, getBirthdayInfo, BirthdayInfo } from '../data/portfolioData';

interface BirthdayAnniversaryBannerProps {
  onSendBirthdayWish: () => void;
  onNavigateTab?: (tab: string) => void;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  speedY: number;
  speedX: number;
  shape: 'square' | 'circle' | 'strip';
}

export const BirthdayAnniversaryBanner: React.FC<BirthdayAnniversaryBannerProps> = ({
  onSendBirthdayWish,
  onNavigateTab,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [confettiBlasts, setConfettiBlasts] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Verify current date against October 15th (BONETTE_PROFILE.birthDate: '2008-10-15')
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed: October is 9
  const currentDate = now.getDate();

  // Extract month and day from BONETTE_PROFILE.birthDate
  const [, birthMonthStr, birthDayStr] = BONETTE_PROFILE.birthDate.split('-').map(Number);
  const isActualOctober15 = currentMonth === birthMonthStr - 1 && currentDate === birthDayStr;

  // State to allow user/tester to preview celebratory UI effects even outside the exact date
  const [previewCelebration, setPreviewCelebration] = useState<boolean>(isActualOctober15);

  const isCelebrationActive = isActualOctober15 || previewCelebration;
  const info: BirthdayInfo = getBirthdayInfo(now);

  // 2. Confetti Particle Canvas Animation when celebration is active
  useEffect(() => {
    if (!isCelebrationActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const colors = ['#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#facc15'];

    // Generate initial batch of particles
    const particleCount = 65;
    const particles: ConfettiParticle[] = [];

    const createParticle = (i: number, fromBottom = false): ConfettiParticle => ({
      id: i,
      x: Math.random() * (canvas.width || 800),
      y: fromBottom ? (canvas.height || 200) + Math.random() * 20 : -10 - Math.random() * 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 7 + 4,
      rotation: Math.random() * 360,
      speedY: Math.random() * 2 + 1.2,
      speedX: (Math.random() - 0.5) * 2,
      shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'strip' : 'square',
    });

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(i));
    }

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += 2;

        if (p.y > canvas.height + 20) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'strip') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size * 1.5, p.size / 3);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || 90;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isCelebrationActive, confettiBlasts]);

  const handleTriggerBlast = () => {
    setConfettiBlasts((prev) => prev + 1);
  };

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Birthday and anniversary celebration banner"
      className={`relative overflow-hidden text-white shadow-lg transition-all duration-300 ${
        isCelebrationActive
          ? 'bg-gradient-to-r from-amber-600 via-rose-600 via-pink-600 to-emerald-600 border-b-2 border-amber-300/60'
          : 'bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-600'
      }`}
    >
      {/* Canvas Confetti Layer (Visible when celebration is active) */}
      {isCelebrationActive && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-75"
        />
      )}

      {/* Decorative ambient glowing circles */}
      <div className="absolute -left-12 -top-12 w-44 h-44 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -right-12 -bottom-12 w-44 h-44 bg-rose-300/25 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-1/2 top-0 w-64 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative z-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Main Message & Verified DOB Badge */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="relative shrink-0">
              <span className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md backdrop-blur-md ${
                isCelebrationActive
                  ? 'bg-amber-300 text-amber-950 ring-4 ring-white/30 animate-pulse'
                  : 'bg-white/20 text-amber-200'
              }`}>
                {isCelebrationActive ? (
                  <Cake className="w-5 h-5 text-amber-900 animate-bounce" />
                ) : (
                  <PartyPopper className="w-5 h-5 text-amber-200" />
                )}
              </span>

              {/* Floating mini balloon badge */}
              {isCelebrationActive && (
                <span className="absolute -top-1 -right-1 text-xs">🎈</span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-extrabold tracking-wide uppercase text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 ${
                  isCelebrationActive
                    ? 'bg-white text-rose-600 ring-1 ring-amber-300'
                    : 'bg-black/25 text-white'
                }`}>
                  <PartyPopper className="w-3 h-3 shrink-0" />
                  {isCelebrationActive
                    ? '🎉 OCTOBER 15TH ANNIVERSARY CELEBRATION!'
                    : '🎂 ANNIVERSARY COUNTDOWN REMINDER'}
                </span>

                <span className="text-amber-100 font-semibold text-xs flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-md">
                  <Calendar className="w-3 h-3 text-amber-300" />
                  <span>DOB Verified: {BONETTE_PROFILE.birthDate}</span>
                </span>

                {/* Preview Celebration Toggle for User Testing */}
                {!isActualOctober15 && (
                  <button
                    type="button"
                    onClick={() => setPreviewCelebration(!previewCelebration)}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 hover:bg-black/50 text-amber-200 border border-amber-300/40 cursor-pointer transition-colors"
                    title="Toggle celebration effects preview"
                  >
                    {previewCelebration ? '✓ Oct 15 Mode Active' : '✨ Preview Oct 15 Celebration'}
                  </button>
                )}
              </div>

              <p className="font-bold text-white text-xs sm:text-sm leading-snug">
                {isCelebrationActive ? (
                  <>
                    🎉 <strong className="underline decoration-amber-300 decoration-2">Today is October 15!</strong> Happy 18th Birthday, <span className="font-extrabold text-amber-200">{BONETTE_PROFILE.name}</span>! Born on October 15, 2008 in Gatsibo, Rwanda. Celebrating 18 years of life, praise, and software engineering! 🎂
                  </>
                ) : (
                  <>
                    IBYOYAKOZE Bonette was born on <strong className="text-amber-200">October 15, 2008</strong> in Gatsibo, Rwanda. Turning <strong className="text-white font-extrabold">{info.turningAge}</strong> in <span className="underline font-bold">{info.daysUntilNextBirthday === 1 ? '1 day' : `${info.daysUntilNextBirthday} days`}</span> (October 15)!
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Celebratory Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap self-end lg:self-center">
            {isCelebrationActive && (
              <button
                type="button"
                onClick={handleTriggerBlast}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                title="Trigger extra confetti particles"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                <span>Blast Confetti!</span>
              </button>
            )}

            <button
              type="button"
              onClick={onSendBirthdayWish}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-slate-900 hover:bg-amber-100 font-bold text-xs shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <Gift className="w-3.5 h-3.5 text-rose-500" />
              <span>{isCelebrationActive ? 'Send Birthday Blessing' : 'Send Birthday Wish'}</span>
            </button>

            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('agenda')}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/25 hover:bg-black/40 text-white font-medium text-xs cursor-pointer transition-colors"
              >
                <span>View Agenda</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
              title="Dismiss reminder"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
