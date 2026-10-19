import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, ThumbsUp, Filter, Heart, Sparkles, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { INITIAL_MESSAGES, VisitorMessage } from '../data/portfolioData';
import { validateEmailFormat } from './GuestbookMessageModal';

interface MessageBoardSectionProps {
  initialType?: VisitorMessage['type'];
  onMessageCountChange?: (count: number) => void;
}

export const MessageBoardSection: React.FC<MessageBoardSectionProps> = ({
  initialType = 'Message',
  onMessageCountChange,
}) => {
  const [messages, setMessages] = useState<VisitorMessage[]>(() => {
    try {
      const saved = localStorage.getItem('bonette_portfolio_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_MESSAGES;
  });

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msgType, setMsgType] = useState<VisitorMessage['type']>(initialType);
  const [content, setContent] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [contentTouched, setContentTouched] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('bonette_portfolio_messages', JSON.stringify(messages));
    } catch {
      // ignore
    }
    onMessageCountChange?.(messages.length);
  }, [messages, onMessageCountChange]);

  const NAME_MIN = 2;
  const NAME_MAX = 50;
  const CONTENT_MIN = 10;
  const CONTENT_MAX = 600;

  const trimmedName = name.trim();
  const isNameEmpty = trimmedName.length === 0;
  const isNameTooShort = !isNameEmpty && trimmedName.length < NAME_MIN;
  const isNameValid = trimmedName.length >= NAME_MIN && trimmedName.length <= NAME_MAX;

  const emailValidation = validateEmailFormat(email);
  const isEmailEntered = email.trim().length > 0;
  const isEmailValid = emailValidation.isValid;

  const trimmedContent = content.trim();
  const isContentEmpty = trimmedContent.length === 0;
  const isContentTooShort = !isContentEmpty && trimmedContent.length < CONTENT_MIN;
  const isContentValid = trimmedContent.length >= CONTENT_MIN && content.length <= CONTENT_MAX;

  const isFormValid = isNameValid && isEmailValid && isContentValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameTouched(true);
    setEmailTouched(true);
    setContentTouched(true);

    if (!isFormValid) return;

    const newMsg: VisitorMessage = {
      id: `msg-${Date.now()}`,
      name: trimmedName,
      email: isEmailEntered ? email.trim() : undefined,
      type: msgType,
      content: trimmedContent,
      createdAt: 'Just now',
      likes: 1,
    };

    setMessages([newMsg, ...messages]);
    setName('');
    setEmail('');
    setContent('');
    setNameTouched(false);
    setEmailTouched(false);
    setContentTouched(false);
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  const handleLike = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m))
    );
  };

  const filterOptions = ['All', 'Message', 'Feedback', 'Gospel Song Suggestion', 'Tech Collaboration'];

  const filteredMessages = activeFilter === 'All'
    ? messages
    : messages.filter((m) => m.type === activeFilter);

  const contentProgressPercent = Math.min(100, Math.round((content.length / CONTENT_MAX) * 100));

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            05. Community Board & Chat
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Send a Message, Feedback or Gospel Song to Bonette
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
            I would love to hear from you! Whether you are a student, teacher, software engineer, or church member, leave a word of encouragement, feedback on my tutorials, or greetings from Gatsibo and beyond.
          </p>
        </div>

        {/* 2-Column Grid: Form on Left, Messages Feed on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Post a Message Card */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white">
              <MessageSquare className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <h3 className="text-lg font-bold">Write to Bonette</h3>
            </div>

            {submittedSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Thank you! Your message has been posted to Bonette's board.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      name.length >= NAME_MAX
                        ? 'text-rose-500 font-bold'
                        : nameTouched && !isNameValid
                        ? 'text-amber-500'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {name.length}/{NAME_MAX}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={NAME_MAX}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameTouched(true);
                    }}
                    onBlur={() => setNameTouched(true)}
                    placeholder="e.g., Sister Marie, or classmate Mugisha"
                    className={`w-full px-3 py-2 pr-8 text-sm bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white transition-colors focus:outline-hidden ${
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
                {nameTouched && isNameTooShort && (
                  <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Name must be at least {NAME_MIN} characters.</span>
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Email <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">(Optional)</span>
                  </label>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Kept private
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailTouched(true);
                    }}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="you@example.com"
                    className={`w-full px-3 py-2 pr-8 text-sm bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white transition-colors focus:outline-hidden ${
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
                {isEmailEntered && !isEmailValid && (
                  <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{emailValidation.error}</span>
                  </p>
                )}
                {isEmailEntered && isEmailValid && (
                  <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Valid email address — will not be displayed publicly.</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message Type *
                </label>
                <select
                  value={msgType}
                  onChange={(e) => setMsgType(e.target.value as VisitorMessage['type'])}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                >
                  <option value="Message">Friendly Message</option>
                  <option value="Feedback">Feedback on Portfolio or Tutorials</option>
                  <option value="Gospel Song Suggestion">Gospel Song Suggestion</option>
                  <option value="Tech Collaboration">Tech Project Collaboration</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Message or Feedback <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                      content.length >= CONTENT_MAX
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold'
                        : isContentValid
                        ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {content.length}/{CONTENT_MAX}
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={CONTENT_MAX}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setContentTouched(true);
                  }}
                  onBlur={() => setContentTouched(true)}
                  placeholder="Write your note, feedback, song advice, or question for Bonette..."
                  className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white transition-colors focus:outline-hidden resize-none ${
                    contentTouched && !isContentValid
                      ? 'border-rose-400 dark:border-rose-600 focus:ring-2 focus:ring-rose-500/30'
                      : isContentValid
                      ? 'border-emerald-400 dark:border-emerald-600 focus:ring-2 focus:ring-emerald-500/30'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/30'
                  }`}
                />
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-150 ${
                      content.length >= CONTENT_MAX
                        ? 'bg-rose-500'
                        : content.length >= CONTENT_MAX * 0.85
                        ? 'bg-amber-500'
                        : 'bg-emerald-600 dark:bg-emerald-500'
                    }`}
                    style={{ width: `${contentProgressPercent}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  {contentTouched && isContentEmpty ? (
                    <span className="text-rose-600 dark:text-rose-400">Please enter your message.</span>
                  ) : isContentTooShort ? (
                    <span className="text-amber-600 dark:text-amber-400">
                      Need {CONTENT_MIN - trimmedContent.length} more char{CONTENT_MIN - trimmedContent.length === 1 ? '' : 's'} (min {CONTENT_MIN}).
                    </span>
                  ) : isContentValid ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Clean message ({CONTENT_MAX - content.length} chars remaining)
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">Min {CONTENT_MIN} · Max {CONTENT_MAX} chars</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm ${
                  isFormValid
                    ? 'bg-slate-900 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed opacity-75'
                }`}
              >
                <Send className="w-4 h-4" />
                Post Message to Board
              </button>
            </form>

            <div className="pt-2 text-[11px] text-slate-400 dark:text-slate-500">
              Direct email: <a href="mailto:ibyoyakozebonette2008@gmail.com" className="text-emerald-700 dark:text-emerald-400 underline">ibyoyakozebonette2008@gmail.com</a>
            </div>
          </div>

          {/* Right Column: Interactive Message Feed & Filters */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setActiveFilter(opt)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === opt
                      ? 'bg-emerald-800 dark:bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Messages Count Header */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>Showing {filteredMessages.length} message{filteredMessages.length === 1 ? '' : 's'}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Real-time Guestbook</span>
            </div>

            {/* List of Messages */}
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs">
                  No messages in this category yet. Be the first to post!
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{msg.name}</h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-400">
                            <span>{msg.type}</span>
                            <span>·</span>
                            <span>{msg.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLike(msg.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title="Cheer this message"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span className="font-mono text-[11px]">{msg.likes}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                      {msg.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
