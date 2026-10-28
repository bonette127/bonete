import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'rw';

const LANGUAGE_STORAGE_KEY = 'bonette_language_preference';

export const TRANSLATIONS = {
  en: {
    // Navigation
    nav_about: 'About & Roots',
    nav_transcripts: 'Transcripts & Certificates',
    nav_achievements: 'Milestones & Badges',
    nav_agenda: 'Daily Agenda',
    nav_tutorials: 'Tutorials',
    nav_articles: 'Articles & Stories',
    nav_photos: 'Moments Gallery',
    nav_gospel: 'Gospel Sanctuary',
    nav_family_chat: 'Family Chat',
    nav_guestbook: 'Guestbook',
    
    // Actions & Badges
    print_cv: 'Print CV / PDF Export',
    portal_login: 'Portal Login',
    admin_suite: 'Admin Suite',
    leave_message: 'Leave a Message',
    search_placeholder: 'Search articles, tutorials, agenda...',
    filter_all: 'All',
    read_story: 'Read Story',
    completed: 'Completed',
    verified_identity: 'Verified Identity',
    daily_log_record: 'Admin Daily Work Log',
    write_article: '+ Write New Article',
    switch_lang: 'Kinyarwanda',
    lang_code: 'RW',
    
    // Transcripts & Certificates
    transcripts_title: 'Official Academic Transcripts & Earned Certificates',
    transcripts_subtitle: 'Comprehensive academic records covering all years of education from G.S Kibondo to Lycée Saint Alexandre Sauli de Muhura, alongside verified honors and technical qualifications.',
    primary_education: 'Primary Education (P1 - P6)',
    ordinary_level: 'Ordinary Level (S1 - S3)',
    software_dev_tvet: 'Level 5 Software Development (L5 SOD)',
    certificates_section: 'Earned Diplomas & Professional Certificates',
    grade_distinction: 'First Class Distinction',
    grade_honors: 'Division I Honors',
    term_report: 'Official Term Report',
    verified_badge: 'Verified Ministry of Education / NESA Standard',
    download_transcript: 'Print / Save Transcript',
    
    // Daily Activity Logging
    daily_logger_title: 'Admin Daily Activity & Engineering Log',
    daily_logger_desc: 'Complete record of tasks executed, technologies mastered, code written, and reflections documented.',
    log_new_activity: 'Log New Daily Activity',
    tech_practiced: 'Technologies Practiced',
    tasks_completed: 'Tasks Completed',
    summary_of_day: 'Summary of the Day',
    
    // Subtitles
    software_student_subtitle: 'Level 5 Software Engineering (L5 SOD)',
    school_name: 'Lycée Saint Alexandre Sauli de Muhura',
    district_name: 'Gatsibo District, Rwanda',
  },
  rw: {
    // Navigation
    nav_about: 'Abo Ndi Bo & Amateka',
    nav_transcripts: 'Indangamanota n\'Impamyabumenyi',
    nav_achievements: 'Ibyagezweho n\'Ibihembo',
    nav_agenda: 'Gahunda y\'Umunsi',
    nav_tutorials: 'Inyigisho z\'Ikoranabuhanga',
    nav_articles: 'Inkuru & Inyandiko',
    nav_photos: 'Amafoto y\'Urwibutso',
    nav_gospel: 'Indirimbo zo Guhimbaza',
    nav_family_chat: 'Ikiganiro cy\'Umuryango',
    nav_guestbook: 'Igitabo cy\'Abashyitsi',
    
    // Actions & Badges
    print_cv: 'Gucapa CV / PDF',
    portal_login: 'Kwinjira muri Porotayiro',
    admin_suite: 'Ibiro by\'Ubuyobozi',
    leave_message: 'Siga Ubutumwa',
    search_placeholder: 'Shakisha muri porotifoliyo...',
    filter_all: 'Byose',
    read_story: 'Soma Inkuru',
    completed: 'Byarangiye',
    verified_identity: 'Umwirondoro Wemejwe',
    daily_log_record: 'Raporo y\'Ibyakozwe Buri Munsi',
    write_article: '+ Andika Inkuru Nshya',
    switch_lang: 'English',
    lang_code: 'EN',
    
    // Transcripts & Certificates
    transcripts_title: 'Indangamanota z\'Amashuri n\'Impamyabumenyi Zahawe',
    transcripts_subtitle: 'Amateka n\'amanota arambuye y\'imyaka yose y\'amashuri guhera muri G.S Kibondo kugera muri Lycée Saint Alexandre Sauli de Muhura, hamwe n\'impamyabumenyi zahawe.',
    primary_education: 'Amashuri Abanza (P1 - P6)',
    ordinary_level: 'Icyiciro Rusange cy\'Amashuri Yisumbuye (S1 - S3)',
    software_dev_tvet: 'Urwego rwa 5 mu Gukora Porogaramu (L5 SOD)',
    certificates_section: 'Impamyabumenyi n\'Ibyemezo by\'Amahugurwa',
    grade_distinction: 'Amanota yo Hejuru Cyane (Distinction)',
    grade_honors: 'Icyiciro cya Mbere (Division I Honors)',
    term_report: 'Raporo y\'Igihembwe Yemejwe',
    verified_badge: 'Bishingiye ku Mabwiriza ya Minisiteri y\'Uburezi / NESA',
    download_transcript: 'Capa / Bika Indangamanota',
    
    // Daily Activity Logging
    daily_logger_title: 'Ibyakozwe n\'Ubuyobozi Buri Munsi',
    daily_logger_desc: 'Raporo yuzuye y\'ibikorwa byakozwe, tekinoloji zize, porogaramu zanditswe n\'inyigisho zakuwemo.',
    log_new_activity: 'Andika Ibyakozwe Uyu Munsi',
    tech_practiced: 'Ibyakoreshejwe mu Ikoranabuhanga',
    tasks_completed: 'Imirimo Yarangiye',
    summary_of_day: 'Incamake y\'Umunsi',
    
    // Subtitles
    software_student_subtitle: 'Umunyeshuri w\'Ikoranabuhanga (L5 SOD)',
    school_name: 'Lycée Saint Alexandre Sauli de Muhura',
    district_name: 'Akarere ka Gatsibo, u Rwanda',
  }
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'rw') {
        return saved;
      }
    } catch {}
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {}
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'rw' : 'en'));
  };

  const t = (key: TranslationKey): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if used outside provider
    const fallbackLang = (typeof window !== 'undefined' && localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'rw') ? 'rw' : 'en';
    return {
      language: fallbackLang as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: TranslationKey) => TRANSLATIONS[fallbackLang as Language][key] || key
    };
  }
  return context;
}
