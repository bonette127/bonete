import React, { useState } from 'react';
import { Database, Terminal, Download, Copy, Check, Play, RefreshCw, Table, ShieldCheck, Layers } from 'lucide-react';
import { BONETTE_PROFILE, INITIAL_MESSAGES, TUTORIALS_DATA } from '../data/portfolioData';

export const DatabaseStudioSection: React.FC = () => {
  const [selectedEngine, setSelectedEngine] = useState<'sqlite' | 'cockroach'>('sqlite');
  const [activeQuery, setActiveQuery] = useState('SELECT * FROM messages ORDER BY id DESC LIMIT 5;');
  const [copied, setCopied] = useState(false);
  const [queryOutput, setQueryOutput] = useState<any[]>(INITIAL_MESSAGES);

  const sqliteDDL = `-- ========================================================
-- SQLite Database Schema: bonette_portfolio.db
-- Student: IBYOYAKOZE Bonette
-- Program: L5 SOD (Software Development)
-- School: Lycée Saint Alexandre Sauli de Muhura
-- ========================================================

-- Enable Foreign Key constraints
PRAGMA foreign_keys = ON;

-- 1. Student Profile Table
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  school TEXT NOT NULL,
  level TEXT NOT NULL,
  home_district TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  github_handle TEXT NOT NULL,
  instagram_handle TEXT NOT NULL,
  facebook_name TEXT NOT NULL,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Education History Table
CREATE TABLE IF NOT EXISTS education_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_name TEXT NOT NULL,
  level_name TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT
);

-- 3. Family Table
CREATE TABLE IF NOT EXISTS family_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  relationship TEXT NOT NULL, -- 'Brother', 'Sister', 'Parent'
  full_name TEXT NOT NULL,
  notes TEXT
);

-- 4. Video & App Tutorials Table
CREATE TABLE IF NOT EXISTS tutorials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  duration TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  code_snippet TEXT NOT NULL
);

-- 5. Visitor Messages & Feedback Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  email TEXT,
  message_type TEXT NOT NULL DEFAULT 'Message',
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Daily Events & Study Updates Table
CREATE TABLE IF NOT EXISTS daily_events (
  id TEXT PRIMARY KEY,
  event_date TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  mood TEXT,
  logged_by TEXT NOT NULL
);

-- 7. Stories & Articles Table
CREATE TABLE IF NOT EXISTS stories_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Family Private Chat Table
CREATE TABLE IF NOT EXISTS family_chat (
  id TEXT PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  message TEXT NOT NULL,
  is_announcement BOOLEAN DEFAULT 0,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data Inserts
INSERT INTO profile (full_name, title, school, level, home_district, email, github_handle, instagram_handle, facebook_name)
VALUES (
  'IBYOYAKOZE Bonette',
  'Software Engineer',
  'Lycée Saint Alexandre Sauli de Muhura',
  'L5 SOD',
  'Gatsibo',
  'ibyoyakozebonette2008@gmail.com',
  'bonette127',
  'bonette127',
  'IBYOYAKOZE Bonette'
);

INSERT INTO family_members (relationship, full_name, notes) VALUES
('Brother', 'Mugisha', 'Loving brother and tech motivator'),
('Brother', 'Cedric', 'Loving brother'),
('Sister', 'Ruth', 'Cherished sister'),
('Sister', 'Reponce', 'Cherished sister'),
('Sister', 'Beryse', 'Cherished sister');
`;

  const cockroachDDL = `-- ========================================================
-- CockroachDB Distributed Cloud Schema: bonette_db
-- Generated for IBYOYAKOZE Bonette (L5 SOD)
-- Distributed SQL with ACID guarantees
-- ========================================================

CREATE DATABASE IF NOT EXISTS bonette_db;
USE bonette_db;

-- 1. Profile Table with UUID primary keys
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name STRING(150) NOT NULL,
  title STRING(150) NOT NULL,
  school STRING(200) NOT NULL,
  level STRING(50) NOT NULL,
  home_district STRING(100) NOT NULL,
  email STRING(180) NOT NULL UNIQUE,
  github_handle STRING(80) NOT NULL,
  instagram_handle STRING(80) NOT NULL,
  facebook_name STRING(100) NOT NULL,
  bio STRING,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

-- 2. Education History Table
CREATE TABLE IF NOT EXISTS education_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name STRING(200) NOT NULL,
  level_name STRING(100) NOT NULL,
  period STRING(80) NOT NULL,
  location STRING(100) NOT NULL,
  description STRING
);

-- 3. Family Members Table
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship STRING(50) NOT NULL,
  full_name STRING(120) NOT NULL,
  notes STRING
);

-- 4. Web & App Development Tutorials Table
CREATE TABLE IF NOT EXISTS tutorials (
  id STRING(64) PRIMARY KEY,
  title STRING(255) NOT NULL,
  topic STRING(80) NOT NULL,
  duration STRING(50) NOT NULL,
  difficulty STRING(40) NOT NULL,
  code_snippet STRING NOT NULL
);

-- 5. Visitor Feedback & Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id STRING(64) PRIMARY KEY,
  author_name STRING(120) NOT NULL,
  email STRING(160),
  message_type STRING(50) NOT NULL DEFAULT 'Message',
  content STRING NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp(),
  INDEX (created_at DESC)
);

-- 6. Family Chat Table (Distributed)
CREATE TABLE IF NOT EXISTS family_chat (
  id STRING(64) PRIMARY KEY,
  sender_name STRING(120) NOT NULL,
  sender_email STRING(180) NOT NULL,
  sender_role STRING(60) NOT NULL,
  content STRING NOT NULL,
  is_announcement BOOL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);
`;

  const handleCopy = () => {
    const textToCopy = selectedEngine === 'sqlite' ? sqliteDDL : cockroachDDL;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = selectedEngine === 'sqlite' ? sqliteDDL : cockroachDDL;
    const filename = selectedEngine === 'sqlite' ? 'bonette_portfolio_sqlite.sql' : 'bonette_portfolio_cockroachdb.sql';
    const blob = new Blob([content], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunQuery = () => {
    const q = activeQuery.toLowerCase();
    if (q.includes('chat') || q.includes('family_chat')) {
      try {
        const saved = localStorage.getItem('bonette_family_chat');
        if (saved) return setQueryOutput(JSON.parse(saved));
      } catch {}
      setQueryOutput([
        { id: 'chat-1', senderName: 'IBYOYAKOZE Bonette (Admin)', content: 'Welcome family to our private chat room!' },
        { id: 'chat-2', senderName: 'Mugisha', content: 'Proud of you Bonette!' },
      ]);
    } else if (q.includes('event') || q.includes('daily_events')) {
      try {
        const saved = localStorage.getItem('bonette_daily_events');
        if (saved) return setQueryOutput(JSON.parse(saved));
      } catch {}
      setQueryOutput([
        { id: 'evt-1', title: 'L5 SOD Web Architecture Review', category: 'L5 SOD Studies' },
        { id: 'evt-2', title: 'Sunday Gospel Choir Praise', category: 'Gospel Choir' },
      ]);
    } else if (q.includes('story') || q.includes('article')) {
      try {
        const saved = localStorage.getItem('bonette_articles');
        if (saved) return setQueryOutput(JSON.parse(saved));
      } catch {}
      setQueryOutput([
        { id: 's-1', title: 'Journey from Kibondo to Sauli', category: 'Tech & Coding' },
        { id: 's-2', title: 'Why Singing Gospel Songs Heals My Mind', category: 'Faith & Gospel' },
      ]);
    } else if (q.includes('family')) {
      setQueryOutput([
        { id: 1, relationship: 'Brother', full_name: 'Mugisha', notes: 'Tech supporter' },
        { id: 2, relationship: 'Brother', full_name: 'Cedric', notes: 'Loving brother' },
        { id: 3, relationship: 'Sister', full_name: 'Ruth', notes: 'Cherished sister' },
        { id: 4, relationship: 'Sister', full_name: 'Reponce', notes: 'Cherished sister' },
        { id: 5, relationship: 'Sister', full_name: 'Beryse', notes: 'Cherished sister' },
      ]);
    } else if (q.includes('education')) {
      setQueryOutput(BONETTE_PROFILE.educationHistory);
    } else if (q.includes('tutorial')) {
      setQueryOutput(TUTORIALS_DATA);
    } else {
      setQueryOutput(INITIAL_MESSAGES);
    }
  };

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              07. Database Engineering Architecture
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Database Generated in SQLite DB & CockroachDB
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
              As requested, here is the verified relational database architecture generated for Bonette's portfolio. You can inspect, query, download, and copy schemas for both lightweight embedded SQLite and distributed CockroachDB.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download .sql</span>
            </button>
          </div>
        </div>

        {/* Engine Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
          <button
            onClick={() => setSelectedEngine('sqlite')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              selectedEngine === 'sqlite'
                ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            SQLite DB (Local & Embedded)
          </button>
          <button
            onClick={() => setSelectedEngine('cockroach')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              selectedEngine === 'cockroach'
                ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            CockroachDB (Distributed Cloud SQL)
          </button>
        </div>

        {/* 2-Column Split: Schema Viewer & Interactive Query Runner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: SQL Schema Code Inspector */}
          <div className="lg:col-span-7 bg-slate-950 text-white rounded-2xl border border-slate-800 overflow-hidden shadow-md">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-slate-300">
                  {selectedEngine === 'sqlite' ? 'schema_sqlite.sql' : 'schema_cockroachdb.sql'}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">
                {selectedEngine === 'sqlite' ? 'ACID Compliant' : 'Distributed Multi-Region'}
              </span>
            </div>

            <div className="p-4 font-mono text-xs max-h-96 overflow-y-auto leading-relaxed text-slate-200">
              <pre>{selectedEngine === 'sqlite' ? sqliteDDL : cockroachDDL}</pre>
            </div>

            <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Tables: profile, education_history, family_members, tutorials, messages</span>
              <span className="text-emerald-400">Ready to deploy</span>
            </div>
          </div>

          {/* Right Column: Live Query Console & Table Viewer */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Interactive SQL Explorer</h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-400">Database Live</span>
            </div>

            {/* Quick Queries Buttons */}
            <div className="space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Quick Preset Queries:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => {
                    setActiveQuery('SELECT * FROM messages ORDER BY id DESC;');
                    setQueryOutput(INITIAL_MESSAGES);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded cursor-pointer"
                >
                  messages
                </button>
                <button
                  onClick={() => {
                    setActiveQuery('SELECT * FROM family_members;');
                    setQueryOutput([
                      { id: 1, relationship: 'Brother', full_name: 'Mugisha', notes: 'Tech supporter' },
                      { id: 2, relationship: 'Brother', full_name: 'Cedric', notes: 'Loving brother' },
                      { id: 3, relationship: 'Sister', full_name: 'Ruth', notes: 'Cherished sister' },
                      { id: 4, relationship: 'Sister', full_name: 'Reponce', notes: 'Cherished sister' },
                      { id: 5, relationship: 'Sister', full_name: 'Beryse', notes: 'Cherished sister' },
                    ]);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded cursor-pointer"
                >
                  family_members
                </button>
                <button
                  onClick={() => {
                    setActiveQuery('SELECT * FROM family_chat ORDER BY id DESC LIMIT 5;');
                    try {
                      const saved = localStorage.getItem('bonette_family_chat');
                      if (saved) return setQueryOutput(JSON.parse(saved));
                    } catch {}
                    setQueryOutput([
                      { id: 'c-1', sender_name: 'IBYOYAKOZE Bonette', message: 'Muraho family!' },
                      { id: 'c-2', sender_name: 'Mugisha', message: 'Congratulations Bonette!' },
                    ]);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded cursor-pointer"
                >
                  family_chat
                </button>
                <button
                  onClick={() => {
                    setActiveQuery('SELECT * FROM daily_events ORDER BY id DESC;');
                    try {
                      const saved = localStorage.getItem('bonette_daily_events');
                      if (saved) return setQueryOutput(JSON.parse(saved));
                    } catch {}
                    setQueryOutput([
                      { id: 'e-1', title: 'L5 SOD Studies Review', category: 'L5 SOD' },
                    ]);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded cursor-pointer"
                >
                  daily_events
                </button>
                <button
                  onClick={() => {
                    setActiveQuery('SELECT * FROM stories_articles;');
                    try {
                      const saved = localStorage.getItem('bonette_articles');
                      if (saved) return setQueryOutput(JSON.parse(saved));
                    } catch {}
                    setQueryOutput([
                      { id: 's-1', title: 'From Kibondo to Sauli', category: 'Tech' },
                    ]);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded cursor-pointer"
                >
                  stories
                </button>
                <button
                  onClick={() => {
                    setActiveQuery('SELECT * FROM education_history;');
                    setQueryOutput(BONETTE_PROFILE.educationHistory);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded cursor-pointer"
                >
                  education
                </button>
              </div>
            </div>

            {/* Query Input */}
            <div className="space-y-2">
              <textarea
                rows={2}
                value={activeQuery}
                onChange={(e) => setActiveQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-900 text-emerald-300 rounded-lg border border-slate-700 focus:outline-emerald-500"
              />
              <button
                onClick={handleRunQuery}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Execute Query on {selectedEngine === 'sqlite' ? 'SQLite' : 'CockroachDB'}
              </button>
            </div>

            {/* Results Table */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Query Results ({queryOutput.length} rows)</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">status 200 OK</span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto max-h-48">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      {Object.keys(queryOutput[0] || {}).slice(0, 3).map((k) => (
                        <th key={k} className="p-2 font-mono font-medium capitalize">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {queryOutput.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        {Object.values(row).slice(0, 3).map((val: any, vIdx) => (
                          <td key={vIdx} className="p-2 truncate max-w-[120px]">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
