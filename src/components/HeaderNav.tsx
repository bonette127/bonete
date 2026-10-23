import React, { useState, useEffect, useRef } from 'react';
import {
  Printer,
  Search,
  X,
  Sun,
  Moon,
  ShieldCheck,
  Lock,
  Calendar,
  Cake,
  BookOpen,
  Video,
  FileText,
  Clock,
  Menu,
  ChevronRight,
  Sparkles,
  Command,
  Users,
  Award,
  Music,
  Camera,
  Database,
  User,
  MessageSquare,
  FileDown
} from 'lucide-react';
import { Theme } from '../hooks/useTheme';
import {
  getBirthdayInfo,
  StoryArticle,
  TutorialItem,
  AgendaEntry,
  TUTORIALS_DATA
} from '../data/portfolioData';

export interface HeaderNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMessageModal: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  onOpenAgendaLogger?: () => void;
  articles?: StoryArticle[];
  agendaEntries?: AgendaEntry[];
  onSelectArticleTitle?: (title: string) => void;
  onSelectTutorial?: (tutorialId: string) => void;
  onSelectAgendaEntry?: (agendaId: string) => void;
  onPrintCV?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMessageModal,
  theme,
  onToggleTheme,
  isAdminLoggedIn,
  onOpenAdmin,
  onOpenAgendaLogger,
  articles = [],
  agendaEntries = [],
  onSelectArticleTitle,
  onSelectTutorial,
  onSelectAgendaEntry,
  onPrintCV
}) => {
  const isDark = theme === 'dark';
  const birthdayInfo = getBirthdayInfo(new Date());

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'articles' | 'tutorials' | 'agenda'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Mobile Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Printing State for subtle overlay
  const [isPrinting, setIsPrinting] = useState(false);

  // Listen for browser print events (e.g. Cmd+P, browser menu, or window.print())
  useEffect(() => {
    const handleBeforePrint = () => {
      setIsPrinting(true);
    };
    const handleAfterPrint = () => {
      setIsPrinting(false);
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Safety timer to clear overlay if print dialog finishes without afterprint event
  useEffect(() => {
    if (isPrinting) {
      const timer = setTimeout(() => {
        setIsPrinting(false);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [isPrinting]);

  // Print CV Action
  const handlePrintCV = () => {
    setIsPrinting(true);
    // Slight tick to render the subtle overlay before the print dialog opens
    setTimeout(() => {
      if (onPrintCV) {
        onPrintCV();
      } else {
        window.print();
      }
    }, 80);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K to open search & Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
          mobileSearchInputRef.current?.focus();
        }, 50);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  // Primary Navigation Links for the Side Menu
  const navLinks = [
    { id: 'about', label: 'About & Roots', icon: User, badge: 'L5 SOD' },
    { id: 'achievements', label: 'Milestones & Badges', icon: Award },
    { id: 'agenda', label: 'Daily Agenda', icon: Calendar, badge: agendaEntries.length ? `${agendaEntries.length}` : undefined },
    { id: 'tutorials', label: 'Tutorials', icon: Video, badge: `${TUTORIALS_DATA.length}` },
    { id: 'articles', label: 'Articles & Stories', icon: FileText, badge: articles.length ? `${articles.length}` : undefined },
    { id: 'photos', label: 'Moments Gallery', icon: Camera },
    { id: 'gospel', label: 'Gospel Sanctuary', icon: Music },
    { id: 'family-chat', label: 'Family Chat', icon: Users },
    { id: 'messages', label: 'Guestbook', icon: MessageSquare },
    { id: 'database', label: 'Database Studio', icon: Database }
  ];

  // Search filtering logic across Articles, Tutorials, and Agenda Entries
  const cleanQuery = searchQuery.trim().toLowerCase();

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
        (t) =>
          t.title.toLowerCase().includes(cleanQuery) ||
          t.summary.toLowerCase().includes(cleanQuery) ||
          t.topic.toLowerCase().includes(cleanQuery) ||
          t.keyTakeaways.some((k) => k.toLowerCase().includes(cleanQuery))
      )
    : [];

  const matchedAgenda = cleanQuery
    ? agendaEntries.filter(
        (entry) =>
          entry.date.toLowerCase().includes(cleanQuery) ||
          entry.dateFormatted.toLowerCase().includes(cleanQuery) ||
          entry.daySummary.toLowerCase().includes(cleanQuery) ||
          (entry.gospelReflection && entry.gospelReflection.toLowerCase().includes(cleanQuery)) ||
          entry.routineTasks.some(
            (task) =>
              task.title.toLowerCase().includes(cleanQuery) ||
              task.category.toLowerCase().includes(cleanQuery)
          ) ||
          entry.activitiesPerformed.some((act) => act.toLowerCase().includes(cleanQuery)) ||
          entry.techSkillsPracticed.some((skill) => skill.toLowerCase().includes(cleanQuery))
      )
    : [];

  const totalResults = matchedArticles.length + matchedTutorials.length + matchedAgenda.length;

  const handleSearchResultClick = (type: 'articles' | 'tutorials' | 'agenda', targetId?: string, title?: string) => {
    onSelectTab(type);
    if (type === 'articles' && title && onSelectArticleTitle) {
      onSelectArticleTitle(title);
    } else if (type === 'tutorials' && targetId && onSelectTutorial) {
      onSelectTutorial(targetId);
    } else if (type === 'agenda' && targetId && onSelectAgendaEntry) {
      onSelectAgendaEntry(targetId);
    }
    setIsSearchOpen(false);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  };

  // Reusable search dropdown list component
  const renderSearchResults = () => (
    <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 max-w-sm sm:max-w-md w-full">
      {/* Search Header & Filter Tabs */}
      <div className="p-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">Filter:</span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
              activeFilter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All ({totalResults})
          </button>
          <button
            onClick={() => setActiveFilter('articles')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
              activeFilter === 'articles'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Articles ({matchedArticles.length})
          </button>
          <button
            onClick={() => setActiveFilter('tutorials')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
              activeFilter === 'tutorials'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Tutorials ({matchedTutorials.length})
          </button>
          <button
            onClick={() => setActiveFilter('agenda')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
              activeFilter === 'agenda'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Agenda ({matchedAgenda.length})
          </button>
        </div>

        <button
          onClick={() => setIsSearchOpen(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer shrink-0"
          title="Close Search (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Results List */}
      <div className="max-h-72 overflow-y-auto p-2 space-y-1">
        {!cleanQuery ? (
          <div className="p-4 text-center text-slate-400 space-y-1.5">
            <Sparkles className="w-5 h-5 mx-auto text-emerald-500 opacity-80" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Instant Search Across Portfolio
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Type &ldquo;React&rdquo;, &ldquo;Muhura&rdquo;, &ldquo;Coding&rdquo;, &ldquo;Prayer&rdquo;, or &ldquo;Agenda&rdquo;
            </p>
          </div>
        ) : totalResults === 0 ? (
          <div className="p-4 text-center text-slate-400 text-xs">
            No matching articles, tutorials, or agenda entries found for &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          <>
            {/* Articles */}
            {(activeFilter === 'all' || activeFilter === 'articles') && matchedArticles.length > 0 && (
              <div className="space-y-1">
                <p className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Articles ({matchedArticles.length})
                </p>
                {matchedArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSearchResultClick('articles', article.id, article.title)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-start gap-2 group cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600">
                          {article.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{article.readTime}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {article.excerpt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Tutorials */}
            {(activeFilter === 'all' || activeFilter === 'tutorials') && matchedTutorials.length > 0 && (
              <div className="space-y-1 pt-1">
                <p className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tutorials ({matchedTutorials.length})
                </p>
                {matchedTutorials.map((tut) => (
                  <button
                    key={tut.id}
                    onClick={() => handleSearchResultClick('tutorials', tut.id)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-start gap-2 group cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600">
                          {tut.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{tut.duration}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {tut.summary}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Agenda */}
            {(activeFilter === 'all' || activeFilter === 'agenda') && matchedAgenda.length > 0 && (
              <div className="space-y-1 pt-1">
                <p className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Agenda Logs ({matchedAgenda.length})
                </p>
                {matchedAgenda.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => handleSearchResultClick('agenda', entry.id)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-start gap-2 group cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600">
                          {entry.dateFormatted || entry.date}
                        </h4>
                        <span className="text-[10px] text-slate-500 shrink-0">{entry.mood}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {entry.daySummary}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* =========================================================================
          1. DESKTOP PERMANENT SIDEBAR NAVIGATION (Visible on lg and larger screens)
          ========================================================================= */}
      <aside className="no-print hidden lg:flex fixed inset-y-0 left-0 w-64 xl:w-72 flex-col z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 shadow-xs select-none">
        {/* Brand / Identity Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => onSelectTab('about')}
            className="w-full text-left flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative shrink-0">
              <img
                src="/src/assets/images/bonette_personal_showcase_1792395117843.jpg"
                alt="IBYOYAKOZE Bonette"
                className="w-10 h-10 rounded-full object-cover object-top ring-2 ring-emerald-600 dark:ring-emerald-500 shadow-xs group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                IBYOYAKOZE Bonette
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                Level 5 Software Eng.
              </div>
            </div>
          </button>

          {/* Birthday Week Notice if active */}
          {birthdayInfo.isBirthdayWeek && (
            <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
              <Cake className="w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" />
              <span>Oct 15: Turning {birthdayInfo.turningAge}!</span>
            </div>
          )}
        </div>

        {/* Global Search Bar (Side layout) */}
        <div ref={searchContainerRef} className="p-3 border-b border-slate-100 dark:border-slate-800 relative">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              placeholder="Search portfolio..."
              className="w-full pl-8 pr-12 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-750 dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-transparent focus:border-emerald-500 transition-all outline-hidden shadow-inner"
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <kbd className="inline-flex items-center gap-0.5 px-1 py-0.2 text-[9px] font-mono text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              )}
            </div>
          </div>

          {/* Search Dropdown Results Popover */}
          {isSearchOpen && renderSearchResults()}
        </div>

        {/* Primary Action Button: Print CV / Export PDF */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={handlePrintCV}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm hover:shadow transition-all cursor-pointer group"
            title="Export or Print formatted CV as PDF"
          >
            <Printer className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
            <span>Print CV / PDF Export</span>
          </button>
        </div>

        {/* Navigation Section Title & Menu Links */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 no-scrollbar">
          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Portfolio Navigation
          </p>
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span className="truncate">{link.label}</span>
                </div>
                {link.badge ? (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {link.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Controls: Theme, Portal, and Message */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
          <div className="flex items-center gap-1.5">
            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
              title={isAdminLoggedIn ? 'Open Admin Management Suite' : 'Admin & Member Portal Sign-in'}
            >
              {isAdminLoggedIn ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate">Admin Suite</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="truncate">Portal Login</span>
                </>
              )}
            </button>

            {/* Dark/Light Mode Switcher */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:text-slate-900" />
              )}
            </button>
          </div>

          {/* Quick Guestbook Message */}
          <button
            onClick={onOpenMessageModal}
            className="w-full py-1.5 text-xs font-semibold text-center text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Leave a Message
          </button>
        </div>
      </aside>

      {/* =========================================================================
          2. MOBILE & TABLET TOP HEADER BAR (Visible below lg screens)
          ========================================================================= */}
      <header className="no-print lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          {/* Mobile Profile Wordmark */}
          <button
            onClick={() => onSelectTab('about')}
            className="flex items-center gap-2 text-left group cursor-pointer min-w-0"
          >
            <img
              src="/src/assets/images/bonette_personal_showcase_1792395117843.jpg"
              alt="IBYOYAKOZE Bonette"
              className="w-8 h-8 rounded-full object-cover object-top ring-1 ring-emerald-600 shrink-0"
            />
            <div className="min-w-0 truncate">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate block">
                Bonette
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5">
                L5 SOD Engineer
              </span>
            </div>
          </button>

          {/* Mobile Controls: Print CV, Theme, Menu Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile Print CV Button */}
            <button
              onClick={handlePrintCV}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer"
              title="Print CV / Export PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print CV</span>
            </button>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(true);
                setTimeout(() => mobileSearchInputRef.current?.focus(), 150);
              }}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Search"
              title="Search portfolio"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Theme Switcher */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* =========================================================================
            3. MOBILE SLIDING SIDE DRAWER
            ========================================================================= */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop overlay */}
            <div
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            />

            {/* Side Menu Drawer Panel */}
            <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/src/assets/images/bonette_personal_showcase_1792395117843.jpg"
                    alt="IBYOYAKOZE Bonette"
                    className="w-9 h-9 rounded-full object-cover object-top ring-2 ring-emerald-500"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">IBYOYAKOZE Bonette</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Level 5 Software Development</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Drawer Search Input */}
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 relative">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    ref={mobileSearchInputRef}
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchOpen(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    placeholder="Search articles, agenda, tutorials..."
                    className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-transparent focus:border-emerald-500 outline-hidden"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {isSearchOpen && renderSearchResults()}
              </div>

              {/* Mobile Print CV Button in Drawer */}
              <div className="p-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => handlePrintCV(), 200);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print CV / Export PDF</span>
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 no-scrollbar">
                {navLinks.map((link) => {
                  const isActive = activeTab === link.id;
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        onSelectTab(link.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-bold text-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isAdminLoggedIn ? 'Open Admin Suite' : 'Portal Sign-in'}</span>
                </button>

                <button
                  onClick={() => {
                    onOpenMessageModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-bold text-center text-white bg-slate-900 dark:bg-emerald-600 rounded-xl"
                >
                  Send Guestbook Message
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          4. FLOATING 'PRINT CV' ACTION BUTTON (Visible on all screen sizes)
          ========================================================================= */}
      <div className="no-print fixed bottom-6 right-6 z-40">
        <button
          onClick={handlePrintCV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-xl hover:shadow-2xl transition-all duration-200 font-semibold text-xs border border-slate-700/60 dark:border-emerald-500/50 cursor-pointer group hover:scale-105 active:scale-95"
          title="Print formatted CV / Export as PDF for offline viewing"
          aria-label="Print CV or export portfolio as PDF"
        >
          <Printer className="w-4 h-4 text-emerald-400 group-hover:text-white dark:text-white transition-colors" />
          <span className="font-bold tracking-wide">Print CV</span>
        </button>
      </div>

      {/* =========================================================================
          5. SUBTLE 'PRINTING...' OVERLAY (Active during Print Dialog preparation)
          ========================================================================= */}
      {isPrinting && (
        <div
          role="status"
          aria-live="polite"
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
              <Printer className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                <span>Printing Document...</span>
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The browser print dialog is active. You can save as a PDF document or select a printer.
              </p>
            </div>

            <button
              onClick={() => setIsPrinting(false)}
              className="px-3 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
};
