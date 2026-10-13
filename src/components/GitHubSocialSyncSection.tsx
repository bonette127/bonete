import React, { useState } from 'react';
import { Github, Instagram, Facebook, Mail, GitCommit, GitBranch, Share2, Copy, Check, ExternalLink, Terminal, Sparkles, Send } from 'lucide-react';
import { BONETTE_PROFILE } from '../data/portfolioData';

interface CommitLog {
  id: string;
  message: string;
  branch: string;
  timestamp: string;
  hash: string;
}

export const GitHubSocialSyncSection: React.FC = () => {
  const [updateText, setUpdateText] = useState('Completed new React tutorial and pushed L5 SOD database schema update from Lycée Saint Alexandre Sauli!');
  const [commitMessage, setCommitMessage] = useState('feat: add interactive lessons and photo gallery');
  const [copiedLink, setCopiedLink] = useState(false);
  const [pushedSuccess, setPushedSuccess] = useState(false);
  const [commitLogs, setCommitLogs] = useState<CommitLog[]>([
    {
      id: 'c-1',
      message: 'feat: add interactive video tutorials for web & mobile apps',
      branch: 'main',
      timestamp: 'Today, 10:14 AM',
      hash: 'a7f3e2b'
    },
    {
      id: 'c-2',
      message: 'feat: setup SQLite and CockroachDB relational schemas',
      branch: 'main',
      timestamp: 'Yesterday, 03:22 PM',
      hash: 'd8c4109'
    },
    {
      id: 'c-3',
      message: 'chore: configure portfolio hero profile and Gatsibo roots',
      branch: 'main',
      timestamp: '2 days ago',
      hash: '91be24f'
    }
  ]);

  const handlePushToGithub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;

    const newCommit: CommitLog = {
      id: `c-${Date.now()}`,
      message: commitMessage.trim(),
      branch: 'main',
      timestamp: 'Just now',
      hash: Math.random().toString(16).substring(2, 9)
    };

    setCommitLogs([newCommit, ...commitLogs]);
    setPushedSuccess(true);
    setCommitMessage('');
    setTimeout(() => setPushedSuccess(false), 3500);
  };

  const handleCopyPortfolioLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareText = encodeURIComponent(
    `Check out IBYOYAKOZE Bonette's portfolio - Aspiring Software Engineer from Gatsibo, Rwanda studying L5 SOD at Lycée Saint Alexandre Sauli! ${window.location.href}`
  );

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            06. GitHub & Social Media Hub
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Push Every Action to GitHub & Social Channels
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
            As a software engineer, version control is essential. Stay connected with my daily commits on GitHub (<span className="font-mono text-emerald-800 dark:text-emerald-400">@bonette127</span>) and follow my updates across Instagram, Facebook, and tech communities.
          </p>
        </div>

        {/* 4 Social Profile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* GitHub Card */}
          <a
            href={`https://github.com/${BONETTE_PROFILE.github}`}
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xs transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Github className="w-6 h-6 text-slate-900 dark:text-white group-hover:scale-110 transition-transform" />
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">GitHub Profile</h4>
              <p className="text-xs font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">@{BONETTE_PROFILE.github}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Open-source repositories, L5 SOD course projects, and app code.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1 group-hover:underline">
              View Repositories →
            </span>
          </a>

          {/* Instagram Card */}
          <a
            href={`https://instagram.com/${BONETTE_PROFILE.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-pink-300 dark:hover:border-pink-700 hover:shadow-xs transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Instagram className="w-6 h-6 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-pink-600 dark:group-hover:text-pink-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Instagram</h4>
              <p className="text-xs font-mono text-pink-600 dark:text-pink-400 mt-0.5">@{BONETTE_PROFILE.instagram}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Behind-the-scenes school stories, choir singing, and daily life in Gatsibo.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-pink-700 dark:text-pink-400 flex items-center gap-1 group-hover:underline">
              Follow on Instagram →
            </span>
          </a>

          {/* Facebook Card */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xs transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Facebook className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Facebook</h4>
              <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-0.5">{BONETTE_PROFILE.facebook}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Connecting with family, classmates from G.S Kibondo, and Muhura alumni.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-1 group-hover:underline">
              Connect on Facebook →
            </span>
          </a>

          {/* Email Direct */}
          <a
            href={`mailto:${BONETTE_PROFILE.email}`}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xs transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Mail className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Direct Email</h4>
              <p className="text-xs font-mono text-emerald-700 dark:text-emerald-400 mt-0.5 truncate">{BONETTE_PROFILE.email}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                For internships, tech questions, scholarships, and collaboration.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 group-hover:underline">
              Send Email Now →
            </span>
          </a>
        </div>

        {/* Interactive GitHub Git Push Console & Social Broadcaster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Git Push Terminal Console */}
          <div className="lg:col-span-7 bg-slate-950 text-white rounded-2xl border border-slate-800 p-6 space-y-5 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>git terminal @bonette127 / portfolio</span>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <GitBranch className="w-3.5 h-3.5" /> branch: main
              </span>
            </div>

            <form onSubmit={handlePushToGithub} className="space-y-3">
              <label className="block text-xs font-mono text-slate-300">
                $ git commit -m <span className="text-amber-300">"[your message]"</span> && git push origin main
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="e.g., feat: add new mobile tutorial"
                  className="flex-1 px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-emerald-300 focus:outline-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold font-mono bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Push to GitHub
                </button>
              </div>
            </form>

            {pushedSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-xs font-mono text-emerald-300 space-y-1">
                <p>✓ [main {commitLogs[0]?.hash}] {commitLogs[0]?.message}</p>
                <p className="text-slate-400">Enumerating objects: 7, done. To github.com/bonette127/portfolio.git</p>
              </div>
            )}

            {/* Commit History Feed */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-mono text-slate-400">Recent Git Commits on main:</p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {commitLogs.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-200 truncate">{c.message}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 shrink-0">
                      <span className="text-amber-400">{c.hash}</span>
                      <span>·</span>
                      <span>{c.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Broadcast to All Social Media */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900">
              <Share2 className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold">Broadcast to All Social Media</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Share Bonette's accomplishments, website tutorials, or gospel corner across social networks with one click:
            </p>

            <div className="space-y-3">
              {/* WhatsApp Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
              >
                <span>Share via WhatsApp</span>
              </a>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                <Facebook className="w-4 h-4" />
                <span>Share to Facebook</span>
              </a>

              {/* Twitter / X Share */}
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <span>Share to X / Twitter</span>
              </a>

              {/* Copy Portfolio URL */}
              <button
                onClick={handleCopyPortfolioLink}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Portfolio Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
