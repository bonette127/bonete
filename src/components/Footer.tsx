import React from 'react';
import { Mail, Github, Instagram, Facebook, Heart, MapPin, GraduationCap } from 'lucide-react';
import { BONETTE_PROFILE } from '../data/portfolioData';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
                  onClick={() => onSelectTab('tutorials')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Web & App Tutorials
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('photos')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Photo Moments & Uploads
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('gospel')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Gospel Songs & Peace
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
                  onClick={() => onSelectTab('database')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  SQLite & CockroachDB Studio
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
