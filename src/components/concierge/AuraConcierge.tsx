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
} from 'lucide-react';
import { AuraAudioVisualizer } from './AuraAudioVisualizer';
import { AuraThinkingWaveform } from './AuraThinkingWaveform';
import { AuraMessage, AuraLeadProfile, CroDiagnostic, RecommendedArchitecture } from './auraTypes';
import { initialAuraGreeting, initialLeadProfile, defaultCroAudit, defaultRecommendedArchitecture, queryAuraConcierge } from './auraEngine';
import { Language } from '../../types';

interface AuraConciergeProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
  onToggleLang: () => void;
}

export const AuraConcierge: React.FC<AuraConciergeProps> = ({ onNavigate, lang, onToggleLang }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [messages, setMessages] = useState<AuraMessage[]>([initialAuraGreeting(lang)]);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'cro' | 'architecture' | 'lead'>('cro');
  const [leadProfile, setLeadProfile] = useState<AuraLeadProfile>(initialLeadProfile);
  const [croAudit, setCroAudit] = useState<CroDiagnostic>(defaultCroAudit(lang));
  const [recommendedStack, setRecommendedStack] = useState<RecommendedArchitecture>(
    defaultRecommendedArchitecture(lang)
  );
  const [copiedBrief, setCopiedBrief] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('Tomorrow 10:00 AM EST (Panama Sync)');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sync greeting when language changes
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

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setIsProcessingVoice(fromVoice);

    try {
      const response = await queryAuraConcierge(text, lang, leadProfile);

      const auraMsg: AuraMessage = {
        id: `msg-aura-${Date.now()}`,
        sender: 'aura',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: response.category,
        suggestedPills: response.suggestedPills,
      };

      setMessages((prev) => [...prev, auraMsg]);

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
        setLeadProfile((prev) => ({ ...prev, ...response.leadUpdate }));
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
    setLeadProfile((prev) => ({
      ...prev,
      scheduledSlot: selectedSlot,
      status: 'priority_enterprise',
      qualificationScore: 99,
    }));

    const confirmMsg: AuraMessage = {
      id: `msg-confirm-${Date.now()}`,
      sender: 'aura',
      text:
        lang === 'es'
          ? `Excelente. He bloqueado provisionalmente su espacio para "${selectedSlot}". Nuestro equipo de socios arquitectos en Ciudad de Panamá le enviará el dossier de bienvenida confidencial.`
          : `Splendid. I have provisioned your strategy slot for "${selectedSlot}". Our senior architectural partners in Panama City will dispatch the confidential discovery dossier to your inbox.`,
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
                </div>

                <div className="text-right">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
