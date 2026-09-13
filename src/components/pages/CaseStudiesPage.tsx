import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, Quote, ExternalLink, ShieldCheck, Code, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { caseStudiesData } from '../../data/sitemapData';
import { Language } from '../../types';

interface CaseStudiesPageProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const CaseStudiesPage: React.FC<CaseStudiesPageProps> = ({ onNavigate, lang }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const industries = [
    { id: 'all', label: lang === 'es' ? 'Todas las Industrias' : 'All Industries' },
    { id: 'maritime', label: lang === 'es' ? 'Logística & Aduanas' : 'Logistics & Maritime' },
    { id: 'health', label: lang === 'es' ? 'Salud & Clínicas' : 'Healthcare' },
    { id: 'wealth', label: lang === 'es' ? 'Banca & FinTech' : 'Wealth Management' }
  ];

  const filteredStudies = caseStudiesData.filter((s) => {
    if (selectedIndustry === 'all') return true;
    if (selectedIndustry === 'maritime' && s.id === 'omnipanam-maritime') return true;
    if (selectedIndustry === 'health' && s.id === 'vitalis-medgroup') return true;
    if (selectedIndustry === 'wealth' && s.id === 'novus-wealth-latam') return true;
    return true;
  });

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono tracking-widest text-[#4F7FFF] uppercase font-semibold">
          {lang === 'es' ? 'IMPACTO COMPROBADO' : 'PROVEN TRACK RECORD'}
        </span>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-foreground tracking-tight">
          {lang === 'es' ? 'Casos de Transformación Empresarial' : 'Enterprise Case Studies'}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {lang === 'es'
            ? 'Vea cómo modernizamos operaciones reales, erradicamos horas de transcripción manual y creamos activos digitales de alto rendimiento.'
            : 'Detailed architectural breakdowns of how we modernised complex operational pipelines and unlocked high-velocity growth.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {industries.map((ind) => (
          <button
            key={ind.id}
            onClick={() => setSelectedIndustry(ind.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
              selectedIndustry === ind.id
                ? 'bg-foreground text-background font-semibold shadow-sm'
                : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {ind.label}
          </button>
        ))}
      </div>

      {/* Deep Dives List */}
      <div className="space-y-12">
        {filteredStudies.map((study) => (
          <div
            key={study.id}
            className="p-8 sm:p-12 rounded-3xl bg-card border border-border/80 shadow-macOS-subtle space-y-8"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
              <div>
                <span className="text-xs font-mono text-[#4F7FFF] uppercase font-semibold">
                  {study.client} • {study.location}
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-1">
                  {study.title}
                </h2>
              </div>
              <Badge variant="secondary" className="self-start sm:self-center font-mono text-xs">
                {study.industry}
              </Badge>
            </div>

            {/* Core Results Callouts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {study.results.map((res, i) => (
                <div key={i} className="p-5 rounded-2xl bg-secondary/30 border border-border/50 text-center">
                  <p className="text-3xl font-display font-extrabold text-[#4F7FFF]">{res.metric}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-1 uppercase tracking-wider">{res.label}</p>
                </div>
              ))}
            </div>

            {/* Two Column Challenge & Solution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3 p-6 rounded-2xl bg-secondary/15 border border-border/40">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-500 font-semibold flex items-center gap-1.5">
                  The Operational Challenge
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {study.challenge}
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-2xl bg-secondary/15 border border-border/40">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-500 font-semibold flex items-center gap-1.5">
                  The Hollowmoon Solution & Architecture
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {study.solution}
                </p>
              </div>
            </div>

            {/* Architecture Stack */}
            <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground mr-1">Deployed Tech:</span>
                {study.architecture.map((arch) => (
                  <span
                    key={arch}
                    className="px-3 py-1 rounded-lg bg-secondary text-xs font-mono text-foreground border border-border/40"
                  >
                    {arch}
                  </span>
                ))}
              </div>

              <Button
                onClick={() => onNavigate('contact')}
                className="text-xs px-5 py-2 cursor-pointer self-start sm:self-auto"
              >
                <span>{lang === 'es' ? 'Consultar Solución Similar' : 'Request Similar Architecture'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>

            {/* Executive Quote */}
            {study.quote && (
              <div className="p-6 rounded-2xl bg-[#0A0A0C] text-white border border-[#D9DBE1]/20 relative">
                <Quote className="w-5 h-5 text-[#4F7FFF] mb-2" />
                <p className="text-sm italic text-[#D9DBE1]/90 leading-relaxed">
                  "{study.quote.text}"
                </p>
                <p className="text-xs font-mono text-white font-semibold mt-3">
                  — {study.quote.author}, <span className="text-[#4F7FFF]">{study.quote.role}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
