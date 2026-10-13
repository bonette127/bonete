import React from 'react';
import { Mail, Github, Instagram, Facebook, MapPin, GraduationCap, Code2, Music, Send, Cake, Calendar, Sparkles } from 'lucide-react';
import { BONETTE_PROFILE, getBirthdayInfo } from '../data/portfolioData';

interface HeroSectionProps {
  onOpenMessageModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenMessageModal,
  onNavigateTab,
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-12 sm:pt-12 sm:pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Screen Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed Kicker Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              <span>L5 SOD</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span>Lycée Saint Alexandre Sauli de Muhura</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span>Gatsibo, Rwanda</span>
            </div>

            {/* Display Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {BONETTE_PROFILE.name}
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-emerald-700 dark:text-emerald-400">
                {BONETTE_PROFILE.title}
              </p>
            </div>

            {/* Lead Prose */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Hello! I am a passionate student engineer specializing in <strong className="text-slate-800 dark:text-slate-100">Software Development (SOD)</strong> at <strong className="text-slate-800 dark:text-slate-100">Lycée Saint Alexandre Sauli de Muhura</strong>. Originally from the green hills of <strong className="text-slate-800 dark:text-slate-100">Gatsibo</strong>, I design and build modern websites, fullstack web APIs, and mobile apps. When I am taking a peaceful break from writing code, I love singing inspiring gospel songs to refresh my soul.
            </p>

            {/* Unboxed Metadata Strip */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Gatsibo District, Eastern Rwanda</span>
              </div>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>L5 SOD Candidate</span>
              </div>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Cake className="w-4 h-4 text-rose-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Born: October 15, 2008</span>
              </div>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Music className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Gospel Singer</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenMessageModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                Send Message & Feedback
              </button>

              <button
                onClick={() => onNavigateTab('agenda')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                <Calendar className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                Daily Agenda & Routines
              </button>

              <button
                onClick={() => onNavigateTab('tutorials')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <Code2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                Coding Tutorials
              </button>

              <button
                onClick={() => onNavigateTab('gospel')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <Music className="w-4 h-4" />
                Gospel Sanctuary
              </button>
            </div>

            {/* Social Channels Bar */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="text-slate-400 dark:text-slate-500">Official Channels:</span>
              <a
                href={`https://github.com/${BONETTE_PROFILE.github}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="GitHub @bonette127"
              >
                <Github className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                <span>github/{BONETTE_PROFILE.github}</span>
              </a>

              <a
                href={`https://instagram.com/${BONETTE_PROFILE.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                title="Instagram @bonette127"
              >
                <Instagram className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <span>@{BONETTE_PROFILE.instagram}</span>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Facebook: IBYOYAKOZE Bonette"
              >
                <Facebook className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{BONETTE_PROFILE.facebook}</span>
              </a>

              <a
                href={`mailto:${BONETTE_PROFILE.email}`}
                className="inline-flex items-center gap-1.5 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                title={`Email: ${BONETTE_PROFILE.email}`}
              >
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{BONETTE_PROFILE.email}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Personal Profile Image Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Decorative Subtle Frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-100 to-amber-50 dark:from-slate-800 dark:to-emerald-950/40 rounded-2xl transform -rotate-1 -z-10" />

              <div className="overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md aspect-4/3 sm:aspect-square relative group">
                {!imageError ? (
                  <img
                    src="/src/assets/images/bonette_portrait_1791547560485.jpg"
                    alt="IBYOYAKOZE Bonette - Software Development student at Lycée Saint Alexandre Sauli"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-102"
                  />
                ) : (
                  /* Stylized CSS Fallback Placeholder */
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 text-white text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center mb-4">
                      <Code2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-lg">IBYOYAKOZE Bonette</h3>
                    <p className="text-xs text-slate-300 mt-1">Aspiring Software Engineer · L5 SOD</p>
                    <p className="text-xs text-slate-400 mt-0.5">Lycée Saint Alexandre Sauli de Muhura</p>
                  </div>
                )}

                {/* Bottom Overlay with Verified Identity */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                        Software Developer Profile
                      </p>
                      <p className="text-sm font-bold text-white">
                        IBYOYAKOZE Bonette
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-xs font-medium bg-emerald-700/90 backdrop-blur-xs px-2.5 py-1 rounded text-white">
                        L5 SOD
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Caption beneath picture */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>📍 Lycée Saint Alexandre Sauli tech lab</span>
                <button
                  onClick={() => onNavigateTab('photos')}
                  className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-medium underline cursor-pointer"
                >
                  View full photo gallery →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI / Metrics Strip (Full Width Below Split per Constitution) */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Focus</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">L5 SOD Program</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Lycée Saint Alexandre Sauli</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Roots & Heritage</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Gatsibo District</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">G.S Kibondo Foundation</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Engineering Focus</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Web & Mobile Apps</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">React · Node.js · SQL</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Personal Soul</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Gospel Song Vocalist</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Choir praise when relaxing</p>
          </div>
        </div>
      </div>
    </section>
  );
};
