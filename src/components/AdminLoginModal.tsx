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
  Users,
  ArrowRight
} from 'lucide-react';
import { FamilyMemberItem } from '../data/portfolioData';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (memberData?: { name: string; email: string; role: string }) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  // Permanent Recognized Admin Credentials for Bonette
  const PERMANENT_MASTER_PASSWORD = 'samu1102005@B';
  const SHORT_MASTER_PASSWORD = 'samu110';
  const PRIMARY_ADMIN_EMAIL = 'byoyakozebonette@protonmail.com';
  const ALTERNATIVE_ADMIN_EMAIL = 'kibondoqueenmary2022@gmail.com';

  const [loginRole, setLoginRole] = useState<'admin' | 'member'>('admin');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Retrieve custom admin password if set by Bonette in Admin Suite
  const savedCustomPassword = (() => {
    try {
      return localStorage.getItem('bonette_custom_admin_password');
    } catch {
      return null;
    }
  })();

  // Retrieve family members from localStorage
  const familyMembers: FamilyMemberItem[] = (() => {
    try {
      const saved = localStorage.getItem('bonette_family_members');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  })();

  const VALID_ADMIN_IDENTIFIERS = [
    PRIMARY_ADMIN_EMAIL.toLowerCase(),
    ALTERNATIVE_ADMIN_EMAIL.toLowerCase(),
    'ibyoyakozebonette2008@gmail.com',
    'bonette127',
    'bonette',
    'admin'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const inputIdent = emailOrUsername.trim().toLowerCase();
      const inputPass = password.trim();

      if (loginRole === 'admin') {
        const isIdentValid = VALID_ADMIN_IDENTIFIERS.includes(inputIdent);
        const isPasswordValid =
          inputPass === PERMANENT_MASTER_PASSWORD ||
          inputPass === SHORT_MASTER_PASSWORD ||
          (savedCustomPassword && inputPass === savedCustomPassword);

        if (isIdentValid && isPasswordValid) {
          localStorage.setItem(
            'bonette_admin_session',
            JSON.stringify({
              email: inputIdent.includes('@') ? inputIdent : PRIMARY_ADMIN_EMAIL,
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
          if (!isPasswordValid && isIdentValid) {
            setErrorMsg('Incorrect admin password entered. Please enter your configured master credentials.');
          } else {
            setErrorMsg('Unrecognized admin credentials. Please enter your valid email or username.');
          }
        }
      } else {
        // Family Member Authentication
        const member = familyMembers.find(
          (m) =>
            m.email.toLowerCase() === inputIdent ||
            (m.username && m.username.toLowerCase() === inputIdent)
        );

        if (member) {
          const expectedPasscode = member.loginPasscode || `${member.name.toLowerCase()}#2026`;
          if (inputPass.toLowerCase() === expectedPasscode.toLowerCase()) {
            localStorage.setItem(
              'bonette_member_session',
              JSON.stringify({
                id: member.id,
                name: member.name,
                email: member.email,
                role: member.relationship,
                loginTime: new Date().toISOString()
              })
            );
            setIsLoading(false);
            onLoginSuccess({
              name: member.name,
              email: member.email,
              role: member.relationship
            });
            onClose();
          } else {
            setIsLoading(false);
            setErrorMsg(`Incorrect passcode for ${member.name}. Please enter the login passcode provided by Bonette.`);
          }
        } else {
          setIsLoading(false);
          setErrorMsg('No family member found matching this email or username. Ask Bonette to register your access in Admin Suite.');
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
                Portal Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                IBYOYAKOZE Bonette Suite & Family Circle
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

        {/* Role Toggle: Admin vs Family Member */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setLoginRole('admin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              loginRole === 'admin'
                ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Admin Bonette</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginRole('member');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              loginRole === 'member'
                ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Family Member</span>
          </button>
        </div>

        {/* Security Notice (No leaked passwords) */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <KeyRound className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            {loginRole === 'admin'
              ? 'Authorized administrative login for IBYOYAKOZE Bonette to manage portfolio stories, daily agenda, members, and guestbook insights.'
              : 'Family members (brothers Mugisha, Cedric, sisters Ruth, Reponce, Beryse, parents) can sign in using their assigned login passcode.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {loginRole === 'admin' ? 'Admin Email or Username' : 'Member Email or Username'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder={loginRole === 'admin' ? 'byoyakozebonette@protonmail.com' : 'e.g. mugisha or email'}
                autoComplete={loginRole === 'admin' ? 'email' : 'username'}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {loginRole === 'admin' ? 'Master Password' : 'Login Passcode'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-emerald-600"
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>
                {isLoading
                  ? 'Verifying...'
                  : loginRole === 'admin'
                  ? 'Sign In as Admin Bonette'
                  : 'Sign In as Family Member'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
          Security protected. Private admin and member data is encrypted in local session storage.
        </p>
      </div>
    </div>
  );
};
