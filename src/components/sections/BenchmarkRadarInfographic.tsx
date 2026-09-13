import React, { useState } from 'react';
import { Target, CheckCircle2, Shield, Zap, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';
import { Language } from '../../types';

interface BenchmarkRadarInfographicProps {
  lang: Language;
}

export const BenchmarkRadarInfographic: React.FC<BenchmarkRadarInfographicProps> = ({ lang }) => {
  const [selectedProfile, setSelectedProfile] = useState<'all' | 'hollowmoon' | 'agency' | 'saas'>('all');
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);

  const axes = [
    {
      titleEn: 'Performance & Speed',
      titleEs: 'Velocidad & Rendimiento',
      descEn: 'Sub-600ms LCP vs 3.2s bloated frameworks',
      descEs: 'Sub-600ms LCP frente a frameworks de 3.2s',
      hollowmoon: 98,
      agency: 45,
      saas: 62,
    },
    {
      titleEn: 'Autonomous AI Depth',
      titleEs: 'Profundidad de IA Autónoma',
      descEn: 'Agentic automated business workflows vs manual forms',
      descEs: 'Flujos automatizados agénticos vs formularios manuales',
      hollowmoon: 95,
      agency: 30,
      saas: 55,
    },
    {
      titleEn: 'Conversion Rate (CRO)',
      titleEs: 'Optimización de Conversión (CRO)',
      descEn: 'Zero-friction enterprise UX yielding +40% higher close rate',
      descEs: 'UX sin fricción con +40% de cierre de prospectos',
      hollowmoon: 94,
      agency: 52,
      saas: 58,
    },
    {
      titleEn: '100% IP & Code Ownership',
      titleEs: 'Propiedad Total del Código e IP',
      descEn: 'Full codebase export vs proprietary agency lock-in',
      descEs: 'Código exportable total sin bloqueos de plataforma',
      hollowmoon: 100,
      agency: 60,
      saas: 10,
    },
    {
      titleEn: 'Zero-Seat Cost Efficiency',
      titleEs: 'Eficiencia Sin Tarifas por Asiento',
      descEn: 'Flat deployment vs $40-$150/user monthly SaaS sprawl',
      descEs: 'Despliegue propio sin suscripciones mensuales infladas',
      hollowmoon: 92,
      agency: 40,
      saas: 35,
    },
    {
      titleEn: 'Security & Enterprise SLA',
      titleEs: 'Seguridad y SLA Empresarial',
      descEn: 'Zero-trust architecture & Panama compliance hub',
      descEs: 'Arquitectura Zero-Trust y nodo de cumplimiento en Panamá',
      hollowmoon: 96,
      agency: 50,
      saas: 75,
    },
  ];

  // Radar chart math
  const center = 160;
  const radius = 120;
  const totalAxes = axes.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const hollowmoonPoints = axes.map((a, i) => getCoordinates(i, a.hollowmoon));
  const agencyPoints = axes.map((a, i) => getCoordinates(i, a.agency));
  const saasPoints = axes.map((a, i) => getCoordinates(i, a.saas));

  const hollowmoonPath = `M ${hollowmoonPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
  const agencyPath = `M ${agencyPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
  const saasPath = `M ${saasPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`;

  return (
    <section className="py-24 bg-card/30 relative overflow-hidden border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border bg-card/60 text-[11px] font-mono font-semibold text-[#4F7FFF] uppercase">
            <Target className="w-3.5 h-3.5" />
            {lang === 'es' ? 'Análisis Comparativo de Arquitectura' : 'Architectural Benchmark Radar'}
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-foreground tracking-tight">
            {lang === 'es'
              ? '¿Por Qué las Empresas Eligen Hollowmoon?'
              : 'Why Enterprises Build on Hollowmoon'}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {lang === 'es'
              ? 'Un desglose visual objetivo de cómo un buque insignia digital hecho a medida supera a las agencias convencionales y a la dispersión de herramientas SaaS.'
              : 'An objective visual analysis of how custom flagship digital architecture outperforms legacy agencies and multi-SaaS subscription sprawl.'}
          </p>

          {/* Profile Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', labelEn: 'Compare All Models', labelEs: 'Comparar Todos' },
              { id: 'hollowmoon', labelEn: 'Hollowmoon OS Only', labelEs: 'Hollowmoon OS' },
              { id: 'agency', labelEn: 'Legacy Agency Only', labelEs: 'Agencias Tradicionales' },
              { id: 'saas', labelEn: 'SaaS Tool Sprawl Only', labelEs: 'Herramientas SaaS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedProfile(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  selectedProfile === tab.id
                    ? 'bg-[#4F7FFF] text-white font-semibold shadow-sm'
                    : 'bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/60'
                }`}
              >
                {lang === 'es' ? tab.labelEs : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Infographic Visual Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Radar Chart SVG Graphic */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-macOS-subtle relative">
            <div className="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px]">
              <svg viewBox="0 0 320 320" className="w-full h-full overflow-visible">
                <defs>
                  <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4F7FFF" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4F7FFF" stopOpacity="0.0" />
                  </radialGradient>
                </defs>

                {/* Concentric radar web circles */}
                {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                  <circle
                    key={i}
                    cx={center}
                    cy={center}
                    r={radius * level}
                    fill={level === 1.0 ? 'url(#radarGlow)' : 'none'}
                    stroke="currentColor"
                    strokeOpacity="0.12"
                    strokeWidth="1"
                    strokeDasharray={level < 1.0 ? '3 3' : 'none'}
                  />
                ))}

                {/* Radar Spokes */}
                {axes.map((_, i) => {
                  const end = getCoordinates(i, 100);
                  return (
                    <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={end.x}
                      y2={end.y}
                      stroke="currentColor"
                      strokeOpacity="0.15"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Agency Layer (Amber / Slate) */}
                {(selectedProfile === 'all' || selectedProfile === 'agency') && (
                  <path
                    d={agencyPath}
                    fill="#F59E0B"
                    fillOpacity="0.15"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    className="transition-all duration-300"
                  />
                )}

                {/* SaaS Sprawl Layer (Rose / Red) */}
                {(selectedProfile === 'all' || selectedProfile === 'saas') && (
                  <path
                    d={saasPath}
                    fill="#EF4444"
                    fillOpacity="0.12"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    className="transition-all duration-300"
                  />
                )}

                {/* Hollowmoon Flagship Layer (Aurora Blue) */}
                {(selectedProfile === 'all' || selectedProfile === 'hollowmoon') && (
                  <path
                    d={hollowmoonPath}
                    fill="#4F7FFF"
                    fillOpacity="0.32"
                    stroke="#4F7FFF"
                    strokeWidth="2.5"
                    className="transition-all duration-300 drop-shadow-md"
                  />
                )}

                {/* Hollowmoon vertex dots */}
                {(selectedProfile === 'all' || selectedProfile === 'hollowmoon') &&
                  hollowmoonPoints.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#FFFFFF"
                      stroke="#4F7FFF"
                      strokeWidth="2.5"
                      className="cursor-pointer hover:scale-125 transition-transform"
                      onMouseEnter={() => setHoveredAxis(i)}
                      onMouseLeave={() => setHoveredAxis(null)}
                    />
                  ))}
              </svg>
            </div>

            {/* Radar Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-border/50 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#4F7FFF] ring-2 ring-[#4F7FFF]/30" />
                <span className="font-semibold text-foreground">Hollowmoon OS (96.2 Avg)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="text-muted-foreground">Legacy Agency (46.1 Avg)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="text-muted-foreground">SaaS Sprawl (49.5 Avg)</span>
              </div>
            </div>
          </div>

          {/* Right Cards: Interactive Metric Drilldowns */}
          <div className="lg:col-span-6 space-y-3.5">
            {axes.map((axis, index) => {
              const isHovered = hoveredAxis === index;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredAxis(index)}
                  onMouseLeave={() => setHoveredAxis(null)}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isHovered
                      ? 'border-[#4F7FFF] bg-[#4F7FFF]/10 shadow-sm scale-[1.01]'
                      : 'border-border/60 bg-card/60 hover:bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-[#4F7FFF]">
                        0{index + 1}
                      </span>
                      <h4 className="font-display font-semibold text-sm text-foreground">
                        {lang === 'es' ? axis.titleEs : axis.titleEn}
                      </h4>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {axis.hollowmoon}% Dominance
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 font-sans">
                    {lang === 'es' ? axis.descEs : axis.descEn}
                  </p>

                  {/* Visual Comparison Progress bars */}
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-muted-foreground">Hollowmoon</span>
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4F7FFF] rounded-full transition-all duration-500"
                          style={{ width: `${axis.hollowmoon}%` }}
                        />
                      </div>
                      <span className="font-semibold text-foreground w-8 text-right">{axis.hollowmoon}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-20 text-muted-foreground">Agency</span>
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500/80 rounded-full transition-all duration-500"
                          style={{ width: `${axis.agency}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground w-8 text-right">{axis.agency}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-20 text-muted-foreground">SaaS Sprawl</span>
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500/80 rounded-full transition-all duration-500"
                          style={{ width: `${axis.saas}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground w-8 text-right">{axis.saas}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
