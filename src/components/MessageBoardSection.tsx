import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, ThumbsUp, Filter, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { INITIAL_MESSAGES, VisitorMessage } from '../data/portfolioData';

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

  useEffect(() => {
    try {
      localStorage.setItem('bonette_portfolio_messages', JSON.stringify(messages));
    } catch {
      // ignore
    }
    onMessageCountChange?.(messages.length);
  }, [messages, onMessageCountChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const newMsg: VisitorMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || undefined,
      type: msgType,
      content: content.trim(),
      createdAt: 'Just now',
      likes: 1,
    };

    setMessages([newMsg, ...messages]);
    setName('');
    setEmail('');
    setContent('');
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sister Marie, or classmate Mugisha"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Email (Optional, kept private)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message Type *
                </label>
                <select
                  value={msgType}
                  onChange={(e) => setMsgType(e.target.value as VisitorMessage['type'])}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-emerald-600"
                >
                  <option value="Message">Friendly Message</option>
                  <option value="Feedback">Feedback on Portfolio or Tutorials</option>
                  <option value="Gospel Song Suggestion">Gospel Song Suggestion</option>
                  <option value="Tech Collaboration">Tech Project Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message or Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note, feedback, song advice, or question for Bonette..."
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-sm cursor-pointer"
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
