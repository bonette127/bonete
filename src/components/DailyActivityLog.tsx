import React, { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  Calendar,
  Tag,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Sparkles,
  Download,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Code2,
  Check,
  RefreshCw,
  X
} from 'lucide-react';

export type ActivityCategory =
  | 'Software Engineering'
  | 'L5 SOD Studies'
  | 'System Architecture'
  | 'Bug Fixing & Testing'
  | 'Personal & Gospel'
  | 'Hardware & Networks';

export interface DailyActivityItem {
  id: string;
  timestamp: string; // ISO format
  formattedTimestamp: string; // Readable formatted string
  dateKey: string; // YYYY-MM-DD
  title: string;
  category: ActivityCategory;
  description: string;
  durationMinutes: number;
  techStack: string[];
  status: 'Completed' | 'In Progress' | 'Milestone Reached';
  loggedBy: string;
}

const STORAGE_KEY = 'bonette_daily_activity_logs';

export const INITIAL_DAILY_ACTIVITIES: DailyActivityItem[] = [
  {
    id: 'act-20261026-01',
    timestamp: '2026-10-26T08:30:00.000Z',
    formattedTimestamp: 'Oct 26, 2026 · 08:30 AM',
    dateKey: '2026-10-26',
    title: 'Engineered Bilingual Kinyarwanda & English Navigation Suite',
    category: 'Software Engineering',
    description: 'Designed and implemented full language switching persistence with reactive state across HeaderNav, transcript cards, and mobile side-drawer.',
    durationMinutes: 120,
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Context API', 'localStorage'],
    status: 'Milestone Reached',
    loggedBy: 'IBYOYAKOZE Bonette (Admin)'
  },
  {
    id: 'act-20261025-02',
    timestamp: '2026-10-25T14:15:00.000Z',
    formattedTimestamp: 'Oct 25, 2026 · 02:15 PM',
    dateKey: '2026-10-25',
    title: 'Compiled Academic Records & Certified Transcripts (P1 to L5 SOD)',
    category: 'L5 SOD Studies',
    description: 'Structured comprehensive academic evaluation modules covering G.S Kibondo Primary, O-Level distinctions, and L5 SOD TVET qualifications with headmaster remarks.',
    durationMinutes: 90,
    techStack: ['NESA Standards', 'Documentation', 'Academic Auditing'],
    status: 'Completed',
    loggedBy: 'IBYOYAKOZE Bonette (Admin)'
  },
  {
    id: 'act-20261025-01',
    timestamp: '2026-10-25T09:00:00.000Z',
    formattedTimestamp: 'Oct 25, 2026 · 09:00 AM',
    dateKey: '2026-10-25',
    title: 'CSS Print Stylesheet & PDF Export Optimization',
    category: 'Bug Fixing & Testing',
    description: 'Resolved cross-browser print pagination rules, page breaks, and created the smooth printing dialog overlay for clean CV exporting.',
    durationMinutes: 75,
    techStack: ['CSS Paged Media', 'Print Layout', 'Tailwind CSS'],
    status: 'Completed',
    loggedBy: 'IBYOYAKOZE Bonette (Admin)'
  },
  {
    id: 'act-20261024-03',
    timestamp: '2026-10-24T16:30:00.000Z',
    formattedTimestamp: 'Oct 24, 2026 · 04:30 PM',
    dateKey: '2026-10-24',
    title: 'Full-text Search Filter for Articles, Tutorials & Agenda Entries',
    category: 'Software Engineering',
    description: 'Constructed an instant keyword search index with tag filtering and keyboard shortcuts (Cmd+K / Ctrl+K).',
    durationMinutes: 110,
    techStack: ['TypeScript', 'Algorithmic Search', 'React Hooks'],
    status: 'Completed',
    loggedBy: 'IBYOYAKOZE Bonette (Admin)'
  },
  {
    id: 'act-20261024-01',
    timestamp: '2026-10-24T07:45:00.000Z',
    formattedTimestamp: 'Oct 24, 2026 · 07:45 AM',
    dateKey: '2026-10-24',
    title: 'Morning Gospel Scripture Meditation & Choir Solo Vocal Training',
    category: 'Personal & Gospel',
    description: 'Meditated on Proverbs 3:5-6 and practiced vocal arrangement for the upcoming Sunday Youth Choir performance at Muhura Parish.',
    durationMinutes: 60,
    techStack: ['Vocal Harmonies', 'Youth Mentorship'],
    status: 'Completed',
    loggedBy: 'IBYOYAKOZE Bonette (Admin)'
  },
  {
    id: 'act-20261023-02',
    timestamp: '2026-10-23T11:20:00.000Z',
    formattedTimestamp: 'Oct 23, 2026 · 11:20 AM',
    dateKey: '2026-10-23',
    title: 'L5 SOD Database Architecture: Normalized Schemas & Indexing',
    category: 'System Architecture',
    description: 'Designed third normal form (3NF) relational database schemas for school student tracking systems with foreign key integrity and B-tree indexes.',
    durationMinutes: 135,
    techStack: ['PostgreSQL', 'SQL DDL/DML', 'Database Modeling'],
    status: 'Milestone Reached',
    loggedBy: 'IBYOYAKOZE Bonette (Admin)'
  }
];

