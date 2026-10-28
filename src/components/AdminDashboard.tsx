import React, { useState } from 'react';
import {
  Users,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  MessageCircle,
  Plus,
  Trash2,
  Mail,
  Send,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Heart,
  Clock,
  KeyRound,
  Lock,
  Cake,
  TrendingUp,
  Star,
  CheckSquare,
  Square,
  AlertCircle,
  Download,
  Upload,
  Database,
  FileJson,
  RefreshCw,
  HardDrive,
  BarChart3,
  BookmarkCheck,
  Activity,
  Key,
  GraduationCap
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  FamilyMemberItem,
  DailyEventLog,
  StoryArticle,
  PhotoItem,
  FamilyChatMessage,
  AgendaEntry,
  AgendaTaskItem,
  getBirthdayInfo,
  ReadArticleRecord,
  VisitorMessage,
  INITIAL_MESSAGES,
  QuarterlyReportItem,
  INITIAL_QUARTERLY_REPORTS
} from '../data/portfolioData';
import { DailyActivityLog } from './DailyActivityLog';
import { QuarterlyReportsManager } from './QuarterlyReportsManager';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  // State and Dispatchers
  familyMembers: FamilyMemberItem[];
  onAddFamilyMember: (member: FamilyMemberItem) => void;
  onRemoveFamilyMember: (id: string) => void;
  onUpdateFamilyMember?: (member: FamilyMemberItem) => void;
  dailyEvents: DailyEventLog[];
  onAddDailyEvent: (event: DailyEventLog) => void;
  onRemoveDailyEvent: (id: string) => void;
  articles: StoryArticle[];
  onAddArticle: (article: StoryArticle) => void;
  onRemoveArticle: (id: string) => void;
  onAddPhoto: (photo: PhotoItem) => void;
  familyChat?: FamilyChatMessage[];
  onSendFamilyChat: (msg: string, isAnnouncement?: boolean) => void;
  // Agenda State & Dispatchers
  agendaEntries: AgendaEntry[];
  onAddAgendaEntry: (entry: AgendaEntry) => void;
  onRemoveAgendaEntry: (id: string) => void;
  // Quarterly Reports
  quarterlyReports?: QuarterlyReportItem[];
  onAddQuarterlyReport?: (report: QuarterlyReportItem) => void;
  onRemoveQuarterlyReport?: (id: string) => void;
  initialTab?: 'daily-activity' | 'family' | 'events' | 'articles' | 'photos' | 'chat' | 'agenda' | 'security' | 'backup' | 'reading-history' | 'reading-analytics' | 'message-insights' | 'quarterly-reports';
  onRestorePortfolioBackup?: (backupData: any) => void;
  readingHistory?: ReadArticleRecord[];
  onClearReadingHistory?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onLogout,
  familyMembers,
  onAddFamilyMember,
  onRemoveFamilyMember,
  onUpdateFamilyMember,
  dailyEvents,
  onAddDailyEvent,
  onRemoveDailyEvent,
  articles,
  onAddArticle,
  onRemoveArticle,
  onAddPhoto,
  familyChat = [],
  onSendFamilyChat,
  agendaEntries,
  onAddAgendaEntry,
  onRemoveAgendaEntry,
  quarterlyReports: propQuarterlyReports,
  onAddQuarterlyReport,
  onRemoveQuarterlyReport,
  initialTab = 'daily-activity',
  onRestorePortfolioBackup,
  readingHistory = [],
  onClearReadingHistory
}) => {
  const [activeTab, setActiveTab] = useState<'daily-activity' | 'family' | 'events' | 'articles' | 'photos' | 'chat' | 'agenda' | 'security' | 'backup' | 'reading-history' | 'reading-analytics' | 'message-insights' | 'quarterly-reports'>(initialTab);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Local fallback state for Quarterly Reports
  const [internalReports, setInternalReports] = useState<QuarterlyReportItem[]>(() => {
    try {
      const saved = localStorage.getItem('bonette_quarterly_reports');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_QUARTERLY_REPORTS;
  });

  const reportsList = propQuarterlyReports || internalReports;

  const handleAddReportInternal = (newReport: QuarterlyReportItem) => {
    if (onAddQuarterlyReport) {
      onAddQuarterlyReport(newReport);
    }
    const updated = [newReport, ...reportsList];
    setInternalReports(updated);
    try {
      localStorage.setItem('bonette_quarterly_reports', JSON.stringify(updated));
    } catch {}
  };

  const handleRemoveReportInternal = (id: string) => {
    if (onRemoveQuarterlyReport) {
      onRemoveQuarterlyReport(id);
    }
    const updated = reportsList.filter((r) => r.id !== id);
    setInternalReports(updated);
    try {
      localStorage.setItem('bonette_quarterly_reports', JSON.stringify(updated));
    } catch {}
  };

  // --- Family Member Form State ---
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState<FamilyMemberItem['relationship']>('Brother');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [newMemberPasscode, setNewMemberPasscode] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [inviteModalData, setInviteModalData] = useState<{ member: FamilyMemberItem; link: string } | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [copiedPasscodeId, setCopiedPasscodeId] = useState<string | null>(null);

  // --- Daily Event Form State ---
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<DailyEventLog['category']>('L5 SOD Studies');
  const [eventSummary, setEventSummary] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [eventMood, setEventMood] = useState('Focused & Thankful');

  // --- Article Form State ---
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState<StoryArticle['category']>('Tech & Coding');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleReadTime, setArticleReadTime] = useState('4 min read');
  const [articleCover, setArticleCover] = useState('/src/assets/images/coding_classroom_lab_1791547598588.jpg');

  // --- Photo Form State ---
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<PhotoItem['category']>('Coding & School');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');

  // --- Chat Announcement State ---
  const [announcementText, setAnnouncementText] = useState('');

  // --- Agenda & Routine Logger State ---
  const [agendaDate, setAgendaDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [agendaMood, setAgendaMood] = useState<AgendaEntry['mood']>('Productive & Grateful');
  const [agendaRating, setAgendaRating] = useState<number>(5);
  const [agendaSummary, setAgendaSummary] = useState('');
  const [agendaActivities, setAgendaActivities] = useState<string[]>([
    'Attended Level 5 SOD programming lecture and hands-on laboratory.',
    'Practiced frontend component state and responsive styles.',
    'Gospel singing and vocal preparation for upcoming service.'
  ]);
  const [newActivityInput, setNewActivityInput] = useState('');

  const [agendaTasks, setAgendaTasks] = useState<AgendaTaskItem[]>([
    { id: 'task-1', title: 'Morning Prayer, Bible Reading & Gratitude', category: 'Gospel & Prayer', completed: true, timeEstimate: '30 mins' },
    { id: 'task-2', title: 'L5 SOD Classes at Lycée Saint Alexandre Sauli', category: 'School (L5 SOD)', completed: true, timeEstimate: '6 hours' },
    { id: 'task-3', title: 'Code Practice: Software Development & Algorithms', category: 'Coding & Tech', completed: true, timeEstimate: '2 hours' },
    { id: 'task-4', title: 'Gospel Singing Practice & Devotion', category: 'Gospel & Prayer', completed: true, timeEstimate: '45 mins' },
    { id: 'task-5', title: 'Household Chores & Evening Family Time', category: 'Family & Chores', completed: true, timeEstimate: '1 hour' }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<AgendaTaskItem['category']>('Coding & Tech');

  const [agendaTechSkills, setAgendaTechSkills] = useState<string[]>(['React 19', 'TypeScript', 'Tailwind CSS', 'SQL']);
  const [newTechInput, setNewTechInput] = useState('');
  const [agendaGospelReflection, setAgendaGospelReflection] = useState('');
  const [agendaTomorrowsGoals, setAgendaTomorrowsGoals] = useState<string[]>(['Review algorithms for school exam', 'Add new tutorial draft']);
  const [newGoalInput, setNewGoalInput] = useState('');

  // --- Security / Password Management State ---
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [securityMessage, setSecurityMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // --- Backup & Export / Import State ---
  const [importSummary, setImportSummary] = useState<{
    agendaCount: number;
    familyCount: number;
    eventsCount: number;
    articlesCount: number;
    messagesCount: number;
    exportedAt?: string;
  } | null>(null);
  const [importedData, setImportedData] = useState<any | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const birthdayInfo = getBirthdayInfo(new Date());

  const showNotification = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  // 1. Submit Family Member
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    const token = `fam-invite-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const username = newMemberUsername.trim().toLowerCase() || newMemberName.trim().toLowerCase().replace(/\s+/g, '');
    const passcode = newMemberPasscode.trim() || `${newMemberName.trim().toLowerCase()}#2026`;

    const newMember: FamilyMemberItem = {
      id: `fam-${Date.now()}`,
      name: newMemberName.trim(),
      relationship: newMemberRelation,
      email: newMemberEmail.trim(),
      username,
      loginPasscode: passcode,
      phone: newMemberPhone.trim() || undefined,
      joinedAt: 'Just now',
      status: 'Active',
      avatar: newMemberName.trim().charAt(0).toUpperCase(),
      inviteToken: token,
    };

    onAddFamilyMember(newMember);

    const inviteLink = `${window.location.origin}${window.location.pathname}?family_invite=${token}&name=${encodeURIComponent(newMember.name)}`;
    setInviteModalData({ member: newMember, link: inviteLink });

    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberUsername('');
    setNewMemberPasscode('');
    setNewMemberPhone('');
    showNotification(`Added ${newMember.name} with passcode ${passcode}!`);
  };

  // 2. Submit Daily Event Log
  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventSummary.trim()) return;

    const newEvent: DailyEventLog = {
      id: `event-${Date.now()}`,
      date: 'Today, Oct 2026',
      title: eventTitle.trim(),
      category: eventCategory,
      summary: eventSummary.trim(),
      details: eventDetails.trim() || eventSummary.trim(),
      mood: eventMood,
      loggedBy: 'IBYOYAKOZE Bonette (Admin)',
    };

    onAddDailyEvent(newEvent);
    setEventTitle('');
    setEventSummary('');
    setEventDetails('');
    showNotification('Daily event logged successfully!');
  };

  // 3. Submit Story / Article
  const handleAddArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleContent.trim()) return;

    const newArticle: StoryArticle = {
      id: `story-${Date.now()}`,
      title: articleTitle.trim(),
      slug: articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt: articleExcerpt.trim() || articleContent.slice(0, 160) + '...',
      content: articleContent.trim(),
      category: articleCategory,
      publishedAt: 'Just now',
      readTime: articleReadTime,
      coverImage: articleCover,
      author: 'IBYOYAKOZE Bonette',
      likes: 1,
    };

    onAddArticle(newArticle);
    setArticleTitle('');
    setArticleExcerpt('');
    setArticleContent('');
    showNotification(`Published article: "${newArticle.title}"!`);
  };

  // 4. Submit Photo
  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;

    const newPhoto: PhotoItem = {
      id: `photo-${Date.now()}`,
      title: photoTitle.trim(),
      category: photoCategory,
      imageUrl: photoUrl.trim() || '/src/assets/images/bonette_portrait_1791547560485.jpg',
      caption: photoCaption.trim() || photoTitle.trim(),
      date: 'Oct 2026',
      isCustom: true,
    };

    onAddPhoto(newPhoto);
    setPhotoTitle('');
    setPhotoUrl('');
    setPhotoCaption('');
    showNotification('Photo uploaded and added to the gallery!');
  };

  // 5. Send Admin Chat Announcement
  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    onSendFamilyChat(announcementText.trim(), true);
    setAnnouncementText('');
    showNotification('Admin announcement posted to family chat!');
  };

  // 6. Submit Daily Agenda Entry
  const handleSaveAgendaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaSummary.trim()) {
      showNotification('Please enter how your day went in the day summary!');
      return;
    }

    const dateObj = new Date(agendaDate);
    const dateFormatted = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newEntry: AgendaEntry = {
      id: `agenda-${agendaDate}-${Date.now()}`,
      date: agendaDate,
      dateFormatted,
      mood: agendaMood,
      dayRating: agendaRating,
      daySummary: agendaSummary.trim(),
      activitiesPerformed: agendaActivities,
      routineTasks: agendaTasks,
      techSkillsPracticed: agendaTechSkills,
      gospelReflection: agendaGospelReflection.trim() || undefined,
      tomorrowsPriorities: agendaTomorrowsGoals.length > 0 ? agendaTomorrowsGoals : undefined,
      loggedAt: new Date().toISOString()
    };

    onAddAgendaEntry(newEntry);
    showNotification(`Agenda for ${dateFormatted} saved! Your portfolio details have evolved.`);
    setAgendaSummary('');
  };

  const handleAddActivity = () => {
    if (!newActivityInput.trim()) return;
    setAgendaActivities([...agendaActivities, newActivityInput.trim()]);
    setNewActivityInput('');
  };

  const handleRemoveActivity = (index: number) => {
    setAgendaActivities(agendaActivities.filter((_, idx) => idx !== index));
  };

  const handleToggleTask = (taskId: string) => {
    setAgendaTasks(
      agendaTasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setAgendaTasks([
      ...agendaTasks,
      {
        id: `task-${Date.now()}`,
        title: newTaskTitle.trim(),
        category: newTaskCategory,
        completed: true,
        timeEstimate: '30 mins'
      }
    ]);
    setNewTaskTitle('');
  };

  const handleRemoveTask = (taskId: string) => {
    setAgendaTasks(agendaTasks.filter((t) => t.id !== taskId));
  };

  const handleAddTechSkill = () => {
    if (!newTechInput.trim()) return;
    if (!agendaTechSkills.includes(newTechInput.trim())) {
      setAgendaTechSkills([...agendaTechSkills, newTechInput.trim()]);
    }
    setNewTechInput('');
  };

  const handleRemoveTechSkill = (skill: string) => {
    setAgendaTechSkills(agendaTechSkills.filter((s) => s !== skill));
  };

  const handleAddTomorrowGoal = () => {
    if (!newGoalInput.trim()) return;
    setAgendaTomorrowsGoals([...agendaTomorrowsGoals, newGoalInput.trim()]);
    setNewGoalInput('');
  };

  const handleRemoveTomorrowGoal = (index: number) => {
    setAgendaTomorrowsGoals(agendaTomorrowsGoals.filter((_, idx) => idx !== index));
  };

  // 7. Security & Password Update
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    const savedPassword = localStorage.getItem('bonette_custom_admin_password') || 'samu1102005@B';
    const inputTrimmed = currentPasswordInput.trim();

    if (inputTrimmed !== savedPassword.trim() && inputTrimmed !== 'samu1102005@B') {
      setSecurityMessage({ text: 'Current password is incorrect. (Use permanent master password samu1102005@B if needed)', type: 'error' });
      return;
    }

    if (newPasswordInput.length < 6) {
      setSecurityMessage({ text: 'New password must be at least 6 characters long.', type: 'error' });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setSecurityMessage({ text: 'New password and confirmation do not match.', type: 'error' });
      return;
    }

    localStorage.setItem('bonette_custom_admin_password', newPasswordInput);
    setSecurityMessage({ text: 'Admin password successfully updated! Only you have access.', type: 'success' });
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    showNotification('Password updated successfully!');
  };

  // --- Backup & Export / Import Handlers ---
  const handleExportBackup = () => {
    try {
      const messages = (() => {
        try {
          const saved = localStorage.getItem('bonette_portfolio_messages');
          return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
      })();

      const customPhotos = (() => {
        try {
          const saved = localStorage.getItem('bonette_portfolio_photos');
          return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
      })();

      const customPassword = localStorage.getItem('bonette_custom_admin_password') || undefined;

      const backupPayload = {
        portfolioVersion: '1.0',
        exportedAt: new Date().toISOString(),
        owner: 'IBYOYAKOZE Bonette',
        agendaEntries,
        familyMembers,
        dailyEvents,
        articles,
        familyChat,
        messages,
        customPhotos,
        customPassword,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `bonette-portfolio-backup-${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showNotification('Portfolio data exported successfully to JSON file!');
    } catch (err: any) {
      showNotification('Failed to export backup: ' + err.message);
    }
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSummary(null);
    setImportedData(null);

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setImportError('Please select a valid JSON backup file (*.json).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed || typeof parsed !== 'object') {
          setImportError('Invalid JSON structure in backup file.');
          return;
        }

        const summary = {
          agendaCount: Array.isArray(parsed.agendaEntries) ? parsed.agendaEntries.length : 0,
          familyCount: Array.isArray(parsed.familyMembers) ? parsed.familyMembers.length : 0,
          eventsCount: Array.isArray(parsed.dailyEvents) ? parsed.dailyEvents.length : 0,
          articlesCount: Array.isArray(parsed.articles) ? parsed.articles.length : 0,
          messagesCount: Array.isArray(parsed.messages) ? parsed.messages.length : 0,
          exportedAt: parsed.exportedAt || undefined,
        };

        setImportSummary(summary);
        setImportedData(parsed);
      } catch (err: any) {
        setImportError('Could not parse JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyRestore = () => {
    if (!importedData) return;

    if (onRestorePortfolioBackup) {
      onRestorePortfolioBackup(importedData);
    }

    showNotification('Backup successfully restored! All portfolio data has been updated.');
    setImportedData(null);
    setImportSummary(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Bonette&apos;s Private Admin Suite
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Private Access
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized for <span className="font-semibold text-slate-700 dark:text-slate-300">IBYOYAKOZE Bonette</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Birthday / Anniversary Milestone Reminder Banner for Bonette */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-emerald-500/15 border-b border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Cake className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              <strong>Date of Birth:</strong> October 15, 2008 (Gatsibo, Rwanda).
              {birthdayInfo.isTodayBirthday
                ? ` 🎉 Today is your 18th Birthday! Happy Anniversary Bonette!`
                : ` Upcoming 18th Milestone in ${birthdayInfo.daysUntilNextBirthday} days (Oct 15).`}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold hidden md:inline">
            Active Anniversary System ✓
          </span>
        </div>

        {/* Global Success Notification Pill */}
        {successNotice && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto bg-white dark:bg-slate-900 text-xs font-medium">
          <button
            onClick={() => setActiveTab('daily-activity')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'daily-activity'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Daily Activity Log
          </button>

          <button
            onClick={() => setActiveTab('quarterly-reports')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'quarterly-reports'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Quarterly Report Upload ({reportsList.length})
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'agenda'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Daily Agenda & Routines ({agendaEntries.length})
          </button>

          <button
            onClick={() => setActiveTab('family')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'family'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Family Members ({familyMembers.length})
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'events'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Event Highlights ({dailyEvents.length})
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'articles'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Articles & Stories ({articles.length})
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'photos'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Upload Photo
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Family Chat
          </button>

          <button
            onClick={() => setActiveTab('reading-history')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'reading-history'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Reading History ({readingHistory.length})
          </button>

          <button
            onClick={() => setActiveTab('reading-analytics')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'reading-analytics'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Reading Analytics
          </button>

          <button
            onClick={() => setActiveTab('message-insights')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'message-insights'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Message Insights
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Security & Password
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Backup & Export / Import
          </button>
        </div>

        {/* Tab Body Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/40">
          {/* TAB: DAILY ACTIVITY LOG (RECORD, LIST, DELETE WITH TIMESTAMPS) */}
          {activeTab === 'daily-activity' && (
            <DailyActivityLog onNotify={showNotification} />
          )}

          {/* TAB: QUARTERLY REPORTS MANAGER (ADMIN EXCLUSIVE UPLOAD) */}
          {activeTab === 'quarterly-reports' && (
            <QuarterlyReportsManager
              reports={reportsList}
              onAddReport={handleAddReportInternal}
              onRemoveReport={handleRemoveReportInternal}
              onNotify={showNotification}
            />
          )}

          {/* TAB 0: AGENDA & ROUTINE LOGGER */}
          {activeTab === 'agenda' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form to Log Day, Activities, Routines */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-850 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Admin Daily Work Log: Record Everything Done
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your central daily log to record everything you have done each day: daily routines at Lycée Saint Alexandre Sauli, software engineering practice, tasks completed, activities performed, and reflections.
                  </p>
                </div>

                <form onSubmit={handleSaveAgendaSubmit} className="space-y-4">
                  {/* Date, Mood, and Rating */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={agendaDate}
                        onChange={(e) => setAgendaDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Daily Mood *
                      </label>
                      <select
                        value={agendaMood}
                        onChange={(e) => setAgendaMood(e.target.value as AgendaEntry['mood'])}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      >
                        <option value="Productive & Grateful">Productive & Grateful</option>
                        <option value="Deep Focus / Code Sprint">Deep Focus / Code Sprint</option>
                        <option value="Peaceful & Reflective">Peaceful & Reflective</option>
                        <option value="Challenging but Growing">Challenging but Growing</option>
                        <option value="Joyful Celebration">Joyful Celebration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Day Rating (Stars)
                      </label>
                      <div className="flex items-center gap-1.5 h-[34px] px-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setAgendaRating(star)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= agendaRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* How My Day Went Summary */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      How My Day Went (Daily Reflection & Highlights) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={agendaSummary}
                      onChange={(e) => setAgendaSummary(e.target.value)}
                      placeholder="Describe how your day unfolded, what you achieved, classes at Lycée Saint Alexandre Sauli, challenges overcome, or what made today special..."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Activities Performed Section */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Activities Performed
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newActivityInput}
                        onChange={(e) => setNewActivityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddActivity();
                          }
                        }}
                        placeholder="e.g., Designed a database schema, attended 3-hour code lab..."
                        className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddActivity}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-slate-700 hover:bg-emerald-600 text-white rounded-lg cursor-pointer transition-colors"
                      >
                        + Add Activity
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {agendaActivities.map((act, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-xs"
                        >
                          <span className="text-slate-800 dark:text-slate-200">{act}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(idx)}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Routine Tasks & Habits Builder */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Routine Tasks & Habits Checklist
                    </label>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {agendaTasks.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-xs"
                        >
                          <div
                            onClick={() => handleToggleTask(t.id)}
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            {t.completed ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                            <span className={t.completed ? 'font-medium text-slate-800 dark:text-slate-200' : 'line-through text-slate-400'}>
                              {t.title}
                            </span>
                            <span className="text-[10px] text-slate-400 px-1.5 py-0.2 bg-slate-200/60 dark:bg-slate-700 rounded">
                              {t.category}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTask(t.id)}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5 ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Add new routine task (e.g., Read documentation, 30m exercise)..."
                        className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                      <select
                        value={newTaskCategory}
                        onChange={(e) => setNewTaskCategory(e.target.value as AgendaTaskItem['category'])}
                        className="px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      >
                        <option value="Coding & Tech">Coding & Tech</option>
                        <option value="School (L5 SOD)">School (L5 SOD)</option>
                        <option value="Gospel & Prayer">Gospel & Prayer</option>
                        <option value="Family & Chores">Family & Chores</option>
                        <option value="Health & Exercise">Health & Exercise</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddTask}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition-colors"
                      >
                        + Task
                      </button>
                    </div>
                  </div>

                  {/* Tech Skills Practiced */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tech Skills / Languages Practiced Today
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {agendaTechSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-md border border-emerald-200 dark:border-emerald-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveTechSkill(skill)}
                            className="hover:text-rose-600 cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTechInput}
                        onChange={(e) => setNewTechInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTechSkill();
                          }
                        }}
                        placeholder="Add skill (e.g. Next.js, Docker, Java, PostgreSQL)..."
                        className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddTechSkill}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-slate-700 hover:bg-emerald-600 text-white rounded-lg cursor-pointer"
                      >
                        + Skill
                      </button>
                    </div>
                  </div>

                  {/* Gospel & Spiritual Reflection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Daily Gospel Reflection or Song Inspiration (Optional)
                    </label>
                    <input
                      type="text"
                      value={agendaGospelReflection}
                      onChange={(e) => setAgendaGospelReflection(e.target.value)}
                      placeholder="e.g. Sung 'Ni Wowe Rutare Rwanjye' in the evening; God's peace strengthens my learning."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Tomorrow's Priorities */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tomorrow&apos;s Agenda Priorities
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newGoalInput}
                        onChange={(e) => setNewGoalInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTomorrowGoal();
                          }
                        }}
                        placeholder="Goal for tomorrow..."
                        className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddTomorrowGoal}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-slate-700 text-white rounded-lg cursor-pointer"
                      >
                        + Goal
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {agendaTomorrowsGoals.map((goal, gIdx) => (
                        <span
                          key={gIdx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700"
                        >
                          {goal}
                          <button
                            type="button"
                            onClick={() => handleRemoveTomorrowGoal(gIdx)}
                            className="hover:text-rose-500 cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    Save & Update Portfolio Daily Agenda
                  </button>
                </form>
              </div>

              {/* Right Column: Existing Agenda History */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Logged Agenda Days ({agendaEntries.length})
                    </h4>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Live Evolution
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
                    {agendaEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {entry.dateFormatted}
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemoveAgendaEntry(entry.id)}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {entry.daySummary}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">{entry.mood}</span>
                          <span>{entry.activitiesPerformed.length} activities</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: FAMILY MANAGEMENT */}
          {activeTab === 'family' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  Add Family Member & Generate Invite Link
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Register brothers Mugisha & Cedric, sisters Ruth, Reponce, Beryse, or parents. They receive an email invite link to join the Family Chat!
                </p>

                <form onSubmit={handleAddMemberSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="e.g., Mugisha, Ruth, Cedric..."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Relationship *
                    </label>
                    <select
                      value={newMemberRelation}
                      onChange={(e) => setNewMemberRelation(e.target.value as FamilyMemberItem['relationship'])}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="Brother">Brother (Mugisha, Cedric)</option>
                      <option value="Sister">Sister (Ruth, Reponce, Beryse)</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Cousin">Cousin</option>
                      <option value="Relative">Relative</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="name.ibyoyakoze@gmail.com"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Username (Optional)
                      </label>
                      <input
                        type="text"
                        value={newMemberUsername}
                        onChange={(e) => setNewMemberUsername(e.target.value)}
                        placeholder="e.g., mugisha"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Passcode
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const nameP = newMemberName.trim().toLowerCase() || 'member';
                            setNewMemberPasscode(`${nameP.charAt(0).toUpperCase() + nameP.slice(1)}#2026`);
                          }}
                          className="text-[10px] text-emerald-600 hover:underline cursor-pointer"
                        >
                          Generate
                        </button>
                      </div>
                      <input
                        type="text"
                        value={newMemberPasscode}
                        onChange={(e) => setNewMemberPasscode(e.target.value)}
                        placeholder="e.g. Mugisha#2026"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-emerald-600 dark:text-emerald-400 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={newMemberPhone}
                      onChange={(e) => setNewMemberPhone(e.target.value)}
                      placeholder="+250 788 000 000"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    Add Member & Generate Passcode
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Registered Family Members ({familyMembers.length})
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Passcodes & Login Slips</span>
                </div>

                <div className="space-y-2">
                  {familyMembers.map((member) => {
                    const pass = member.loginPasscode || `${member.name.toLowerCase()}#2026`;
                    const user = member.username || member.name.toLowerCase();
                    const memberAllowed = member.allowedSections || ['family-chat', 'about', 'transcripts', 'achievements', 'photos', 'gospel', 'articles', 'agenda'];

                    const AVAILABLE_PERMISSIONS = [
                      { id: 'family-chat', label: 'Chat' },
                      { id: 'about', label: 'About' },
                      { id: 'transcripts', label: 'Transcripts' },
                      { id: 'achievements', label: 'Achievements' },
                      { id: 'photos', label: 'Photos' },
                      { id: 'gospel', label: 'Gospel' },
                      { id: 'articles', label: 'Articles' },
                      { id: 'agenda', label: 'Agenda' },
                    ];

                    const handleTogglePermission = (sectionId: string) => {
                      if (sectionId === 'family-chat') return; // chat is always allowed for family
                      const exists = memberAllowed.includes(sectionId);
                      const next = exists ? memberAllowed.filter((s) => s !== sectionId) : [...memberAllowed, sectionId];
                      const updatedMember: FamilyMemberItem = { ...member, allowedSections: next };
                      if (onUpdateFamilyMember) {
                        onUpdateFamilyMember(updatedMember);
                      }
                      showNotification(`Updated access for ${member.name}: ${next.length} sections allowed.`);
                    };

                    return (
                      <div
                        key={member.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3 shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0">
                              {member.avatar || member.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900 dark:text-white">
                                  {member.name}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                                  {member.relationship}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                User: <strong>{user}</strong> | Passcode: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{pass}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const slip = `Family Hub Login:\nName: ${member.name} (${member.relationship})\nUsername/Email: ${user}\nPasscode: ${pass}\nPortal: ${window.location.origin}`;
                                navigator.clipboard.writeText(slip);
                                setCopiedPasscodeId(member.id);
                                setTimeout(() => setCopiedPasscodeId(null), 2500);
                                showNotification(`Copied login credentials slip for ${member.name}!`);
                              }}
                              className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 cursor-pointer flex items-center gap-1 shrink-0"
                              title="Copy credentials slip to send to this member"
                            >
                              {copiedPasscodeId === member.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedPasscodeId === member.id ? 'Copied Slip' : 'Copy Slip'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const link = `${window.location.origin}${window.location.pathname}?family_invite=${member.inviteToken || member.id}&name=${encodeURIComponent(member.name)}`;
                                navigator.clipboard.writeText(link);
                                showNotification(`Copied invite link for ${member.name}!`);
                              }}
                              className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              <Copy className="w-3 h-3" /> Link
                            </button>

                            <button
                              type="button"
                              onClick={() => onRemoveFamilyMember(member.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                              title="Remove member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Admin Content Authorization Controls */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              Content Authorization (Controlled by Bonette):
                            </span>
                            <span>{memberAllowed.length} menus authorized</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {AVAILABLE_PERMISSIONS.map((perm) => {
                              const isAllowed = memberAllowed.includes(perm.id);
                              return (
                                <button
                                  key={perm.id}
                                  type="button"
                                  onClick={() => handleTogglePermission(perm.id)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer border ${
                                    isAllowed
                                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
                                  }`}
                                  title={`Toggle access to ${perm.label}`}
                                >
                                  {isAllowed ? '✓' : '+'} {perm.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DAILY EVENTS */}
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Log Daily Event Highlight
                </h3>

                <form onSubmit={handleAddEventSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="e.g. Mastered React state in L5 SOD"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value as DailyEventLog['category'])}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="L5 SOD Studies">L5 SOD Studies</option>
                      <option value="Coding Project">Coding Project</option>
                      <option value="Gospel Choir">Gospel Choir</option>
                      <option value="Family Gathering">Family Gathering</option>
                      <option value="Personal Milestone">Personal Milestone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Summary *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={eventSummary}
                      onChange={(e) => setEventSummary(e.target.value)}
                      placeholder="Brief overview of the achievement..."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Log Event Highlight
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 space-y-2">
                {dailyEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-600">{ev.category}</span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{ev.summary}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveDailyEvent(ev.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ARTICLES & STORIES */}
          {activeTab === 'articles' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Publish New Article / Devotional
                </h3>

                <form onSubmit={handleAddArticleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      placeholder="Title of story or devotional"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Category *</label>
                    <select
                      value={articleCategory}
                      onChange={(e) => setArticleCategory(e.target.value as StoryArticle['category'])}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <option value="Tech & Coding">Tech & Coding</option>
                      <option value="Faith & Gospel">Faith & Gospel</option>
                      <option value="Life in Gatsibo">Life in Gatsibo</option>
                      <option value="Family & Roots">Family & Roots</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Content *</label>
                    <textarea
                      required
                      rows={5}
                      value={articleContent}
                      onChange={(e) => setArticleContent(e.target.value)}
                      placeholder="Write your story or devotional here..."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Publish Article
                  </button>
                </form>
              </div>

              <div className="lg:col-span-6 space-y-2">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">{art.category}</span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{art.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{art.excerpt}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveArticle(art.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PHOTOS */}
          {activeTab === 'photos' && (
            <div className="max-w-xl mx-auto bg-white dark:bg-slate-850 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                Upload New Photo Moment
              </h3>
              <form onSubmit={handleAddPhotoSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder="e.g. Coding lab project presentation"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Paste image URL or leave empty for default asset"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border rounded-lg font-mono text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Add Photo to Gallery
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: FAMILY CHAT */}
          {activeTab === 'chat' && (
            <div className="max-w-xl mx-auto bg-white dark:bg-slate-850 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Broadcast Family Chat Announcement
              </h3>
              <form onSubmit={handleSendAnnouncement} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Type an announcement to all registered family members..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Announcement
                </button>
              </form>
            </div>
          )}

          {/* TAB: READING HISTORY STATISTICS */}
          {activeTab === 'reading-history' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                      <BookmarkCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Article Reading History & Reader Progress
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Track which stories, tech write-ups, and dev logs have been read and finished by visitors
                      </p>
                    </div>
                  </div>

                  {readingHistory.length > 0 && onClearReadingHistory && (
                    <button
                      type="button"
                      onClick={onClearReadingHistory}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/60 rounded-lg transition-colors cursor-pointer"
                    >
                      Clear Reading History
                    </button>
                  )}
                </div>

                {/* Metrics Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Total Articles Read
                    </span>
                    <strong className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                      {readingHistory.length}
                    </strong>
                    <span className="text-[10px] text-slate-400">Recorded in local vault</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Published Stories
                    </span>
                    <strong className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                      {articles.length}
                    </strong>
                    <span className="text-[10px] text-slate-400">Available in library</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Completion Ratio
                    </span>
                    <strong className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 block">
                      {articles.length > 0
                        ? `${Math.min(100, Math.round((readingHistory.length / articles.length) * 100))}%`
                        : '0%'}
                    </strong>
                    <span className="text-[10px] text-slate-400">Portfolio completion</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Avg Progress
                    </span>
                    <strong className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 block">
                      {readingHistory.length > 0 ? '100%' : '0%'}
                    </strong>
                    <span className="text-[10px] text-slate-400">Full reads tracked</span>
                  </div>
                </div>

                {/* Table of Read Articles */}
                <div className="pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Completed Article Reading Logs</span>
                  </h4>

                  {readingHistory.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                      <BookmarkCheck className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">No article reading sessions recorded yet.</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        When visitors or students scroll through and finish your articles, their progress will be recorded here permanently.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-750">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-750">
                          <tr>
                            <th className="py-2.5 px-3">Article Title</th>
                            <th className="py-2.5 px-3">Category</th>
                            <th className="py-2.5 px-3">Read Time</th>
                            <th className="py-2.5 px-3">Completed At</th>
                            <th className="py-2.5 px-3">Progress</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-850">
                          {readingHistory.map((item, idx) => (
                            <tr key={`${item.id}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                                {item.title}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">
                                  {item.category || 'Story'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                                {item.readTime || '3 min'}
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                                {item.readAt}
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div
                                      className="bg-emerald-600 h-full rounded-full"
                                      style={{ width: `${item.progress || 100}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    {item.progress || 100}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: READING ANALYTICS WITH RECHARTS BAR CHART */}
          {activeTab === 'reading-analytics' && (() => {
            // Aggregate reading records from history and localStorage
            const storedHistory: ReadArticleRecord[] = (() => {
              if (readingHistory && readingHistory.length > 0) return readingHistory;
              try {
                const saved = localStorage.getItem('bonette_session_read_articles');
                if (saved) return JSON.parse(saved);
              } catch {}
              return [];
            })();

            // Aggregate frequency map per article title
            const articleStatsMap: Record<string, { count: number; category: string; progressSum: number; fullTitle: string; readTime: string }> = {};

            // Seed with articles so chart is informative even before multiple reads
            articles.forEach((art) => {
              articleStatsMap[art.title] = {
                count: 1, // base interest baseline
                category: art.category,
                progressSum: 85,
                fullTitle: art.title,
                readTime: art.readTime
              };
            });

            // Add real session readings
            storedHistory.forEach((record) => {
              if (!articleStatsMap[record.title]) {
                articleStatsMap[record.title] = {
                  count: 0,
                  category: record.category || 'Article',
                  progressSum: 0,
                  fullTitle: record.title,
                  readTime: record.readTime || '3 min'
                };
              }
              articleStatsMap[record.title].count += 1;
              articleStatsMap[record.title].progressSum += (record.progress || 100);
            });

            const chartData = Object.values(articleStatsMap)
              .map((stat, idx) => {
                const colors = ['#059669', '#0d9488', '#2563eb', '#8b5cf6', '#d97706', '#e11d48'];
                return {
                  name: stat.fullTitle.length > 22 ? stat.fullTitle.slice(0, 20) + '…' : stat.fullTitle,
                  fullTitle: stat.fullTitle,
                  reads: stat.count,
                  category: stat.category,
                  avgProgress: Math.min(100, Math.round(stat.progressSum / stat.count)),
                  fill: colors[idx % colors.length]
                };
              })
              .sort((a, b) => b.reads - a.reads);

            const totalReadingSessions = chartData.reduce((acc, curr) => acc + curr.reads, 0);
            const uniqueArticlesCount = chartData.length;
            const mostPopularArticle = chartData[0]?.fullTitle || 'None yet';
            const overallAvgCompletion = Math.round(
              chartData.reduce((acc, curr) => acc + curr.avgProgress, 0) / (chartData.length || 1)
            );

            return (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          Reading Analytics & Audience Engagement
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Recharts bar chart visualizing the most frequently read articles from user reading history
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                        {totalReadingSessions} Total Reads
                      </span>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Total Reads
                      </span>
                      <strong className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 block">
                        {totalReadingSessions}
                      </strong>
                      <span className="text-[10px] text-slate-500">Recorded sessions</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Unique Articles
                      </span>
                      <strong className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 block">
                        {uniqueArticlesCount}
                      </strong>
                      <span className="text-[10px] text-slate-500">Published stories</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Avg Completion
                      </span>
                      <strong className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 block">
                        {overallAvgCompletion}%
                      </strong>
                      <span className="text-[10px] text-slate-500">Scroll depth rate</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Top Article
                      </span>
                      <strong className="text-xs font-bold text-slate-900 dark:text-white mt-1 block truncate" title={mostPopularArticle}>
                        {mostPopularArticle}
                      </strong>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Highest frequency</span>
                    </div>
                  </div>

                  {/* Recharts Bar Chart Container */}
                  <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Most Frequently Read Articles (Recharts Bar Visualization)</span>
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">X: Articles &bull; Y: Times Read</span>
                    </div>

                    <div className="h-72 sm:h-80 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 15, right: 15, left: -10, bottom: 40 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            interval={0}
                            angle={-15}
                            textAnchor="end"
                          />
                          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl text-xs space-y-1 max-w-xs">
                                    <p className="font-bold text-slate-900 dark:text-white">{data.fullTitle}</p>
                                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Category: {data.category}</p>
                                    <p className="text-slate-600 dark:text-slate-300">
                                      <strong>{data.reads}</strong> times read
                                    </p>
                                    <p className="text-slate-500 text-[11px]">
                                      Avg Completion: <strong>{data.avgProgress}%</strong>
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Legend verticalAlign="top" height={36} />
                          <Bar
                            dataKey="reads"
                            name="Read Frequency (Times Read)"
                            radius={[6, 6, 0, 0]}
                            fill="#059669"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Detailed Reading Breakdown Table */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Ranked Article Performance Breakdown
                    </h4>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                          <tr>
                            <th className="py-2.5 px-3">Rank</th>
                            <th className="py-2.5 px-3">Article Title</th>
                            <th className="py-2.5 px-3">Category</th>
                            <th className="py-2.5 px-3 text-center">Frequency (Reads)</th>
                            <th className="py-2.5 px-3">Avg Progress</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {chartData.map((item, index) => (
                            <tr key={item.fullTitle} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{index + 1}</td>
                              <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate" title={item.fullTitle}>
                                {item.fullTitle}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold">
                                  {item.category}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                {item.reads}
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div
                                      className="bg-emerald-600 h-full rounded-full"
                                      style={{ width: `${item.avgProgress}%` }}
                                    />
                                  </div>
                                  <span className="text-[11px] font-mono text-slate-500">{item.avgProgress}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB: MESSAGE INSIGHTS WITH RECHARTS BAR CHART */}
          {activeTab === 'message-insights' && (() => {
            // Retrieve messages from localStorage or default
            const messagesList: VisitorMessage[] = (() => {
              try {
                const saved = localStorage.getItem('bonette_portfolio_messages');
                if (saved) return JSON.parse(saved);
              } catch {}
              return INITIAL_MESSAGES;
            })();

            // Aggregate messages by category/type
            const countsByType: Record<string, number> = {};
            messagesList.forEach((msg) => {
              const type = msg.type || 'Message';
              countsByType[type] = (countsByType[type] || 0) + 1;
            });

            const chartData = [
              { name: 'General Messages', type: 'Message', messages: countsByType['Message'] || 0, fill: '#059669' },
              { name: 'Prayers & Faith', type: 'Prayer', messages: countsByType['Prayer'] || 0, fill: '#8b5cf6' },
              { name: 'Feedback & Tech', type: 'Feedback', messages: countsByType['Feedback'] || 0, fill: '#2563eb' },
              { name: 'Song Suggestions', type: 'Gospel Song Suggestion', messages: countsByType['Gospel Song Suggestion'] || 0, fill: '#f59e0b' },
              { name: 'Questions', type: 'Question', messages: countsByType['Question'] || 0, fill: '#ec4899' },
            ];

            const totalMsg = messagesList.length;
            const prayerCount = countsByType['Prayer'] || 0;
            const songCount = countsByType['Gospel Song Suggestion'] || 0;
            const feedbackCount = (countsByType['Feedback'] || 0) + (countsByType['Question'] || 0);

            return (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          Guestbook Message Insights & Engagement
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Visualizing incoming message volume over time and category distribution using Recharts
                        </p>
                      </div>
                    </div>

                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                      {totalMsg} Total Messages
                    </span>
                  </div>

                  {/* Top Stats Overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Total Volume
                      </span>
                      <strong className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                        {totalMsg}
                      </strong>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">100% active</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Prayers & Blessings
                      </span>
                      <strong className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 block">
                        {prayerCount}
                      </strong>
                      <span className="text-[10px] text-purple-500 font-medium">Faith encouragement</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Song Suggestions
                      </span>
                      <strong className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 block">
                        {songCount}
                      </strong>
                      <span className="text-[10px] text-amber-500 font-medium">Gospel favorites</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Tech & Feedback
                      </span>
                      <strong className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 block">
                        {feedbackCount}
                      </strong>
                      <span className="text-[10px] text-blue-500 font-medium">Code & Questions</span>
                    </div>
                  </div>

                  {/* Bar Chart Visualization */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Message Volume by Category (Recharts)</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">Interactive Bar Chart</span>
                    </div>

                    <div className="h-64 sm:h-72 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-10} textAnchor="end" />
                          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: '10px',
                              border: '1px solid #cbd5e1',
                              fontSize: '11px',
                              backgroundColor: '#ffffff',
                              color: '#0f172a'
                            }}
                          />
                          <Bar dataKey="messages" fill="#059669" radius={[6, 6, 0, 0]} name="Messages" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Incoming Message Stream */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Recent Visitor Message Stream ({messagesList.length})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {messagesList.slice(0, 10).map((msg) => (
                        <div
                          key={msg.id}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/70 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">{msg.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                                {msg.type}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">{msg.createdAt}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                            {msg.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          {activeTab === 'security' && (
            <div className="max-w-xl mx-auto bg-white dark:bg-slate-850 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Private Admin Password & Credentials Control
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    You are the only person who should have access to these management controls.
                  </p>
                </div>
              </div>

              {securityMessage && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    securityMessage.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {securityMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{securityMessage.text}</span>
                </div>
              )}

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-2 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Admin Account:</span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono">
                    byoyakozebonette@protonmail.com
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Owner Name:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    IBYOYAKOZE Bonette
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Date of Birth:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    October 15, 2008 (Gatsibo, Rwanda)
                  </span>
                </div>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Update Admin Password
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new private password"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    Save New Password
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('bonette_custom_admin_password');
                      setSecurityMessage({ text: 'Password reset to your default private credentials.', type: 'success' });
                    }}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg cursor-pointer"
                  >
                    Reset to Default
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: BACKUP & EXPORT / IMPORT DATA */}
          {activeTab === 'backup' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Export Portfolio Data */}
              <div className="lg:col-span-6 bg-white dark:bg-slate-850 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Export Portfolio Backup (.JSON)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Download a single JSON file containing all your dynamic data
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Safely preserve all your personal logs, stories, routine tasks, family invites, and guest messages. Keep this backup on your computer or cloud drive so you never lose your progress.
                </p>

                {/* Data Overview Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Agenda Entries</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{agendaEntries.length}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Family Members</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{familyMembers.length}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Articles & Stories</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{articles.length}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Event Logs</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{dailyEvents.length}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Chat Messages</span>
                    <strong className="text-slate-900 dark:text-white text-sm">{familyChat.length}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Format</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 text-sm">JSON v1.0</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete JSON Backup</span>
                </button>
              </div>

              {/* Right Column: Import & Restore Portfolio Data */}
              <div className="lg:col-span-6 bg-white dark:bg-slate-850 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Import & Restore Portfolio Data
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Upload a previously exported JSON backup file
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Moving devices or recovering past updates? Select your saved <code className="font-mono text-emerald-700 dark:text-emerald-400">.json</code> backup to restore all portfolio records instantly.
                </p>

                {importError && (
                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}

                {/* File Upload Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Select Backup File (.json)
                  </label>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportFileChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-emerald-100 hover:file:text-emerald-800 dark:file:bg-slate-800 dark:file:text-slate-300 cursor-pointer border border-slate-200 dark:border-slate-700 rounded-lg p-1.5"
                  />
                </div>

                {/* Backup Inspection Preview */}
                {importSummary && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Valid Backup File Ready to Restore:</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                      <div>• Agenda Entries: <strong>{importSummary.agendaCount}</strong></div>
                      <div>• Family Members: <strong>{importSummary.familyCount}</strong></div>
                      <div>• Articles & Stories: <strong>{importSummary.articlesCount}</strong></div>
                      <div>• Event Highlights: <strong>{importSummary.eventsCount}</strong></div>
                      <div>• Guestbook Messages: <strong>{importSummary.messagesCount}</strong></div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={handleApplyRestore}
                        className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Confirm & Restore All Data</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setImportSummary(null);
                          setImportedData(null);
                        }}
                        className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Invite Modal Overlay */}
        {inviteModalData && (
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setInviteModalData(null)}
          >
            <div
              className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  <Mail className="w-4 h-4" />
                  <span>Email Invitation Dispatched!</span>
                </div>
                <button
                  onClick={() => setInviteModalData(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1.5 text-xs">
                <p><strong>Recipient:</strong> {inviteModalData.member.name} ({inviteModalData.member.relationship})</p>
                <p><strong>Email:</strong> {inviteModalData.member.email}</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ An email notification with the secure join link has been simulated.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Direct Join Link for {inviteModalData.member.name}:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteModalData.link}
                    className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteModalData.link);
                      setCopiedInvite(true);
                      setTimeout(() => setCopiedInvite(false), 2000);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-emerald-700 dark:bg-emerald-600 text-white rounded-lg text-xs font-medium cursor-pointer"
                  >
                    {copiedInvite ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setInviteModalData(null)}
                className="w-full py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
