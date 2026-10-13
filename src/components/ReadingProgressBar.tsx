import React, { useState } from 'react';
import { BookOpen, CheckCircle2, History, X, Clock, BookCheck, Trash2, ArrowUpRight, Sparkles } from 'lucide-react';
import { ReadArticleRecord } from '../data/portfolioData';

interface ReadingProgressBarProps {
  progress: number; // 0 - 100
  activeStoryTitle?: string | null;
  category?: string | null;
  readTime?: string | null;
  isVisible: boolean;
  onCloseReader?: () => void;
  sessionReadingHistory?: ReadArticleRecord[];
  onClearHistory?: () => void;
  onSelectHistoryArticle?: (title: string) => void;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  progress,
  activeStoryTitle,
  category,
  readTime,
  isVisible,
  onCloseReader,
  sessionReadingHistory = [],
  onClearHistory,
  onSelectHistoryArticle,
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const hasHistory = sessionReadingHistory.length > 0;
  const isCompleted = progress >= 99;

  // Don't render track if progress is 0 and not visible, but keep history toggle accessible if history exists
  if (!isVisible && progress === 0 && !hasHistory) return null;

  return (
    <>
      <aside
        aria-label="Reading progress bar"
        className="fixed top-0 left-0 right-0 z-[100] transition-opacity duration-300"
      >
        {/* Visual Progress Bar Track at absolute top of browser window */}
        <div
          className="w-full h-1.5 sm:h-2 bg-slate-200/60 dark:bg-slate-900/80 backdrop-blur-xs relative overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Article reading progress"
        >
          <div
            className={`h-full transition-all duration-150 ease-out relative ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-600 via-teal-400 to-amber-300'
                : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400'
            }`}
            style={{ width: `${progress}%` }}
          >
            {/* Glowing pulse indicator at leading edge */}
            {progress > 0 && progress < 100 && (
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/80 shadow-[0_0_8px_#34d399] animate-pulse rounded-r-full" />
            )}
          </div>
        </div>

        {/* Floating Active Story & Reading History Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pointer-events-none">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Active Story Indicator Pill */}
            {activeStoryTitle ? (
              <div className="pointer-events-auto inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md text-xs">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <BookOpen className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  )}
                </span>

                <div className="flex items-center gap-2 truncate max-w-[180px] sm:max-w-md">
                  {category && (
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px] uppercase tracking-wider hidden sm:inline">
                      [{category}]
                    </span>
                  )}
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {activeStoryTitle}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px] shrink-0">
                  <span
                    className={
                      isCompleted
                        ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 font-semibold'
                    }
                  >
                    {isCompleted ? 'Finished!' : `${progress}%`}
                  </span>
                  {readTime && !isCompleted && (
                    <span className="hidden md:inline">· {readTime}</span>
                  )}
                </div>

                {onCloseReader && (
                  <button
                    onClick={onCloseReader}
                    className="ml-1 p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded cursor-pointer transition-colors"
                    title="Close Reader"
                  >
                    ✕
                  </button>
                )}
              </div>
            ) : <div />}

            {/* Right: Reading History Toggle Button */}
            {hasHistory && (
              <div className="pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border shadow-md backdrop-blur-md cursor-pointer transition-all ${
                    isHistoryOpen
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
                      : 'bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                  title="View articles completed during this session"
                >
                  <History className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span className="font-semibold hidden xs:inline">Reading History</span>
                  <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {sessionReadingHistory.length}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Reading History Dropdown / Modal Drawer */}
      {isHistoryOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-xs flex justify-end"
          onClick={() => setIsHistoryOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <BookCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Reading History
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {sessionReadingHistory.length} {sessionReadingHistory.length === 1 ? 'Article' : 'Articles'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Articles fully read during this browser session
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reading Stats Summary */}
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Great job!</strong> You explored Bonette&apos;s thoughts and devotionals today.
                </span>
              </div>
              {onClearHistory && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 font-medium cursor-pointer transition-colors"
                  title="Clear reading history for this session"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* List of Read Articles */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sessionReadingHistory.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No articles completed yet
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Scroll through any article in the Stories & Articles section to 100% to track your reading progress here.
                  </p>
                </div>
              ) : (
                sessionReadingHistory.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/80 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        {item.category && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                        )}
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {item.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.readAt}
                        </span>
                        {item.readTime && <span>· {item.readTime}</span>}
                      </div>

                      {onSelectHistoryArticle && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectHistoryArticle(item.title);
                            setIsHistoryOpen(false);
                          }}
                          className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
                        >
                          <span>Re-read</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Session Note */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-xs text-slate-500 dark:text-slate-400 text-center">
              Session history resets automatically when your browser tab is closed.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
