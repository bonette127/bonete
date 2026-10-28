import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  FileText,
  Video,
  Calendar,
  Sparkles,
  Command,
  ArrowRight,
  Clock,
  Tag
} from 'lucide-react';
import {
  StoryArticle,
  AgendaEntry,
  TUTORIALS_DATA,
  TutorialItem
} from '../data/portfolioData';
import { useLanguage } from '../hooks/useLanguage';

interface GlobalSearchProps {
  articles?: StoryArticle[];
  agendaEntries?: AgendaEntry[];
  onSelectTab: (tab: string) => void;
  onSelectArticleTitle?: (title: string) => void;
  onSelectTutorial?: (tutorialId: string) => void;
  onSelectAgendaEntry?: (agendaId: string) => void;
  variant?: 'desktop' | 'mobile';
  onCloseMobile?: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  articles = [],
  agendaEntries = [],
  onSelectTab,
  onSelectArticleTitle,
  onSelectTutorial,
  onSelectAgendaEntry,
  variant = 'desktop',
  onCloseMobile
}) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'articles' | 'tutorials' | 'agenda'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut Ctrl+K / Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const cleanQuery = query.trim().toLowerCase();

  // Search Results
  const matchedArticles = cleanQuery
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(cleanQuery) ||
          a.excerpt.toLowerCase().includes(cleanQuery) ||
          a.category.toLowerCase().includes(cleanQuery) ||
          a.content.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedTutorials = cleanQuery
    ? TUTORIALS_DATA.filter(
        (tut) =>
          tut.title.toLowerCase().includes(cleanQuery) ||
          tut.summary.toLowerCase().includes(cleanQuery) ||
          tut.topic.toLowerCase().includes(cleanQuery) ||
          tut.keyTakeaways.some((k) => k.toLowerCase().includes(cleanQuery))
      )
    : [];

  const matchedAgenda = cleanQuery
    ? agendaEntries.filter(
        (ag) =>
          ag.date.toLowerCase().includes(cleanQuery) ||
          ag.dateFormatted.toLowerCase().includes(cleanQuery) ||
          ag.daySummary.toLowerCase().includes(cleanQuery) ||
          (ag.gospelReflection && ag.gospelReflection.toLowerCase().includes(cleanQuery)) ||
          ag.routineTasks.some((t) => t.title.toLowerCase().includes(cleanQuery)) ||
          ag.activitiesPerformed.some((act) => act.toLowerCase().includes(cleanQuery)) ||
          ag.techSkillsPracticed.some((s) => s.toLowerCase().includes(cleanQuery))
      )
    : [];

  const totalResults = matchedArticles.length + matchedTutorials.length + matchedAgenda.length;

  // Flattened results for keyboard navigation
  const visibleResults: Array<{
    type: 'articles' | 'tutorials' | 'agenda';
    id: string;
    title: string;
    subtitle: string;
    category: string;
  }> = [];

  if (activeFilter === 'all' || activeFilter === 'articles') {
    matchedArticles.forEach((a) => {
      visibleResults.push({
        type: 'articles',
        id: a.id,
        title: a.title,
        subtitle: a.excerpt,
        category: a.category
      });
    });
  }

  if (activeFilter === 'all' || activeFilter === 'tutorials') {
    matchedTutorials.forEach((tut) => {
      visibleResults.push({
        type: 'tutorials',
        id: tut.id,
        title: tut.title,
        subtitle: tut.summary,
        category: tut.topic
      });
    });
  }

  if (activeFilter === 'all' || activeFilter === 'agenda') {
    matchedAgenda.forEach((ag) => {
      visibleResults.push({
        type: 'agenda',
        id: ag.id,
        title: ag.dateFormatted,
        subtitle: ag.daySummary,
        category: ag.mood
      });
    });
  }

  const handleSelectResult = (type: 'articles' | 'tutorials' | 'agenda', targetId?: string, title?: string) => {
    onSelectTab(type);
    if (type === 'articles' && title && onSelectArticleTitle) {
      onSelectArticleTitle(title);
    } else if (type === 'tutorials' && targetId && onSelectTutorial) {
      onSelectTutorial(targetId);
    } else if (type === 'agenda' && targetId && onSelectAgendaEntry) {
      onSelectAgendaEntry(targetId);
    }

    setIsOpen(false);
    setQuery('');
    if (onCloseMobile) onCloseMobile();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || visibleResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % visibleResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + visibleResults.length) % visibleResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = visibleResults[selectedIndex];
      if (target) {
        handleSelectResult(target.type, target.id, target.title);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t('search_placeholder')}
          className={`w-full pl-8 pr-10 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-750 dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-transparent focus:border-emerald-500 transition-all outline-hidden ${
            variant === 'desktop' ? 'shadow-inner' : ''
          }`}
        />
        <div className="absolute right-2 top-2 flex items-center gap-1">
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            variant === 'desktop' && (
              <kbd className="inline-flex items-center gap-0.5 px-1 py-0.2 text-[9px] font-mono text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            )
          )}
        </div>
      </div>

      {/* Popover Dropdown Results */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 max-w-sm sm:max-w-md w-full">
          {/* Header & Filter Tabs */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-[11px] overflow-x-auto no-scrollbar">
              <span className="font-bold text-slate-400 shrink-0">Filter:</span>
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                  activeFilter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                All ({totalResults})
              </button>
              <button
                onClick={() => setActiveFilter('articles')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                  activeFilter === 'articles'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Articles ({matchedArticles.length})
              </button>
              <button
                onClick={() => setActiveFilter('tutorials')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                  activeFilter === 'tutorials'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Tutorials ({matchedTutorials.length})
              </button>
              <button
                onClick={() => setActiveFilter('agenda')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                  activeFilter === 'agenda'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Agenda ({matchedAgenda.length})
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-72 overflow-y-auto p-2 space-y-1">
            {!cleanQuery ? (
              <div className="p-4 text-center text-slate-400 space-y-1">
                <Sparkles className="w-4 h-4 mx-auto text-emerald-500 opacity-80" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Global Search Across Portfolio
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Search across Articles, Tutorials, and Daily Agenda entries
                </p>
              </div>
            ) : totalResults === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">
                No matching results found for &ldquo;{query}&rdquo;.
              </div>
            ) : (
              visibleResults.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                const Icon =
                  item.type === 'articles'
                    ? FileText
                    : item.type === 'tutorials'
                    ? Video
                    : Calendar;

                const badgeColor =
                  item.type === 'articles'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : item.type === 'tutorials'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';

                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelectResult(item.type, item.id, item.title)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer group ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 ring-1 ring-emerald-500'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${badgeColor}`}>
                          {item.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 truncate">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
