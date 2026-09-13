import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Clock,
  Layout,
  Cpu,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Language } from '../../types';
import { siteTranslations } from '../../data/sitemapData';
import heroGraphicImg from '../../assets/images/hero_studio_system_1789261716089.jpg';
import {
  fadeInUp,
  staggerContainer,
  defaultViewport,
  appleEase
} from '../../lib/animations';

interface HeroSectionProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, lang }) => {
  const t = siteTranslations[lang].hero;

  // Toggle state between new visual layout and preserved classic minimalist design
  const [heroMode, setHeroMode] = useState<'visual' | 'minimal'>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('hm_hero_layout') : null;
    return saved === 'minimal' || saved === 'visual' ? saved : 'visual';
  });

  const handleToggleMode = (mode: 'visual' | 'minimal') => {
    setHeroMode(mode);
    localStorage.setItem('hm_hero_layout', mode);
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Apple-style subtle ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#4F7FFF]/20 via-[#4F7FFF]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar: Eyebrow + Layout Mode Toggle Switcher */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: appleEase }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-border/40"
        >
          <div className="flex items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/70 bg-card/60 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#4F7FFF] animate-ping" />
              <span className="text-[11px] font-mono tracking-wider font-semibold text-foreground uppercase">
                {t.badge}
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
              • {lang === 'es' ? 'Sistemas Autónomos de Alta Conversión' : 'Autonomous High-Conversion Systems'}
            </span>
          </div>

          {/* Apple-Style Hero Layout Mode Toggle Pill */}
          <div className="inline-flex items-center p-1 rounded-full bg-secondary/80 border border-border/70 text-xs font-mono backdrop-blur-md shadow-sm">
            <button
              onClick={() => handleToggleMode('visual')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                heroMode === 'visual'
                  ? 'bg-foreground text-background font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Display new hero layout with autonomous system visual"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4F7FFF]" />
              <span>{lang === 'es' ? 'Hero Visual' : 'System Visual'}</span>
            </button>
            <button
              onClick={() => handleToggleMode('minimal')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                heroMode === 'minimal'
                  ? 'bg-foreground text-background font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Preserve original minimalist typography hero"
            >
              <Layout className="w-3.5 h-3.5 text-[#4F7FFF]" />
              <span>{lang === 'es' ? 'Minimalista Original' : 'Classic Minimal'}</span>
            </button>
          </div>
        </motion.div>

        {/* CONDITIONALLY RENDERED HERO LAYOUTS WITH FLUID MOTION */}
        <AnimatePresence mode="wait">
          {heroMode === 'visual' ? (
            /* ================= NEW VISUAL HERO SECTION ================= */
            <motion.div
              key="visual-hero"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: appleEase }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
            >
              {/* Left Column: Staggered High-Impact Typography & Dual CTAs */}
              <motion.div
                variants={staggerContainer(0.08, 0.05)}
                initial="hidden"
                animate="visible"
                className="lg:col-span-7 space-y-6 text-left"
              >
                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-foreground leading-[1.08]"
                >
                  {t.titleStart}{' '}
                  <span className="block mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-[#4F7FFF] via-[#7B9EFF] to-foreground">
                    {t.titleHighlight}
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-sans"
                >
                  {t.subtitle}
                </motion.p>

                {/* Dual CTAs */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row items-center gap-3.5 pt-2"
                >
                  <Button
                    size="lg"
                    onClick={() => onNavigate('contact')}
                    className="w-full sm:w-auto bg-[#4F7FFF] hover:bg-[#3D6CE6] text-white shadow-md hover:shadow-aurora-glow text-sm px-8 py-3.5 font-semibold flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>{t.primaryCta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onNavigate('os')}
                    className="w-full sm:w-auto text-sm px-7 py-3.5 hover:bg-secondary/70 border-border/80 text-foreground font-medium flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-[#4F7FFF]" />
                    <span>{t.secondaryCta}</span>
                  </Button>
                </motion.div>

                {/* Security & Panama Hub Badges with stagger */}
                <motion.div
                  variants={fadeInUp}
                  className="pt-4 flex flex-wrap items-center gap-5 text-xs text-muted-foreground font-mono"
                >
                  <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 animate-pulse-subtle" />
                    Zero-Trust Encryption
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <Activity className="w-3.5 h-3.5 text-[#4F7FFF] animate-pulse-subtle" />
                    SOC2 & ISO Ready
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse-subtle" />
                    Panama Tech Bridge
                  </span>
                </motion.div>
              </motion.div>

              {/* Right Column: Studio System Graphic Visual Stage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.65, ease: appleEase, delay: 0.15 }}
                className="lg:col-span-5 relative"
              >
                {/* Outer decorative ambient glow behind card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#4F7FFF]/30 to-[#7B9EFF]/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-1000 -z-10" />

                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.3, ease: appleEase } }}
                  className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl p-3 relative overflow-hidden group hover:border-[#4F7FFF]/50 transition-colors duration-300"
                >
                  {/* Visual Window Header */}
                  <div className="flex items-center justify-between px-2 pb-2.5 mb-2 border-b border-border/50 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-muted-foreground tracking-wider uppercase text-[10px]">
                      HOLLOWMOON AUTONOMOUS SYSTEM
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-semibold border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </span>
                  </div>

                  {/* Main Visual Image */}
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-secondary/50 border border-border/40">
                    <img
                      src={heroGraphicImg}
                      alt="Hollowmoon Autonomous Digital System and Intelligence Architecture Visual"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    {/* Subtle glass reflection & vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

                    {/* Floating Glass Badge 1: Edge Latency */}
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35, duration: 0.4 }}
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white flex items-center gap-1.5 shadow-lg"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F7FFF] animate-ping" />
                      <span>Edge Latency: <strong className="text-white">14ms</strong></span>
                    </motion.div>

                    {/* Floating Glass Badge 2: Autonomous Pipeline */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45, duration: 0.4 }}
                      className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white/90 flex items-center gap-2 shadow-lg"
                    >
                      <Cpu className="w-3.5 h-3.5 text-[#4F7FFF]" />
                      <span>Pipeline: <strong className="text-emerald-400">1,420 events/min</strong></span>
                    </motion.div>
                  </div>

                  {/* Bottom Visual System Telemetry Bar */}
                  <div className="mt-2.5 pt-2 border-t border-border/50 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-muted-foreground">
                    <div className="py-1 px-1.5 rounded-lg bg-secondary/50">
                      <span className="block text-foreground font-semibold">Gemini 2.5</span>
                      <span>AI Reasoning</span>
                    </div>
                    <div className="py-1 px-1.5 rounded-lg bg-secondary/50">
                      <span className="block text-foreground font-semibold">Sub-100ms</span>
                      <span>Global Edge</span>
                    </div>
                    <div className="py-1 px-1.5 rounded-lg bg-secondary/50">
                      <span className="block text-foreground font-semibold">Panama Hub</span>
                      <span>Dual-Region</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            /* ================= PRESERVED CLASSIC MINIMALIST HERO ================= */
            <motion.div
              key="minimal-hero"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: appleEase }}
              className="text-center max-w-4xl mx-auto space-y-8"
            >
              <motion.h1
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-foreground leading-[1.08]"
              >
                {t.titleStart}{' '}
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[#4F7FFF] via-[#7B9EFF] to-foreground">
                  {t.titleHighlight}
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-sans"
              >
                {t.subtitle}
              </motion.p>

              {/* Dual CTAs */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
              >
                <Button
                  size="lg"
                  onClick={() => onNavigate('contact')}
                  className="w-full sm:w-auto bg-[#4F7FFF] hover:bg-[#3D6CE6] text-white shadow-md hover:shadow-aurora-glow text-sm px-8 py-3.5 font-semibold flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{t.primaryCta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('os')}
                  className="w-full sm:w-auto text-sm px-7 py-3.5 hover:bg-secondary/70 border-border/80 text-foreground font-medium flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#4F7FFF]" />
                  <span>{t.secondaryCta}</span>
                </Button>
              </motion.div>

              {/* Security & Panama Hub Badges */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.25 }}
                className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-mono"
              >
                <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 animate-pulse-subtle" />
                  Zero-Trust Encryption
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <Activity className="w-3.5 h-3.5 text-[#4F7FFF] animate-pulse-subtle" />
                  SOC2 & ISO Compliant Ready
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse-subtle" />
                  Panama & Global Timezone Sync
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Operational Metrics Ribbon (Shared across both hero designs, with staggered entrance) */}
        <motion.div
          variants={staggerContainer(0.08, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="mt-16 md:mt-20 pt-8 border-t border-border/60"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-4 rounded-2xl bg-card/40 border border-border/40 text-center transition-colors hover:border-[#4F7FFF]/30"
            >
              <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                {t.metrics.uptimeVal}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                {t.metrics.uptime}
              </p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-4 rounded-2xl bg-card/40 border border-border/40 text-center transition-colors hover:border-[#4F7FFF]/30"
            >
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#4F7FFF]">
                {t.metrics.speedVal}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                {t.metrics.speed}
              </p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-4 rounded-2xl bg-card/40 border border-border/40 text-center transition-colors hover:border-emerald-500/30"
            >
              <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {t.metrics.savingsVal}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                {t.metrics.savings}
              </p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-4 rounded-2xl bg-card/40 border border-border/40 text-center transition-colors hover:border-[#4F7FFF]/30"
            >
              <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                {t.metrics.velocityVal}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                {t.metrics.velocity}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
