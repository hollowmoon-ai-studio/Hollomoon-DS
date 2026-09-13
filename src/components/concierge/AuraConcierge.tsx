import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  X,
  Send,
  Target,
  Layers,
  FileText,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  Copy,
  Check,
  Radio,
  RefreshCw,
  MessageSquare,
  Activity,
  Brain,
  Trash2,
  RotateCcw,
  History,
  Database,
  FolderArchive,
  HardDrive,
  Plus,
  Download,
  ChevronRight,
  ArrowUpDown,
  FileCode,
} from 'lucide-react';
import { AuraAudioVisualizer } from './AuraAudioVisualizer';
import { AuraThinkingWaveform } from './AuraThinkingWaveform';
import {
  AuraMessage,
  AuraLeadProfile,
  CroDiagnostic,
  RecommendedArchitecture,
  AuraSessionMemory,
  AuraMemoryRecallPoint,
  AuraSessionSummary,
  IndexedDBStats,
} from './auraTypes';
import { initialAuraGreeting, initialLeadProfile, defaultCroAudit, defaultRecommendedArchitecture, queryAuraConcierge } from './auraEngine';
import {
  loadAuraSessionMemory,
  loadAuraSessionMemoryAsync,
  saveAuraSessionMemory,
  clearAuraSessionMemory,
  extractRecallPoints,
  createDefaultSessionMemory,
  listAllSessionsFromIndexedDB,
  loadSessionFromIndexedDB,
  deleteSessionFromIndexedDB,
  clearAllSessionsFromIndexedDB,
  setActiveSessionIdInIndexedDB,
  getIndexedDBMetrics,
  downloadSessionJsonFile,
  isIndexedDBAvailable,
} from './auraMemoryStorage';
import { Language } from '../../types';

interface AuraConciergeProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
  onToggleLang: () => void;
}

