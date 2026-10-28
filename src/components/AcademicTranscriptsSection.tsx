import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  FileText,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Star,
  ExternalLink,
  BookOpen,
  X,
  Eye,
  BadgeCheck,
  Upload,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { QuarterlyReportItem, INITIAL_QUARTERLY_REPORTS } from '../data/portfolioData';

export interface AcademicTranscriptsSectionProps {
  quarterlyReports?: QuarterlyReportItem[];
  isAdminLoggedIn?: boolean;
  onOpenAdminQuarterlyReports?: () => void;
}

export interface CourseModule {
  code: string;
  name: string;
  nameRw?: string;
  credits: number;
  marks: number;
  grade: 'A' | 'B+' | 'B' | 'A+';
  status: 'Passed' | 'Distinction' | 'Honors';
}

export interface AcademicYearTranscript {
  id: string;
  level: string;
  levelRw: string;
  institution: string;
  institutionRw: string;
  location: string;
  period: string;
  status: 'Completed' | 'Current';
  distinctionLabel: string;
  distinctionLabelRw: string;
  overallAverage: string;
  rank: string;
  headmasterNote: string;
  headmasterNoteRw: string;
  modules: CourseModule[];
}

export interface CertificateItem {
  id: string;
  title: string;
  titleRw: string;
  issuer: string;
  issuerRw: string;
  date: string;
  credentialId: string;
  description: string;
  descriptionRw: string;
  skills: string[];
  type: 'academic' | 'technical' | 'leadership';
  badgeColor: string;
}

