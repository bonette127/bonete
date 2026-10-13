import React, { useState } from 'react';
import { Play, Pause, Code2, CheckCircle2, Copy, Check, Smartphone, Database, Globe, Terminal, Sparkles } from 'lucide-react';
import { TUTORIALS_DATA, TutorialItem } from '../data/portfolioData';

export const TutorialsSection: React.FC = () => {
  const [activeTutorial, setActiveTutorial] = useState<TutorialItem>(TUTORIALS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(45);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeTutorial.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTopicIcon = (topic: TutorialItem['topic']) => {
    switch (topic) {
      case 'HTML & CSS':
      case 'React & Vite':
        return <Globe className="w-4 h-4 text-emerald-600" />;
      case 'Node.js APIs':
        return <Terminal className="w-4 h-4 text-emerald-600" />;
      case 'Databases':
        return <Database className="w-4 h-4 text-emerald-600" />;
      case 'Mobile Apps':
        return <Smartphone className="w-4 h-4 text-emerald-600" />;
      default:
        return <Code2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            02. Teach Web & App Development
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Learn Coding with Bonette: Website & Mobile App Tutorials
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
            I believe true mastery comes from sharing. In my L5 SOD classes and independent projects, I prepare practical guides to teach beginners how to construct responsive web pages, create backend APIs in Node.js, and design mobile apps.
          </p>
        </div>

        {/* Tutorial Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TUTORIALS_DATA.map((tut) => {
            const isSelected = tut.id === activeTutorial.id;
            return (
              <button
                key={tut.id}
                onClick={() => {
                  setActiveTutorial(tut);
                  setIsPlaying(false);
                }}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-850 border-emerald-600 dark:border-emerald-500 shadow-sm ring-1 ring-emerald-600 dark:ring-emerald-500'
                    : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {getTopicIcon(tut.topic)}
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{tut.topic}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {tut.title}
                </h4>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400 dark:text-slate-400">
                  <span>{tut.duration}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">{tut.level}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Video Player & Code Studio Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Video Player Mockup */}
          <div className="lg:col-span-7 bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-md flex flex-col">
            {/* Screen Header */}
            <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-slate-400">BonetteDev_Masterclass.mp4</span>
              </div>
              <span className="font-semibold text-emerald-400 text-xs">L5 SOD Studio</span>
            </div>

            {/* Video Canvas Container */}
            <div className="relative aspect-16/9 bg-slate-900 flex items-center justify-center overflow-hidden group">
              <img
                src="/src/assets/images/coding_classroom_lab_1791547598588.jpg"
                alt="Bonette teaching software engineering tutorial"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60 filter contrast-110"
              />

              {/* Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Overlay Video Banner */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 bg-black/70 backdrop-blur-xs rounded text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                  {activeTutorial.topic} Masterclass
                </span>
                <span className="px-2 py-0.5 bg-black/60 rounded text-xs font-mono text-slate-300">
                  HD 1080p
                </span>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer border border-emerald-400"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                  )}
                </button>
                <p className="mt-4 text-sm font-semibold text-white drop-shadow-md max-w-md">
                  {activeTutorial.title}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Instructor: <span className="text-emerald-300 font-semibold">IBYOYAKOZE Bonette</span>
                </p>
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
                {/* Progress bar */}
                <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: isPlaying ? '68%' : '22%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-emerald-400 cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-xs">
                      {isPlaying ? '08:24' : '02:40'} / {activeTutorial.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Lycée St Alexandre Sauli</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Meta Info */}
            <div className="p-4 sm:p-6 bg-slate-950 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {activeTutorial.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeTutorial.summary}
              </p>

              <div className="pt-3 border-t border-slate-800 space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Key Skills Taught in this Lesson:
                </p>
                <ul className="space-y-1 text-xs text-slate-300">
                  {activeTutorial.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Code Snippet & Live Sandbox */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="px-5 py-3.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Lesson Source Code
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200 rounded text-slate-700 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Pre Box */}
              <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-80 leading-relaxed">
                <pre>{activeTutorial.codeSnippet}</pre>
              </div>

              <div className="p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  How Bonette Explains this Concept
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In software development, writing clean, well-commented code is how we collaborate across teams. Practice running this snippet in your local VS Code terminal or Vite browser tab!
                </p>
              </div>
            </div>

            {/* Quick Practice Challenge */}
            <div className="p-4 m-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Bonette's Practice Challenge:</span>
              </div>
              <p className="leading-relaxed">
                Try modifying the button handler in the snippet above to handle your own custom state message. Share your solution in the Messages tab below!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
