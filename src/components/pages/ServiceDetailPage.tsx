import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, Clock, Layers, Sparkles, Terminal, Code } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { servicesData } from '../../data/sitemapData';
import { Language } from '../../types';

interface ServiceDetailPageProps {
  slug: string;
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug, onNavigate, lang }) => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'process' | 'schema'>('benefits');

  const service = servicesData.find((s) => s.slug === slug) || servicesData[0];

  // Schema.org structured data preview as required by prompt
  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.shortDesc,
    serviceType: service.category,
    provider: {
      '@type': 'Organization',
      name: 'Hollowmoon Digital Studio',
      url: 'https://hollowmoon.digital'
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Panama, Latin America & Global'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: 'Custom Enterprise Scope',
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('services')}
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'es' ? 'Volver a Servicios' : 'Back to Services'}</span>
        </button>

        <Badge variant="accent" className="font-mono text-xs">
          {service.category}
        </Badge>
      </div>

      {/* Hero Service Overview */}
      <div className="space-y-6 max-w-4xl">
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-foreground tracking-tight leading-tight">
          {service.title}
        </h1>
        <p className="text-xl text-[#4F7FFF] font-medium leading-relaxed">
          {service.tagline}
        </p>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {service.fullDesc}
        </p>

        {/* Highlight Problem Solved */}
        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/70 text-sm font-mono text-foreground">
          <span className="text-[#4F7FFF] font-bold">Operational Problem Solved: </span>
          {service.problemSolved}
        </div>
      </div>

      {/* Live Metric Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {service.metrics.map((metric, i) => (
          <div key={i} className="p-5 rounded-2xl bg-card border border-border/80 text-center shadow-macOS-subtle">
            <p className="text-xs font-mono uppercase text-muted-foreground">{metric.label}</p>
            <p className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Interactive Tabs: Benefits vs. Process vs. Schema.org */}
      <div className="space-y-6">
        <div className="flex border-b border-border/60 gap-2">
          <button
            onClick={() => setActiveTab('benefits')}
            className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'benefits'
                ? 'border-[#4F7FFF] text-[#4F7FFF]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {lang === 'es' ? 'Beneficios & Capacidades' : 'Benefits & Architecture'}
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'process'
                ? 'border-[#4F7FFF] text-[#4F7FFF]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {lang === 'es' ? 'Proceso de Entrega' : 'Delivery Methodology'}
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'border-[#4F7FFF] text-[#4F7FFF]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Schema.org JSON-LD (SEO)</span>
          </button>
        </div>

        {/* Tab 1: Benefits */}
        {activeTab === 'benefits' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {service.benefits.map((benefit, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border/70 space-y-3 shadow-macOS-subtle">
                <div className="w-8 h-8 rounded-lg bg-[#4F7FFF]/10 border border-[#4F7FFF]/20 flex items-center justify-center text-[#4F7FFF] font-mono text-xs font-bold">
                  0{i + 1}
                </div>
                <h3 className="font-display font-bold text-base text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Process */}
        {activeTab === 'process' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-200">
            {service.process.map((step) => (
              <div key={step.step} className="p-6 rounded-2xl bg-card border border-border/70 space-y-3 relative shadow-macOS-subtle">
                <span className="text-2xl font-display font-extrabold text-[#4F7FFF]">
                  {step.step}
                </span>
                <h3 className="font-display font-bold text-base text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Schema.org JSON-LD */}
        {activeTab === 'schema' && (
          <div className="p-6 rounded-2xl bg-[#0A0A0C] text-[#D9DBE1] border border-[#D9DBE1]/20 font-mono text-xs space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#4F7FFF]" />
                Schema.org/Service Structured Data Script
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white">Valid JSON-LD</span>
            </div>
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
              {JSON.stringify(schemaJson, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Deliverable Package & Conversion Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-secondary/30 border border-border/80 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-xl">
          <p className="text-xs font-mono uppercase tracking-wider text-[#4F7FFF] font-semibold">
            Ready for Implementation
          </p>
          <h3 className="text-2xl font-display font-bold text-foreground">
            Schedule a Strategy Session for {service.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            Standard deliverable: {service.deliverable}
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => onNavigate('contact')}
          className="w-full md:w-auto px-8 py-3.5 text-sm font-semibold shrink-0 cursor-pointer"
        >
          <span>{lang === 'es' ? 'Agendar Sesión de Estrategia' : 'Book a Strategy Session'}</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
