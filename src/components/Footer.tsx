import React, { useState, useEffect } from 'react';
import { Mail, Github, Instagram, Facebook, Heart, MapPin, GraduationCap, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { BONETTE_PROFILE } from '../data/portfolioData';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribers, setSubscribers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bonette_newsletter_subscribers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('bonette_newsletter_subscribers', JSON.stringify(subscribers));
    } catch {}
  }, [subscribers]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newsletterEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setSubscribeStatus('error');
      setErrorMessage('Please enter an email address.');
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setSubscribeStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (subscribers.includes(cleanEmail)) {
      setSubscribeStatus('success');
      setErrorMessage('');
      setNewsletterEmail('');
      return;
    }

    setSubscribers((prev) => [cleanEmail, ...prev]);
    setSubscribeStatus('success');
    setErrorMessage('');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Newsletter Subscription Row */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-850 to-slate-850 p-6 sm:p-8 rounded-2xl border border-emerald-900/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center md:text-left max-w-lg">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Stay Connected with Bonette</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              Subscribe to My Tech & Devotional Newsletter
            </h4>
            <p className="text-xs text-slate-400">
              Receive notifications whenever I publish new software tutorials, dev logs, and inspirational stories from Gatsibo.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (subscribeStatus === 'error') setSubscribeStatus('idle');
                  }}
                  placeholder="Enter your email address..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 text-white border border-slate-700 rounded-xl focus:border-emerald-500 outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {subscribeStatus === 'success' && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Thank you for subscribing! Your email is saved to our community updates list.</span>
              </div>
            )}

            {subscribeStatus === 'error' && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-rose-400 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {BONETTE_PROFILE.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Student engineer in Level 5 Software Development (L5 SOD) at Lycée Saint Alexandre Sauli de Muhura. Proudly representing Gatsibo, Rwanda.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Gatsibo District, Eastern Province, Rwanda</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Navigation
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectTab('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  About & Academic Journey
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('agenda')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Daily Agenda & Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('tutorials')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Web & App Tutorials
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('articles')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Stories & Articles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('family-chat')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Family Chat Sanctuary
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('messages')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Guestbook & Messages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('transcripts')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Transcripts & Certificates
                </button>
              </li>
            </ul>
          </div>

          {/* Socials & Connect */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Direct Contact
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${BONETTE_PROFILE.email}`} className="hover:text-white transition-colors">
                  {BONETTE_PROFILE.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Github className="w-4 h-4 text-slate-300 shrink-0" />
                <a
                  href={`https://github.com/${BONETTE_PROFILE.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  github.com/{BONETTE_PROFILE.github}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <a
                  href={`https://instagram.com/${BONETTE_PROFILE.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  instagram.com/{BONETTE_PROFILE.instagram}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{BONETTE_PROFILE.facebook}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} IBYOYAKOZE Bonette. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Built with React & Node.js</span>
            <span aria-hidden="true">·</span>
            <span>Lycée Saint Alexandre Sauli de Muhura</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
