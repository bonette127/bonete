import React from 'react';
import { GraduationCap, Heart, Users, MapPin, School, BookOpen, CheckCircle, Code } from 'lucide-react';
import { BONETTE_PROFILE } from '../data/portfolioData';

export const AboutEducationSection: React.FC = () => {
  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            01. Background & Academic Journey
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Journey from Gatsibo to Software Engineering
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
            Every software system begins with strong foundations. From my first school days at G.S Kibondo to my technical training at Lycée Saint Alexandre Sauli de Muhura, here is how my passion for technology and community has developed.
          </p>
        </div>

        {/* 3 Academic Milestones Bento / Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lycée Saint Alexandre Sauli de Muhura */}
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">CURRENT · SENIOR 5</span>
                <span>2024 - Present</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <School className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Lycée Saint Alexandre Sauli de Muhura
                </h3>
              </div>
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300 mb-3">
                Level 5 Software Development (L5 SOD)
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Specialized vocational training in computer programming, database administration, software testing, client-server web architectures, and algorithms.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Full-stack web & mobile development</span>
            </div>
          </div>

          {/* G.S Kibondo - Lower Secondary */}
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span className="font-semibold text-slate-700 dark:text-slate-300">ORDINARY LEVEL (O-LEVEL)</span>
                <span>Graduated</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-slate-700 dark:text-slate-300 shrink-0" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  G.S. Kibondo
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-3">
                Lower Secondary School (Senior 1 – Senior 3)
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Excelled in core sciences, mathematics, and English communication, igniting an appetite for computational problem solving and leadership.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Foundational sciences & math excellence</span>
            </div>
          </div>

          {/* G.S Kibondo - Nursery & Primary */}
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span className="font-semibold text-slate-700 dark:text-slate-300">EARLY ROOTS</span>
                <span>Foundational</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-slate-700 dark:text-slate-300 shrink-0" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  G.S. Kibondo
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-3">
                Nursery & Primary School (P1 – P6)
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Where my educational footsteps began. Cultivated discipline, gospel singing in school chorales, curiosity for books, and respect for community values.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Primary graduation & youth chorale</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Family Tribute & Gatsibo Home */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Family Card */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-50/40 via-white to-emerald-50/30 dark:from-slate-850 dark:via-slate-800 dark:to-emerald-950/20 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>My Loved Family & Inspiration</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Blessed by Parents, Brothers & Sisters
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Behind every line of code I write is the love and encouragement of my wonderful family who believe in my dream of becoming a software engineer:
              </p>

              <div className="space-y-3 pt-2">
                {/* Parents */}
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Father & Mother</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    My foundation of prayers, wisdom, and steadfast moral support.
                  </p>
                </div>

                {/* 2 Brothers */}
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">2 Caring Brothers</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Mugisha · Cedric</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-white">Mugisha</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="font-semibold text-slate-800 dark:text-white">Cedric</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span>Always motivating me to aim high in tech!</span>
                  </div>
                </div>

                {/* 3 Sisters */}
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">3 Wonderful Sisters</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Ruth · Reponce · Beryse</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-white">Ruth</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="font-semibold text-slate-800 dark:text-white">Reponce</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="font-semibold text-slate-800 dark:text-white">Beryse</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span>My joy, cheerleaders, and prayer partners</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 italic">
              "Family is the quiet root that lets the tree grow toward the sky."
            </p>
          </div>

          {/* Right: Gatsibo Roots & Rwandan Landscape */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col bg-slate-900 text-white shadow-sm">
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <img
                src="/src/assets/images/gatsibo_rwanda_scenery_1791547617271.jpg"
                alt="Scenic view of Gatsibo District hills, Eastern Province, Rwanda"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold rounded-md border border-white/20 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Gatsibo, Rwanda
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                  Origin & Identity
                </p>
                <h4 className="text-lg font-bold text-white mt-0.5">
                  The Rolling Green Hills of Gatsibo
                </h4>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-sm text-slate-300 leading-relaxed">
                Gatsibo District in the Eastern Province is my home. Its peaceful mornings, fertile terraces, and warm community spirit remind me of resilience and focus. As Rwanda advances toward digital transformation, I want to represent Gatsibo on national and international tech stages.
              </p>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Date of Birth:</span>
                  <span className="font-semibold text-emerald-300">October 15, 2008</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Province:</span>
                  <span className="font-semibold text-white">Eastern Province (Gatsibo)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">School Location:</span>
                  <span className="font-semibold text-white">Muhura Sector</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Proficiency Strip */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            <Code className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Technical Capabilities in L5 SOD</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BONETTE_PROFILE.skills.map((skill) => (
              <div key={skill.name} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  <span>{skill.name}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono">{skill.proficiency}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 dark:bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
