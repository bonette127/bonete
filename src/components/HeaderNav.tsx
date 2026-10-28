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
  GraduationCap,
  Languages,
  User,
  MessageSquare,
  FileDown
} from 'lucide-react';
import { Theme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { PrintingOverlay } from './PrintingOverlay';
import { GlobalSearch } from './GlobalSearch';
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
  const { language, t, toggleLanguage } = useLanguage();

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


  // Primary Navigation Links for the Side Menu
  const navLinks = [
    { id: 'about', label: t('nav_about'), icon: User, badge: 'L5 SOD' },
    { id: 'transcripts', label: t('nav_transcripts'), icon: GraduationCap, badge: 'NESA' },
    { id: 'achievements', label: t('nav_achievements'), icon: Award },
    { id: 'agenda', label: t('nav_agenda'), icon: Calendar, badge: agendaEntries.length ? `${agendaEntries.length}` : undefined },
    { id: 'tutorials', label: t('nav_tutorials'), icon: Video, badge: `${TUTORIALS_DATA.length}` },
    { id: 'articles', label: t('nav_articles'), icon: FileText, badge: articles.length ? `${articles.length}` : undefined },
    { id: 'photos', label: t('nav_photos'), icon: Camera },
    { id: 'gospel', label: t('nav_gospel'), icon: Music },
    { id: 'family-chat', label: t('nav_family_chat'), icon: Users },
    { id: 'messages', label: t('nav_guestbook'), icon: MessageSquare },
  ];

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
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <GlobalSearch
            articles={articles}
            agendaEntries={agendaEntries}
            onSelectTab={onSelectTab}
            onSelectArticleTitle={onSelectArticleTitle}
            onSelectTutorial={onSelectTutorial}
            onSelectAgendaEntry={onSelectAgendaEntry}
            variant="desktop"
          />
        </div>

        {/* Primary Action Button: Print CV / Export PDF */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={handlePrintCV}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm hover:shadow transition-all cursor-pointer group"
            title="Export or Print formatted CV as PDF"
          >
            <Printer className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
            <span>{t('print_cv')}</span>
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

        {/* Sidebar Footer Controls: Theme, Language, Portal, and Message */}
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
                  <span className="truncate">{t('admin_suite')}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="truncate">{t('portal_login')}</span>
                </>
              )}
            </button>

            {/* Language Switcher (EN / RW) */}
            <button
              onClick={toggleLanguage}
              className="px-2 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0 flex items-center gap-1"
              aria-label={`Switch language to ${language === 'en' ? 'Kinyarwanda' : 'English'}`}
              title={`Switch language: Currently ${language === 'en' ? 'English (EN)' : 'Kinyarwanda (RW)'}`}
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono text-[11px] font-bold">{language === 'en' ? 'RW' : 'EN'}</span>
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
            {t('leave_message')}
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

          {/* Mobile Controls: Print CV, Language, Theme, Menu Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile Print CV Button */}
            <button
              onClick={handlePrintCV}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer"
              title="Print CV / Export PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'rw' ? 'Gucapa' : 'Print CV'}</span>
            </button>

            {/* Mobile Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
              title={`Switch language: Currently ${language === 'en' ? 'English (EN)' : 'Kinyarwanda (RW)'}`}
              aria-label="Toggle Language"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono text-[11px]">{language === 'en' ? 'RW' : 'EN'}</span>
            </button>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
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

              {/* Mobile Drawer Global Search Input */}
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <GlobalSearch
                  articles={articles}
                  agendaEntries={agendaEntries}
                  onSelectTab={onSelectTab}
                  onSelectArticleTitle={onSelectArticleTitle}
                  onSelectTutorial={onSelectTutorial}
                  onSelectAgendaEntry={onSelectAgendaEntry}
                  variant="mobile"
                  onCloseMobile={() => setIsMobileMenuOpen(false)}
                />
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
                  <span>{t('print_cv')}</span>
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
                {/* Language Switcher in Drawer */}
                <button
                  onClick={toggleLanguage}
                  className="w-full py-2 text-xs font-bold text-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{language === 'en' ? 'Hindura Ururimi: Kinyarwanda' : 'Switch Language: English'}</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAdmin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-bold text-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isAdminLoggedIn ? t('admin_suite') : t('portal_login')}</span>
                </button>

                <button
                  onClick={() => {
                    onOpenMessageModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-bold text-center text-white bg-slate-900 dark:bg-emerald-600 rounded-xl"
                >
                  {t('leave_message')}
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
          <span className="font-bold tracking-wide">{language === 'rw' ? 'Gucapa CV' : 'Print CV'}</span>
        </button>
      </div>

      {/* =========================================================================
          5. SUBTLE 'PRINTING...' OVERLAY (Active during Print Dialog preparation)
          ========================================================================= */}
      <PrintingOverlay isPrinting={isPrinting} onDismiss={() => setIsPrinting(false)} />
    </>
  );
};
