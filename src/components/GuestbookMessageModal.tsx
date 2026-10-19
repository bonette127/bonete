import React, { useState, useEffect, useId } from 'react';
import {
  X,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Send,
  Sparkles,
  Mail,
  User,
  Tag,
  ShieldCheck,
  Check
} from 'lucide-react';
import { VisitorMessage, BONETTE_PROFILE } from '../data/portfolioData';

interface GuestbookMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: {
    name: string;
    email?: string;
    type: VisitorMessage['type'];
    content: string;
  }) => void;
  initialType?: VisitorMessage['type'];
  initialContent?: string;
}

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;
const CONTENT_MIN_LENGTH = 10;
const CONTENT_MAX_LENGTH = 600;

// Email RFC-standard validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const validateEmailFormat = (email: string): { isValid: boolean; error?: string } => {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: true }; // Email is optional
  }

  if (trimmed.includes(' ')) {
    return { isValid: false, error: 'Email addresses cannot contain spaces' };
  }

  if (!trimmed.includes('@')) {
    return { isValid: false, error: "Missing '@' in email address" };
  }

  const parts = trimmed.split('@');
  if (parts.length > 2) {
    return { isValid: false, error: "Only one '@' is allowed in email address" };
  }

  const [local, domain] = parts;
  if (!local) {
    return { isValid: false, error: "Missing username before '@'" };
  }

  if (!domain || !domain.includes('.')) {
    return { isValid: false, error: "Email domain must include an extension (e.g. .com, .rw, .org)" };
  }

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return { isValid: false, error: "Domain extension must be at least 2 characters (e.g. .rw, .com)" };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email format (e.g., name@domain.com)' };
  }

  return { isValid: true };
};

