import React from 'react';
import { ArrowRight, Sparkles, Shield, Clock, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { siteTranslations } from '../../data/sitemapData';
import { Language } from '../../types';

interface LeadCaptureSectionProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const LeadCaptureSection: React.FC<LeadCaptureSectionProps> = ({ onNavigate, lang }) => {
  const t = siteTranslations[lang].ctaBanner;

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#0A0A0C] text-white p-8 sm:p-14 lg:p-20 overflow-hidden border border-[#D9DBE1]/20 shadow-macOS-lift">
          {/* Subtle Aurora Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-r from-[#4F7FFF]/25 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#D9DBE1] border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#4F7FFF]" />
              <span>{lang === 'es' ? 'DISPONIBILIDAD PARA EL PRÓXIMO TRIMESTRE' : 'LIMITED QUARTERLY CAPACITY'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
              {t.title}
            </h2>

            <p className="text-base sm:text-lg text-[#D9DBE1]/80 leading-relaxed font-sans">
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto bg-[#4F7FFF] hover:bg-[#3D6CE6] text-white text-sm px-8 py-3.5 font-semibold rounded-xl flex items-center justify-center gap-2 group cursor-pointer shadow-aurora-glow"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.button}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('services')}
                className="w-full sm:w-auto text-sm px-7 py-3.5 border-white/20 text-white hover:bg-white/10 rounded-xl cursor-pointer"
              >
                {lang === 'es' ? 'Explorar Servicios' : 'Browse All Services'}
              </Button>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#D9DBE1]/60 font-mono">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                30-Min High-Value Architectural Call
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#4F7FFF]" />
                NDA & Intellectual Property Protected
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
