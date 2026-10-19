import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  // Permanent Recognized Admin Credentials for Bonette
  const PERMANENT_MASTER_PASSWORD = 'samu1102005@B';
  const PRIMARY_ADMIN_EMAIL = 'byoyakozebonette@protonmail.com';
  const ALTERNATIVE_ADMIN_EMAIL = 'kibondoqueenmary2022@gmail.com';

  const [email, setEmail] = useState(PRIMARY_ADMIN_EMAIL);
  const [password, setPassword] = useState(PERMANENT_MASTER_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  if (!isOpen) return null;

  // Retrieve any custom password set by Bonette in Admin Suite
  const savedCustomPassword = (() => {
    try {
      return localStorage.getItem('bonette_custom_admin_password');
    } catch {
      return null;
    }
  })();

  const VALID_USERNAMES_OR_EMAILS = [
    'byoyakozebonette@protonmail.com',
    'kibondoqueenmary2022@gmail.com',
    'ibyoyakozebonette2008@gmail.com',
    'bonette127',
    'bonette',
    'admin',
    'ibyoyakoze bonette',
    'kibondo',
  ];

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(PERMANENT_MASTER_PASSWORD);
    setCopiedPass(true);
    setInfoMsg('Password copied to clipboard!');
    setTimeout(() => {
      setCopiedPass(false);
      setInfoMsg('');
    }, 2500);
  };

  const handleInstantLogin = () => {
    setIsLoading(true);
    setErrorMsg('');
    setInfoMsg('Signing in with verified master credentials...');

    setTimeout(() => {
      // Clear any conflicting stale password so master is guaranteed
      try {
        localStorage.removeItem('bonette_custom_admin_password');
      } catch {}

      localStorage.setItem(
        'bonette_admin_session',
        JSON.stringify({
          email: PRIMARY_ADMIN_EMAIL,
          role: 'ADMIN',
          loginTime: new Date().toISOString(),
          name: 'IBYOYAKOZE Bonette',
        })
      );
      setIsLoading(false);
      onLoginSuccess();
      onClose();
    }, 300);
  };

  const handleAutofillPermanent = () => {
    setEmail(PRIMARY_ADMIN_EMAIL);
    setPassword(PERMANENT_MASTER_PASSWORD);
    setErrorMsg('');
    setInfoMsg('Permanent credentials auto-filled! Click "Sign In as Admin Bonette".');
  };

  const handleResetToDefaultPassword = () => {
    try {
      localStorage.removeItem('bonette_custom_admin_password');
    } catch {}
    setPassword(PERMANENT_MASTER_PASSWORD);
    setErrorMsg('');
    setInfoMsg(`Password reset to permanent master default: ${PERMANENT_MASTER_PASSWORD}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    setTimeout(() => {
      const inputEmail = email.trim().toLowerCase();
      const inputPass = password.trim();

      // Forgiving and robust password check
      const isMasterPass =
        inputPass === PERMANENT_MASTER_PASSWORD ||
        inputPass.toLowerCase() === PERMANENT_MASTER_PASSWORD.toLowerCase() ||
        inputPass === 'samu1102005' ||
        inputPass.toLowerCase() === 'samu1102005@b' ||
        inputPass.toLowerCase() === 'bonette2008' ||
        inputPass.toLowerCase() === 'bonette127';

      const isCustomPass =
        savedCustomPassword &&
        (inputPass === savedCustomPassword.trim() ||
          inputPass.toLowerCase() === savedCustomPassword.trim().toLowerCase());

      const isPasswordValid = isMasterPass || isCustomPass;

      // Email is valid if recognized, or if it contains bonette/kibondo/admin, or if password is valid
      const isEmailValid =
        inputEmail.length > 0 &&
        (VALID_USERNAMES_OR_EMAILS.some((valid) => inputEmail === valid.toLowerCase()) ||
          inputEmail.includes('bonette') ||
          inputEmail.includes('kibondo') ||
          inputEmail === 'admin' ||
          isPasswordValid);

      if (isEmailValid && isPasswordValid) {
        localStorage.setItem(
          'bonette_admin_session',
          JSON.stringify({
            email: inputEmail || PRIMARY_ADMIN_EMAIL,
            role: 'ADMIN',
            loginTime: new Date().toISOString(),
            name: 'IBYOYAKOZE Bonette',
          })
        );
        setIsLoading(false);
        onLoginSuccess();
        onClose();
      } else {
        setIsLoading(false);
        if (!isPasswordValid) {
          setErrorMsg(
            'Incorrect password entered. Click "Auto-fill Master Credentials" or "Instant 1-Click Login".'
          );
        } else {
          setErrorMsg(
            'Unrecognized admin username/email. Use byoyakozebonette@protonmail.com or kibondoqueenmary2022@gmail.com.'
          );
        }
      }
    }, 250);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Admin Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                IBYOYAKOZE Bonette Personal Management Suite
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permanent Verified Credentials Card */}
        <div className="p-4 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300">
              <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Permanent Admin Access Key
            </span>
            <button
              type="button"
              onClick={handleInstantLogin}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors shadow-xs shrink-0"
              title="Instantly sign in without typing"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant 1-Click Login</span>
            </button>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono bg-white dark:bg-slate-900/90 p-3 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <span className="text-slate-500 font-sans">Primary Email:</span>
              <strong className="text-slate-800 dark:text-emerald-300 select-all font-semibold">
                {PRIMARY_ADMIN_EMAIL}
              </strong>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <span className="text-slate-500 font-sans">Alt Email:</span>
              <span className="text-slate-700 dark:text-slate-300 select-all">
                {ALTERNATIVE_ADMIN_EMAIL}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-sans">Permanent Password:</span>
                <strong className="text-emerald-700 dark:text-emerald-400 select-all font-bold text-xs">
                  {PERMANENT_MASTER_PASSWORD}
                </strong>
              </div>
              <button
                type="button"
                onClick={handleCopyPassword}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-sans font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer shrink-0"
                title="Copy permanent password"
              >
                {copiedPass ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {infoMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{infoMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Admin Email Address / Username
              </label>
              <button
                type="button"
                onClick={handleAutofillPermanent}
                className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Auto-fill Both
              </button>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="byoyakozebonette@protonmail.com"
                autoComplete="email"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-emerald-600 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Admin Password
              </label>
              <button
                type="button"
                onClick={handleResetToDefaultPassword}
                className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to default
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="samu1102005@B"
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-emerald-600 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2.5 top-2.5 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In as Admin Bonette'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleInstantLogin}
              disabled={isLoading}
              className="w-full py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 hover:bg-emerald-200/80 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>One-Click Instant Access (No Typing Needed)</span>
            </button>
          </div>
        </form>

        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
          Permanent master password <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">samu1102005@B</span> is permanently configured to guarantee access anytime.
        </p>
      </div>
    </div>
  );
};
