import React, { useState, useEffect } from 'react';
import { Activity, Radio, Cpu, ArrowUpRight, Zap, Globe, ShieldCheck, Gauge, Layers, RefreshCw } from 'lucide-react';
import { Language } from '../../types';

interface LiveTelemetryInfographicProps {
  lang: Language;
}

export const LiveTelemetryInfographic: React.FC<LiveTelemetryInfographicProps> = ({ lang }) => {
  const [activeEdge, setActiveEdge] = useState<'panama' | 'us-east' | 'frankfurt' | 'tokyo'>('panama');
  const [dataPoints, setDataPoints] = useState<number[]>([42, 45, 48, 44, 52, 60, 58, 65, 72, 68, 75, 84, 80, 89, 94, 91, 98, 104, 102, 110]);
  const [tps, setTps] = useState<number>(1420);
  const [latency, setLatency] = useState<number>(18.4);
  const [isLive, setIsLive] = useState<boolean>(true);

  // Live ticking simulation for the telemetry sparkline
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const last = prev[prev.length - 1];
        const delta = (Math.random() - 0.48) * 8;
        const nextVal = Math.max(30, Math.min(130, Math.round(last + delta)));
        return [...prev.slice(1), nextVal];
      });
      setTps((prev) => Math.round(1380 + Math.random() * 80));
      setLatency((prev) => +(17.5 + Math.random() * 2).toFixed(1));
    }, 1200);
    return () => clearInterval(interval);
  }, [isLive]);

  const edges = [
    {
      id: 'panama',
      name: 'Panama Central Hub',
      flag: '🇵🇦',
      region: 'Americas Gateway (HQ)',
      latency: `${latency}ms`,
      traffic: '38%',
      status: 'Primary Flagship',
    },
    {
      id: 'us-east',
      name: 'US-East (Virginia)',
      flag: '🇺🇸',
      region: 'North America Transit',
      latency: `${(latency * 1.3).toFixed(1)}ms`,
      traffic: '32%',
      status: 'Synchronized',
    },
    {
      id: 'frankfurt',
      name: 'Frankfurt Central',
      flag: '🇩🇪',
      region: 'EMEA Enterprise Node',
      latency: `${(latency * 2.1).toFixed(1)}ms`,
      traffic: '19%',
      status: 'Synchronized',
    },
    {
      id: 'tokyo',
      name: 'Tokyo Pacific',
      flag: '🇯🇵',
      region: 'APAC Trading Gateway',
      latency: `${(latency * 2.6).toFixed(1)}ms`,
      traffic: '11%',
      status: 'Synchronized',
    },
  ];

  // Calculate SVG path for dataPoints
  const width = 600;
  const height = 140;
  const max = 140;
  const min = 20;

  const points = dataPoints.map((val, idx) => {
    const x = (idx / (dataPoints.length - 1)) * width;
    const y = height - ((val - min) / (max - min)) * (height - 20) - 10;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;

  return (
    <section className="py-20 bg-background relative overflow-hidden border-t border-border/40">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#4F7FFF]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#4F7FFF]/30 bg-[#4F7FFF]/10 text-[11px] font-mono font-semibold text-[#4F7FFF] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#4F7FFF] animate-pulse-subtle" />
              {lang === 'es' ? 'Infraestructura & Telemetría en Vivo' : 'Live Infrastructure & Telemetry'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
              {lang === 'es'
                ? 'Rendimiento en Tiempo Real y Arquitectura Edge'
                : 'Real-Time Edge Telemetry & Architecture'}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {lang === 'es'
                ? 'Supervisión en vivo de latencia de red, rendimiento de agentes autónomos y distribución de tráfico optimizado para conversión.'
                : 'Real-time telemetry across Hollowmoon OS edge network, autonomous reasoning dispatch, and conversion-optimized routing.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setIsLive(!isLive)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border bg-card/80 text-xs font-mono font-medium text-foreground hover:bg-secondary transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#4F7FFF] ${isLive ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              <span>{isLive ? (lang === 'es' ? 'Telemetría Activa' : 'Streaming Live') : (lang === 'es' ? 'Pausado' : 'Paused')}</span>
            </button>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              99.99% SLA
            </div>
          </div>
        </div>

        {/* Infographic Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Visual: Live Streaming Graph & Pipeline Flow */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-macOS-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#4F7FFF] animate-pulse-subtle" />
                  <span className="text-xs font-mono uppercase font-semibold text-foreground">
                    {lang === 'es' ? 'Flujo de Transacciones Globales' : 'Global Transactional Throughput'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  {lang === 'es' ? 'Eventos procesados por segundo (TPS)' : 'Live Edge Requests & Autonomous AI Invocations'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-display font-extrabold text-foreground tracking-tight">
                  {tps.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-[#4F7FFF] ml-1">TPS</span>
              </div>
            </div>

            {/* Live SVG Wave Area Chart */}
            <div className="relative pt-2 pb-1">
              <div className="w-full h-[150px] overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="telemetryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4F7FFF" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#4F7FFF" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="30" x2={width} y2="30" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                  <line x1="0" y1="75" x2={width} y2="75" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2={width} y2="120" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />

                  {/* Gradient Area */}
                  <path d={areaD} fill="url(#telemetryGrad)" />

                  {/* Smooth animated wave polyline */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#4F7FFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                  />

                  {/* Current Tip Glowing Circle */}
                  {points.length > 0 && (
                    <circle
                      cx={width}
                      cy={points[points.length - 1].split(',')[1]}
                      r="5"
                      fill="#FFFFFF"
                      stroke="#4F7FFF"
                      strokeWidth="3"
                      className="animate-pulse"
                    />
                  )}
                </svg>
              </div>

              {/* Chart X-Axis Timeline */}
              <div className="flex justify-between text-[11px] font-mono text-muted-foreground pt-3 border-t border-border/40">
                <span>-60 sec</span>
                <span>-45 sec</span>
                <span>-30 sec</span>
                <span>-15 sec</span>
                <span className="text-[#4F7FFF] font-semibold">Real-Time Now</span>
              </div>
            </div>

            {/* Visual System Pipeline: Ingest -> Reason -> Cache -> Client */}
            <div className="pt-4 border-t border-border/50">
              <div className="text-xs font-mono uppercase text-muted-foreground mb-3 flex items-center justify-between">
                <span>{lang === 'es' ? 'Canalización de Datos Ultrarrápida' : 'Autonomous Edge Pipeline Flow'}</span>
                <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Zero Bottleneck
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { step: '01', title: 'Edge Ingest', metric: '0.8ms', icon: <Radio className="w-3.5 h-3.5 text-[#4F7FFF] animate-pulse-subtle" /> },
                  { step: '02', title: 'AI Reasoning', metric: '14.2ms', icon: <Cpu className="w-3.5 h-3.5 text-[#4F7FFF]" /> },
                  { step: '03', title: 'NVMe Cache', metric: '0.4ms', icon: <Zap className="w-3.5 h-3.5 text-amber-500" /> },
                  { step: '04', title: 'Client Paint', metric: '18.4ms', icon: <Gauge className="w-3.5 h-3.5 text-emerald-500" /> },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-secondary/50 border border-border/60 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] font-mono">
                      {item.icon}
                      <span>{item.step}</span>
                    </div>
                    <p className="text-xs font-semibold text-foreground line-clamp-1">{item.title}</p>
                    <p className="text-[11px] font-mono text-[#4F7FFF] font-medium">{item.metric}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Visual: Global Edge Routing & Core Web Vitals */}
          <div className="lg:col-span-5 space-y-6">
            {/* Edge Nodes Selector Cards */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-macOS-subtle space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-semibold text-foreground flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#4F7FFF]" />
                  {lang === 'es' ? 'Nodos de Red Global' : 'Global Node Routing Matrix'}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">Panama Primary</span>
              </div>

              <div className="space-y-2.5">
                {edges.map((edge) => {
                  const isSelected = activeEdge === edge.id;
                  return (
                    <button
                      key={edge.id}
                      onClick={() => setActiveEdge(edge.id as any)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#4F7FFF] bg-[#4F7FFF]/10 shadow-sm'
                          : 'border-border/60 bg-background/50 hover:bg-secondary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{edge.flag}</span>
                        <div>
                          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            {edge.name}
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4F7FFF] animate-ping" />}
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground">{edge.region}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {edge.latency}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground">{edge.traffic} volume</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core Web Vitals Infographic Comparison */}
            <div className="p-6 rounded-3xl bg-[#0A0A0C] text-white border border-[#D9DBE1]/20 shadow-macOS-lift space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono uppercase text-[#4F7FFF] font-semibold flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5" />
                  {lang === 'es' ? 'Auditoría Core Web Vitals' : 'Google Core Web Vitals Metric'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Grade A+ (100/100)
                </span>
              </div>

              {/* Metric Comparison Bars */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#D9DBE1]/80">Largest Contentful Paint (LCP)</span>
                    <span className="text-emerald-400 font-bold">0.6s (Industry: 3.2s)</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
                    <div className="w-[92%] bg-emerald-400 h-full rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#D9DBE1]/80">Interaction to Next Paint (INP)</span>
                    <span className="text-emerald-400 font-bold">18ms (Industry: 280ms)</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
                    <div className="w-[96%] bg-[#4F7FFF] h-full rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#D9DBE1]/80">Cumulative Layout Shift (CLS)</span>
                    <span className="text-emerald-400 font-bold">0.00 (Zero Drift)</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
                    <div className="w-[100%] bg-emerald-400 h-full rounded-full" />
                  </div>
                </div>
              </div>

              <p className="text-[11px] font-mono text-[#D9DBE1]/60 pt-2 border-t border-white/10">
                {lang === 'es'
                  ? 'Cada 100ms de latencia eliminada genera un aumento medido de +1.4% en tasa de conversión B2B.'
                  : 'Every 100ms of edge latency eliminated yields an average +1.4% conversion rate uplift in enterprise digital flagships.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