export const AuraConcierge: React.FC<AuraConciergeProps> = ({ onNavigate, lang, onToggleLang }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);

  // Persistent Session Memory Initialization (IndexedDB primary with localStorage fast-boot mirror)
  const [sessionMemory, setSessionMemory] = useState<AuraSessionMemory>(() => loadAuraSessionMemory(lang));
  const [messages, setMessages] = useState<AuraMessage[]>(() => sessionMemory.messages);
  const [leadProfile, setLeadProfile] = useState<AuraLeadProfile>(() => sessionMemory.leadProfile);
  const [croAudit, setCroAudit] = useState<CroDiagnostic>(() => sessionMemory.croAudit || defaultCroAudit(lang));
  const [recommendedStack, setRecommendedStack] = useState<RecommendedArchitecture>(
    () => sessionMemory.recommendedStack || defaultRecommendedArchitecture(lang)
  );
  const [recallPoints, setRecallPoints] = useState<AuraMemoryRecallPoint[]>(() => sessionMemory.recallPoints);
  const [showMemoryNotice, setShowMemoryNotice] = useState<boolean>(() => sessionMemory.messages.length > 1);

  // IndexedDB Multi-Session State
  const [idbStats, setIdbStats] = useState<IndexedDBStats>({
    supported: isIndexedDBAvailable(),
    activeSessionId: sessionMemory.sessionId,
    totalSessions: 1,
    estimatedBytes: 0,
    storageEngine: isIndexedDBAvailable() ? 'indexeddb' : 'localstorage_fallback',
  });
  const [savedSessions, setSavedSessions] = useState<AuraSessionSummary[]>([]);
  const [isCreatingNewSession, setIsCreatingNewSession] = useState<boolean>(false);
  const [newSessionTitle, setNewSessionTitle] = useState<string>('');
  const [newSessionSector, setNewSessionSector] = useState<string>('Logistics & Freight');
  const [sessionStatusMessage, setSessionStatusMessage] = useState<string | null>(null);

  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'cro' | 'architecture' | 'lead' | 'memory'>('cro');
  const [copiedBrief, setCopiedBrief] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('Tomorrow 10:00 AM EST (Panama Sync)');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Deep asynchronous IndexedDB load on mount: restores full multi-session history
  useEffect(() => {
    let isMounted = true;
    async function restoreFromIndexedDB() {
      try {
        const storedSession = await loadAuraSessionMemoryAsync(lang);
        if (!isMounted) return;

        if (storedSession && storedSession.sessionId) {
          setSessionMemory(storedSession);
          setMessages(storedSession.messages);
          setLeadProfile(storedSession.leadProfile);
          if (storedSession.croAudit) setCroAudit(storedSession.croAudit);
          if (storedSession.recommendedStack) setRecommendedStack(storedSession.recommendedStack);
          if (storedSession.recallPoints) setRecallPoints(storedSession.recallPoints);
          if (storedSession.leadProfile?.scheduledSlot) setBookingConfirmed(true);
        }

        const sessionsList = await listAllSessionsFromIndexedDB();
        const metrics = await getIndexedDBMetrics(storedSession.sessionId);
        if (isMounted) {
          setSavedSessions(sessionsList);
          setIdbStats(metrics);
        }
      } catch (err) {
        console.warn('Initial IndexedDB sync error:', err);
      }
    }
    restoreFromIndexedDB();
    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize state with persistent IndexedDB memory and localStorage mirror
  useEffect(() => {
    // Dynamically derive a descriptive session title based on client discovery progression
    const computedTitle =
      sessionMemory.sessionTitle ||
      (leadProfile.companyName
        ? `${leadProfile.companyName} (${leadProfile.industry})`
        : `${leadProfile.industry} Discovery`);

    const updated: AuraSessionMemory = {
      ...sessionMemory,
      sessionTitle: computedTitle,
      messages,
      leadProfile,
      croAudit,
      recommendedStack,
      recallPoints,
      language: lang,
      storageEngine: isIndexedDBAvailable() ? 'indexeddb' : 'localstorage_fallback',
    };

    saveAuraSessionMemory(updated).then(() => {
      listAllSessionsFromIndexedDB().then(setSavedSessions);
      getIndexedDBMetrics(updated.sessionId).then(setIdbStats);
    });

    setSessionMemory(updated);
  }, [messages, leadProfile, croAudit, recommendedStack, recallPoints, lang]);

  // Sync initial greeting when language changes if no custom messages yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [initialAuraGreeting(lang)];
      }
      return prev;
    });
    setCroAudit(defaultCroAudit(lang, leadProfile.industry));
    setRecommendedStack(defaultRecommendedArchitecture(lang, leadProfile.industry));
  }, [lang]);

  // Multi-Session: Switch to another saved session from IndexedDB
  const handleSwitchSession = async (targetSessionId: string) => {
    try {
      const target = await loadSessionFromIndexedDB(targetSessionId);
      if (target) {
        await setActiveSessionIdInIndexedDB(targetSessionId);
        setSessionMemory(target);
        setMessages(target.messages);
        setLeadProfile(target.leadProfile);
        setCroAudit(target.croAudit || defaultCroAudit(lang, target.leadProfile?.industry));
        setRecommendedStack(target.recommendedStack || defaultRecommendedArchitecture(lang, target.leadProfile?.industry));
        setRecallPoints(target.recallPoints || []);
        setBookingConfirmed(Boolean(target.leadProfile?.scheduledSlot));
        setShowMemoryNotice(false);

        const updatedSessions = await listAllSessionsFromIndexedDB();
        setSavedSessions(updatedSessions);
        const stats = await getIndexedDBMetrics(targetSessionId);
        setIdbStats(stats);

        setSessionStatusMessage(
          lang === 'es'
            ? `Sesión cargada desde IndexedDB: "${target.sessionTitle || targetSessionId}" (${target.messages.length} mensajes)`
            : `Loaded session from IndexedDB: "${target.sessionTitle || targetSessionId}" (${target.messages.length} turns)`
        );
        setTimeout(() => setSessionStatusMessage(null), 4500);
      }
    } catch (err) {
      console.error('Failed to switch session:', err);
    }
  };

  // Multi-Session: Create a new strategic discovery session
  const handleCreateNewSession = async () => {
    try {
      const defaultName =
        newSessionTitle.trim() ||
        (lang === 'es'
          ? `Sesión Estratégica (${newSessionSector})`
          : `Discovery Strategy (${newSessionSector})`);

      const fresh = createDefaultSessionMemory(lang, defaultName);
      fresh.leadProfile.industry = newSessionSector;
      fresh.croAudit = defaultCroAudit(lang, newSessionSector);
      fresh.recommendedStack = defaultRecommendedArchitecture(lang, newSessionSector);

      await saveAuraSessionMemory(fresh);
      await setActiveSessionIdInIndexedDB(fresh.sessionId);

      setSessionMemory(fresh);
      setMessages(fresh.messages);
      setLeadProfile(fresh.leadProfile);
      setCroAudit(fresh.croAudit);
      setRecommendedStack(fresh.recommendedStack);
      setRecallPoints(fresh.recallPoints);
      setBookingConfirmed(false);
      setIsCreatingNewSession(false);
      setNewSessionTitle('');

      const updatedSessions = await listAllSessionsFromIndexedDB();
      setSavedSessions(updatedSessions);
      const stats = await getIndexedDBMetrics(fresh.sessionId);
      setIdbStats(stats);

      setSessionStatusMessage(
        lang === 'es'
          ? `Nueva sesión creada en IndexedDB: "${defaultName}".`
          : `New discovery session initialized in IndexedDB: "${defaultName}".`
      );
      setTimeout(() => setSessionStatusMessage(null), 4500);
    } catch (err) {
      console.error('Failed to create new session:', err);
    }
  };

  // Multi-Session: Delete an archive from IndexedDB
  const handleDeleteSession = async (targetSessionId: string) => {
    try {
      await deleteSessionFromIndexedDB(targetSessionId);
      const remaining = await listAllSessionsFromIndexedDB();
      setSavedSessions(remaining);

      // If active session was deleted, switch to the first remaining or create a fresh one
      if (sessionMemory.sessionId === targetSessionId) {
        if (remaining.length > 0) {
          await handleSwitchSession(remaining[0].sessionId);
        } else {
          await handleCreateNewSession();
        }
      } else {
        const stats = await getIndexedDBMetrics(sessionMemory.sessionId);
        setIdbStats(stats);
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  // Export current session context as JSON file
  const handleExportSession = (sessionToExport: AuraSessionMemory) => {
    downloadSessionJsonFile(sessionToExport);
  };

  // Reset Session Memory Handler (Clears active session from IndexedDB and local state)
  const handleResetMemory = async () => {
    const clean = await clearAuraSessionMemory(lang, sessionMemory.sessionId);
    setSessionMemory(clean);
    setMessages(clean.messages);
    setLeadProfile(clean.leadProfile);
    setCroAudit(clean.croAudit || defaultCroAudit(lang));
    setRecommendedStack(clean.recommendedStack || defaultRecommendedArchitecture(lang));
    setRecallPoints(clean.recallPoints);
    setShowMemoryNotice(false);
    setBookingConfirmed(false);

    const updatedSessions = await listAllSessionsFromIndexedDB();
    setSavedSessions(updatedSessions);
    const stats = await getIndexedDBMetrics(clean.sessionId);
    setIdbStats(stats);

    setSessionStatusMessage(
      lang === 'es' ? 'Sesión reiniciada exitosamente.' : 'Session memory reset successfully.'
    );
    setTimeout(() => setSessionStatusMessage(null), 4000);
  };

  // Purge all IndexedDB archives
  const handlePurgeAllSessions = async () => {
    await clearAllSessionsFromIndexedDB();
    const fresh = await clearAuraSessionMemory(lang);
    setSessionMemory(fresh);
    setMessages(fresh.messages);
    setLeadProfile(fresh.leadProfile);
    setCroAudit(fresh.croAudit || defaultCroAudit(lang));
    setRecommendedStack(fresh.recommendedStack || defaultRecommendedArchitecture(lang));
    setRecallPoints(fresh.recallPoints);
    setBookingConfirmed(false);
    setSavedSessions([
      {
        sessionId: fresh.sessionId,
        sessionTitle: fresh.sessionTitle || 'Active Strategy Session',
        createdAt: fresh.createdAt,
        lastActiveAt: fresh.lastActiveAt,
        totalTurns: fresh.messages.length,
        recallCount: fresh.recallPoints.length,
        industry: fresh.leadProfile.industry,
        qualificationScore: fresh.leadProfile.qualificationScore,
      },
    ]);
    const stats = await getIndexedDBMetrics(fresh.sessionId);
    setIdbStats(stats);

    setSessionStatusMessage(
      lang === 'es' ? 'Todas las sesiones de IndexedDB fueron purgadas.' : 'All IndexedDB session archives purged.'
    );
    setTimeout(() => setSessionStatusMessage(null), 4000);
  };

  // AI Strategic Session Recap Trigger
  const handleTriggerRecap = () => {
    handleSendMessage(
      lang === 'es'
        ? 'Por favor, realiza un resumen ejecutivo de los puntos clave, métricas de fricción y decisiones que hemos registrado en esta sesión.'
        : 'Please provide an executive recap of the key points, friction metrics, and decisions retained in our session memory.'
    );
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Speech Synthesis helper
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      // Clean markdown tags for natural vocalization
      const cleanText = text.replace(/[*_#`[\]()]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang === 'es' ? 'es-ES' : 'en-US';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select high quality voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => (lang === 'es' ? v.lang.startsWith('es') : v.lang.startsWith('en')) && !v.name.includes('Google')
      ) || voices.find((v) => (lang === 'es' ? v.lang.startsWith('es') : v.lang.startsWith('en')));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Web Speech Recognition Initialization
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === 'es' ? 'es-ES' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setInterimTranscript('');
          handleSendMessage(final, true);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      stopSpeaking();
    };
  }, [lang]);

  const toggleListening = () => {
    if (isSpeaking) {
      stopSpeaking();
    }

    if (!recognitionRef.current) {
      alert(
        lang === 'es'
          ? 'El reconocimiento de voz no está disponible en este navegador o contexto.'
          : 'Speech recognition is not supported or permitted in this browser frame.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = lang === 'es' ? 'es-ES' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string, fromVoice = false) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    setInputText('');
    setInterimTranscript('');

    const userMsg: AuraMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Extract recall points from user input immediately
    const updatedPointsWithUser = extractRecallPoints(text, 'user', recallPoints, leadProfile);
    setRecallPoints(updatedPointsWithUser);

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setIsProcessingVoice(fromVoice);

    try {
      const memoryForQuery: AuraSessionMemory = {
        ...sessionMemory,
        messages: [...messages, userMsg],
        leadProfile,
        croAudit,
        recommendedStack,
        recallPoints: updatedPointsWithUser,
        language: lang,
      };

      const response = await queryAuraConcierge(text, lang, leadProfile, memoryForQuery);

      const auraMsg: AuraMessage = {
        id: `msg-aura-${Date.now()}`,
        sender: 'aura',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: response.category,
        suggestedPills: response.suggestedPills,
      };

      setMessages((prev) => [...prev, auraMsg]);

      // Extract recall points from assistant response and lead update
      const updatedProfile = response.leadUpdate ? { ...leadProfile, ...response.leadUpdate } : leadProfile;
      const finalPoints = extractRecallPoints(response.reply, 'aura', updatedPointsWithUser, updatedProfile);
      setRecallPoints(finalPoints);

      // Update right-side multimodal canvas accordingly
      if (response.croAudit) {
        setCroAudit(response.croAudit);
        setActiveTab('cro');
      }
      if (response.recommendedStack) {
        setRecommendedStack(response.recommendedStack);
        setActiveTab('architecture');
      }
      if (response.leadUpdate) {
        setLeadProfile(updatedProfile);
        if (response.category === 'sales') {
          setActiveTab('lead');
        }
      }

      // Voice vocalization
      if (speechEnabled) {
        speakText(response.reply);
      }
    } catch (err) {
      console.error('Concierge interaction error:', err);
    } finally {
      setIsLoading(false);
      setIsProcessingVoice(false);
    }
  };

  const handleSendMessageRef = useRef(handleSendMessage);
  handleSendMessageRef.current = handleSendMessage;

  // Global event listener to allow other components (e.g. ROI Calculator, Benchmarks) to invoke AURA
  useEffect(() => {
    const handleAuraTrigger = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsOpen(true);
      setIsMinimized(false);
      if (detail) {
        if (detail.tab) {
          setActiveTab(detail.tab);
        }
        if (detail.prompt) {
          handleSendMessageRef.current(detail.prompt);
        }
      }
    };

    window.addEventListener('open-aura-concierge', handleAuraTrigger);
    return () => {
      window.removeEventListener('open-aura-concierge', handleAuraTrigger);
    };
  }, []);

  const handleCopyBrief = () => {
    const brief = `# Hollowmoon Digital Studio — Executive Discovery Brief
Date: ${new Date().toLocaleDateString()}
Industry: ${leadProfile.industry}
Team Size: ${leadProfile.teamSize}
Target Budget: ${leadProfile.targetBudget}
Identified Friction: ${leadProfile.currentBottleneck}
Conversion Potential: ${croAudit.conversionPotential}
Projected Annual Recovery: ${croAudit.estimatedAnnualRecovery}
Recommended Suite: ${recommendedStack.stackName}
Lead Readiness Score: ${leadProfile.qualificationScore}/100 (${leadProfile.status.toUpperCase()})
Selected Strategy Window: ${selectedSlot}
Panama Flagship SLA: 99.99% • Zero-Trust Compliance Ready`;

    navigator.clipboard.writeText(brief);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2500);
  };

  const handleConfirmSlot = () => {
    setBookingConfirmed(true);
    const updatedLead: AuraLeadProfile = {
      ...leadProfile,
      scheduledSlot: selectedSlot,
      status: 'priority_enterprise',
      qualificationScore: 99,
    };
    setLeadProfile(updatedLead);

    // Record decision in session memory
    const updatedPoints = extractRecallPoints(
      `Confirmed strategy discovery booking for ${selectedSlot}`,
      'user',
      recallPoints,
      updatedLead
    );
    setRecallPoints(updatedPoints);

    const confirmMsg: AuraMessage = {
      id: `msg-confirm-${Date.now()}`,
      sender: 'aura',
      text:
        lang === 'es'
          ? `Excelente. He bloqueado formalmente su espacio para "${selectedSlot}" y registrado la confirmación en su memoria de sesión. Nuestro equipo de socios arquitectos en Ciudad de Panamá le enviará el dossier de bienvenida confidencial.`
          : `Splendid. I have provisioned your strategy slot for "${selectedSlot}" and committed the milestone to session memory. Our senior architectural partners in Panama City will dispatch the confidential discovery dossier to your inbox.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'sales',
    };

    setMessages((prev) => [...prev, confirmMsg]);
    if (speechEnabled) {
      speakText(confirmMsg.text);
    }
  };

  return (
    <>
      {/* 1. COMPACT STATE: Dynamic Studio Island Floating Pill */}
      {(!isOpen || isMinimized) && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="glass-panel border border-[#4F7FFF]/30 shadow-macOS-lift rounded-full p-2 pl-3.5 pr-2 flex items-center gap-3 bg-card/90 backdrop-blur-xl animate-float-subtle">
            {/* Pulsing Acoustic Core Orb */}
            <div
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#4F7FFF]/10 border border-[#4F7FFF]/30 group-hover:bg-[#4F7FFF]/20 transition-all">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4F7FFF] animate-pulse-subtle" />
                <span className="absolute inset-0 rounded-full border border-[#4F7FFF] animate-ping opacity-30" />
              </div>

              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs font-bold text-foreground">AURA AI</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-[#4F7FFF] animate-ping' : 'bg-emerald-500'}`} />
                </div>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {isLoading
                    ? isProcessingVoice
                      ? lang === 'es' ? 'Procesando Voz...' : 'Processing Voice...'
                      : lang === 'es' ? 'AURA Pensando...' : 'AURA Thinking...'
                    : lang === 'es' ? 'Asesora de Negocios' : 'Executive BizDev Agent'}
                </p>
              </div>
            </div>

            {/* Quick Micro Voice Trigger */}
            <button
              onClick={toggleListening}
              title={isListening ? 'Stop Listening' : 'Voice Command'}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isListening
                  ? 'bg-emerald-500 text-white animate-pulse shadow-md'
                  : 'bg-secondary text-foreground hover:bg-[#4F7FFF] hover:text-white'
              }`}
            >
              {isListening ? <Mic className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            {/* Language Switcher Pill */}
            <button
              onClick={onToggleLang}
              className="px-2 py-1 rounded-full bg-secondary text-[10px] font-mono text-foreground font-semibold hover:bg-secondary/80 cursor-pointer"
            >
              {lang.toUpperCase()}
            </button>

            {/* Memory Recall Badge */}
            {recallPoints.length > 0 && (
              <button
                onClick={() => {
                  setActiveTab('memory');
                  setIsOpen(true);
                  setIsMinimized(false);
                }}
                title={lang === 'es' ? `Memoria Activa: ${recallPoints.length} nodos recordados` : `Session Memory: ${recallPoints.length} points recalled`}
                className="flex items-center gap-1 text-[10px] font-mono text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 px-2 py-1 rounded-full border border-purple-500/25 transition-all cursor-pointer"
              >
                <Brain className="w-3 h-3 text-purple-400" />
                <span className="font-semibold">{recallPoints.length}</span>
              </button>
            )}

            {/* Expand Cockpit Button */}
            <button
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="p-2 rounded-full bg-[#4F7FFF] text-white hover:bg-[#3D6CE6] cursor-pointer shadow-sm flex items-center gap-1"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. EXPANDED MULTIMODAL EXECUTIVE COMMAND DECK (HUD) */}
      {isOpen && !isMinimized && (
        <div className="fixed inset-4 sm:inset-6 md:inset-10 lg:inset-x-16 lg:inset-y-12 z-50 flex flex-col rounded-3xl glass-panel border border-[#4F7FFF]/30 shadow-macOS-lift overflow-hidden bg-background/95 backdrop-blur-2xl">
          {/* Deck Top HUD Header */}
          <div className="px-6 py-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-4 bg-card/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#4F7FFF]/10 border border-[#4F7FFF]/30 flex items-center justify-center relative">
                <Sparkles className="w-4 h-4 text-[#4F7FFF]" />
                {isSpeaking && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm sm:text-base text-foreground">
                    AURA • Autonomous Unified Relations Agent
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                    {lang === 'es' ? 'Bilingüe • En Línea' : 'Bilingual • Multimodal'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {lang === 'es'
                    ? 'Consultoría en Soporte (CS), Experiencia (CX), CRO y Desarrollo de Negocios'
                    : 'Customer Support, CX Journey, CRO Diagnostics & Strategic Sales Partner'}
                </p>
              </div>
            </div>

            {/* Audio Visualizer Waveform Canvas in Header */}
            <div className="hidden md:flex items-center gap-3 bg-secondary/50 px-4 py-1.5 rounded-2xl border border-border/50">
              <span className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-1.5">
                {isListening ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>{lang === 'es' ? 'Escuchando Voz...' : 'Listening to Mic...'}</span>
                  </>
                ) : isLoading ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F7FFF] animate-ping" />
                    <span>
                      {isProcessingVoice
                        ? lang === 'es' ? 'Procesando Voz...' : 'Processing Voice...'
                        : lang === 'es' ? 'AURA Razonando...' : 'AURA Thinking...'}
                    </span>
                  </>
                ) : isSpeaking ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F7FFF] animate-pulse" />
                    <span>{lang === 'es' ? 'Vocalizando...' : 'Speaking Audio...'}</span>
                  </>
                ) : (
                  <span>{lang === 'es' ? 'Onda Acústica' : 'Acoustic Waveform'}</span>
                )}
              </span>
              <AuraAudioVisualizer
                isActive={isListening || isSpeaking || isLoading}
                isListening={isListening}
                isSpeaking={isSpeaking}
                isThinking={isLoading}
                barCount={24}
              />
            </div>

            {/* Controls Right */}
            <div className="flex items-center gap-2">
              {/* Active Session Switcher Shortcut */}
              <button
                onClick={() => setActiveTab('memory')}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'memory'
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-sm font-semibold'
                    : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                }`}
                title={lang === 'es' ? 'Gestor de Sesiones de Negocios e IndexedDB' : 'Business Discovery Sessions & IndexedDB'}
              >
                <FolderArchive className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline max-w-[130px] truncate font-medium">
                  {sessionMemory.sessionTitle || (lang === 'es' ? 'Sesión Activa' : 'Active Discovery')}
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                  {savedSessions.length || 1}
                </span>
              </button>

              {/* Memory Recall Points Badge */}
              <button
                onClick={() => setActiveTab('memory')}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-mono cursor-pointer hover:bg-purple-500/20 transition-all"
                title="IndexedDB Context Nodes"
              >
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>{recallPoints.length}</span>
              </button>

              {/* Voice Speech Audio Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setSpeechEnabled(!speechEnabled);
                }}
                className={`p-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                  speechEnabled
                    ? 'bg-[#4F7FFF]/10 border-[#4F7FFF]/30 text-[#4F7FFF]'
                    : 'bg-secondary border-border text-muted-foreground'
                }`}
                title={speechEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Language Toggle */}
              <button
                onClick={onToggleLang}
                className="px-3 py-1.5 rounded-xl border border-border bg-secondary text-xs font-mono font-bold text-foreground hover:bg-secondary/80 cursor-pointer"
              >
                {lang === 'en' ? 'Español' : 'English'}
              </button>

              {/* Minimize / Close */}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 rounded-xl border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl border border-border hover:bg-rose-500/10 hover:border-rose-500/30 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Deck Body: Two-Column Multimodal Architecture */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left Column: Conversational Executive Director (CS/CX/CRO/Sales) */}
            <div className="lg:col-span-6 flex flex-col border-b lg:border-b-0 lg:border-r border-border/60 overflow-hidden bg-background/50">
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Dynamic Session Status Toast Message */}
                {sessionStatusMessage && (
                  <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-fade-in shadow-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold flex-1">{sessionStatusMessage}</span>
                  </div>
                )}

                {/* Session Memory Continuity Notice */}
                {showMemoryNotice && messages.length > 1 && (
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-foreground shadow-sm animate-fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                        <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-purple-300">
                            {lang === 'es' ? 'Memoria IndexedDB Activa' : 'IndexedDB Memory Restored'}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                            High Capacity
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {recallPoints.length} {lang === 'es' ? 'nodos' : 'nodes'}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {lang === 'es'
                            ? 'AURA retiene el contexto completo de sus sesiones en la base de datos IndexedDB local.'
                            : 'AURA retains unbounded multi-turn conversation state in client IndexedDB.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleTriggerRecap}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-semibold transition-colors cursor-pointer"
                        title="Ask AURA to summarize recalled points"
                      >
                        {lang === 'es' ? 'Resumen IA' : 'AI Recap'}
                      </button>
                      <button
                        onClick={() => setActiveTab('memory')}
                        className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-[11px] transition-colors cursor-pointer"
                      >
                        {lang === 'es' ? 'Explorar' : 'Inspect'}
                      </button>
                      <button
                        onClick={() => setShowMemoryNotice(false)}
                        className="text-muted-foreground hover:text-foreground text-xs p-1 cursor-pointer"
                        title="Dismiss notice"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {messages.map((msg) => {
                  const isAura = msg.sender === 'aura';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[92%] ${isAura ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                    >
                      {isAura && (
                        <div className="w-7 h-7 rounded-xl bg-[#4F7FFF]/20 border border-[#4F7FFF]/40 flex items-center justify-center shrink-0 mt-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#4F7FFF]" />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div
                          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isAura
                              ? 'bg-card border border-border/80 text-foreground shadow-sm'
                              : 'bg-[#4F7FFF] text-white shadow-md'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>

                        <div
                          className={`flex items-center gap-2 px-1 text-[10px] font-mono text-muted-foreground ${
                            isAura ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isAura && (
                            <>
                              <span>•</span>
                              <button
                                onClick={() => speakText(msg.text)}
                                className="hover:text-[#4F7FFF] transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Volume2 className="w-3 h-3" />
                                <span>Replay Voice</span>
                              </button>
                            </>
                          )}
                        </div>

                        {/* Suggested action pills for user */}
                        {isAura && msg.suggestedPills && msg.suggestedPills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.suggestedPills.map((pill, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(pill)}
                                className="px-2.5 py-1 rounded-full bg-secondary/80 hover:bg-[#4F7FFF]/15 border border-border/70 text-[11px] font-mono text-foreground hover:text-[#4F7FFF] hover:border-[#4F7FFF]/40 transition-all cursor-pointer"
                              >
                                {pill}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Live Speech Recognition Interim Preview */}
                {isListening && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>
                      {interimTranscript || (lang === 'es' ? 'Escuchando su voz...' : 'Listening to speech...')}
                    </span>
                  </div>
                )}

                {/* Standard Text-Based Chat Indicator & Visual Thinking Waveform */}
                {isLoading && (
                  <div className="flex gap-3 max-w-[95%] mr-auto">
                    <div className="w-7 h-7 rounded-xl bg-[#4F7FFF]/20 border border-[#4F7FFF]/40 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#4F7FFF] animate-pulse-subtle" />
                    </div>

                    <div className="space-y-2 w-full max-w-md">
                      {/* Standard text-based chat bubble */}
                      <div className="p-4 rounded-2xl bg-card border border-[#4F7FFF]/40 text-foreground shadow-sm space-y-3 relative overflow-hidden">
                        {/* Shimmer top accent */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4F7FFF] to-transparent animate-pulse" />

                        {/* Status bar */}
                        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
                          <div className="flex items-center gap-2.5">
                            {/* Three animated bouncing dots */}
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-[#4F7FFF] animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-2 h-2 rounded-full bg-[#4F7FFF] animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-2 h-2 rounded-full bg-[#4F7FFF] animate-bounce" />
                            </div>
                            <span className="text-xs font-mono font-semibold text-foreground">
                              {isProcessingVoice
                                ? lang === 'es'
                                  ? 'AURA procesando entrada de voz...'
                                  : 'AURA processing voice input...'
                                : lang === 'es'
                                ? 'AURA sintetizando respuesta...'
                                : 'AURA is thinking...'}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#4F7FFF]/10 text-[#4F7FFF] border border-[#4F7FFF]/20 font-medium shrink-0">
                            {isProcessingVoice ? 'Voice Inference' : 'Neural Core'}
                          </span>
                        </div>

                        {/* Visual Thinking Waveform (Canvas) */}
                        <div className="rounded-xl bg-background/60 border border-border/60 p-2 overflow-hidden">
                          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1.5 px-1">
                            <span className="flex items-center gap-1.5 text-xs text-[#4F7FFF] font-medium">
                              <Activity className="w-3.5 h-3.5 animate-pulse" />
                              {lang === 'es' ? 'Espectro de Inferencia Cognitiva' : 'Cognitive Inference Waveform'}
                            </span>
                            <span className="text-[10px] text-emerald-500 font-semibold font-mono">
                              {isProcessingVoice ? 'STT Signal Active' : 'Gemini 3.8 Flash'}
                            </span>
                          </div>
                          <AuraThinkingWaveform
                            isVoiceProcessing={isProcessingVoice}
                            width={340}
                            height={52}
                            className="w-full"
                          />
                        </div>

                        {/* Status detail caption */}
                        <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">
                          {isProcessingVoice
                            ? lang === 'es'
                              ? 'Decodificando armónicos de audio capturado, evaluando arquitectura y calibrando métricas de conversión...'
                              : 'Decoding captured speech harmonics, evaluating system architecture, and calibrating CRO metrics...'
                            : lang === 'es'
                            ? 'Analizando parámetros de negocio, arquitectura y diagnóstico de conversión...'
                            : 'Evaluating business parameters, architectural stack, and conversion diagnostics...'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 px-1 text-[10px] font-mono text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F7FFF] animate-ping" />
                        <span>{lang === 'es' ? 'Generando counsel ejecutivo' : 'Generating executive counsel'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Command Dock */}
              <div className="p-4 border-t border-border/60 bg-card/40 space-y-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  {/* Voice Mic Input Toggle */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isListening
                        ? 'bg-emerald-500 border-emerald-600 text-white animate-pulse'
                        : 'bg-secondary border-border text-foreground hover:bg-[#4F7FFF] hover:text-white'
                    }`}
                    title={isListening ? 'Stop Speech' : 'Speak into Microphone'}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      lang === 'es'
                        ? 'Consulte sobre CRO, arquitectura de software o hable con el micrófono...'
                        : 'Ask about CRO, software architecture, or speak via mic...'
                    }
                    className="flex-1 bg-background border border-border/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F7FFF]"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="p-3 rounded-xl bg-[#4F7FFF] text-white hover:bg-[#3D6CE6] disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Zero-Trust Confidential Session
                  </span>
                  <span>Powered by Hollowmoon Intelligence</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Multimodal Intelligence Canvas */}
            <div className="lg:col-span-6 flex flex-col bg-card/20 overflow-hidden">
              {/* Tab Navigation */}
              <div className="px-6 pt-4 pb-3 border-b border-border/60 flex items-center justify-between gap-2 bg-card/30">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/80 border border-border/60">
                  <button
                    onClick={() => setActiveTab('cro')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'cro'
                        ? 'bg-card text-foreground shadow-sm font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5 text-[#4F7FFF]" />
                    <span>CRO Audit</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('architecture')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'architecture'
                        ? 'bg-card text-foreground shadow-sm font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-[#4F7FFF]" />
                    <span>System Stack</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('lead')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'lead'
                        ? 'bg-card text-foreground shadow-sm font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Lead & Brief</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('memory')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'memory'
                        ? 'bg-card text-purple-400 shadow-sm font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Brain className="w-3.5 h-3.5 text-purple-400" />
                    <span>{lang === 'es' ? 'Memoria' : 'Memory'}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                      {recallPoints.length}
                    </span>
                  </button>
                </div>

                <div className="text-right flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-semibold border border-purple-500/20 hidden sm:inline">
                    Memory: {recallPoints.length} Nodes
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4F7FFF]/10 text-[#4F7FFF] font-semibold border border-[#4F7FFF]/20">
                    Lead Score: {leadProfile.qualificationScore}/100
                  </span>
                </div>
              </div>

              {/* Dynamic Content Panel */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 1. CRO AUDIT & CONVERSION OPTIMIZATION PANEL */}
                {activeTab === 'cro' && (
                  <div className="space-y-6">
                    {/* Visual Friction Gauge */}
                    <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase font-semibold text-[#4F7FFF] flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" />
                          {lang === 'es' ? 'Índice de Fricción Digital' : 'Digital Operational Friction Gauge'}
                        </span>
                        <span className="text-xs font-mono text-rose-500 font-bold bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                          {croAudit.frictionScore}% Yield Leakage
                        </span>
                      </div>

                      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-rose-500 rounded-full transition-all duration-700"
                          style={{ width: `${croAudit.frictionScore}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 font-mono">
                        <div className="p-3 rounded-2xl bg-secondary/50 border border-border/50">
                          <p className="text-[10px] text-muted-foreground uppercase">
                            {lang === 'es' ? 'Potencial de Aumento' : 'Conversion Velocity Potential'}
                          </p>
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {croAudit.conversionPotential}
                          </p>
                        </div>
                        <div className="p-3 rounded-2xl bg-secondary/50 border border-border/50">
                          <p className="text-[10px] text-muted-foreground uppercase">
                            {lang === 'es' ? 'Recuperación Proyectada' : 'Annual Capital Reclaimed'}
                          </p>
                          <p className="text-lg font-bold text-[#4F7FFF] mt-0.5">
                            {croAudit.estimatedAnnualRecovery}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Top 3 Bottlenecks Identified */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase font-semibold text-foreground">
                        {lang === 'es' ? 'Fugas de Conversión Detectadas' : 'Critical Friction Points & Engineering Fix'}
                      </h4>

                      {croAudit.topBottlenecks.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-card border border-border/70 space-y-2 hover:border-[#4F7FFF]/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display font-semibold text-xs text-foreground flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              {item.title}
                            </span>
                            <span className="text-[10px] font-mono text-rose-500 font-medium">{item.impact}</span>
                          </div>
                          <p className="text-xs text-muted-foreground font-sans pl-3 border-l-2 border-[#4F7FFF]">
                            <strong className="text-foreground font-medium">Hollowmoon Fix:</strong> {item.fix}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveTab('architecture')}
                      className="w-full py-3 rounded-xl bg-[#4F7FFF] hover:bg-[#3D6CE6] text-white text-xs font-semibold font-mono flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>{lang === 'es' ? 'Inspeccionar Arquitectura Recomendada' : 'Inspect Recommended System Stack'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 2. RECOMMENDED SYSTEM ARCHITECTURE */}
                {activeTab === 'architecture' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase font-semibold text-[#4F7FFF] flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          {recommendedStack.stackName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                          {recommendedStack.estimatedTimeline}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground font-sans">
                        {recommendedStack.keyDeliverable}
                      </p>

                      <div className="space-y-3 pt-2">
                        {recommendedStack.modules.map((mod, i) => (
                          <div key={i} className="p-3.5 rounded-2xl bg-secondary/50 border border-border/60 space-y-1">
                            <div className="flex items-center justify-between text-xs font-display font-semibold text-foreground">
                              <span>{mod.name}</span>
                              <span className="text-[10px] font-mono text-[#4F7FFF]">{mod.tech}</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-sans">{mod.role}</p>
                            <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                              ✓ {mod.benefit}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0A0A0C] text-white border border-[#D9DBE1]/20 font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between text-[#4F7FFF] font-semibold">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          100% Intellectual Property Handover
                        </span>
                        <span>Zero Lock-In</span>
                      </div>
                      <p className="text-[#D9DBE1]/70 text-[11px] font-sans">
                        {lang === 'es'
                          ? 'Usted recibe el repositorio completo con pruebas automatizadas, infraestructura como código y documentación de despliegue sin pagos obligatorios de licenciamiento.'
                          : 'You receive complete Git source code, infrastructure-as-code scripts, and CI/CD pipelines with zero ongoing vendor licensing hostage fees.'}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('lead')}
                      className="w-full py-3 rounded-xl bg-[#4F7FFF] hover:bg-[#3D6CE6] text-white text-xs font-semibold font-mono flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>{lang === 'es' ? 'Generar Brief Ejecutivo & Reservar' : 'Generate Executive Brief & Reserve Slot'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 3. EXECUTIVE LEAD MANAGEMENT & DISCOVERY BRIEF */}
                {activeTab === 'lead' && (
                  <div className="space-y-6">
                    {/* Lead Qualification Status */}
                    <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase font-semibold text-foreground flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-emerald-500" />
                          {lang === 'es' ? 'Expediente de Calificación Empresarial' : 'Enterprise Discovery Profile'}
                        </span>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                          Tier 1 • Qualified ({leadProfile.qualificationScore}%)
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div>
                          <label className="text-muted-foreground text-[10px] block mb-1">Company Name</label>
                          <input
                            type="text"
                            value={leadProfile.companyName}
                            onChange={(e) => setLeadProfile({ ...leadProfile, companyName: e.target.value })}
                            placeholder="e.g. Apex Marine Logistics"
                            className="w-full bg-secondary px-3 py-2 rounded-xl text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-[#4F7FFF]"
                          />
                        </div>
                        <div>
                          <label className="text-muted-foreground text-[10px] block mb-1">Target Budget</label>
                          <select
                            value={leadProfile.targetBudget}
                            onChange={(e) => setLeadProfile({ ...leadProfile, targetBudget: e.target.value })}
                            className="w-full bg-secondary px-3 py-2 rounded-xl text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-[#4F7FFF]"
                          >
                            <option>$15k - $25k (Essential OS)</option>
                            <option>$25k - $50k (Enterprise Flagship)</option>
                            <option>$50k - $100k+ (Autonomous Fleet)</option>
                          </select>
                        </div>
                      </div>

                      {/* Immediate Slot Selector */}
                      <div className="pt-2">
                        <label className="text-muted-foreground text-[10px] font-mono block mb-2">
                          {lang === 'es'
                            ? 'Seleccione su horario preferido para la sesión arquitectónica:'
                            : 'Select preferred Architectural Discovery Window:'}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            'Tomorrow 10:00 AM EST (Panama Sync)',
                            'Tomorrow 2:30 PM EST (Panama Sync)',
                            'Thursday 11:00 AM EST (Panama Sync)',
                            'Friday 1:00 PM EST (Panama Sync)',
                          ].map((slot, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                                selectedSlot === slot
                                  ? 'border-[#4F7FFF] bg-[#4F7FFF]/10 text-foreground font-semibold'
                                  : 'border-border/70 bg-secondary/40 text-muted-foreground hover:bg-secondary'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-[#4F7FFF]" />
                                <span className="line-clamp-1">{slot}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-3">
                        <button
                          onClick={handleConfirmSlot}
                          disabled={bookingConfirmed}
                          className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-75"
                        >
                          {bookingConfirmed ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>{lang === 'es' ? 'Sesión Confirmada' : 'Slot Provisioned'}</span>
                            </>
                          ) : (
                            <>
                              <Calendar className="w-4 h-4" />
                              <span>{lang === 'es' ? 'Confirmar Sesión de 30 Min' : 'Lock In Strategy Slot'}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleCopyBrief}
                          className="px-4 py-3 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {copiedBrief ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedBrief ? (lang === 'es' ? 'Brief Copiado' : 'Brief Copied') : (lang === 'es' ? 'Copiar Brief' : 'Copy Brief')}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 text-xs text-muted-foreground flex items-center gap-2 font-mono">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        {lang === 'es'
                          ? 'Sesiones coordinadas directamente por ingenieros principales de Hollowmoon Studio.'
                          : 'Direct engagement led by Hollowmoon Studio Principal Architects. No sales reps.'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. PERSISTENT SESSION MEMORY (INDEXEDDB HIGH-CAPACITY ENGINE & MULTI-SESSION SUITE) */}
                {activeTab === 'memory' && (
                  <div className="space-y-6 animate-fade-in">
                    {/* IndexedDB High-Capacity Storage Banner */}
                    <div className="p-5 rounded-3xl bg-card border border-purple-500/30 shadow-sm space-y-3 relative overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                            <HardDrive className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-purple-300">
                              {lang === 'es' ? 'Motor de Memoria IndexedDB v2' : 'AURA IndexedDB Memory Engine v2'}
                            </h4>
                            <p className="text-[11px] text-muted-foreground font-mono">
                              {lang === 'es' ? 'Almacenamiento Estructurado de Alta Capacidad' : 'Client-Side High-Capacity Database Fabric'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {idbStats.storageEngine === 'indexeddb' ? 'IndexedDB Active' : 'LocalStorage Fallback'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {lang === 'es'
                          ? 'AURA utiliza una base de datos IndexedDB local en el navegador, eliminando la limitación de 5MB de almacenamiento tradicional. Esto permite retener historiales conversacionales extensos, diagnósticos de CRO, diagramas de arquitectura y múltiples sesiones independientes de desarrollo de negocios (BizDev) con privacidad Zero-Trust.'
                          : 'AURA leverages a high-capacity client-side IndexedDB database, eliminating standard 5MB storage quotas. This enables unbounded multi-turn conversation memory, CRO benchmarks, architecture profiles, and multi-session business development discovery with complete Zero-Trust local confidentiality.'}
                      </p>

                      {/* Quick Storage & Multi-Session Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
                        <div className="p-2.5 rounded-xl bg-secondary/60 border border-border/50">
                          <span className="text-muted-foreground block text-[9px]">CONVERSATION TURNS</span>
                          <span className="font-bold text-foreground">{messages.length} messages</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-secondary/60 border border-border/50">
                          <span className="text-muted-foreground block text-[9px]">RECALL NODES</span>
                          <span className="font-bold text-purple-400">{recallPoints.length} points</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-secondary/60 border border-border/50">
                          <span className="text-muted-foreground block text-[9px]">STORED SESSIONS</span>
                          <span className="font-bold text-emerald-400">{savedSessions.length} archives</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-secondary/60 border border-border/50">
                          <span className="text-muted-foreground block text-[9px]">DATABASE USAGE</span>
                          <span className="font-bold text-[#4F7FFF]">
                            ~{(idbStats.estimatedBytes / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Multi-Session Business Development Workspace */}
                    <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-mono uppercase font-semibold text-foreground flex items-center gap-1.5">
                            <FolderArchive className="w-3.5 h-3.5 text-purple-400" />
                            {lang === 'es' ? 'Sesiones Estratégicas de Negocios' : 'Strategic Discovery Sessions'} ({savedSessions.length})
                          </span>
                          <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                            {lang === 'es' ? 'Cambie entre sesiones o cree un nuevo contexto de auditoría' : 'Switch between discovery threads or initiate a new audit track'}
                          </p>
                        </div>

                        <button
                          onClick={() => setIsCreatingNewSession(!isCreatingNewSession)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{lang === 'es' ? 'Nueva Sesión' : 'New Session'}</span>
                        </button>
                      </div>

                      {/* Inline New Session Creator Form */}
                      {isCreatingNewSession && (
                        <div className="p-4 rounded-2xl bg-secondary/40 border border-purple-500/30 space-y-3 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-semibold text-purple-300">
                              {lang === 'es' ? 'Configurar Nueva Sesión de Descubrimiento' : 'Configure New Discovery Session'}
                            </span>
                            <button
                              onClick={() => setIsCreatingNewSession(false)}
                              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-mono text-muted-foreground block">
                              {lang === 'es' ? 'Título o Nombre de la Empresa' : 'Session Title or Enterprise Name'}
                            </label>
                            <input
                              type="text"
                              value={newSessionTitle}
                              onChange={(e) => setNewSessionTitle(e.target.value)}
                              placeholder={
                                lang === 'es'
                                  ? 'Ej. Copa Cargo Logistics, Banistmo Core Sync...'
                                  : 'e.g. Copa Cargo Logistics, Banistmo Core Sync...'
                              }
                              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-mono text-muted-foreground block">
                              {lang === 'es' ? 'Sector Industrial' : 'Industry Domain'}
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                'Logistics & Freight',
                                'Fintech & Banking',
                                'Healthcare & MedTech',
                                'Enterprise SaaS',
                                'Commerce & Retail',
                                'Legal & Compliance',
                              ].map((sec) => (
                                <button
                                  key={sec}
                                  type="button"
                                  onClick={() => setNewSessionSector(sec)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                                    newSessionSector === sec
                                      ? 'bg-purple-600 text-white font-semibold shadow-sm'
                                      : 'bg-secondary text-muted-foreground hover:text-foreground border border-border/60'
                                  }`}
                                >
                                  {sec}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={handleCreateNewSession}
                              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{lang === 'es' ? 'Crear e Iniciar Sesión' : 'Create & Launch Session'}</span>
                            </button>
                            <button
                              onClick={() => setIsCreatingNewSession(false)}
                              className="px-3 py-2 rounded-xl border border-border text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              {lang === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Saved Sessions Cards List */}
                      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {savedSessions.map((s) => {
                          const isActive = s.sessionId === sessionMemory.sessionId;
                          return (
                            <div
                              key={s.sessionId}
                              className={`p-3.5 rounded-2xl border transition-all text-xs font-mono ${
                                isActive
                                  ? 'bg-purple-500/10 border-purple-500/50 shadow-sm'
                                  : 'bg-secondary/30 border-border/60 hover:border-border'
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                  {isActive ? (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                  ) : (
                                    <FolderArchive className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  )}
                                  <span className="font-semibold text-foreground truncate">
                                    {s.sessionTitle || s.sessionId}
                                  </span>
                                  {isActive && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                      ACTIVE
                                    </span>
                                  )}
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border/50 hidden sm:inline">
                                    {s.industry}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {!isActive && (
                                    <button
                                      onClick={() => handleSwitchSession(s.sessionId)}
                                      className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-[11px] font-semibold transition-colors cursor-pointer border border-border flex items-center gap-1"
                                      title="Switch to this session"
                                    >
                                      <ChevronRight className="w-3 h-3 text-[#4F7FFF]" />
                                      <span>{lang === 'es' ? 'Reanudar' : 'Resume'}</span>
                                    </button>
                                  )}

                                  <button
                                    onClick={async () => {
                                      const full = await loadSessionFromIndexedDB(s.sessionId);
                                      if (full) handleExportSession(full);
                                    }}
                                    className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors"
                                    title={lang === 'es' ? 'Descargar JSON de Sesión' : 'Download Session JSON'}
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>

                                  {savedSessions.length > 1 && (
                                    <button
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            lang === 'es'
                                              ? `¿Eliminar la sesión "${s.sessionTitle || s.sessionId}" de IndexedDB?`
                                              : `Delete session "${s.sessionTitle || s.sessionId}" from IndexedDB?`
                                          )
                                        ) {
                                          handleDeleteSession(s.sessionId);
                                        }
                                      }}
                                      className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                                      title={lang === 'es' ? 'Eliminar de IndexedDB' : 'Delete from IndexedDB'}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] text-muted-foreground">
                                <span>{s.totalTurns} turns</span>
                                <span>•</span>
                                <span>{s.recallCount} recall nodes</span>
                                <span>•</span>
                                <span>Lead: {s.qualificationScore}/100</span>
                                <span>•</span>
                                <span className="text-[9px]">
                                  {new Date(s.lastActiveAt).toLocaleString([], {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Retained Executive Profile Snapshot */}
                    <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase font-semibold text-foreground flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-[#4F7FFF]" />
                          {lang === 'es' ? 'Parámetros Retenidos en Sesión Activa' : 'Retained Executive Parameters (Active Session)'}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">IndexedDB Synced</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Company & Sector</span>
                          <span className="font-medium text-foreground">
                            {leadProfile.companyName ? leadProfile.companyName : (lang === 'es' ? 'Por definir' : 'Unspecified')} • {leadProfile.industry}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/40">
                          <span className="text-[10px] text-muted-foreground block">Team Scale & Budget</span>
                          <span className="font-medium text-foreground">
                            {leadProfile.teamSize} • {leadProfile.targetBudget}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-secondary/40 border border-border/40 sm:col-span-2">
                          <span className="text-[10px] text-muted-foreground block">Identified Operational Bottleneck</span>
                          <span className="font-medium text-amber-400">
                            {leadProfile.currentBottleneck}
                          </span>
                        </div>
                        {leadProfile.scheduledSlot && (
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 sm:col-span-2 text-emerald-400">
                            <span className="text-[10px] block opacity-80">Reserved Strategy Window</span>
                            <span className="font-semibold">{leadProfile.scheduledSlot}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recalled Conversation Nodes List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-mono uppercase font-semibold text-foreground flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5 text-purple-400" />
                          {lang === 'es' ? 'Nodos de Memoria Contextual' : 'Contextual Memory Nodes'} ({recallPoints.length})
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {lang === 'es' ? 'Persistidos en IndexedDB' : 'Persisted in IndexedDB'}
                        </span>
                      </div>

                      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                        {recallPoints.map((point) => {
                          const categoryBadge = {
                            need: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', label: 'NEED' },
                            metric: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'METRIC' },
                            preference: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'PREF' },
                            architecture: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', label: 'STACK' },
                            decision: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'DECISION' },
                          }[point.category] || { bg: 'bg-secondary', text: 'text-foreground', border: 'border-border', label: 'NOTE' };

                          return (
                            <div
                              key={point.id}
                              className="p-3.5 rounded-2xl bg-card border border-border/70 hover:border-purple-500/30 transition-all text-xs font-mono space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${categoryBadge.bg} ${categoryBadge.text} ${categoryBadge.border}`}
                                  >
                                    {categoryBadge.label}
                                  </span>
                                  <span className="font-semibold text-foreground">{point.topic}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground">{point.timestamp}</span>
                              </div>
                              <p className="text-muted-foreground text-[11px] leading-relaxed pl-1">
                                {point.detail}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Memory Control Actions */}
                    <div className="p-4 rounded-2xl bg-card border border-border/80 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={handleTriggerRecap}
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{lang === 'es' ? 'Solicitar Resumen de Sesión a AURA' : 'Ask AURA for Full Session Recap'}</span>
                      </button>

                      <button
                        onClick={() => handleExportSession(sessionMemory)}
                        className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl border border-purple-500/30 hover:bg-purple-500/10 text-purple-300 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        title={lang === 'es' ? 'Descargar expediente completo JSON' : 'Export complete session audit file'}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{lang === 'es' ? 'Exportar JSON' : 'Export JSON'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              lang === 'es'
                                ? '¿Desea reiniciar la sesión activa actual en IndexedDB?'
                                : 'Reset current active session in IndexedDB?'
                            )
                          ) {
                            handleResetMemory();
                          }
                        }}
                        className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        title="Clear active session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{lang === 'es' ? 'Reiniciar' : 'Reset'}</span>
                      </button>
                    </div>

                    {/* Purge All Archives Option */}
                    <div className="flex items-center justify-between px-2 pt-1">
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              lang === 'es'
                                ? 'ADVERTENCIA: ¿Está seguro de que desea purgar TODAS las sesiones guardadas en IndexedDB? Esta acción no se puede deshacer.'
                                : 'WARNING: Are you sure you want to purge ALL saved sessions from IndexedDB? This action is irreversible.'
                            )
                          ) {
                            handlePurgeAllSessions();
                          }
                        }}
                        className="text-[10px] font-mono text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        {lang === 'es' ? '⚠ Purgar todas las sesiones guardadas en IndexedDB' : '⚠ Purge all saved IndexedDB sessions'}
                      </button>

                      <span className="text-[10px] font-mono text-muted-foreground">
                        DB: hollowmoon_aura_db v2
                      </span>
                    </div>

                    {/* Zero-Trust Compliance Note */}
                    <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/50 text-[11px] text-muted-foreground flex items-center gap-2 font-mono">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>
                        {lang === 'es'
                          ? 'Los registros de IndexedDB residen de forma 100% confidencial en el almacenamiento estructurado de su propio navegador. Cero telemetría de terceros.'
                          : 'Zero-Trust client storage: all session threads and CRO diagnostics reside strictly in your browser IndexedDB sandbox. Zero third-party ad telemetry.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