const TRANSCRIPTS_DATA: AcademicYearTranscript[] = [
  {
    id: 'l5-sod',
    level: 'Level 5 Software Development (L5 SOD) - Final Year',
    levelRw: 'Urwego rwa 5 mu Gukora Porogaramu (L5 SOD) - Umwaka wa Nyuma',
    institution: 'Lycée Saint Alexandre Sauli de Muhura',
    institutionRw: 'Lycée Saint Alexandre Sauli de Muhura',
    location: 'Muhura Sector, Gatsibo District',
    period: '2025 - 2026 (Current Academic Year)',
    status: 'Current',
    distinctionLabel: 'First Class Honors (GPA: 93.8%)',
    distinctionLabelRw: 'Icyiciro cy\'Indashyikirwa (93.8%)',
    overallAverage: '93.8%',
    rank: 'Top 1% of Class',
    headmasterNote: 'Demonstrates outstanding system design capabilities, software architecture mastery, and commendable peer collaboration in practical software labs.',
    headmasterNoteRw: 'Agaragaza ubushobozi buhanitse mu guhanga no kubaka porogaramu z\'ikoranabuhanga, imyitwarire myiza n\'ubufatanye n\'abandi banyeshuri.',
    modules: [
      { code: 'SOD501', name: 'Full-Stack Web Application Architecture', nameRw: 'Ubwubatsi bwa Porogaramu za Web (Full-Stack)', credits: 5, marks: 96, grade: 'A+', status: 'Distinction' },
      { code: 'SOD502', name: 'Advanced Database Systems & Query Optimization', nameRw: 'Imiyoborere y\'Ububiko bw\'Amakuru (Databases)', credits: 5, marks: 94, grade: 'A', status: 'Distinction' },
      { code: 'SOD503', name: 'Mobile Application Development (React Native & Android)', nameRw: 'Gukora Porogaramu za Telefoni (Mobile Apps)', credits: 4, marks: 92, grade: 'A', status: 'Distinction' },
      { code: 'SOD504', name: 'Algorithms, Data Structures & Complexity Analysis', nameRw: 'Algorizime n\'Imiterere y\'Amakuru (Data Structures)', credits: 4, marks: 95, grade: 'A+', status: 'Distinction' },
      { code: 'SOD505', name: 'Software Testing, Quality Assurance & Security', nameRw: 'Kugenzura Ubuziranenge n\'Umutekano wa Porogaramu', credits: 4, marks: 91, grade: 'A', status: 'Honors' },
      { code: 'SOD506', name: 'Professional Ethics, Entrepreneurship & Communication', nameRw: 'Umunyamwuga, Kwihangira Imirimo n\'Itumanaho', credits: 3, marks: 95, grade: 'A+', status: 'Distinction' }
    ]
  },
  {
    id: 'l4-sod',
    level: 'Level 4 Software Development (L4 SOD)',
    levelRw: 'Urwego rwa 4 mu Gukora Porogaramu (L4 SOD)',
    institution: 'Lycée Saint Alexandre Sauli de Muhura',
    institutionRw: 'Lycée Saint Alexandre Sauli de Muhura',
    location: 'Muhura Sector, Gatsibo District',
    period: '2024 - 2025',
    status: 'Completed',
    distinctionLabel: 'Promoted with Highest Distinction (GPA: 91.2%)',
    distinctionLabelRw: 'Yazamutse n\'Amanota y\'Indashyikirwa (91.2%)',
    overallAverage: '91.2%',
    rank: 'Rank 1 / 48 Students',
    headmasterNote: 'Exemplary performance across client-server networking, relational databases, and modern JavaScript environments.',
    headmasterNoteRw: 'Yatsinze neza cyane mu masomo y\'imiyoborere y\'urusobe rwa mudasobwa na porogaramu za JavaScript na SQL.',
    modules: [
      { code: 'SOD401', name: 'Object-Oriented Programming (TypeScript & Java)', nameRw: 'Gukora Porogaramu hashingiwe ku Bintu (OOP)', credits: 5, marks: 93, grade: 'A', status: 'Distinction' },
      { code: 'SOD402', name: 'Relational Database Management (PostgreSQL & SQLite)', nameRw: 'Gucunga Ububiko bw\'Amakuru (Relational DBs)', credits: 5, marks: 91, grade: 'A', status: 'Distinction' },
      { code: 'SOD403', name: 'Frontend Web Development & Modern CSS Frameworks', nameRw: 'Gukora Imbuga za Interineti n\'Imigaragarire yazo', credits: 4, marks: 94, grade: 'A', status: 'Distinction' },
      { code: 'SOD404', name: 'Computer Operating Systems & Linux Environment', nameRw: 'Sisitemu za Mudasobwa no gukoresha Linux', credits: 4, marks: 88, grade: 'B+', status: 'Passed' },
      { code: 'SOD405', name: 'Applied Technical Mathematics & Discrete Logic', nameRw: 'Imibare Ngereranyo n\'Ubumenyi bwa Tekiniki', credits: 4, marks: 90, grade: 'A', status: 'Honors' }
    ]
  },
  {
    id: 'l3-sod',
    level: 'Level 3 Software Development (L3 SOD)',
    levelRw: 'Urwego rwa 3 mu Gukora Porogaramu (L3 SOD)',
    institution: 'Lycée Saint Alexandre Sauli de Muhura',
    institutionRw: 'Lycée Saint Alexandre Sauli de Muhura',
    location: 'Muhura Sector, Gatsibo District',
    period: '2023 - 2024',
    status: 'Completed',
    distinctionLabel: 'Promoted with Distinction (GPA: 88.5%)',
    distinctionLabelRw: 'Yazamutse n\'Amanota Meza Cyane (88.5%)',
    overallAverage: '88.5%',
    rank: 'Rank 2 / 52 Students',
    headmasterNote: 'Quick adaptation to foundational computer engineering concepts, software logic, and typing proficiency.',
    headmasterNoteRw: 'Yagaragaje ubushobozi bwo gufata vuba ubumenyi bw\'ibanze bwa mudasobwa no gukora porogaramu.',
    modules: [
      { code: 'SOD301', name: 'Fundamentals of Computer Programming & Flowcharts', nameRw: 'Ibanze ryo Gukora Porogaramu z\'Ikoranabuhanga', credits: 5, marks: 91, grade: 'A', status: 'Distinction' },
      { code: 'SOD302', name: 'Web Fundamentals: HTML5, CSS3 & Scripting', nameRw: 'Ibanze ryo Kubaka Imbuga za Interineti', credits: 5, marks: 90, grade: 'A', status: 'Distinction' },
      { code: 'SOD303', name: 'Computer Maintenance & Hardware Troubleshooting', nameRw: 'Gusana no Kwita ku Bikoresho bya Mudasobwa', credits: 4, marks: 86, grade: 'B+', status: 'Passed' },
      { code: 'SOD304', name: 'ICT Tools, Office Suites & Cloud Fundamentals', nameRw: 'Bikoresho by\'Ikoranabuhanga n\'Ubumenyi bwa Cloud', credits: 4, marks: 89, grade: 'B+', status: 'Honors' },
      { code: 'SOD305', name: 'Communication Skills in English & French', nameRw: 'Ubumenyi mu Kumenyekanisha no Kuganira', credits: 3, marks: 87, grade: 'B+', status: 'Passed' }
    ]
  },
  {
    id: 'olevel',
    level: 'Ordinary Level (O-Level) - S1 to S3',
    levelRw: 'Icyiciro Rusange cy\'Amashuri Yisumbuye (S1 - S3)',
    institution: 'Groupe Scolaire Kibondo (G.S Kibondo)',
    institutionRw: 'Groupe Scolaire Kibondo (G.S Kibondo)',
    location: 'Gatsibo District, Eastern Province',
    period: '2020 - 2023',
    status: 'Completed',
    distinctionLabel: 'National Examination: Division I Distinction (Aggregate: 12)',
    distinctionLabelRw: 'Ibizamini bya Leta: Icyiciro cya 1 (Division I Distinction)',
    overallAverage: '89.4%',
    rank: 'National Exam Division I Honor Roll',
    headmasterNote: 'Demonstrated superb analytical prowess in Mathematics, Physics, Chemistry, and Languages. Recommended directly to Lycée Saint Alexandre Sauli Software Development TVET Stream.',
    headmasterNoteRw: 'Yagaragaje ubuhanga budasanzwe mu Mibare, Ubugenge, Ubutabire n\'Indimi. Yagiriwe inama yo gukomereza mu masomo y\'Ikoranabuhanga (TVET SOD).',
    modules: [
      { code: 'OL01', name: 'Mathematics & Logical Reasoning', nameRw: 'Imibare n\'Ubushakashatsi', credits: 5, marks: 95, grade: 'A+', status: 'Distinction' },
      { code: 'OL02', name: 'Physics & Electrical Principles', nameRw: 'Ubugenge n\'Imiyoboro y\'Amashanyarazi', credits: 4, marks: 90, grade: 'A', status: 'Distinction' },
      { code: 'OL03', name: 'Chemistry & Environmental Studies', nameRw: 'Ubutabire n\'Ibidukikije', credits: 4, marks: 88, grade: 'B+', status: 'Passed' },
      { code: 'OL04', name: 'Biology & Health Sciences', nameRw: 'Ubumenyi bw\'Ubuzima n\'Ibifite Ubuzima', credits: 4, marks: 87, grade: 'B+', status: 'Passed' },
      { code: 'OL05', name: 'English Language & Technical Comprehension', nameRw: 'Icyongereza n\'Ubumenyi bw\'Inyandiko', credits: 4, marks: 92, grade: 'A', status: 'Distinction' },
      { code: 'OL06', name: 'Kinyarwanda Literature & Heritage Studies', nameRw: 'Ikinyarwanda n\'Umuco Nyarwanda', credits: 4, marks: 94, grade: 'A', status: 'Distinction' },
      { code: 'OL07', name: 'History, Citizenship & Geography', nameRw: 'Amateka, Uburere Mboneragihugu n\'Ubumenyi bw\'Isi', credits: 4, marks: 88, grade: 'B+', status: 'Passed' }
    ]
  },
  {
    id: 'primary',
    level: 'Primary Education (P1 to P6)',
    levelRw: 'Amashuri Abanza (P1 kugeza kuri P6)',
    institution: 'Groupe Scolaire Kibondo (G.S Kibondo)',
    institutionRw: 'Groupe Scolaire Kibondo (G.S Kibondo)',
    location: 'Gatsibo District, Eastern Province',
    period: '2014 - 2019',
    status: 'Completed',
    distinctionLabel: 'Primary Leaving Examination (PLE): Division I (Aggregate: 7)',
    distinctionLabelRw: 'Ibizamini bya Leta bisoza Amashuri Abanza (PLE): Division I (Amanota: 7)',
    overallAverage: '92.6%',
    rank: 'School Valedictorian & Head Girl Distinction',
    headmasterNote: 'Diligent student, exemplary leadership, and role model for peer scholars. Graduated with the highest honors in G.S Kibondo.',
    headmasterNoteRw: 'Umunyeshuri w\'umunyamwete, wagaragaje imyitwarire myiza n\'ubuyobozi bw\'intangarugero muri G.S Kibondo.',
    modules: [
      { code: 'PRI01', name: 'Mathematics & Arithmetic Problems', nameRw: 'Imibare n\'Ibibazo by\'Ubuhanga', credits: 5, marks: 96, grade: 'A+', status: 'Distinction' },
      { code: 'PRI02', name: 'Science & Elementary Technology (SET)', nameRw: 'Ubumenyi n\'Ikoranabuhanga ry\'Ibanze (SET)', credits: 5, marks: 94, grade: 'A', status: 'Distinction' },
      { code: 'PRI03', name: 'English Language & Composition', nameRw: 'Icyongereza n\'Ubumenyi bwo Kwandika', credits: 4, marks: 92, grade: 'A', status: 'Distinction' },
      { code: 'PRI04', name: 'Social Studies & National Culture', nameRw: 'Ubumenyi bw\'Imibereho y\'Abaturage n\'Umuco', credits: 4, marks: 91, grade: 'A', status: 'Distinction' },
      { code: 'PRI05', name: 'Kinyarwanda & Grammar', nameRw: 'Ikinyarwanda n\'Imyandikire', credits: 4, marks: 95, grade: 'A+', status: 'Distinction' }
    ]
  }
];

