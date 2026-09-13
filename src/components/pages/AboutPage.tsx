import React from 'react';
import { ArrowRight, ShieldCheck, MapPin, Sparkles, Cpu, Award, Zap, Code2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Language } from '../../types';

interface AboutPageProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, lang }) => {
  const principles = [
    {
      title: lang === 'es' ? 'Precisión Matemática' : 'Mathematical Craft & Precision',
      desc: lang === 'es'
        ? 'Rechazamos el diseño genérico y las plantillas prefabricadas. Cada interfaz obedece escalas tipográficas calculadas, sombras ópticas y contraste visual riguroso.'
        : 'We actively reject generic templates and aesthetic shortcuts. Every interface conforms to calculated typographic ratios, optical shadows, and rigorous contrast ratios.',
      icon: <Sparkles className="w-5 h-5 text-[#4F7FFF]" />
    },
    {
      title: lang === 'es' ? 'Sistemas Autónomos, No Tableros Pasivos' : 'Autonomous Systems, Not Passive Dashboards',
      desc: lang === 'es'
        ? 'El software moderno no debe pedirle a su equipo transcribir datos. Diseñamos agentes de IA que ejecutan, concilian y despachan operaciones en milisegundos.'
        : 'Modern software must not demand human transcription. We architect agentic pipelines that reason, reconcile, and execute operations in milliseconds.',
      icon: <Cpu className="w-5 h-5 text-[#4F7FFF]" />
    },
    {
      title: lang === 'es' ? 'Propiedad Total del Código' : 'Complete Code & Asset Ownership',
      desc: lang === 'es'
        ? 'Usted es dueño absoluto del código fuente, repositorios y modelos desplegados. Sin tarifas ocultas por usuario ni dependencia de proveedores.'
        : 'You retain 100% ownership of source code, deployment blueprints, and data schemas. Zero per-seat lock-in, zero vendor hostage dynamics.',
      icon: <Code2 className="w-5 h-5 text-[#4F7FFF]" />
    },
    {
      title: lang === 'es' ? 'El Puente Tecnológico de Panamá' : 'The Panama Global Tech Bridge',
      desc: lang === 'es'
        ? 'Ubicados en el cruce logístico y financiero de las Américas, combinamos estándares de ingeniería de Silicon Valley con comprensión del comercio regional.'
        : 'Stationed at the financial and logistical crossroads of the Americas, we combine Silicon Valley engineering standards with deep regional commerce fluency.',
      icon: <MapPin className="w-5 h-5 text-emerald-500" />
    }
  ];

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="max-w-4xl space-y-6">
        <span className="text-xs font-mono tracking-widest text-[#4F7FFF] uppercase font-semibold">
          {lang === 'es' ? 'EL ESTUDIO' : 'THE STUDIO PHILOSOPHY'}
        </span>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-foreground tracking-tight leading-tight">
          {lang === 'es'
            ? 'Ingeniería Digital de Vanguardia para Empresas con Visión de Futuro'
            : 'Digital Engineering with Relentless Craft for Forward-Thinking Enterprises'}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          {lang === 'es'
            ? 'Hollowmoon Digital Studio nació para transformar la manera en que las empresas de servicios operan. Sustituimos procesos lentos y software fragmentado por plataformas de alta velocidad y agentes de IA autónomos.'
            : 'Hollowmoon Digital Studio was forged to redefine how service enterprises scale. We replace manual friction, fragmented spreadsheets, and bloated SaaS with bespoke, high-velocity digital flagships and autonomous AI infrastructure.'}
        </p>
      </div>

      {/* Panama Crossroads Narrative Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-secondary/30 border border-border/70 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#4F7FFF] font-semibold uppercase">
            <MapPin className="w-4 h-4" />
            <span>Panama City Headquarters • Costa del Este Financial District</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            {lang === 'es'
              ? 'En el Centro del Comercio Global y Latinoamericano'
              : 'At the Crossroads of Global Logistics and Latin American Commerce'}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {lang === 'es'
              ? 'Panamá no es solo nuestra sede: es nuestro campo de pruebas para sistemas de alta confiabilidad. Desde la gestión portuaria y la banca privada hasta redes de salud de múltiples sedes, nuestros sistemas procesan operaciones críticas con latencia imperceptible.'
              : 'Panama is more than our headquarters—it is our proving ground for zero-failure systems. From maritime customs and wealth advisory to multi-location healthcare networks, our systems power mission-critical operations with sub-second responsiveness.'}
          </p>
        </div>

        <div className="lg:col-span-4 p-6 rounded-2xl bg-card border border-border/80 font-mono text-xs space-y-3 shadow-macOS-subtle">
          <div className="flex justify-between border-b border-border/40 pb-2">
            <span className="text-muted-foreground">Established:</span>
            <span className="font-bold text-foreground">2024</span>
          </div>
          <div className="flex justify-between border-b border-border/40 pb-2">
            <span className="text-muted-foreground">Headquarters:</span>
            <span className="text-foreground">Panama City, PA</span>
          </div>
          <div className="flex justify-between border-b border-border/40 pb-2">
            <span className="text-muted-foreground">Operations:</span>
            <span className="text-emerald-500 font-bold">Bilingual EN / ES</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Engineering Stack:</span>
            <span className="text-[#4F7FFF]">Next.js / Python / Gemini</span>
          </div>
        </div>
      </div>

      {/* Core Principles Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-display font-bold text-foreground">
            {lang === 'es' ? 'Nuestros Principios de Ingeniería' : 'Core Operating Tenets'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {lang === 'es'
              ? 'La disciplina innegociable detrás de cada línea de código que entregamos.'
              : 'The non-negotiable discipline governing every line of code we ship.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((p, idx) => (
            <Card key={idx} className="p-8 space-y-4 hover:shadow-macOS-lift transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#4F7FFF]/10 border border-[#4F7FFF]/20 flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Conversion CTA */}
      <div className="p-10 rounded-3xl bg-[#0A0A0C] text-white border border-[#D9DBE1]/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-bold text-white">
            {lang === 'es' ? 'Conozca a Nuestros Ingenieros Principales' : 'Meet with Our Principal Engineers'}
          </h3>
          <p className="text-xs text-[#D9DBE1]/70 font-mono">
            {lang === 'es' ? 'Sesión de 30 minutos sin compromiso' : 'No-obligation 30-minute architectural strategy session'}
          </p>
        </div>
        <Button
          onClick={() => onNavigate('contact')}
          className="bg-[#4F7FFF] hover:bg-[#3D6CE6] text-white text-xs px-6 py-3 cursor-pointer shrink-0"
        >
          <span>{lang === 'es' ? 'Agendar Reunión' : 'Schedule Discovery'}</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};
