import React, { useState, useEffect } from 'react';
import { Printer, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface PrintingOverlayProps {
  isPrinting?: boolean;
  onDismiss?: () => void;
}

/**
 * CSS-based 'Printing...' overlay component that appears centered in the viewport
 * when a print event is triggered. Marked with 'no-print' class so it is strictly
 * omitted from the printed document/PDF output.
 */
export const PrintingOverlay: React.FC<PrintingOverlayProps> = ({
  isPrinting: externalIsPrinting,
  onDismiss
}) => {
  const [internalIsPrinting, setInternalIsPrinting] = useState(false);

  // Determine active state from external prop or internal window event listeners
  const active = externalIsPrinting !== undefined ? externalIsPrinting : internalIsPrinting;

  useEffect(() => {
    const handleBeforePrint = () => {
      setInternalIsPrinting(true);
    };

    const handleAfterPrint = () => {
      setInternalIsPrinting(false);
      onDismiss?.();
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [onDismiss]);

  // Fallback auto-dismiss after 12 seconds in case browser does not emit afterprint
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        setInternalIsPrinting(false);
        onDismiss?.();
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [active, onDismiss]);

  if (!active) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200 select-none"
    >
      <div className="relative w-full max-w-sm mx-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={() => {
            setInternalIsPrinting(false);
            onDismiss?.();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Dismiss overlay"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Animated Icon Container */}
        <div className="relative w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Printer className="w-8 h-8 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </span>
        </div>

        {/* Text Content */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Document Generation</span>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Printing CV & Portfolio
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            The browser print dialog is active. You can save as a PDF or send to a local printer with formatting intact.
          </p>
        </div>

        {/* CSS Animated Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-full animate-pulse w-3/4 mx-auto" />
        </div>

        {/* Quick Footer Action */}
        <div className="pt-1">
          <button
            onClick={() => {
              setInternalIsPrinting(false);
              onDismiss?.();
            }}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Cancel or Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
