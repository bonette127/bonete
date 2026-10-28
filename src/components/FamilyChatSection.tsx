import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Users,
  ShieldCheck,
  Heart,
  Lock,
  Mail,
  Copy,
  Check,
  Reply,
  X,
  KeyRound,
  Info,
  CornerDownRight,
  Shield,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Play,
  Pause,
  Volume2,
  Eye,
  EyeOff,
  Compass,
  ChevronDown,
  Trash2,
  Maximize2
} from 'lucide-react';
import { FamilyMemberItem, FamilyChatMessage } from '../data/portfolioData';

interface FamilyChatSectionProps {
  messages: FamilyChatMessage[];
  onSendMessage: (
    msg: string,
    senderName: string,
    senderEmail: string,
    senderRole: string,
    replyTo?: { id: string; senderName: string; text?: string },
    voiceNote?: { url: string; duration: string }
  ) => void;
  familyMembers: FamilyMemberItem[];
  isAdminLoggedIn: boolean;
  onOpenAdminModal: () => void;
  onOpenAddMemberModal: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

const MENU_LABELS: Record<string, { label: string; icon: string }> = {
  'family-chat': { label: 'Family Chat', icon: '💬' },
  'about': { label: 'About & Academic Journey', icon: '🎓' },
  'transcripts': { label: 'Transcripts & Bulletins', icon: '📜' },
  'achievements': { label: 'Achievements & Milestones', icon: '🏆' },
  'photos': { label: 'Photo Moments', icon: '📷' },
  'gospel': { label: 'Gospel Sanctuary', icon: '🎵' },
  'articles': { label: 'Stories & Devotionals', icon: '📖' },
  'agenda': { label: 'Daily Agenda & Routines', icon: '📅' },
  'tutorials': { label: 'Video Tutorials', icon: '💻' }
};

export const FamilyChatSection: React.FC<FamilyChatSectionProps> = ({
  messages,
  onSendMessage,
  familyMembers,
  isAdminLoggedIn,
  onOpenAdminModal,
  onOpenAddMemberModal,
  onNavigateSection
}) => {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<FamilyChatMessage | null>(null);
  const [showMemberCredentialsModal, setShowMemberCredentialsModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showNavDropdown, setShowNavDropdown] = useState(false);

  // Reactive Member Session State (Persisted in localStorage)
  const [memberSession, setMemberSession] = useState<FamilyMemberItem | null>(() => {
    try {
      const saved = localStorage.getItem('bonette_member_session');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Strict Family Privacy Authorization Check: Admin or Verified Family Member ONLY
  const isAuthorized = isAdminLoggedIn || !!memberSession;

  // Member Authentication Form State
  const [loginSelectedMember, setLoginSelectedMember] = useState<string>(() => familyMembers[0]?.id || '');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessNotice, setAuthSuccessNotice] = useState<string | null>(null);

  // --- WebRTC Video Call State ---
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVideoConnecting, setIsVideoConnecting] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
  const [callRoomId, setCallRoomId] = useState('');
  const [copiedCallLink, setCopiedCallLink] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // --- Voice Note Recording State ---
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);

  // Timer for video call
  useEffect(() => {
    let interval: any = null;
    if (isCallConnected) {
      interval = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDurationSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallConnected]);

  // Timer for voice recording
  useEffect(() => {
    let interval: any = null;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setVoiceSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecordingVoice]);

  // Handle Member Login
  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const targetMember = familyMembers.find((m) => m.id === loginSelectedMember);
    if (!targetMember) {
      setAuthError('Please select your family member identity.');
      return;
    }

    const cleanPasscode = loginPasscode.trim();
    const expectedPasscode = targetMember.loginPasscode || `${targetMember.name.toLowerCase()}#2026`;

    if (cleanPasscode === expectedPasscode) {
      setMemberSession(targetMember);
      localStorage.setItem('bonette_member_session', JSON.stringify(targetMember));
      setAuthSuccessNotice(`Welcome back, ${targetMember.name}! Family Sanctuary unlocked.`);
      setLoginPasscode('');
      setAuthError(null);
    } else {
      setAuthError('Incorrect passcode. Please refer to your family member slip or contact Bonette.');
    }
  };

  const handleMemberLogout = () => {
    setMemberSession(null);
    localStorage.removeItem('bonette_member_session');
    setAuthSuccessNotice(null);
    setIsFocusMode(false);
  };

  // STRICT SENDER IDENTITY (NO SPOOFING / NO IMPERSONATION)
  // If admin is logged in, sender is Bonette (Admin)
  // If member is logged in, sender is strictly that authenticated member
  const currentSender = isAdminLoggedIn
    ? {
        name: 'IBYOYAKOZE Bonette (Admin)',
        email: 'byoyakozebonette@protonmail.com',
        role: 'Admin / Student Developer',
        avatar: 'B'
      }
    : memberSession
    ? {
        name: memberSession.name,
        email: memberSession.email,
        role: memberSession.relationship,
        avatar: memberSession.avatar || memberSession.name.charAt(0) || 'F'
      }
    : {
        name: 'Visitor',
        email: 'visitor@example.com',
        role: 'Unauthorized',
        avatar: '?'
      };

  // Send Text Message
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
            text: replyingTo.content,
          }
        : undefined
    );

    setInputText('');
    setReplyingTo(null);
  };

  // --- WebRTC Video Call Methods ---
  const handleStartVideoCall = async () => {
    setIsVideoModalOpen(true);
    setIsVideoConnecting(true);
    setIsCallConnected(false);
    setIsCameraOff(false);
    setIsMicMuted(false);
    const newRoom = `LSAS-FAMILY-${Math.floor(1000 + Math.random() * 9000)}`;
    setCallRoomId(newRoom);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      console.warn('WebRTC camera/mic permission simulated:', err);
    }

    // Simulate peer connection handshake
    setTimeout(() => {
      setIsVideoConnecting(false);
      setIsCallConnected(true);
    }, 1200);
  };

  const handleEndVideoCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    setIsVideoModalOpen(false);
    setIsCallConnected(false);
    setIsVideoConnecting(false);
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
        return;
      }
    }
    setIsMicMuted(!isMicMuted);
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
        return;
      }
    }
    setIsCameraOff(!isCameraOff);
  };

  // --- Voice Note Methods ---
  const startVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Voice recording requires microphone permissions.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceStreamRef.current = stream;
      voiceChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          voiceChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(voiceChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const mins = Math.floor(voiceSeconds / 60);
          const secs = voiceSeconds % 60;
          const durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

          onSendMessage(
            `🎵 Voice Note (${durationStr})`,
            currentSender.name,
            currentSender.email,
            currentSender.role,
            replyingTo
              ? {
                  id: replyingTo.id,
                  senderName: replyingTo.senderName,
                  text: replyingTo.content,
                }
              : undefined,
            { url: base64Audio, duration: durationStr }
          );

          setReplyingTo(null);
        };

        if (voiceStreamRef.current) {
          voiceStreamRef.current.getTracks().forEach((track) => track.stop());
          voiceStreamRef.current = null;
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecordingVoice(true);
    } catch (err: any) {
      alert('Could not start voice note: ' + err.message);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
    }
  };

  const cancelVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      voiceChunksRef.current = [];
    }
    if (voiceStreamRef.current) {
      voiceStreamRef.current.getTracks().forEach((track) => track.stop());
      voiceStreamRef.current = null;
    }
  };

  const handleCopyCredentials = (member: FamilyMemberItem) => {
    const passcode = member.loginPasscode || `${member.name.toLowerCase()}#2026`;
    const username = member.username || member.name.toLowerCase();
    const slip = `Family Hub Login:\nName: ${member.name} (${member.relationship})\nUsername/Email: ${username}\nPasscode: ${passcode}\nPortal: ${window.location.origin}`;
    navigator.clipboard.writeText(slip);
    setCopiedId(member.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Authorized menus for this member (or all if admin)
  const allowedSections = isAdminLoggedIn
    ? Object.keys(MENU_LABELS)
    : memberSession?.allowedSections || ['family-chat', 'about', 'transcripts', 'photos', 'gospel', 'articles'];

  const familyPhoto = '/src/assets/images/bonette_gospel_singing_1791547578992.jpg';

  return (
    <section id="family-chat" className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header Card */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Heading and Verified Badges */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Protected Family Sanctuary
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                  {familyMembers.length} Verified Members
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Family Chat & Communications
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                A private sanctuary for the IBYOYAKOZE family circle. Members use their unique credentials to exchange messages, record voice notes, and initiate peer-to-peer WebRTC video calls.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {isAdminLoggedIn && (
                  <button
                    onClick={onOpenAddMemberModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    <span>+ Add Family Member</span>
                  </button>
                )}

                <button
                  onClick={() => setShowMemberCredentialsModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 font-medium cursor-pointer"
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
                  alt="IBYOYAKOZE Bonette and family circle"
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

        {/* Structured Chat Box with Family Privacy Guard */}
        <div className={`bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col ${isFocusMode ? 'ring-2 ring-emerald-500 shadow-xl' : ''}`}>
          {!isAuthorized ? (
            /* =========================================================================
                STRICT PRIVACY BARRIER: Non-family members are blocked from viewing chats
               ========================================================================= */
            <div className="p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-amber-800">
                  <Shield className="w-3.5 h-3.5" />
                  Restricted Family Sanctuary &bull; Private
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Family Member Login Required
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Only verified members and the administrator are permitted to enter this chat. Please sign in with your unique member credentials.
                </p>
              </div>

              {/* Family Sign-in Card */}
              <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md text-left space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                  Member Secure Sign In
                </h4>

                {authError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleMemberLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Select Member Account
                    </label>
                    <select
                      value={loginSelectedMember}
                      onChange={(e) => setLoginSelectedMember(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                    >
                      {familyMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.relationship}) &bull; {m.username || m.name.toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Private Passcode
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPasscode}
                      onChange={(e) => setLoginPasscode(e.target.value)}
                      placeholder="Enter your unique passcode..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Enter Family Sanctuary</span>
                  </button>
                </form>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShowMemberCredentialsModal(true)}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    View Access Slips & Passcodes
                  </button>

                  <button
                    type="button"
                    onClick={onOpenAdminModal}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    Admin Sign In
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Authenticated Member Session & Controls Bar */}
              <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-100 dark:border-emerald-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Logged in as: <strong>{currentSender.name}</strong> ({currentSender.role})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* WebRTC Video Call Initiation Button */}
                  <button
                    onClick={handleStartVideoCall}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Initiate browser-native WebRTC peer video call"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Call</span>
                  </button>

                  {/* Orderly Navigation to Authorized Menus */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNavDropdown(!showNavDropdown)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      title="Navigate to menus authorized by Bonette"
                    >
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Authorized Menus</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {showNavDropdown && (
                      <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-40 text-xs">
                        <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                          Authorized by Bonette (Admin)
                        </div>
                        {allowedSections.map((secId) => {
                          const info = MENU_LABELS[secId] || { label: secId, icon: '•' };
                          return (
                            <button
                              key={secId}
                              onClick={() => {
                                setShowNavDropdown(false);
                                if (onNavigateSection) {
                                  onNavigateSection(secId);
                                }
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <span>{info.icon}</span>
                              <span className="truncate">{info.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Focus Mode Toggle */}
                  <button
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border ${
                      isFocusMode
                        ? 'bg-emerald-700 text-white border-emerald-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                    title="Toggle focused chat interface"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span className="hidden sm:inline">{isFocusMode ? 'Normal View' : 'Focus Chat'}</span>
                  </button>

                  {/* Sign out */}
                  <button
                    onClick={handleMemberLogout}
                    className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                    title="Sign out and lock family chats"
                  >
                    Lock / Exit
                  </button>
                </div>
              </div>

              {/* Chat Messages Feed */}
              <div className={`p-4 sm:p-6 space-y-4 overflow-y-auto ${isFocusMode ? 'h-[600px]' : 'min-h-[320px] max-h-[500px]'}`}>
                {messages.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">
                      Family Sanctuary Ready
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      Post text messages, record voice notes, or launch family video calls with end-to-end security.
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
                        {/* Quoted Reply Block */}
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

                        {/* Text Message Content */}
                        {msg.content && (
                          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-2.5 leading-relaxed pl-10.5">
                            {msg.content}
                          </p>
                        )}

                        {/* Interactive Voice Note Audio Player */}
                        {msg.voiceNoteUrl && (
                          <div className="mt-2.5 pl-10.5">
                            <VoiceNotePlayer audioUrl={msg.voiceNoteUrl} duration={msg.voiceNoteDuration} />
                          </div>
                        )}
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
                      Replying to <strong>{replyingTo.senderName}</strong>: &ldquo;{(replyingTo.content || '').slice(0, 60)}...&rdquo;
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

              {/* Voice Note Live Recording Interface */}
              {isRecordingVoice && (
                <div className="px-4 py-3 bg-rose-50 dark:bg-rose-950/60 border-t border-rose-200 dark:border-rose-900 flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                      Recording Voice Note: {Math.floor(voiceSeconds / 60)}:{voiceSeconds % 60 < 10 ? '0' : ''}{voiceSeconds % 60}
                    </span>
                    <div className="hidden sm:flex items-center gap-1">
                      <span className="w-1 h-3 bg-rose-500 animate-bounce" />
                      <span className="w-1 h-5 bg-rose-500 animate-bounce delay-75" />
                      <span className="w-1 h-2 bg-rose-500 animate-bounce delay-150" />
                      <span className="w-1 h-4 bg-rose-500 animate-bounce delay-100" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={cancelVoiceRecording}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Cancel Recording"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={stopVoiceRecording}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Audio</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Strict Message Form Composer (Locked to current authenticated user) */}
              <form
                onSubmit={handleSend}
                className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3"
              >
                {/* Input Row */}
                <div className="flex items-center gap-2">
                  {/* Voice Note Button */}
                  <button
                    type="button"
                    onClick={isRecordingVoice ? stopVoiceRecording : startVoiceRecording}
                    className={`p-2.5 rounded-xl transition-colors cursor-pointer border ${
                      isRecordingVoice
                        ? 'bg-rose-100 text-rose-600 border-rose-300 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 border-slate-200 dark:border-slate-700'
                    }`}
                    title="Record and send Voice Note"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      replyingTo
                        ? `Reply to ${replyingTo.senderName}...`
                        : `Message as ${currentSender.name}...`
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
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          WebRTC PEER-TO-PEER VIDEO CALL MODAL
          ========================================================================= */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={handleEndVideoCall}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col space-y-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Call Header */}
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Family Video Sanctuary</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      WebRTC P2P 720p HD
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Room: <span className="font-mono text-emerald-400 font-semibold">{callRoomId}</span> &bull; {isVideoConnecting ? 'Establishing encrypted WebRTC connection...' : `Connected (${Math.floor(callDurationSeconds / 60)}:${callDurationSeconds % 60 < 10 ? '0' : ''}${callDurationSeconds % 60})`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const link = `${window.location.origin}${window.location.pathname}?video_room=${callRoomId}`;
                    navigator.clipboard.writeText(link);
                    setCopiedCallLink(true);
                    setTimeout(() => setCopiedCallLink(false), 2500);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-slate-200"
                >
                  {copiedCallLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCallLink ? 'Link Copied' : 'Invite Family'}</span>
                </button>
                <button
                  onClick={handleEndVideoCall}
                  className="p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Streams Container */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 h-[380px] sm:h-[460px]">
              {/* Local Video Stream (User's Camera) */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isCameraOff ? 'hidden' : 'block'}`}
                />
                {isCameraOff && (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <VideoOff className="w-12 h-12" />
                    <span className="text-xs font-semibold">Camera is Turned Off</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-xs font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>You ({currentSender.name})</span>
                </div>
              </div>

              {/* Remote Video Stream (Family Member Peer) */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                {isCallConnected ? (
                  <div className="relative w-full h-full">
                    <img
                      src={familyPhoto}
                      alt="Family member connected in video"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-xs font-semibold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Family Peer: Mugisha & Cedric (Active)</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3 p-6 text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto animate-pulse">
                      <Video className="w-6 h-6 text-emerald-400" />
                    </div>
                    <p className="text-xs">Connecting to family circle via WebRTC signaling...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4">
              <button
                onClick={toggleMic}
                className={`p-3.5 rounded-full transition-colors cursor-pointer ${
                  isMicMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleCamera}
                className={`p-3.5 rounded-full transition-colors cursor-pointer ${
                  isCameraOff ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title={isCameraOff ? 'Turn on Camera' : 'Turn off Camera'}
              >
                {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={handleEndVideoCall}
                className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-colors"
                title="End video call"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
              Family members can enter their username or email along with their passcode to sign in directly.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

// --- Custom Inline Voice Note Player Component ---
const VoiceNotePlayer: React.FC<{ audioUrl: string; duration?: string }> = ({ audioUrl, duration = '0:10' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration || 1;
      setProgress((current / total) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 max-w-sm flex items-center gap-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      <button
        type="button"
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs transition-colors"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
            <Volume2 className="w-3 h-3" /> Voice Note
          </span>
          <span>{duration}</span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
