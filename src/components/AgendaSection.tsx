import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Code2,
  BookOpen,
  Music,
  Heart,
  Plus,
  Edit3,
  Star,
  ChevronRight,
  TrendingUp,
  Smile,
  Zap,
  Target
} from 'lucide-react';
import { AgendaEntry, AgendaTaskItem } from '../data/portfolioData';

interface AgendaSectionProps {
  agendaEntries: AgendaEntry[];
  isAdminLoggedIn: boolean;
  onOpenAdminAgenda: () => void;
  onQuickToggleTask?: (entryId: string, taskId: string) => void;
  targetAgendaId?: string | null;
}

export const AgendaSection: React.FC<AgendaSectionProps> = ({
  agendaEntries,
  isAdminLoggedIn,
  onOpenAdminAgenda,
  onQuickToggleTask,
  targetAgendaId,
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string>(
    agendaEntries[0]?.id || ''
  );
  const [filterMood, setFilterMood] = useState<string>('All');

  React.useEffect(() => {
    if (targetAgendaId) {
      setSelectedEntryId(targetAgendaId);
    }
  }, [targetAgendaId]);

  const selectedEntry =
    agendaEntries.find((e) => e.id === selectedEntryId) || agendaEntries[0];

  const filteredEntries = filterMood === 'All'
    ? agendaEntries
    : agendaEntries.filter((e) => e.mood.toLowerCase().includes(filterMood.toLowerCase()));

  // Stats
  const totalEntries = agendaEntries.length;
  const allTasks = agendaEntries.flatMap((e) => e.routineTasks);
  const completedTasksCount = allTasks.filter((t) => t.completed).length;
  const completionRate = allTasks.length > 0 ? Math.round((completedTasksCount / allTasks.length) * 100) : 100;

  const getCategoryIcon = (category: AgendaTaskItem['category']) => {
    switch (category) {
      case 'Coding & Tech':
        return <Code2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'School (L5 SOD)':
        return <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'Gospel & Prayer':
        return <Music className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'Family & Chores':
        return <Heart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      case 'Health & Exercise':
        return <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <section id="agenda" className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                02. Daily Agenda & Routine Tracker
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Live Dynamic Log
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Daily Agenda, Activities & Routines
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
              How my day went, the coding modules and classes tackled at Lycée Saint Alexandre Sauli, gospel rehearsals, and routine tasks. As I advance in my engineering journey, this agenda updates dynamically.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdminLoggedIn ? (
              <button
                onClick={onOpenAdminAgenda}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Log Today&apos;s Agenda
              </button>
            ) : (
              <button
                onClick={onOpenAdminAgenda}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Admin log access"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Admin Agenda Logger
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights / Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Logged Days</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{totalEntries} Entries</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Routine Habits Done</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{completionRate}% Rate</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Focus Area</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">L5 SOD & Web</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Spiritual Renewal</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">Daily Praise</p>
            </div>
          </div>
        </div>

        {/* Main Agenda Grid: Sidebar of Dates + Detailed View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Agenda Log Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Date Log
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {filteredEntries.length} found
              </span>
            </div>

            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredEntries.map((entry) => {
                const isSelected = selectedEntry?.id === entry.id;
                const completedCount = entry.routineTasks.filter((t) => t.completed).length;

                return (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedEntryId(entry.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 shadow-xs'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className={`font-bold ${isSelected ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                        {entry.dateFormatted}
                      </span>
                      <div className="flex items-center text-amber-500 text-[11px]">
                        {[...Array(entry.dayRating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                      {entry.daySummary}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-750">
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                        <Smile className="w-3 h-3" />
                        {entry.mood}
                      </span>
                      <span>
                        {completedCount}/{entry.routineTasks.length} tasks
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Agenda Detailed Card */}
          {selectedEntry && (
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/70 space-y-6">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-750">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {selectedEntry.mood}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Logged {new Date(selectedEntry.loggedAt || selectedEntry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedEntry.dateFormatted}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Rating:</span>
                    <div className="flex items-center">
                      {[...Array(selectedEntry.dayRating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {isAdminLoggedIn && (
                    <button
                      onClick={onOpenAdminAgenda}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Log
                    </button>
                  )}
                </div>
              </div>

              {/* How My Day Went Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  How My Day Went
                </h4>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedEntry.daySummary}
                </div>
              </div>

              {/* Two Column Grid: Activities Performed + Routine Tasks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Activities Performed */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Activities Performed ({selectedEntry.activitiesPerformed.length})
                  </h4>
                  <ul className="space-y-2">
                    {selectedEntry.activitiesPerformed.map((act, idx) => (
                      <li
                        key={idx}
                        className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Routine Tasks & Daily Habits */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Routine Tasks & Habits ({selectedEntry.routineTasks.filter(t => t.completed).length}/{selectedEntry.routineTasks.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedEntry.routineTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onQuickToggleTask?.(selectedEntry.id, task.id)}
                        className={`p-2.5 rounded-lg border transition-colors flex items-center justify-between text-xs sm:text-sm ${
                          task.completed
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-750 text-slate-500 dark:text-slate-400'
                        } ${isAdminLoggedIn ? 'cursor-pointer hover:border-emerald-400' : ''}`}
                      >
                        <div className="flex items-center gap-2.5 truncate mr-2">
                          <button
                            type="button"
                            className="shrink-0 text-emerald-600 dark:text-emerald-400 focus:outline-hidden"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          <span className={`truncate ${task.completed ? 'font-medium' : 'line-through text-slate-400'}`}>
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {getCategoryIcon(task.category)}
                          {task.timeEstimate && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">
                              {task.timeEstimate}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills Practiced & Gospel Reflection */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-750 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tech Skills Practiced */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Tech Practiced:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEntry.techSkillsPracticed.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gospel & Spiritual Reflection */}
                {selectedEntry.gospelReflection && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                    <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                      <Music className="w-3.5 h-3.5" />
                      Daily Gospel Reflection:
                    </span>
                    <p className="text-amber-800/90 dark:text-amber-200/90 italic">
                      {selectedEntry.gospelReflection}
                    </p>
                  </div>
                )}
              </div>

              {/* Tomorrow's Priorities */}
              {selectedEntry.tomorrowsPriorities && selectedEntry.tomorrowsPriorities.length > 0 && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 space-y-2 text-xs">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Tomorrow&apos;s Next Steps & Priorities:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {selectedEntry.tomorrowsPriorities.map((item, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-emerald-200/50 dark:border-emerald-900/50 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