export interface DailyActivityLogProps {
  onNotify?: (message: string) => void;
}

export const DailyActivityLog: React.FC<DailyActivityLogProps> = ({ onNotify }) => {
  // State for activity entries with localStorage persistence
  const [activities, setActivities] = useState<DailyActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading daily activity logs from storage', e);
    }
    return INITIAL_DAILY_ACTIVITIES;
  });

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Software Engineering');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [status, setStatus] = useState<DailyActivityItem['status']>('Completed');
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['React', 'TypeScript']);
  
  // Custom date/time picker (defaults to now)
  const now = new Date();
  const defaultDateStr = now.toISOString().split('T')[0];
  const defaultTimeStr = now.toTimeString().substring(0, 5);
  const [customDate, setCustomDate] = useState<string>(defaultDateStr);
  const [customTime, setCustomTime] = useState<string>(defaultTimeStr);
  const [useCurrentTime, setUseCurrentTime] = useState<boolean>(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to persist daily activity logs', e);
    }
  }, [activities]);

  // Helper: Format a date into readable timestamp
  const formatDateTime = (dateObj: Date): string => {
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', ' ·');
  };

  // Add Tech tag
  const handleAddTechTag = () => {
    const clean = techInput.trim();
    if (clean && !techStack.includes(clean)) {
      setTechStack((prev) => [...prev, clean]);
      setTechInput('');
    }
  };

  const handleRemoveTechTag = (tag: string) => {
    setTechStack((prev) => prev.filter((t) => t !== tag));
  };

  // Handle Form Submit: Record Entry
  const handleRecordActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please provide a title and detailed description.');
      return;
    }

    let targetDate: Date;
    if (useCurrentTime) {
      targetDate = new Date();
    } else {
      targetDate = new Date(`${customDate}T${customTime || '12:00'}:00`);
    }

    const isoString = targetDate.toISOString();
    const dateKey = isoString.split('T')[0];
    const formatted = formatDateTime(targetDate);

    const newEntry: DailyActivityItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: isoString,
      formattedTimestamp: formatted,
      dateKey,
      title: title.trim(),
      category,
      description: description.trim(),
      durationMinutes: Number(durationMinutes) || 30,
      techStack: techStack.length > 0 ? techStack : [category],
      status,
      loggedBy: 'IBYOYAKOZE Bonette (Admin)'
    };

    setActivities((prev) => [newEntry, ...prev]);

    // Reset Form
    setTitle('');
    setDescription('');
    setDurationMinutes(60);
    setTechStack(['React', 'TypeScript']);
    setTechInput('');

    if (onNotify) {
      onNotify(`Activity recorded: "${newEntry.title}" at ${formatted}!`);
    }
  };

  // Delete an entry
  const handleDeleteActivity = (id: string) => {
    const target = activities.find((a) => a.id === id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirmId(null);
    if (onNotify && target) {
      onNotify(`Deleted log entry: "${target.title}"`);
    }
  };

  // Reset to default seed logs
  const handleRestoreDefaults = () => {
    if (window.confirm('Restore initial verified activity logs from Lycée Saint Alexandre Sauli?')) {
      setActivities(INITIAL_DAILY_ACTIVITIES);
      if (onNotify) onNotify('Restored default verified daily activity logs.');
    }
  };

  // Export Daily Activity Log as Markdown
  const handleExportMarkdown = () => {
    const lines = [
      `# IBYOYAKOZE Bonette - Engineering Daily Activity Log`,
      `*Generated on: ${new Date().toLocaleString()}*`,
      `*Level 5 Software Development (L5 SOD) · Lycée Saint Alexandre Sauli de Muhura*`,
      '',
      `## Summary Metrics`,
      `- **Total Activities Logged:** ${activities.length}`,
      `- **Total Hours Invested:** ${(activities.reduce((acc, a) => acc + a.durationMinutes, 0) / 60).toFixed(1)} hrs`,
      '',
      `## Chronological Activity Records`,
      ''
    ];

    activities.forEach((act, idx) => {
      lines.push(`### ${idx + 1}. ${act.title}`);
      lines.push(`- **Timestamp:** ${act.formattedTimestamp}`);
      lines.push(`- **Category:** ${act.category}`);
      lines.push(`- **Duration:** ${act.durationMinutes} minutes`);
      lines.push(`- **Status:** ${act.status}`);
      lines.push(`- **Tech Stack:** ${act.techStack.join(', ')}`);
      lines.push(`- **Details:** ${act.description}`);
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bonette-daily-activity-log-${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
    if (onNotify) onNotify('Exported Daily Activity Log to Markdown file!');
  };

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      !searchQuery.trim() ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = filterCategory === 'all' || act.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || act.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate Metrics
  const totalMinutes = activities.reduce((acc, a) => acc + (a.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const completedCount = activities.filter((a) => a.status === 'Completed' || a.status === 'Milestone Reached').length;
  const milestoneCount = activities.filter((a) => a.status === 'Milestone Reached').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Progress Metric Cards */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900/50 p-5 rounded-2xl border border-emerald-500/20 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
              <Activity className="w-3.5 h-3.5" />
              <span>Admin Progress Tracker</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Daily Activity & Engineering Log
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Record, audit, and track everything you do daily—from software development sprints to TVET L5 SOD coursework and gospel leadership at Muhura.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Export formatted Markdown report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Log (.MD)</span>
            </button>
            <button
              onClick={handleRestoreDefaults}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Reset to default seed entries"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-500/10">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Recorded</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-emerald-400">{activities.length}</span>
              <span className="text-[11px] text-slate-400">entries</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Time Invested</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-teal-300">{totalHours}</span>
              <span className="text-[11px] text-slate-400">hours</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Completed Tasks</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-emerald-300">{completedCount}</span>
              <span className="text-[11px] text-slate-400">tasks</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-750">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Key Milestones</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-amber-400">{milestoneCount}</span>
              <span className="text-[11px] text-slate-400">achieved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left (5 Cols) + List on Right (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            1. RECORD NEW DAILY ACTIVITY FORM (Left Side)
            ========================================================================= */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                <Plus className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Record Daily Activity
              </h4>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full font-semibold">
              Live Timestamp
            </span>
          </div>

          <form onSubmit={handleRecordActivity} className="space-y-3.5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Activity Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Built responsive side-drawer, solved SQL normalization"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 outline-hidden"
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 outline-hidden"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="L5 SOD Studies">L5 SOD Studies</option>
                  <option value="System Architecture">System Architecture</option>
                  <option value="Bug Fixing & Testing">Bug Fixing & Testing</option>
                  <option value="Personal & Gospel">Personal & Gospel</option>
                  <option value="Hardware & Networks">Hardware & Networks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as DailyActivityItem['status'])}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 outline-hidden"
                >
                  <option value="Completed">Completed ✓</option>
                  <option value="Milestone Reached">Milestone Reached 🏆</option>
                  <option value="In Progress">In Progress ⏳</option>
                </select>
              </div>
            </div>

            {/* Duration (Minutes) & Timestamp Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Timestamp Option
                </label>
                <div className="flex items-center gap-2 pt-1.5">
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={useCurrentTime}
                      onChange={() => setUseCurrentTime(true)}
                      className="text-emerald-600"
                    />
                    <span>Current Time</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={!useCurrentTime}
                      onChange={() => setUseCurrentTime(false)}
                      className="text-emerald-600"
                    />
                    <span>Custom</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Custom Date & Time Fields (Shown only if Custom selected) */}
            {!useCurrentTime && (
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs animate-in fade-in">
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Time</label>
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Tech Stack Tags Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tech Stack / Skills Practiced
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTechTag();
                    }
                  }}
                  placeholder="e.g. React, PostgreSQL, Git, Vite"
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddTechTag}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-200 dark:bg-slate-750 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {/* Tag Badges */}
              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {techStack.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechTag(tag)}
                        className="hover:text-rose-500 cursor-pointer ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Activity Details & What You Accomplished *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what was accomplished, challenges solved, insights discovered, code commits pushed, or notes from school..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-emerald-500 outline-hidden resize-y"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Log Activity with Timestamp</span>
            </button>
          </form>
        </div>

        {/* =========================================================================
            2. LIST & TIMELINE OF RECORDED DAILY ACTIVITIES (Right Side)
            ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter logs by keyword, topic, or tech..."
                  className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-hidden"
              >
                <option value="all">All Categories</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="L5 SOD Studies">L5 SOD Studies</option>
                <option value="System Architecture">System Architecture</option>
                <option value="Bug Fixing & Testing">Bug Fixing & Testing</option>
                <option value="Personal & Gospel">Personal & Gospel</option>
                <option value="Hardware & Networks">Hardware & Networks</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Milestone Reached">Milestones</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>
                Showing <strong>{filteredActivities.length}</strong> of {activities.length} activity entries
              </span>
              <span>Sorted by Most Recent Timestamp</span>
            </div>
          </div>

          {/* Activities List */}
          {filteredActivities.length === 0 ? (
            <div className="bg-white dark:bg-slate-850 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <Clock className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No matching daily activities found
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Try clearing your search query or record a new daily entry using the form on the left.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((act) => {
                const isExpanded = expandedId === act.id;
                const isConfirmingDelete = deleteConfirmId === act.id;

                return (
                  <div
                    key={act.id}
                    className={`bg-white dark:bg-slate-850 rounded-2xl border transition-all duration-200 shadow-xs overflow-hidden ${
                      act.status === 'Milestone Reached'
                        ? 'border-amber-400/40 dark:border-amber-600/30 ring-1 ring-amber-400/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="p-4 flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Timestamp & Category Badge */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                            <Clock className="w-3 h-3 shrink-0" />
                            {act.formattedTimestamp}
                          </span>

                          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {act.category}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              act.status === 'Milestone Reached'
                                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                : act.status === 'Completed'
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                            }`}
                          >
                            {act.status}
                          </span>

                          <span className="text-[10px] font-mono text-slate-400">
                            • {act.durationMinutes} mins
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {act.title}
                        </h4>

                        {/* Description Preview or Expanded */}
                        <p className={`text-xs text-slate-600 dark:text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {act.description}
                        </p>

                        {/* Tech Stack Pills */}
                        {act.techStack && act.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {act.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750"
                              >
                                #{tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Action Controls: Expand / Delete */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : act.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          title={isExpanded ? 'Collapse' : 'Expand full note'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {/* Delete Button with Confirmation Guard */}
                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/80 p-1 rounded-lg border border-rose-200 dark:border-rose-900 animate-in fade-in">
                            <button
                              onClick={() => handleDeleteActivity(act.id)}
                              className="px-2 py-0.5 text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer"
                              title="Confirm Delete"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(act.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Delete this activity log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Footer Metadata in Expanded View */}
                    {isExpanded && (
                      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Logged By: {act.loggedBy}</span>
                        <span>Log ID: {act.id}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
