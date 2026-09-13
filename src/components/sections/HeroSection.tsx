import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Activity, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Language } from '../../types';
import { siteTranslations } from '../../data/sitemapData';

interface HeroSectionProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, lang }) => {
  const t = siteTranslations[lang].hero;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Apple-style subtle ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#4F7FFF]/15 via-[#4F7FFF]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/70 bg-card/60 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#4F7FFF] animate-ping" />
            <span className="text-[11px] font-mono tracking-wider font-semibold text-foreground uppercase">
              {t.badge}
            </span>
          </div>

          {/* H1 Display Heading with Strict Optical Hierarchy */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-foreground leading-[1.08]">
            {t.titleStart}{' '}
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[#4F7FFF] via-[#7B9EFF] to-foreground">
              {t.titleHighlight}
            </span>
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-sans">
            {t.subtitle}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
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
          </div>

          {/* Security & Panama Hub Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
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
          </div>
        </div>

        {/* Live Operational Metrics Ribbon */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-border/60">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="p-4 rounded-2xl bg-card/40 border border-border/40 text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                {t.metrics.uptimeVal}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                {t.metrics.uptime}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-card/40 border border-border/40 text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#4F7FFF]">
                {t.metrics.speedVal}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                {t.metrics.speed}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-card/40 border border-border/40 text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {t.metrics.savingsVal}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                {t.metrics.savings}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-card/40 border border-border/40 text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                {t.metrics.velocityVal}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                {t.metrics.velocity}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
