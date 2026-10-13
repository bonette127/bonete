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
  Check
} from 'lucide-react';
import { FamilyMemberItem, FamilyChatMessage } from '../data/portfolioData';

interface FamilyChatSectionProps {
  messages: FamilyChatMessage[];
  onSendMessage: (msg: string, senderName: string, senderEmail: string, senderRole: string) => void;
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
  const [selectedSenderId, setSelectedSenderId] = useState<string>(
    isAdminLoggedIn ? 'admin' : (familyMembers[0]?.id || 'admin')
  );

  // Identify sender based on selection
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
          name: member ? member.name : 'Family Member',
          email: member ? member.email : 'family@example.com',
          role: member ? member.relationship : 'Family',
          avatar: member?.avatar || member?.name.charAt(0) || 'F'
        };
      })();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(
      inputText.trim(),
      currentSender.name,
      currentSender.email,
      currentSender.role
    );
    setInputText('');
  };

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Private Family Sanctuary</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Family Chat Room: Bonette, Brothers & Sisters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
              A private real-time hub connecting Bonette with brothers Mugisha & Cedric, sisters Ruth, Reponce, Beryse, and parents. Admin can invite members via direct email link.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Admin Active
              </span>
            ) : (
              <button
                onClick={onOpenAdminModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Admin Login
              </button>
            )}

            <button
              onClick={onOpenAddMemberModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              Invite Member via Email
            </button>
          </div>
        </div>

        {/* Active Members Bar */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
              <Users className="w-4 h-4 text-emerald-600" />
              Family Circle:
            </span>
            <div className="flex items-center gap-2">
              {/* Admin Bonette */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-900 dark:text-emerald-200">Bonette (Admin)</span>
              </div>

              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs whitespace-nowrap"
                >
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">{member.relationship}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 hidden md:inline">
            End-to-end Family Protected
          </span>
        </div>

        {/* 2-Column Chat Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Chat Conversation View */}
          <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[560px] overflow-hidden shadow-xs">
            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => {
                const isAdmin = msg.senderEmail === 'byoyakozebonette@protonmail.com' || msg.isAnnouncement;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 text-xs ${
                      isAdmin ? 'bg-emerald-50/80 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full text-white font-bold flex items-center justify-center shrink-0 ${
                        isAdmin ? 'bg-emerald-600' : 'bg-slate-700 dark:bg-slate-700'
                      }`}
                    >
                      {msg.senderName.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {msg.senderRole}
                          </span>
                          {isAdmin && (
                            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-200/80 dark:bg-emerald-900/60 px-1.5 py-0.2 rounded">
                              OFFICIAL ADMIN
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Bar with Identity Switcher */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3">
              {/* Identity Selector */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span>Chatting as:</span>
                  <select
                    value={selectedSenderId}
                    onChange={(e) => setSelectedSenderId(e.target.value)}
                    className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-semibold text-slate-800 dark:text-slate-200 focus:outline-emerald-600"
                  >
                    <option value="admin">IBYOYAKOZE Bonette (Admin)</option>
                    {familyMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.relationship})
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-[11px] italic">Hit send to post in family chat</span>
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write a message as ${currentSender.name}...`}
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-emerald-600"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-xs shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Family Quick Info & Email Join Flow */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                How the Email Invite Works
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                When Admin Bonette registers a family member (brothers Mugisha & Cedric, sisters Ruth, Reponce, Beryse, or parents), a unique join token is dispatched to their email:
              </p>

              <ol className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 list-decimal list-inside">
                <li>Admin enters the member's email & role.</li>
                <li>System generates a private encrypted invite link.</li>
                <li>Member clicks their email link and joins the chat room instantly!</li>
              </ol>

              <button
                onClick={onOpenAddMemberModal}
                className="w-full mt-2 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                + Register New Relative Now
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Prayer & Encouragement Wall
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                "Praising God for Bonette's studies in L5 SOD at Lycée Saint Alexandre Sauli. May our family remain strong, united, and guided by faith in Gatsibo and beyond."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
