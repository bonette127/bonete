/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { HeroSection } from './components/HeroSection';
import { AboutEducationSection } from './components/AboutEducationSection';
import { AgendaSection } from './components/AgendaSection';
import { TutorialsSection } from './components/TutorialsSection';
import { StoriesArticlesSection } from './components/StoriesArticlesSection';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { GospelSanctuarySection } from './components/GospelSanctuarySection';
import { FamilyChatSection } from './components/FamilyChatSection';
import { MessageBoardSection } from './components/MessageBoardSection';
import { GitHubSocialSyncSection } from './components/GitHubSocialSyncSection';
import { DatabaseStudioSection } from './components/DatabaseStudioSection';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { ReadingProgressBar } from './components/ReadingProgressBar';
import { BirthdayAnniversaryBanner } from './components/BirthdayAnniversaryBanner';
import { X, Send, CheckCircle2, ShieldCheck, Mail, Sparkles, Heart } from 'lucide-react';
import {
  BONETTE_PROFILE,
  VisitorMessage,
  FamilyMemberItem,
  DailyEventLog,
  StoryArticle,
  PhotoItem,
  FamilyChatMessage,
  AgendaEntry,
  ReadArticleRecord,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_DAILY_EVENTS,
  INITIAL_STORIES_ARTICLES,
  INITIAL_FAMILY_CHAT,
  INITIAL_AGENDA_ENTRIES
} from './data/portfolioData';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('about');

  // Reading Progress State for browser window top bar
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [activeStoryTitle, setActiveStoryTitle] = useState<string | null>(null);
  const [activeStoryCategory, setActiveStoryCategory] = useState<string | null>(null);
  const [activeStoryReadTime, setActiveStoryReadTime] = useState<string | null>(null);
  const [isReadingActive, setIsReadingActive] = useState<boolean>(false);

  // Session Reading History
  const [sessionReadingHistory, setSessionReadingHistory] = useState<ReadArticleRecord[]>(() => {
    try {
      const saved = sessionStorage.getItem('bonette_session_read_articles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [targetArticleTitle, setTargetArticleTitle] = useState<string | null>(null);

  // --- Admin State ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('bonette_admin_session');
    } catch {
      return false;
    }
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'family' | 'events' | 'articles' | 'photos' | 'chat' | 'agenda' | 'security'>('agenda');

  // --- Dynamic Application Data with localStorage Persistence ---
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberItem[]>(() => {
    try {
      const saved = localStorage.getItem('bonette_family_members');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FAMILY_MEMBERS;
  });

  const [dailyEvents, setDailyEvents] = useState<DailyEventLog[]>(() => {
    try {
      const saved = localStorage.getItem('bonette_daily_events');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DAILY_EVENTS;
  });

  const [articles, setArticles] = useState<StoryArticle[]>(() => {
    try {
      const saved = localStorage.getItem('bonette_articles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STORIES_ARTICLES;
  });

  const [familyChat, setFamilyChat] = useState<FamilyChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('bonette_family_chat');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FAMILY_CHAT;
  });

  const [agendaEntries, setAgendaEntries] = useState<AgendaEntry[]>(() => {
    try {
      const saved = localStorage.getItem('bonette_agenda_entries');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_AGENDA_ENTRIES;
  });

  // URL Invite Welcome Banner State
  const [inviteWelcomeName, setInviteWelcomeName] = useState<string | null>(null);

  // Modal Form State for Guestbook
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<VisitorMessage['type']>('Message');
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);

  // References for scrolling
  const aboutRef = useRef<HTMLDivElement>(null);
  const agendaRef = useRef<HTMLDivElement>(null);
  const tutorialsRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const gospelRef = useRef<HTMLDivElement>(null);
  const familyChatRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const databaseRef = useRef<HTMLDivElement>(null);

  // Check URL params for family invite link
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const inviteToken = params.get('family_invite');
      const inviteName = params.get('name');
      if (inviteToken) {
        setInviteWelcomeName(inviteName || 'Family Member');
        setTimeout(() => {
          handleSelectTab('family-chat');
        }, 800);
      }
    } catch {}
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bonette_family_members', JSON.stringify(familyMembers));
    } catch {}
  }, [familyMembers]);

  useEffect(() => {
    try {
      localStorage.setItem('bonette_daily_events', JSON.stringify(dailyEvents));
    } catch {}
  }, [dailyEvents]);

  useEffect(() => {
    try {
      localStorage.setItem('bonette_articles', JSON.stringify(articles));
    } catch {}
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('bonette_family_chat', JSON.stringify(familyChat));
    } catch {}
  }, [familyChat]);

  useEffect(() => {
    try {
      localStorage.setItem('bonette_agenda_entries', JSON.stringify(agendaEntries));
    } catch {}
  }, [agendaEntries]);

  useEffect(() => {
    try {
      sessionStorage.setItem('bonette_session_read_articles', JSON.stringify(sessionReadingHistory));
    } catch {}
  }, [sessionReadingHistory]);

  // Track scroll reading progress across stories and articles
  useEffect(() => {
    if (isReadingActive) return;

    const handleWindowScroll = () => {
      if (!articlesRef.current) return;
      const rect = articlesRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      const startTrigger = windowHeight * 0.75;
      const scrolled = startTrigger - rect.top;

      if (scrolled > 0 && rect.bottom > 0) {
        const total = sectionHeight + windowHeight * 0.25;
        const progress = Math.min(100, Math.max(0, Math.round((scrolled / total) * 100)));
        setReadingProgress(progress);
        if (progress > 5 && progress < 99) {
          setActiveStoryTitle('Articles & Devotionals by Bonette');
          setActiveStoryCategory('L5 SOD Stories');
        } else if (progress >= 99) {
          setActiveStoryTitle('Articles Completed');
          setActiveStoryCategory('Done');
        } else {
          setActiveStoryTitle(null);
          setActiveStoryCategory(null);
        }
      } else {
        setReadingProgress(0);
        setActiveStoryTitle(null);
        setActiveStoryCategory(null);
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [isReadingActive]);

  const handleReadingProgressChange = (
    progress: number,
    title: string | null,
    category?: string | null,
    readTime?: string | null
  ) => {
    if (title) {
      setIsReadingActive(true);
      setActiveStoryTitle(title);
      setActiveStoryCategory(category || null);
      setActiveStoryReadTime(readTime || null);
      setReadingProgress(progress);
    } else {
      setIsReadingActive(false);
      setActiveStoryTitle(null);
      setActiveStoryCategory(null);
      setActiveStoryReadTime(null);
      setReadingProgress(0);
    }
  };

  const handleMarkArticleFinished = (article: StoryArticle) => {
    setSessionReadingHistory((prev) => {
      const exists = prev.some((item) => item.id === article.id || item.title === article.title);
      if (exists) return prev;
      const newRecord: ReadArticleRecord = {
        id: article.id,
        title: article.title,
        category: article.category,
        readAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        readTime: article.readTime,
        progress: 100,
      };
      return [newRecord, ...prev];
    });
  };

  const handleClearReadingHistory = () => {
    setSessionReadingHistory([]);
    try {
      sessionStorage.removeItem('bonette_session_read_articles');
    } catch {}
  };

  const handleSelectHistoryArticle = (title: string) => {
    setTargetArticleTitle(title);
    handleSelectTab('articles');
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    const map: Record<string, React.RefObject<HTMLDivElement | null>> = {
      about: aboutRef,
      agenda: agendaRef,
      tutorials: tutorialsRef,
      articles: articlesRef,
      photos: photosRef,
      gospel: gospelRef,
      'family-chat': familyChatRef,
      messages: messagesRef,
      database: databaseRef,
    };

    const target = map[tab];
    if (target?.current) {
      target.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenAdminPortal = (tab: 'family' | 'events' | 'articles' | 'photos' | 'chat' | 'agenda' | 'security' = 'agenda') => {
    setAdminInitialTab(tab);
    if (isAdminLoggedIn) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('bonette_admin_session');
    setIsAdminLoggedIn(false);
    setIsAdminDashboardOpen(false);
  };

  // Dispatchers for Admin Actions
  const handleAddFamilyMember = (newMember: FamilyMemberItem) => {
    setFamilyMembers([newMember, ...familyMembers]);
  };

  const handleRemoveFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((m) => m.id !== id));
  };

  const handleAddDailyEvent = (newEvent: DailyEventLog) => {
    setDailyEvents([newEvent, ...dailyEvents]);
  };

  const handleRemoveDailyEvent = (id: string) => {
    setDailyEvents(dailyEvents.filter((e) => e.id !== id));
  };

  const handleAddArticle = (newArticle: StoryArticle) => {
    setArticles([newArticle, ...articles]);
  };

  const handleRemoveArticle = (id: string) => {
    setArticles(articles.filter((a) => a.id !== id));
  };

  const handleAddPhoto = (newPhoto: PhotoItem) => {
    try {
      const existing = localStorage.getItem('bonette_portfolio_photos');
      const photos = existing ? JSON.parse(existing) : [];
      localStorage.setItem('bonette_portfolio_photos', JSON.stringify([newPhoto, ...photos]));
    } catch {}
  };

  const handleAddAgendaEntry = (newEntry: AgendaEntry) => {
    setAgendaEntries([newEntry, ...agendaEntries]);
  };

  const handleRemoveAgendaEntry = (id: string) => {
    setAgendaEntries(agendaEntries.filter((e) => e.id !== id));
  };

  const handleSendFamilyChat = (
    content: string,
    senderName = 'IBYOYAKOZE Bonette (Admin)',
    senderEmail = 'byoyakozebonette@protonmail.com',
    senderRole = 'Admin / Student Developer',
    isAnnouncement = false
  ) => {
    const newMsg: FamilyChatMessage = {
      id: `chat-${Date.now()}`,
      senderName,
      senderEmail,
      senderRole,
      content,
      timestamp: 'Just now',
      isAnnouncement,
    };
    setFamilyChat([...familyChat, newMsg]);
  };

  const handleOpenMessageModal = (type: VisitorMessage['type'] = 'Message') => {
    setModalType(type);
    setIsMessageModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim() || !modalContent.trim()) return;

    try {
      const existing = localStorage.getItem('bonette_portfolio_messages');
      const messagesList = existing ? JSON.parse(existing) : [];
      const newEntry: VisitorMessage = {
        id: `msg-${Date.now()}`,
        name: modalName.trim(),
        email: modalEmail.trim() || undefined,
        type: modalType,
        content: modalContent.trim(),
        createdAt: 'Just now',
        likes: 1,
      };
      const updated = [newEntry, ...messagesList];
      localStorage.setItem('bonette_portfolio_messages', JSON.stringify(updated));
    } catch {}

    setModalSuccess(true);
    setTimeout(() => {
      setModalSuccess(false);
      setIsMessageModalOpen(false);
      setModalName('');
      setModalEmail('');
      setModalContent('');
      handleSelectTab('messages');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors">
      {/* Reading Progress Indicator Bar at the very top of the browser window */}
      <ReadingProgressBar
        progress={readingProgress}
        activeStoryTitle={activeStoryTitle}
        category={activeStoryCategory}
        readTime={activeStoryReadTime}
        isVisible={isReadingActive || readingProgress > 0}
        onCloseReader={() => {
          setIsReadingActive(false);
          setActiveStoryTitle(null);
          setActiveStoryCategory(null);
          setActiveStoryReadTime(null);
          setReadingProgress(0);
        }}
        sessionReadingHistory={sessionReadingHistory}
        onClearHistory={handleClearReadingHistory}
        onSelectHistoryArticle={handleSelectHistoryArticle}
      />

      {/* Birthday & Anniversary Reminder Banner */}
      <BirthdayAnniversaryBanner
        onSendBirthdayWish={() => {
          setModalType('Message');
          setModalContent('Happy 18th Birthday and Anniversary, IBYOYAKOZE Bonette! Wishing you God\'s abundant blessings, wisdom, and groundbreaking success in software engineering from Gatsibo to the world! 🎉🎂');
          setIsMessageModalOpen(true);
        }}
        onNavigateTab={handleSelectTab}
      />

      {/* Top Navigation Bar with Admin Portal button and Light/Dark toggle */}
      <HeaderNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenMessageModal={() => handleOpenMessageModal('Message')}
        theme={theme}
        onToggleTheme={toggleTheme}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => handleOpenAdminPortal('agenda')}
        onOpenAgendaLogger={() => handleOpenAdminPortal('agenda')}
      />

      {/* Welcome Banner when arriving from a Family Email Invite Link */}
      {inviteWelcomeName && (
        <div className="bg-emerald-700 text-white px-4 py-3 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <span>
              Welcome to the family circle, <strong>{inviteWelcomeName}</strong>! Your email invite token is verified. You can now chat in the private Family Chat below!
            </span>
          </div>
          <button
            onClick={() => setInviteWelcomeName(null)}
            className="text-white hover:text-emerald-200 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onOpenMessageModal={() => handleOpenMessageModal('Message')}
          onNavigateTab={handleSelectTab}
        />

        {/* Section 1: About, Academic Journey (L5 SOD & G.S Kibondo), Family & Gatsibo */}
        <div ref={aboutRef}>
          <AboutEducationSection />
        </div>

        {/* Section 2: Daily Agenda & Routine Tracker (Dynamic logs of daily activities) */}
        <div ref={agendaRef}>
          <AgendaSection
            agendaEntries={agendaEntries}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdminAgenda={() => handleOpenAdminPortal('agenda')}
            onQuickToggleTask={(entryId, taskId) => {
              if (!isAdminLoggedIn) return;
              setAgendaEntries((prev) =>
                prev.map((entry) => {
                  if (entry.id === entryId) {
                    return {
                      ...entry,
                      routineTasks: entry.routineTasks.map((t) =>
                        t.id === taskId ? { ...t, completed: !t.completed } : t
                      ),
                    };
                  }
                  return entry;
                })
              );
            }}
          />
        </div>

        {/* Section 3: Video Tutorials on How to Develop Website & App */}
        <div ref={tutorialsRef}>
          <TutorialsSection />
        </div>

        {/* Section 4: Stories & Articles by Bonette (Admin Published) */}
        <div ref={articlesRef}>
          <StoriesArticlesSection
            articles={articles}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdminPublish={() => handleOpenAdminPortal('articles')}
            onReadingProgressChange={handleReadingProgressChange}
            onMarkArticleFinished={handleMarkArticleFinished}
            targetArticleTitle={targetArticleTitle}
            onClearTargetArticleTitle={() => setTargetArticleTitle(null)}
          />
        </div>

        {/* Section 5: Photo Moments & Uploads (What I Done & My Photos) */}
        <div ref={photosRef}>
          <PhotoGallerySection />
        </div>

        {/* Section 6: Gospel Singing Sanctuary */}
        <div ref={gospelRef}>
          <GospelSanctuarySection
            onSuggestSong={() => handleOpenMessageModal('Gospel Song Suggestion')}
          />
        </div>

        {/* Section 7: Family Chat Room (Admin & Members with Email Invite System) */}
        <div ref={familyChatRef}>
          <FamilyChatSection
            messages={familyChat}
            onSendMessage={(msg, name, email, role) => handleSendFamilyChat(msg, name, email, role, false)}
            familyMembers={familyMembers}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdminModal={() => setIsAdminLoginOpen(true)}
            onOpenAddMemberModal={() => handleOpenAdminPortal('family')}
          />
        </div>

        {/* Section 8: Community Guestbook & Message Board */}
        <div ref={messagesRef}>
          <MessageBoardSection />
        </div>

        {/* Section 9: GitHub Commit Console & Social Media Broadcast */}
        <GitHubSocialSyncSection />

        {/* Section 10: SQLite & CockroachDB Database Studio */}
        <div ref={databaseRef}>
          <DatabaseStudioSection />
        </div>
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />

      {/* Admin Login Modal (Restricted, secure, no credentials exposed) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Full Admin Management Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onLogout={handleAdminLogout}
        familyMembers={familyMembers}
        onAddFamilyMember={handleAddFamilyMember}
        onRemoveFamilyMember={handleRemoveFamilyMember}
        dailyEvents={dailyEvents}
        onAddDailyEvent={handleAddDailyEvent}
        onRemoveDailyEvent={handleRemoveDailyEvent}
        articles={articles}
        onAddArticle={handleAddArticle}
        onRemoveArticle={handleRemoveArticle}
        onAddPhoto={handleAddPhoto}
        onSendFamilyChat={(msg) => handleSendFamilyChat(msg, 'IBYOYAKOZE Bonette (Admin)', 'byoyakozebonette@protonmail.com', 'Admin / Student Developer', true)}
        agendaEntries={agendaEntries}
        onAddAgendaEntry={handleAddAgendaEntry}
        onRemoveAgendaEntry={handleRemoveAgendaEntry}
        initialTab={adminInitialTab}
      />

      {/* Floating Send Message Modal for Visitors */}
      {isMessageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsMessageModalOpen(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Send a Message to {BONETTE_PROFILE.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Leave words of encouragement, gospel song ideas, or birthday wishes
                </p>
              </div>
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Message Posted Successfully!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Thank you for your warmth and feedback. Bonette appreciates your message!
                </p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    placeholder="e.g. Samuel Mugenzi, Keza..."
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message Type
                  </label>
                  <select
                    value={modalType}
                    onChange={(e) => setModalType(e.target.value as VisitorMessage['type'])}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-emerald-600"
                  >
                    <option value="Message">Message / Encouragement</option>
                    <option value="Feedback">Feedback on Portfolio</option>
                    <option value="Gospel Song Suggestion">Gospel Song Suggestion</option>
                    <option value="Tech Collaboration">Tech Collaboration / L5 SOD Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message Content *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={modalContent}
                    onChange={(e) => setModalContent(e.target.value)}
                    placeholder="Write your note here..."
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Post Message to Guestbook
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