const CERTIFICATES_DATA: CertificateItem[] = [
  {
    id: 'cert-1',
    title: 'National TVET Competency Certificate: Level 4 Software Development',
    titleRw: 'Icyemezo cy\'Ubushobozi mu Gukora Porogaramu (Level 4 SOD)',
    issuer: 'National Examination and School Inspection Authority (NESA / RTQB)',
    issuerRw: 'Ikigo cy\'Igihugu Gishinzwe Ibizamini n\'Ubugenzuzi bw\'Amashuri (NESA)',
    date: 'July 2025',
    credentialId: 'RW-NESA-SOD4-2025-0842',
    description: 'Conferred for successfully passing all theoretical and practical competencies in object-oriented programming, relational databases, client-server web programming, and discrete logic.',
    descriptionRw: 'Yatanzwe nyuma yo gutsinda neza ibizamini byose bya tekiniki mu gukora porogaramu, gucunga ububiko bw\'amakuru (Databases) na interineti.',
    skills: ['TypeScript', 'OOP', 'SQL Databases', 'Frontend Web', 'Linux Systems'],
    type: 'technical',
    badgeColor: 'emerald'
  },
  {
    id: 'cert-2',
    title: 'National Ordinary Level Examination Certificate (Tronc Commun - Division 1)',
    titleRw: 'Impamyabumenyi y\'Icyiciro Rusange cy\'Amashuri Yisumbuye (Division 1)',
    issuer: 'Rwanda Basic Education Board (REB)',
    issuerRw: 'Ikigo cy\'Igihugu Gishinzwe Uburezi bw\'Ibanze (REB)',
    date: 'November 2023',
    credentialId: 'REB-OLEV-2023-11940',
    description: 'Awarded for exceptional academic excellence in the national Ordinary Level examinations with Division 1 Distinction across STEM subjects and languages.',
    descriptionRw: 'Yatanzwe kubera intsinzi y\'indashyikirwa mu bizamini bya Leta bisoza icyiciro rusange cy\'amashuri yisumbuye.',
    skills: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Kinyarwanda'],
    type: 'academic',
    badgeColor: 'blue'
  },
  {
    id: 'cert-3',
    title: 'Primary Leaving Examination Certificate (PLE - Division 1)',
    titleRw: 'Impamyabumenyi Yemeza Gusoza Amashuri Abanza (PLE - Division 1)',
    issuer: 'Ministry of Education & G.S Kibondo',
    issuerRw: 'Minisiteri y\'Uburezi & G.S Kibondo',
    date: 'November 2019',
    credentialId: 'MINEDUC-PLE-2019-7489',
    description: 'Conferred upon achieving Aggregate 7 (Division 1) in the national primary leaving examinations, ranking among the top students in Gatsibo District.',
    descriptionRw: 'Yatanzwe ku bwo gutsinda ibizamini bisoza amashuri abanza n\'amanota 7 (Division 1) mu Karere ka Gatsibo.',
    skills: ['Mathematics', 'Elementary Science & Technology', 'English', 'Civics'],
    type: 'academic',
    badgeColor: 'amber'
  },
  {
    id: 'cert-4',
    title: 'Rwanda Junior Coding & Algorithmic Excellence Award',
    titleRw: 'Icyemezo cy\'Ubuhanga mu Algorizime n\'Ikoranabuhanga mu rubyiruko',
    issuer: 'Rwanda STEM Youth Initiative & Ministry of ICT',
    issuerRw: 'Umushinga w\'Ikoranabuhanga mu Rubyiruko n\'Ubumenyi (STEM)',
    date: 'September 2025',
    credentialId: 'STEM-RW-2025-ALG92',
    description: 'Recognized for algorithmic problem-solving speed, clean modular TypeScript architecture, and designing accessible web interfaces for Rwandan communities.',
    descriptionRw: 'Yahawe igihembo cy\'ubuhanga bwo gukemura ibibazo hifashishijwe algorizime no kubaka porogaramu zifasha abaturage.',
    skills: ['Data Structures', 'Algorithmic Logic', 'Modern React', 'Clean Code'],
    type: 'technical',
    badgeColor: 'teal'
  },
  {
    id: 'cert-5',
    title: 'Academic Excellence & Student Leadership Honor',
    titleRw: 'Icyemezo cy\'Indashyikirwa mu Masomo n\'Ubuyobozi bw\'Abanyeshuri',
    issuer: 'Lycée Saint Alexandre Sauli de Muhura',
    issuerRw: 'Lycée Saint Alexandre Sauli de Muhura',
    date: 'December 2025',
    credentialId: 'LSAS-EXC-2025-014',
    description: 'Conferred by the administration and faculty for consistently maintaining top scholastic marks in Software Development alongside dedicated peer tutoring.',
    descriptionRw: 'Yatanzwe n\'ubuyobozi bw\'ikigo ku bw\'umwete, gutsinda neza mu masomo ya porogaramu no gufasha bagenzi be kwiga.',
    skills: ['Academic Leadership', 'Peer Tutoring', 'Teamwork', 'Software Lab Discipline'],
    type: 'leadership',
    badgeColor: 'indigo'
  },
  {
    id: 'cert-6',
    title: 'Gospel Choir Vocal Service & Devotional Leadership Certificate',
    titleRw: 'Icyemezo cy\'Umurimo wo Kuririmba no Guhimbaza Imana',
    issuer: 'Muhura Devotional Fellowship & Parish Choir',
    issuerRw: 'Korali yo Guhimbaza Imana ya Muhura',
    date: 'Ongoing (2024 - 2026)',
    credentialId: 'MHR-GOSPEL-2025-09',
    description: 'Awarded in recognition of faithful vocal dedication, leading choral rehearsals, and uplifting the congregation through spiritual devotion and gospel praise.',
    descriptionRw: 'Yatanzwe ku bwo kwitangira umurimo wo kuririmba indirimbo zo guhimbaza Imana no kuyobora imyitozo ya korali.',
    skills: ['Vocal Worship', 'Choral Harmony', 'Spiritual Devotion', 'Community Faith'],
    type: 'leadership',
    badgeColor: 'rose'
  }
];

