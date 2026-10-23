import React, { useState } from 'react';
import {
  Award,
  GraduationCap,
  Code2,
  CheckCircle2,
  Star,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Trophy,
  Filter
} from 'lucide-react';

export interface AchievementItem {
  id: string;
  type: 'project' | 'academic';
  title: string;
  badgeLabel: string;
  organization: string;
  date: string;
  description: string;
  skills: string[];
  status: 'Completed' | 'Honors' | 'Certified';
  iconColor: string;
}

const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: 'ach-1',
    type: 'academic',
    title: 'Level 5 Software Development (L5 SOD) Distinction',
    badgeLabel: 'Academic Milestone',
    organization: 'Lycée Saint Alexandre Sauli de Muhura',
    date: '2025 - 2026',
    description: 'Active Level 5 Software Development student with stellar marks in software architecture, database theory, algorithms, and web development fundamentals.',
    skills: ['Software Engineering', 'System Architecture', 'Database Management', 'Full-Stack'],
    status: 'Honors',
    iconColor: 'emerald'
  },
  {
    id: 'ach-2',
    type: 'project',
    title: 'Daily Agenda & Routine Tracker Suite',
    badgeLabel: 'Completed Project',
    organization: 'Personal Software Suite',
    date: '2026',
    description: 'Engineered a full-featured real-time daily agenda tracker with interactive task checkboxes, mood selectors, routine checklists, and persistent state storage.',
    skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'State Persistence'],
    status: 'Completed',
    iconColor: 'blue'
  },
  {
    id: 'ach-3',
    type: 'academic',
    title: 'Primary School Graduation & Excellence Award',
    badgeLabel: 'Academic Milestone',
    organization: 'G.S Kibondo (Groupe Scolaire Kibondo)',
    date: 'Primary School',
    description: 'Graduated with high distinction from G.S Kibondo, demonstrating strong mathematical logic, discipline, and exemplary leadership within school initiatives.',
    skills: ['Mathematics', 'Science Fundamentals', 'French & English', 'Leadership'],
    status: 'Certified',
    iconColor: 'amber'
  },
  {
    id: 'ach-4',
    type: 'project',
    title: 'Gatsibo Gospel Sanctuary & Praise Player',
    badgeLabel: 'Completed Project',
    organization: 'Community Faith Initiative',
    date: '2026',
    description: 'Created an inspiring sanctuary module for gospel praise with an audio track preview player, devotional lyrics viewer, and community prayer suggestion system.',
    skills: ['Audio API', 'Interactive UI', 'Community Hub', 'Accessibility'],
    status: 'Completed',
    iconColor: 'rose'
  },
  {
    id: 'ach-5',
    type: 'project',
    title: 'Interactive SQLite & CockroachDB Studio',
    badgeLabel: 'Completed Project',
    organization: 'Database Engineering Portfolio',
    date: '2026',
    description: 'Built a specialized database studio explaining embedded SQLite vs distributed CockroachDB architectures with interactive schemas and query demonstrations.',
    skills: ['SQLite', 'CockroachDB', 'SQL Engine', 'Distributed Systems'],
    status: 'Completed',
    iconColor: 'indigo'
  },
  {
    id: 'ach-6',
    type: 'academic',
    title: 'National Junior Coding & Algorithmic Foundations',
    badgeLabel: 'Academic Milestone',
    organization: 'Rwanda STEM Youth Initiative',
    date: '2025',
    description: 'Recognized for algorithmic problem solving in data structures, loop optimizations, and modern web application logic for young Rwandan developers.',
    skills: ['Algorithms', 'Logic & Problem Solving', 'Web Standards', 'Data Structures'],
    status: 'Honors',
    iconColor: 'teal'
  },
  {
    id: 'ach-7',
    type: 'project',
    title: 'Family Sanctuary Hub with Credential Distribution',
    badgeLabel: 'Completed Project',
    organization: 'Family Communication Network',
    date: '2026',
    description: 'Developed an organized family communication board with member authentication slips, direct replies, and admin credential governance.',
    skills: ['Auth Security', 'Role-Based Access', 'Data Filtering', 'Local Vault'],
    status: 'Completed',
    iconColor: 'emerald'
  },
  {
    id: 'ach-8',
    type: 'academic',
    title: 'Gospel Choir & Vocal Worship Leadership Milestone',
    badgeLabel: 'Academic Milestone',
    organization: 'Gatsibo Community & Muhura Choir',
    date: 'Ongoing',
    description: 'Long-standing service as vocal worship member, leading devotional rehearsals and inspiring fellow students through uplifting gospel praise.',
    skills: ['Vocal Harmonization', 'Team Leadership', 'Community Service', 'Public Speaking'],
    status: 'Certified',
    iconColor: 'purple'
  }
];

interface AchievementsSectionProps {
  onNavigateTab?: (tab: string) => void;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ onNavigateTab }) => {
  const [filter, setFilter] = useState<'all' | 'academic' | 'project'>('all');

  const filteredItems = ACHIEVEMENTS_DATA.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const academicCount = ACHIEVEMENTS_DATA.filter((i) => i.type === 'academic').length;
  const projectCount = ACHIEVEMENTS_DATA.filter((i) => i.type === 'project').length;

  return (
    <section id="achievements-section" className="py-14 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-800">
              <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Milestones & Credential Badges</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Achievements & Academic Honors
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Verified badges documenting completed software engineering projects, academic milestones at Lycée Muhura and G.S Kibondo, and extracurricular accomplishments.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shadow-xs shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({ACHIEVEMENTS_DATA.length})
            </button>
            <button
              onClick={() => setFilter('academic')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                filter === 'academic'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic ({academicCount})</span>
            </button>
            <button
              onClick={() => setFilter('project')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                filter === 'project'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Projects ({projectCount})</span>
            </button>
          </div>
        </div>

        {/* Small Badge Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isAcademic = item.type === 'academic';
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Badge Top Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 group-hover:scale-105 transition-transform">
                      {isAcademic ? (
                        <GraduationCap className="w-5 h-5" />
                      ) : (
                        <Code2 className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isAcademic
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {item.badgeLabel}
                    </span>
                  </div>

                  {/* Title & Organization */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      {item.organization}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Skills / Tech Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {item.skills.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-medium">
                        +{item.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer status & date */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.status}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
