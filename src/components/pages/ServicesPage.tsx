import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Layout, Smartphone, Cpu, Layers, Cloud, Sparkles, Shield, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { servicesData, siteTranslations } from '../../data/sitemapData';
import { Language } from '../../types';

interface ServicesPageProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, lang }) => {
  const [filter, setFilter] = useState<string>('all');

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout': return <Layout className="w-6 h-6 text-[#4F7FFF]" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-[#4F7FFF]" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-[#4F7FFF]" />;
      case 'Layers': return <Layers className="w-6 h-6 text-[#4F7FFF]" />;
      case 'Cloud': return <Cloud className="w-6 h-6 text-[#4F7FFF]" />;
      default: return <Sparkles className="w-6 h-6 text-[#4F7FFF]" />;
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono tracking-widest text-[#4F7FFF] uppercase font-semibold">
          {lang === 'es' ? 'PORTAFOLIO DE SOLUCIONES' : 'SOLUTIONS PORTFOLIO'}
        </span>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-foreground tracking-tight">
          {lang === 'es'
            ? 'Capacidades de Transformación Digital'
            : 'Enterprise Digital Capabilities'}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {lang === 'es'
            ? 'Diseñamos y desplegamos infraestructuras digitales a medida para empresas que exigen velocidad, precisión y autonomía operativa.'
            : 'We design and deploy bespoke digital infrastructures for service enterprises demanding speed, precision, and operational autonomy.'}
        </p>
      </div>

      {/* Services Detailed List */}
      <div className="space-y-12">
        {servicesData.map((service, index) => (
          <div
            key={service.slug}
            className="p-8 sm:p-12 rounded-3xl bg-card border border-border/80 shadow-macOS-subtle hover:shadow-macOS-lift transition-all duration-300 space-y-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
              {/* Left Column: Overview */}
              <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#4F7FFF]/10 border border-[#4F7FFF]/20 flex items-center justify-center">
                    {getServiceIcon(service.icon)}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      Module 0{index + 1} • {service.category}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                      {service.title}
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {service.fullDesc}
                </p>

                {/* Problem solved callout */}
                <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/50 text-xs text-foreground/90 font-mono">
                  <span className="text-[#4F7FFF] font-semibold">Problem Solved: </span>
                  {service.problemSolved}
                </div>
              </div>

              {/* Right Column: Metrics & CTAs */}
              <div className="lg:w-80 shrink-0 space-y-4 bg-secondary/20 p-6 rounded-2xl border border-border/50">
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Performance Benchmarks
                </p>
                <div className="space-y-2.5">
                  {service.metrics.map((m, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">{m.label}:</span>
                      <span className="font-mono font-bold text-foreground">{m.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-border/50 space-y-2">
                  <Button
                    onClick={() => onNavigate('service-detail', service.slug)}
                    className="w-full text-xs py-2.5 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{lang === 'es' ? 'Ver Especificación Técnica' : 'Inspect Specification'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('contact')}
                    className="w-full text-xs py-2 cursor-pointer"
                  >
                    {lang === 'es' ? 'Consultar Este Servicio' : 'Consult on This Scope'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Key Features & Tech Stack */}
            <div className="pt-6 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  Core Engineering Capabilities
                </p>
                <div className="space-y-2">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  Standard Production Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-secondary text-xs font-mono text-foreground border border-border/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-3">
                  Deliverable: {service.deliverable}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
