import React, { useState } from 'react';
import {
  MessageCircle,
  Send,
  Users,
  ShieldCheck,
  UserPlus,
  Heart,
  Sparkles,
  Lock,
  Mail,
  Copy,
  Check,
  Reply,
  X,
  KeyRound,
  Info,
  CornerDownRight,
  Smile,
  Shield
} from 'lucide-react';
import { FamilyMemberItem, FamilyChatMessage } from '../data/portfolioData';

interface FamilyChatSectionProps {
  messages: FamilyChatMessage[];
  onSendMessage: (
    msg: string,
    senderName: string,
    senderEmail: string,
    senderRole: string,
    replyTo?: { id: string; senderName: string; text?: string }
  ) => void;
  familyMembers: FamilyMemberItem[];
  isAdminLoggedIn: boolean;
  onOpenAdminModal: () => void;
  onOpenAddMemberModal: () => void;
}

export const FamilyChatSection: React.FC<FamilyChatSectionProps> = ({
  messages,
  onSendMessage,
  familyMembers,
  isAdminLoggedIn,
  onOpenAdminModal,
  onOpenAddMemberModal,
}) => {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<FamilyChatMessage | null>(null);
  const [showMemberCredentialsModal, setShowMemberCredentialsModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check if a member session exists
  const memberSession = (() => {
    try {
      const saved = localStorage.getItem('bonette_member_session');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  })();

  const [selectedSenderId, setSelectedSenderId] = useState<string>(() => {
    if (isAdminLoggedIn) return 'admin';
    if (memberSession) return memberSession.id;
    return familyMembers[0]?.id || 'admin';
  });

  // Identify sender details
  const currentSender = selectedSenderId === 'admin'
    ? {
        name: 'IBYOYAKOZE Bonette (Admin)',
        email: 'byoyakozebonette@protonmail.com',
        role: 'Admin / Student Developer',
        avatar: 'B'
      }
    : (() => {
        const member = familyMembers.find((m) => m.id === selectedSenderId);
        return {
          name: member ? member.name : (memberSession?.name || 'Family Member'),
          email: member ? member.email : (memberSession?.email || 'family@example.com'),
          role: member ? member.relationship : (memberSession?.role || 'Family Member'),
          avatar: member?.avatar || member?.name?.charAt(0) || 'F'
        };
      })();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(
      inputText.trim(),
      currentSender.name,
      currentSender.email,
      currentSender.role,
      replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderName,
            text: (replyingTo.content || (replyingTo as any).message || '').slice(0, 80)
          }
        : undefined
    );

    setInputText('');
    setReplyingTo(null);
  };

  const handleCopyCredentials = (member: FamilyMemberItem) => {
    const slip = `Family Hub Login:\nName: ${member.name}\nEmail/Username: ${member.username || member.email}\nPasscode: ${member.loginPasscode || `${member.name.toLowerCase()}#2026`}`;
    navigator.clipboard.writeText(slip);
    setCopiedId(member.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const familyPhoto = '/src/assets/images/bonette_family_portrait_1792395098861.jpg';

  return (
    <section id="family-chat-section" className="py-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header with Family Photo Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-slate-50 to-emerald-50 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-slate-800 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Header info */}
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                <Lock className="w-3.5 h-3.5" />
                <span>Private Family Sanctuary & Community Chat</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Family Chat Room: Bonette, Brothers & Sisters
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                A clean, structured space connecting Bonette with brothers Mugisha & Cedric, sisters Ruth, Reponce, Beryse, and parents. Bonette manages member accounts and provides individual login passcodes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {isAdminLoggedIn ? (
                  <button
                    onClick={onOpenAddMemberModal}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Member & Generate Passcode</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenAdminModal}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 dark:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Admin / Member Sign In</span>
                  </button>
                )}

                {/* Member Login Credentials Info Button */}
                <button
                  onClick={() => setShowMemberCredentialsModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Member Passcodes & Access Slips</span>
                </button>
              </div>
            </div>

            {/* Right: Embedded Photo of Bonette & Family */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden aspect-16/10 border-2 border-white dark:border-slate-800 shadow-md group">
                <img
                  src={familyPhoto}
                  alt="IBYOYAKOZE Bonette and her loving family"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span>The IBYOYAKOZE Family Community</span>
                  </div>
                  <p className="text-[11px] text-slate-200 line-clamp-1">
                    Gatsibo, Rwanda &bull; Blessed with Love, Unity, and Purpose
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Members Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
              <Users className="w-4 h-4 text-emerald-600" />
              Family Circle:
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-900 dark:text-emerald-200">Bonette (Admin)</span>
              </div>

              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs whitespace-nowrap"
                >
                  <span className="text-slate-400 text-[11px]">{member.relationship}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          <span className="text-[11px] text-slate-400 hidden lg:inline whitespace-nowrap">
            Structured &bull; End-to-End Family Vault
          </span>
        </div>

        {/* Structured Chat Box */}
        <div className="bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          {/* Chat Messages Feed */}
          <div className="p-4 sm:p-6 space-y-4 min-h-[320px] max-h-[500px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  Family Sanctuary Ready
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Previous placeholder records have been deleted. You can now post clean, structured messages as Bonette or as a signed-in family member.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isAdmin = msg.senderRole?.toLowerCase().includes('admin') || msg.senderEmail?.toLowerCase().includes('byoyakoze');
                return (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl transition-all border ${
                      isAdmin
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80'
                    }`}
                  >
                    {/* Quoted Reply Block if message is a reply */}
                    {msg.replyTo && (
                      <div className="mb-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border-l-4 border-emerald-500 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <CornerDownRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            Replying to {msg.replyTo.senderName}:
                          </span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 mt-0.5">
                            {msg.replyTo.contentSnippet || (msg.replyTo as any).text || 'Original message'}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${
                            isAdmin
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {msg.senderName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {msg.senderName}
                            </h4>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                isAdmin
                                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {msg.senderRole}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                        title="Structured Reply to this message"
                      >
                        <Reply className="w-3 h-3" />
                        <span>Reply</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-2.5 leading-relaxed pl-10.5">
                      {msg.content || (msg as any).message}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Replying Banner */}
          {replyingTo && (
            <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-950/80 border-t border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2 truncate">
                <CornerDownRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Structured reply to <strong>{replyingTo.senderName}</strong>: &ldquo;{(replyingTo.content || (replyingTo as any).message || '').slice(0, 60)}...&rdquo;
                </span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="p-1 hover:text-rose-600 cursor-pointer text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Form Composer */}
          <form
            onSubmit={handleSend}
            className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3"
          >
            {/* Sender selection */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Posting as:</span>
                <select
                  value={selectedSenderId}
                  onChange={(e) => setSelectedSenderId(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  <option value="admin">IBYOYAKOZE Bonette (Admin)</option>
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relationship})
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-[11px] text-slate-400">
                {currentSender.role} &bull; {currentSender.email}
              </span>
            </div>

            {/* Input Row */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  replyingTo
                    ? `Reply to ${replyingTo.senderName}...`
                    : `Write a message to Bonette and family circle...`
                }
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-emerald-500 text-slate-900 dark:text-white text-xs sm:text-sm outline-hidden"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Member Passcodes and Credential Slips Modal */}
      {showMemberCredentialsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowMemberCredentialsModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Family Member Login Slips
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Provide each family member with their individual login passcode
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMemberCredentialsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {familyMembers.map((m) => {
                const passcode = m.loginPasscode || `${m.name.toLowerCase()}#2026`;
                const username = m.username || m.name.toLowerCase();
                const isCopied = copiedId === m.id;

                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {m.relationship}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Username: <strong>{username}</strong> | Passcode: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{passcode}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyCredentials(m)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy Slip'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Family members can enter their username or email along with their passcode in the Portal to sign in directly.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