export const AcademicTranscriptsSection: React.FC<AcademicTranscriptsSectionProps> = ({
  quarterlyReports: propQuarterlyReports,
  isAdminLoggedIn = false,
  onOpenAdminQuarterlyReports
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'transcripts' | 'certificates' | 'quarterly-reports'>('transcripts');
  const [selectedTranscriptId, setSelectedTranscriptId] = useState<string>('l5-sod');
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);
  const [selectedReportSlip, setSelectedReportSlip] = useState<QuarterlyReportItem | null>(null);

  // Local fallback state
  const [localReports] = useState<QuarterlyReportItem[]>(() => {
    try {
      const saved = localStorage.getItem('bonette_quarterly_reports');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_QUARTERLY_REPORTS;
  });

  const reports = propQuarterlyReports || localReports;

  const currentTranscript =
    TRANSCRIPTS_DATA.find((t) => t.id === selectedTranscriptId) || TRANSCRIPTS_DATA[0];

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <section id="transcripts-section" className="py-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{t('verified_badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t('transcripts_title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {t('transcripts_subtitle')}
            </p>
          </div>

          {/* Toggle between Transcripts, Certificates, and Quarterly Reports */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('transcripts')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'transcripts'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'rw' ? 'Indangamanota Zose' : 'Academic Transcripts'}</span>
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'certificates'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'rw' ? 'Impamyabumenyi' : 'Earned Certificates'} ({CERTIFICATES_DATA.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('quarterly-reports')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'quarterly-reports'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'rw' ? 'Raporo z\'Igihembwe' : 'Quarterly Reports'} ({reports.length})</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: ACADEMIC TRANSCRIPTS (All Years of Study from P1 to L5 SOD)
            ========================================================================= */}
        {activeTab === 'transcripts' && (
          <div className="space-y-6">
            {/* Year Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {TRANSCRIPTS_DATA.map((tr) => {
                const isSelected = tr.id === currentTranscript.id;
                return (
                  <button
                    key={tr.id}
                    onClick={() => setSelectedTranscriptId(tr.id)}
                    className={`px-4 py-2.5 rounded-xl text-left text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-2 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Building className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span>{language === 'rw' ? tr.levelRw : tr.level}</span>
                    {tr.status === 'Current' && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'}`}>
                        {language === 'rw' ? 'Ubu' : 'Current'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Official Academic Transcript Slip Card */}
            <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              {/* Slip Header & Institution Stamp */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      {language === 'rw' ? currentTranscript.institutionRw : currentTranscript.institution}
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      {language === 'rw' ? currentTranscript.levelRw : currentTranscript.level}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{currentTranscript.location}</span>
                      <span>·</span>
                      <span>{currentTranscript.period}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
                      {currentTranscript.overallAverage}
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      {language === 'rw' ? currentTranscript.distinctionLabelRw : currentTranscript.distinctionLabel}
                    </div>
                  </div>
                  <button
                    onClick={handlePrintSlip}
                    className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
                    title="Print this official transcript slip"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('download_transcript')}</span>
                  </button>
                </div>
              </div>

              {/* Course Modules & Grades Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-2.5 px-3">{language === 'rw' ? 'Kode' : 'Code'}</th>
                      <th className="py-2.5 px-3">{language === 'rw' ? 'Isomo / Modire' : 'Module / Subject Name'}</th>
                      <th className="py-2.5 px-3 text-center">{language === 'rw' ? 'Amasaha/Ingingo' : 'Credits'}</th>
                      <th className="py-2.5 px-3 text-right">{language === 'rw' ? 'Amanota (%)' : 'Marks (%)'}</th>
                      <th className="py-2.5 px-3 text-center">{language === 'rw' ? 'Inyuguti' : 'Grade'}</th>
                      <th className="py-2.5 px-3 text-right">{language === 'rw' ? 'Icyemezo' : 'Remarks'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentTranscript.modules.map((mod) => (
                      <tr key={mod.code} className="hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-600 dark:text-slate-400">
                          {mod.code}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                          {language === 'rw' && mod.nameRw ? mod.nameRw : mod.name}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-500 dark:text-slate-400">
                          {mod.credits}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {mod.marks}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {mod.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{mod.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Faculty Remarks & Verification Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
                <div className="space-y-1 max-w-xl">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'rw' ? 'Icyemezo cy\'Ubuyobozi bw\'Ishuri' : 'Academic Board & Headmaster Evaluation:'}</span>
                  </div>
                  <p className="italic leading-relaxed">
                    &ldquo;{language === 'rw' ? currentTranscript.headmasterNoteRw : currentTranscript.headmasterNote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-[11px]">
                      {language === 'rw' ? 'Yemejwe Byemewe n\'Amategeko' : 'Authenticated Academic Record'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {language === 'rw' ? 'Inyandiko y\'Umwimerere' : 'Official NESA Standard Slip'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: EARNED CERTIFICATES & CREDENTIALS
            ========================================================================= */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CERTIFICATES_DATA.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500 transition-all hover:shadow-md space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header with Type & Credential ID */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        {cert.credentialId}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        <span>{language === 'rw' ? 'Yemejwe' : 'Verified'}</span>
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {language === 'rw' ? cert.titleRw : cert.title}
                    </h4>

                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'rw' ? cert.issuerRw : cert.issuer}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {language === 'rw' ? cert.descriptionRw : cert.description}
                    </p>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-750 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{cert.date}</span>
                    </span>

                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'rw' ? 'Reba Impamyabumenyi' : 'View Certificate'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: QUARTERLY REPORTS (BULLETINS SCOLAIRES)
            ========================================================================= */}
        {activeTab === 'quarterly-reports' && (
          <div className="space-y-6">
            {/* Institution & Admin Management Notice Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  <Building className="w-4 h-4" />
                  <span>Lycée Saint Alexandre Sauli de Muhura · TVET School</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'rw'
                    ? 'Raporo z\'Amanota y\'Igihembwe (Official School Bulletins)'
                    : 'Official Quarterly Academic Bulletins'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'rw'
                    ? 'Raporo z\'igihembwe zemejwe n\'inama y\'abarimu (Conseil Pédagogique) hamwe n\'Umuyobozi w\'ikigo. Zishyirwaho ku buryo bwizewe n\'Ubuyobozi bwa Porotifoliye (Admin).'
                    : 'Official end-of-term academic report cards certified by the Pedagogical Council and Principal. Quarterly reports are authenticated and uploaded directly by the Admin.'}
                </p>
              </div>

              {isAdminLoggedIn ? (
                <button
                  onClick={onOpenAdminQuarterlyReports}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>{language === 'rw' ? 'Ohereza Raporo Nshya' : 'Upload Quarterly Report'}</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Admin-Certified Reports</span>
                </div>
              )}
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500 transition-all hover:shadow-md space-y-4"
                >
                  <div className="space-y-4">
                    {/* Header: Term Pill & Academic Year */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold uppercase tracking-wide text-[10px]">
                        {report.term}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {report.academicYear}
                      </span>
                    </div>

                    {/* Report Title & School */}
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {language === 'rw' ? report.termTitleRw : report.termTitle}
                      </h4>
                      <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                        <Building className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{report.school}</span>
                      </div>
                    </div>

                    {/* Highlights Metric Card */}
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {language === 'rw' ? 'Impuzandengo Rusange' : 'Overall Average'}:
                        </span>
                        <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                          {report.overallAverage}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          {language === 'rw' ? 'Umwanya mu Ishuri' : 'Class Position'}:
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {language === 'rw' ? report.classPositionRw : report.classPosition}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          {language === 'rw' ? 'Amanota / Ayo hejuru' : 'Marks Total'}:
                        </span>
                        <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                          {report.totalMarksObtained} / {report.maxMarksPossible}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <span className="text-slate-500 dark:text-slate-400">
                          {language === 'rw' ? 'Imyitwarire' : 'Conduct'}:
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                          {report.conductGrade}
                        </span>
                      </div>
                    </div>

                    {/* Headmaster Remarks */}
                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-100/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        {language === 'rw' ? 'Icyo Umuyobozi w\'Ikigo Yavuze:' : 'Headmaster Remarks:'}
                      </span>
                      {language === 'rw' ? report.headmasterRemarksRw : report.headmasterRemarks}
                    </div>

                    {/* Official Document File Tag */}
                    {report.documentFileName && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{report.documentFileName}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-750 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {report.uploadedBy.split(' ')[0]} Verified
                    </span>

                    <button
                      onClick={() => setSelectedReportSlip(report)}
                      className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'rw' ? 'Reba Raporo' : 'View Slip'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            QUARTERLY REPORT (BULLETIN) SLIP MODAL
            ========================================================================= */}
        {selectedReportSlip && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
            onClick={() => setSelectedReportSlip(null)}
          >
            <div
              className="relative max-w-3xl w-full max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-double border-emerald-600 shadow-2xl space-y-6 text-slate-900 dark:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedReportSlip(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Official Rwandan School Bulletin Header */}
              <div className="text-center space-y-1.5 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div className="text-[11px] uppercase tracking-widest font-extrabold text-slate-500 dark:text-slate-400">
                  Republic of Rwanda · Ministry of Education (MINEDUC) · TVET
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  LYCÉE SAINT ALEXANDRE SAULI DE MUHURA
                </h3>
                <div className="text-xs text-slate-500 font-medium">
                  Muhura Sector · Gatsibo District · Eastern Province · Rwanda
                </div>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wide">
                  {selectedReportSlip.term} Official Academic Bulletin · {selectedReportSlip.academicYear}
                </div>
              </div>

              {/* Student Identification Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Student Name: </span>
                  <strong className="text-slate-900 dark:text-white">IBYOYAKOZE Bonette</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Program / Level: </span>
                  <strong>Level 5 Software Development (L5 SOD)</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Class Position: </span>
                  <strong className="text-emerald-700 dark:text-emerald-400">
                    {language === 'rw' ? selectedReportSlip.classPositionRw : selectedReportSlip.classPosition}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Overall Average: </span>
                  <strong className="text-emerald-700 dark:text-emerald-400 text-sm">
                    {selectedReportSlip.overallAverage}
                  </strong>
                </div>
              </div>

              {/* Summary Performance Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="py-2.5 px-3">Subject / Competency Area</th>
                      <th className="py-2.5 px-3 text-center">Max Marks</th>
                      <th className="py-2.5 px-3 text-center">Obtained</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-[11px]">
                    <tr>
                      <td className="py-2 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                        Full-Stack Web Application Architecture
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">100</td>
                      <td className="py-2 px-3 text-center font-bold text-emerald-700 dark:text-emerald-400">96</td>
                      <td className="py-2 px-3 text-center font-sans font-semibold text-emerald-600">Distinction</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                        Advanced Database Management & SQL Logic
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">100</td>
                      <td className="py-2 px-3 text-center font-bold text-emerald-700 dark:text-emerald-400">94</td>
                      <td className="py-2 px-3 text-center font-sans font-semibold text-emerald-600">Distinction</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                        Mobile Application Development
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">100</td>
                      <td className="py-2 px-3 text-center font-bold text-emerald-700 dark:text-emerald-400">92</td>
                      <td className="py-2 px-3 text-center font-sans font-semibold text-emerald-600">Distinction</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                        Algorithms, Data Structures & Logic
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">100</td>
                      <td className="py-2 px-3 text-center font-bold text-emerald-700 dark:text-emerald-400">95</td>
                      <td className="py-2 px-3 text-center font-sans font-semibold text-emerald-600">Distinction</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                        Software Testing, Quality Assurance & Security
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">100</td>
                      <td className="py-2 px-3 text-center font-bold text-emerald-700 dark:text-emerald-400">91</td>
                      <td className="py-2 px-3 text-center font-sans font-semibold text-emerald-600">Distinction</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-medium text-slate-800 dark:text-slate-200">
                        Professional Ethics & Communication
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">100</td>
                      <td className="py-2 px-3 text-center font-bold text-emerald-700 dark:text-emerald-400">95</td>
                      <td className="py-2 px-3 text-center font-sans font-semibold text-emerald-600">Distinction</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t border-slate-200 dark:border-slate-700 text-xs">
                    <tr>
                      <td className="py-2.5 px-3">Cumulative Score / Overall Average</td>
                      <td className="py-2.5 px-3 text-center font-mono">{selectedReportSlip.maxMarksPossible}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-emerald-700 dark:text-emerald-400 font-black">
                        {selectedReportSlip.totalMarksObtained}
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-700 dark:text-emerald-400 font-black">
                        {selectedReportSlip.overallAverage}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Conduct & Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    Conduct Grade / Imyitwarire:
                  </span>
                  <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    {selectedReportSlip.conductGrade}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    Pedagogical Council Decision:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">
                    Promoted with High Honors. Validated by Dean of Studies.
                  </p>
                </div>
              </div>

              {/* Headmaster Remarks Block */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-2 text-xs">
                <strong className="text-emerald-900 dark:text-emerald-300">
                  Headmaster Evaluation & Official Recommendation:
                </strong>
                <p className="italic text-slate-700 dark:text-slate-300 leading-relaxed">
                  &ldquo;{selectedReportSlip.headmasterRemarks}&rdquo;
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Signatory: Headmaster / Prefet des Etudes</span>
                  <span>Stamp: LSAS Muhura Pedagogical Seal ✓</span>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'rw' ? 'Capa Iyi Raporo' : 'Print Official Slip'}</span>
                </button>
                <button
                  onClick={() => setSelectedReportSlip(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  {language === 'rw' ? 'Funga' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CERTIFICATE MODAL VIEWER
            ========================================================================= */}
        {selectedCertificate && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setSelectedCertificate(null)}
          >
            <div
              className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border-4 border-double border-emerald-600 shadow-2xl text-center space-y-6 text-slate-900 dark:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-800">
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-xs uppercase tracking-widest font-extrabold text-emerald-700 dark:text-emerald-400">
                  Republic of Rwanda · Official Academic & Technical Credential
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold">
                  {language === 'rw' ? selectedCertificate.titleRw : selectedCertificate.title}
                </h3>
              </div>

              <div className="py-3 px-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Conferred Upon: <span className="text-emerald-700 dark:text-emerald-400 font-bold">IBYOYAKOZE Bonette</span>
                </p>
                <p className="leading-relaxed">
                  {language === 'rw' ? selectedCertificate.descriptionRw : selectedCertificate.description}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] font-mono text-slate-500">
                  <span>Issuer: {language === 'rw' ? selectedCertificate.issuerRw : selectedCertificate.issuer}</span>
                  <span>·</span>
                  <span>Issue Date: {selectedCertificate.date}</span>
                  <span>·</span>
                  <span>ID: {selectedCertificate.credentialId}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'rw' ? 'Capa Impamyabumenyi' : 'Print Certificate'}</span>
                </button>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  {language === 'rw' ? 'Funga' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