export const GuestbookMessageModal: React.FC<GuestbookMessageModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialType = 'Message',
  initialContent = '',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<VisitorMessage['type']>(initialType);
  const [content, setContent] = useState(initialContent);

  // Touched states for user-friendly error display
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [contentTouched, setContentTouched] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nameInputId = useId();
  const emailInputId = useId();
  const typeSelectId = useId();
  const contentTextareaId = useId();

  // Reset or initialize on open or when initial props change
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      if (initialContent) {
        setContent(initialContent);
      }
      setIsSuccess(false);
    }
  }, [isOpen, initialType, initialContent]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Real-time validations
  const trimmedName = name.trim();
  const isNameEmpty = trimmedName.length === 0;
  const isNameTooShort = !isNameEmpty && trimmedName.length < NAME_MIN_LENGTH;
  const isNameValid = trimmedName.length >= NAME_MIN_LENGTH && trimmedName.length <= NAME_MAX_LENGTH;

  const emailValidation = validateEmailFormat(email);
  const isEmailEntered = email.trim().length > 0;
  const isEmailValid = emailValidation.isValid;

  const trimmedContent = content.trim();
  const isContentEmpty = trimmedContent.length === 0;
  const isContentTooShort = !isContentEmpty && trimmedContent.length < CONTENT_MIN_LENGTH;
  const isContentValid = trimmedContent.length >= CONTENT_MIN_LENGTH && content.length <= CONTENT_MAX_LENGTH;

  const isFormValid = isNameValid && isEmailValid && isContentValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameTouched(true);
    setEmailTouched(true);
    setContentTouched(true);

    if (!isFormValid) return;

    onSubmit({
      name: trimmedName,
      email: isEmailEntered ? email.trim() : undefined,
      type,
      content: trimmedContent,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setName('');
      setEmail('');
      setContent('');
      setNameTouched(false);
      setEmailTouched(false);
      setContentTouched(false);
      onClose();
    }, 1800);
  };

  const starterChips = [
    { label: '🎉 Happy Birthday & Congratulations!', text: `Happy 18th Birthday and Anniversary, ${BONETTE_PROFILE.name}! Wishing you God's blessings and great success in software engineering! 🎂` },
    { label: '🙏 Encouragement & Prayer', text: `May God richly bless your studies at G.S Kibondo and your journey as an L5 Software Developer!` },
    { label: '💻 Tech Collaboration / L5 SOD', text: `Hello Bonette, I reviewed your software projects and tutorials. Would love to collaborate on a full-stack project!` },
    { label: '🎵 Gospel Music Recommendation', text: `Here is a beautiful gospel song recommendation that will uplift your spirit during coding sessions:` },
  ];

  const handleApplyStarter = (text: string) => {
    setContent(text);
    setContentTouched(true);
  };

  // Content progress calculation
  const contentProgressPercent = Math.min(100, Math.round((content.length / CONTENT_MAX_LENGTH) * 100));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Send a Message to {BONETTE_PROFILE.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Encouragement, feedback, gospel song ideas, or L5 SOD tech collaborations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            aria-label="Close message modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Message Posted Successfully!
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Thank you for your warmth and clean message. Your note has been added to Bonette's community board!
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Redirecting to guestbook feed...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
            {/* Quick Starters / Suggested Templates */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Message Starters
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">Tap to insert</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {starterChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyStarter(chip.text)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 dark:bg-slate-800 dark:hover:bg-emerald-950/40 dark:text-slate-300 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer text-left"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row: Name and Message Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name Field with Real-time character limit */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor={nameInputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Your Full Name</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      name.length >= NAME_MAX_LENGTH
                        ? 'text-rose-500 font-bold'
                        : name.length < NAME_MIN_LENGTH && nameTouched
                        ? 'text-amber-500'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {name.length}/{NAME_MAX_LENGTH}
                  </span>
                </div>
                <div className="relative">
                  <input
                    id={nameInputId}
                    type="text"
                    required
                    maxLength={NAME_MAX_LENGTH}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameTouched(true);
                    }}
                    onBlur={() => setNameTouched(true)}
                    placeholder="e.g., Keza Aline or Brother Samuel"
                    className={`w-full px-3 py-2 pr-8 text-sm bg-white dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white transition-colors focus:outline-hidden ${
                      nameTouched && !isNameValid
                        ? 'border-rose-400 dark:border-rose-600 focus:ring-2 focus:ring-rose-500/30'
                        : isNameValid
                        ? 'border-emerald-400 dark:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/30'
                    }`}
                  />
                  {isNameValid && (
                    <div className="absolute right-2.5 top-2.5 text-emerald-600 dark:text-emerald-400 pointer-events-none">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  {nameTouched && !isNameValid && (
                    <div className="absolute right-2.5 top-2.5 text-rose-500 pointer-events-none">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                {/* Real-time validation message for Name */}
                {nameTouched && isNameTooShort && (
                  <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Name must be at least {NAME_MIN_LENGTH} characters long.</span>
                  </p>
                )}
                {nameTouched && isNameEmpty && (
                  <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Please enter your name.</span>
                  </p>
                )}
              </div>

              {/* Message Type Selector */}
              <div>
                <label htmlFor={typeSelectId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Category</span>
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  id={typeSelectId}
                  value={type}
                  onChange={(e) => setType(e.target.value as VisitorMessage['type'])}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                >
                  <option value="Message">Message / Friendly Note</option>
                  <option value="Feedback">Feedback on Portfolio or Tutorials</option>
                  <option value="Gospel Song Suggestion">Gospel Song Suggestion</option>
                  <option value="Tech Collaboration">Tech Collaboration / L5 SOD Project</option>
                </select>
              </div>
            </div>

            {/* Email Field with Real-time Client-side Format Validation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={emailInputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Your Email Address</span>
                  <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">(Optional)</span>
                </label>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Kept private
                </span>
              </div>
              <div className="relative">
                <input
                  id={emailInputId}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailTouched(true);
                  }}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="e.g., student@gskibondo.rw or user@example.com"
                  className={`w-full px-3 py-2 pr-8 text-sm bg-white dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white transition-colors focus:outline-hidden ${
                    isEmailEntered && !isEmailValid
                      ? 'border-rose-400 dark:border-rose-600 focus:ring-2 focus:ring-rose-500/30'
                      : isEmailEntered && isEmailValid
                      ? 'border-emerald-400 dark:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/30'
                  }`}
                />
                {isEmailEntered && isEmailValid && (
                  <div className="absolute right-2.5 top-2.5 text-emerald-600 dark:text-emerald-400 pointer-events-none">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {isEmailEntered && !isEmailValid && (
                  <div className="absolute right-2.5 top-2.5 text-rose-500 pointer-events-none">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Real-time Email Format Feedback */}
              {isEmailEntered && !isEmailValid && (
                <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{emailValidation.error}</span>
                </p>
              )}
              {isEmailEntered && isEmailValid && (
                <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Valid email address format — will remain private and never shown publicly.</span>
                </p>
              )}
              {!isEmailEntered && (
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                  Provide your email if you wish to receive a personal reply from Bonette.
                </p>
              )}
            </div>

            {/* Message Content Field with Real-time Character Counter & Limit */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={contentTextareaId} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Your Message</span>
                  <span className="text-rose-500">*</span>
                </label>

                {/* Real-time Character Counter */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-md ${
                      content.length >= CONTENT_MAX_LENGTH
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold'
                        : content.length >= CONTENT_MAX_LENGTH * 0.85
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : isContentValid
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {content.length} / {CONTENT_MAX_LENGTH} characters
                  </span>
                </div>
              </div>

              <div className="relative">
                <textarea
                  id={contentTextareaId}
                  required
                  rows={4}
                  maxLength={CONTENT_MAX_LENGTH}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setContentTouched(true);
                  }}
                  onBlur={() => setContentTouched(true)}
                  placeholder="Write your note, song suggestion, question, or encouragement for Bonette..."
                  className={`w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white transition-colors focus:outline-hidden resize-none ${
                    contentTouched && !isContentValid
                      ? 'border-rose-400 dark:border-rose-600 focus:ring-2 focus:ring-rose-500/30'
                      : isContentValid
                      ? 'border-emerald-400 dark:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/30'
                  }`}
                />
              </div>

              {/* Progress bar visual indicator of character limit */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-150 ${
                    content.length >= CONTENT_MAX_LENGTH
                      ? 'bg-rose-500'
                      : content.length >= CONTENT_MAX_LENGTH * 0.85
                      ? 'bg-amber-500'
                      : 'bg-emerald-600 dark:bg-emerald-500'
                  }`}
                  style={{ width: `${contentProgressPercent}%` }}
                />
              </div>

              {/* Real-time Content Validation Feedback */}
              <div className="mt-1 flex items-center justify-between text-[11px]">
                {contentTouched && isContentEmpty ? (
                  <p className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Please enter your message before sending.</span>
                  </p>
                ) : isContentTooShort ? (
                  <p className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>
                      Need {CONTENT_MIN_LENGTH - trimmedContent.length} more character
                      {CONTENT_MIN_LENGTH - trimmedContent.length === 1 ? '' : 's'} (minimum {CONTENT_MIN_LENGTH} characters).
                    </span>
                  </p>
                ) : content.length >= CONTENT_MAX_LENGTH ? (
                  <p className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Maximum character limit ({CONTENT_MAX_LENGTH}) reached.</span>
                  </p>
                ) : isContentValid ? (
                  <p className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Good message length ({CONTENT_MAX_LENGTH - content.length} characters remaining).</span>
                  </p>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">
                    Min {CONTENT_MIN_LENGTH} characters · Max {CONTENT_MAX_LENGTH} characters
                  </span>
                )}
              </div>
            </div>

            {/* Validation Alert Summary if user tried to submit with errors */}
            {(!isFormValid && (nameTouched || emailTouched || contentTouched)) && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Please correct the following before posting:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-amber-800 dark:text-amber-300">
                  {!isNameValid && (
                    <li>Name must be between {NAME_MIN_LENGTH} and {NAME_MAX_LENGTH} characters</li>
                  )}
                  {isEmailEntered && !isEmailValid && (
                    <li>{emailValidation.error}</li>
                  )}
                  {!isContentValid && (
                    <li>
                      {isContentEmpty
                        ? 'Message content cannot be blank'
                        : isContentTooShort
                        ? `Message must be at least ${CONTENT_MIN_LENGTH} characters long`
                        : `Message cannot exceed ${CONTENT_MAX_LENGTH} characters`}
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Submit & Cancel Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`flex-2 inline-flex items-center justify-center gap-2 py-2.5 px-5 text-xs font-bold text-white rounded-xl shadow-sm transition-all ${
                  isFormValid
                    ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer shadow-emerald-600/20 shadow-md'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed opacity-75'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Post Message to Guestbook</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
