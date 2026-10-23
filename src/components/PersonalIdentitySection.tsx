import React, { useState } from 'react';
import {
  UserCheck,
  Heart,
  Calendar,
  MapPin,
  GraduationCap,
  Sparkles,
  Award,
  Users,
  ShieldCheck,
  Maximize2,
  X,
  ExternalLink,
  BookOpen,
  Code2
} from 'lucide-react';
import { BONETTE_PROFILE } from '../data/portfolioData';

interface PersonalIdentitySectionProps {
  onNavigateTab?: (tab: string) => void;
}

export const PersonalIdentitySection: React.FC<PersonalIdentitySectionProps> = ({
  onNavigateTab
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; caption: string } | null>(null);

  // Photos
  const personalPhoto = '/src/assets/images/bonette_personal_showcase_1792395117843.jpg';
  const familyPhoto = '/src/assets/images/bonette_family_portrait_1792395098861.jpg';
  const alternatePortrait = '/src/assets/images/bonette_portrait_1791547560485.jpg';

  return (
    <section id="identity-section" className="py-14 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/90 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Official Verified Identity & Family Heritage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Personal Identity & Family Showcase
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Welcome to my verified portfolio space. Here is my official profile portrait as a Level 5 Software Development student, alongside my beloved family from Gatsibo District, Rwanda, who inspire my daily pursuit of excellence in technology and faith.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('about')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all shadow-xs cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Full Academic Journey</span>
              </button>
            )}
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('family-chat')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Join Family Room</span>
              </button>
            )}
          </div>
        </div>

        {/* Dual Showcase Grid: Personal Photo + Family Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card 1: Bonette's Personal Profile Card (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-5">
              {/* Photo Container */}
              <div className="relative group rounded-xl overflow-hidden aspect-4/3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner">
                <img
                  src={personalPhoto}
                  alt="IBYOYAKOZE Bonette - Official Portfolio Portrait"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Portfolio Owner</span>
                </div>
                <button
                  onClick={() => setSelectedPhoto({
                    url: personalPhoto,
                    title: 'IBYOYAKOZE Bonette (Official Developer Portrait)',
                    caption: 'Student Engineer in Level 5 Software Development (L5 SOD) at Lycée Saint Alexandre Sauli de Muhura.'
                  })}
                  className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                  title="Zoom Photo"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bio & Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      IBYOYAKOZE Bonette
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      Level 5 Software Development (L5 SOD)
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Age 17
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Passionate Rwandan software engineering student dedicated to building high-quality web applications, mastering modern TypeScript, React, and relational database systems while serving through gospel music.
                </p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">School</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">Lycée Muhura</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Home</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">Gatsibo, Rwanda</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Born</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">October 15, 2008</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Focus</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">Full Stack & DB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Primary School: G.S Kibondo</span>
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">L5 SOD 2025/2026</span>
            </div>
          </div>

          {/* Card 2: Family Photo & Heritage (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-5">
              {/* Photo Container */}
              <div className="relative group rounded-xl overflow-hidden aspect-16/9 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner">
                <img
                  src={familyPhoto}
                  alt="IBYOYAKOZE Bonette and her loving family in Gatsibo, Rwanda"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>The IBYOYAKOZE Family</span>
                </div>
                <button
                  onClick={() => setSelectedPhoto({
                    url: familyPhoto,
                    title: 'The IBYOYAKOZE Family Portrait',
                    caption: 'Bonette with parents and beloved brothers Mugisha & Cedric, sisters Ruth, Reponce, and Beryse in Rwanda.'
                  })}
                  className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                  title="Zoom Photo"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Family Story */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Bonette & Her Family</span>
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Gatsibo Roots
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Family is the pillar of love, faith, and support behind every milestone. Growing up in the rolling hills of Gatsibo, Rwanda, Bonette is blessed by devoted parents and caring siblings: brothers <strong>Mugisha</strong> and <strong>Cedric</strong>, and sisters <strong>Ruth</strong>, <strong>Reponce</strong>, and <strong>Beryse</strong>.
                </p>

                {/* Family Circle Pills */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Family Circle Members:</span>
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold border border-emerald-200 dark:border-emerald-800">
                      Father & Mother (Parents)
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      Mugisha (Brother)
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      Cedric (Brother)
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      Ruth (Sister)
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      Reponce (Sister)
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      Beryse (Sister)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 italic text-slate-600 dark:text-slate-300">
                &ldquo;Where there is love, faith, and family unity, every ambition blossoms.&rdquo;
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl space-y-4 p-4 sm:p-6 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white">
                {selectedPhoto.title}
              </h4>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {selectedPhoto.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
