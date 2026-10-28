import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Award,
  Building,
  Printer,
  Calendar,
  X,
  FileCheck,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { QuarterlyReportItem } from '../data/portfolioData';

interface QuarterlyReportsManagerProps {
  reports: QuarterlyReportItem[];
  onAddReport: (report: QuarterlyReportItem) => void;
  onRemoveReport: (id: string) => void;
  onNotify?: (message: string) => void;
}

export const QuarterlyReportsManager: React.FC<QuarterlyReportsManagerProps> = ({
  reports,
  onAddReport,
  onRemoveReport,
  onNotify
}) => {
  // Form State
  const [term, setTerm] = useState<'Term 1' | 'Term 2' | 'Term 3'>('Term 1');
  const [academicYear, setAcademicYear] = useState('2025 - 2026');
  const [level, setLevel] = useState('Level 5 Software Development (L5 SOD)');
  const [school, setSchool] = useState('Lycée Saint Alexandre Sauli de Muhura');
  const [overallAverage, setOverallAverage] = useState('94.5%');
  const [totalMarks, setTotalMarks] = useState<number>(567);
  const [maxMarks, setMaxMarks] = useState<number>(600);
  const [classPosition, setClassPosition] = useState('1st out of 48 Students');
  const [conductGrade, setConductGrade] = useState('Exceptional (A / Indashyikirwa)');
  const [headmasterRemarks, setHeadmasterRemarks] = useState(
    'Demonstrates stellar mastery in full-stack web architecture, mobile programming, and peer guidance. Outstanding scholastic performance.'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [previewReport, setPreviewReport] = useState<QuarterlyReportItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      if (onNotify) {
        onNotify(`Attached report document: ${file.name}`);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overallAverage.trim() || !headmasterRemarks.trim()) return;

    const newReport: QuarterlyReportItem = {
      id: `report-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      termTitle: `${term} Official Academic Bulletin`,
      termTitleRw: `Raporo y'Igihembwe cya ${term === 'Term 1' ? '1' : term === 'Term 2' ? '2' : '3'} (Bulletin)`,
      academicYear: academicYear.trim(),
      term,
      level: level.trim(),
      levelRw: 'Urwego rwa 5 mu Gukora Porogaramu (L5 SOD)',
      school: school.trim(),
      overallAverage: overallAverage.trim().includes('%') ? overallAverage.trim() : `${overallAverage.trim()}%`,
      totalMarksObtained: Number(totalMarks) || 550,
      maxMarksPossible: Number(maxMarks) || 600,
      classPosition: classPosition.trim(),
      classPositionRw: classPosition.includes('1st') ? 'Uwa 1 mu banyeshuri 48' : classPosition.trim(),
      conductGrade: conductGrade.trim(),
      headmasterRemarks: headmasterRemarks.trim(),
      headmasterRemarksRw: 'Amanota ahanitse cyane n\'imyitwarire myiza y\'intangarugero mu masomo y\'ikoranabuhanga.',
      documentFileName: uploadedFileName || `${term.replace(/\s+/g, '')}_Official_Bulletin_${Date.now()}.pdf`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'IBYOYAKOZE Bonette (Admin)'
    };

    onAddReport(newReport);
    setUploadedFileName('');
    if (onNotify) {
      onNotify(`Quarterly report for ${term} published successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900/50 p-5 rounded-2xl border border-emerald-500/20 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Admin Academic Suite</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Quarterly Academic Report & School Bulletin Uploader
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              As administrator, upload official quarterly bulletins, report cards, class rankings, and headmaster evaluations from Lycée Saint Alexandre Sauli de Muhura to keep academic records transparent and updated.
            </p>
          </div>

          <div className="bg-slate-900/80 px-4 py-2.5 rounded-xl border border-emerald-500/30 shrink-0 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Published Reports
            </span>
            <span className="text-xl font-extrabold text-emerald-400">{reports.length}</span>
            <span className="text-[11px] text-slate-400 ml-1">Terms</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload Form (5 Cols) + Published Reports List (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upload Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                <Upload className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Upload Quarterly Report
              </h4>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full font-semibold">
              Admin Only
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            {/* Term & Academic Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quarterly Term *
                </label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                >
                  <option value="Term 1">Term 1 (Quarter 1)</option>
                  <option value="Term 2">Term 2 (Quarter 2)</option>
                  <option value="Term 3">Term 3 (Annual Promotion)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year *
                </label>
                <input
                  type="text"
                  required
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2025 - 2026"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* School & Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institution
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class / Program Level
              </label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Overall Average & Position */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Overall Score (%) *
                </label>
                <input
                  type="text"
                  required
                  value={overallAverage}
                  onChange={(e) => setOverallAverage(e.target.value)}
                  placeholder="e.g. 94.5%"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 font-bold font-mono text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Class Position / Rank *
                </label>
                <input
                  type="text"
                  required
                  value={classPosition}
                  onChange={(e) => setClassPosition(e.target.value)}
                  placeholder="e.g. 1st out of 48"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Marks Breakdown & Conduct */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Marks Obtained / Total
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-1/2 px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                  <span className="text-xs text-slate-400">/</span>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-1/2 px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Conduct Grade
                </label>
                <input
                  type="text"
                  value={conductGrade}
                  onChange={(e) => setConductGrade(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            {/* File Upload Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Attach Official PDF / Bulletin Scan
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 cursor-pointer text-xs text-slate-600 dark:text-slate-300 transition-colors">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span className="truncate">
                    {uploadedFileName || 'Choose PDF file or document...'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {uploadedFileName && (
                  <button
                    type="button"
                    onClick={() => setUploadedFileName('')}
                    className="p-2 text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Headmaster Remarks */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Headmaster / Direction Evaluation Remarks *
              </label>
              <textarea
                required
                rows={3}
                value={headmasterRemarks}
                onChange={(e) => setHeadmasterRemarks(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 resize-y"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Official Quarterly Report</span>
            </button>
          </form>
        </div>

        {/* Published Reports List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Active Quarterly Reports on Portfolio
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Visible to visitors under the Academic Transcripts section
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              {reports.length} Terms
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                        {rep.term}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                        {rep.academicYear}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                        Rank: {rep.classPosition}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {rep.termTitle}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {rep.school} &bull; {rep.level}
                    </p>
                  </div>

                  {/* Average Badge */}
                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {rep.overallAverage}
                    </div>
                    <span className="text-[10px] text-slate-400 block -mt-1 font-mono">
                      {rep.totalMarksObtained}/{rep.maxMarksPossible} pts
                    </span>
                  </div>
                </div>

                {/* Headmaster Remarks Quote */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{rep.headmasterRemarks}&rdquo;
                </div>

                {/* Footer Controls: Preview, File Info, Delete */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate max-w-[200px]">{rep.documentFileName || 'Digital Slip'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewReport(rep)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-emerald-600" />
                      <span>Preview Slip</span>
                    </button>

                    {deleteConfirmId === rep.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/80 p-1 rounded-lg border border-rose-200 dark:border-rose-900">
                        <button
                          onClick={() => {
                            onRemoveReport(rep.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(rep.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                        title="Delete report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Preview of Report */}
      {previewReport && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewReport(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {previewReport.termTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500">{previewReport.school}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Overall Average</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {previewReport.overallAverage}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Class Ranking</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {previewReport.classPosition}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Points Scored</span>
                  <span className="text-xs font-mono font-semibold">
                    {previewReport.totalMarksObtained} / {previewReport.maxMarksPossible}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Conduct</span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    {previewReport.conductGrade}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Headmaster Remarks & Verification:
                </span>
                <p className="italic text-slate-600 dark:text-slate-300 leading-relaxed">
                  &ldquo;{previewReport.headmasterRemarks}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Document: {previewReport.documentFileName}</span>
                <span>Uploaded: {previewReport.uploadedBy}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
