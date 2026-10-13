import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Heart, Sparkles, Disc, Radio } from 'lucide-react';
import { GOSPEL_SONGS, GospelSong } from '../data/portfolioData';

interface GospelSanctuaryProps {
  onSuggestSong: () => void;
}

export const GospelSanctuarySection: React.FC<GospelSanctuaryProps> = ({ onSuggestSong }) => {
  const [activeSong, setActiveSong] = useState<GospelSong>(GOSPEL_SONGS[0]);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  // Web Audio API generator for relaxing harmonic gospel progression
  const playHarmonicChime = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Chord notes progression: C major / A minor uplifting frequencies
      const chords = [
        [261.63, 329.63, 392.00], // C major
        [196.00, 246.94, 293.66], // G major
        [220.00, 261.63, 329.63], // A minor
        [174.61, 220.00, 261.63], // F major
      ];

      let chordIndex = 0;

      const playChord = () => {
        if (!audioCtxRef.current || isMuted) return;
        const now = ctx.currentTime;
        const notes = chords[chordIndex % chords.length];

        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = i === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.06, now + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.15);
          osc.stop(now + 3.0);
        });

        chordIndex++;
      };

      playChord();
      // Loop softly every 3.2 seconds
      timerRef.current = window.setInterval(playChord, 3200);
    } catch {
      // Audio fallback
    }
  };

  const stopHarmonicChime = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
    setIsPlayingMelody(false);
  };

  const toggleMelody = () => {
    if (isPlayingMelody) {
      stopHarmonicChime();
    } else {
      setIsPlayingMelody(true);
      playHarmonicChime();
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  return (
    <section className="py-12 bg-gradient-to-b from-amber-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              04. My Heart & Peace
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              The Gospel Corner: Singing When I'm Relaxing
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
              Writing complex algorithms requires intense mental focus. Whenever I step away from code, singing praises and acoustic gospel melodies brings serenity, joy, and spiritual renewal.
            </p>
          </div>

          {/* Interactive Relaxing Audio Chime Control */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <button
              onClick={toggleMelody}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isPlayingMelody
                  ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600'
              }`}
            >
              {isPlayingMelody ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Relaxing Chimes</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Gospel Ambient Chimes</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label="Toggle mute"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Authentic Singing Portrait */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md relative aspect-4/3 sm:aspect-square bg-slate-900 group">
            <img
              src="/src/assets/images/bonette_gospel_singing_1791547578992.jpg"
              alt="IBYOYAKOZE Bonette singing gospel songs"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-xs text-white text-xs font-medium rounded border border-white/20 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-300" />
                Vocalist & Chorale
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-xs font-medium text-amber-300 uppercase tracking-wider">
                Bonette's Sanctuary
              </p>
              <h4 className="text-base font-bold mt-0.5">
                "Urukundo rw'Imana niyo soko y'amahoro yanjye"
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Singing gospel songs in Muhura & Gatsibo chapels
              </p>
            </div>
          </div>

          {/* Right Column: Playlist & Devotional Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">FAVORITE GOSPEL PRAISES</span>
              <span>Tap any track to view reflection</span>
            </div>

            <div className="space-y-3">
              {GOSPEL_SONGS.map((song) => {
                const isCurrent = song.id === activeSong.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => setActiveSong(song)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-white dark:bg-slate-800 border-amber-400 dark:border-amber-400 shadow-sm ring-1 ring-amber-400'
                        : 'bg-white/80 dark:bg-slate-850/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isCurrent ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          <Disc className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{song.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{song.artist}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                        {song.tone}
                      </span>
                    </div>

                    {isCurrent && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2 text-xs">
                        <blockquote className="italic text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-amber-400 bg-amber-50/40 dark:bg-amber-950/20 py-1 rounded-r">
                          "{song.favoriteLyrics}"
                        </blockquote>
                        <p className="text-slate-600 dark:text-slate-400">
                          <strong className="text-slate-800 dark:text-slate-200">Why Bonette loves it: </strong>
                          {song.whyRelaxing}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick action to suggest a song to Bonette */}
            <div className="p-4 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-medium">
                <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                <span>Do you have an inspiring gospel song to recommend to Bonette?</span>
              </div>
              <button
                onClick={onSuggestSong}
                className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-semibold rounded-lg shadow-xs cursor-pointer whitespace-nowrap"
              >
                Send Song Suggestion
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
