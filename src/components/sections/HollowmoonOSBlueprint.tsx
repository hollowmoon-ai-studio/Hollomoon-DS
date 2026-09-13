import React, { useState } from 'react';
import { Layers, Database, Cpu, Zap, Radio, Shield, CheckCircle, Activity, ArrowRight, Play, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { hollowmoonOSNodes, siteTranslations } from '../../data/sitemapData';
import { Language } from '../../types';

interface HollowmoonOSBlueprintProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const HollowmoonOSBlueprint: React.FC<HollowmoonOSBlueprintProps> = ({ onNavigate, lang }) => {
  const [activeNodeId, setActiveNodeId] = useState<string>('reasoning');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [pulseCount, setPulseCount] = useState<number>(142);
  const t = siteTranslations[lang].osSection;

  const activeNode = hollowmoonOSNodes.find((n) => n.id === activeNodeId) || hollowmoonOSNodes[1];

  const getNodeIcon = (id: string) => {
    switch (id) {
      case 'ingestion': return <Radio className="w-5 h-5 text-[#4F7FFF] animate-pulse-subtle" />;
      case 'reasoning': return <Cpu className="w-5 h-5 text-[#4F7FFF] animate-pulse-subtle" />;
      case 'orchestration': return <Zap className="w-5 h-5 text-[#4F7FFF] animate-pulse-subtle" />;
      case 'data-vault': return <Database className="w-5 h-5 text-emerald-500 animate-pulse-subtle" />;
      case 'cockpit': return <Layers className="w-5 h-5 text-amber-500 animate-pulse-subtle" />;
      default: return <Activity className="w-5 h-5 text-[#4F7FFF] animate-pulse-subtle" />;
    }
  };

  const handleSimulatePulse = () => {
    setPulseCount((prev) => prev + 1);
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#4F7FFF] uppercase font-semibold">
            {t.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-foreground tracking-tight">
            {t.title}
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            {t.description}
          </p>
          <p className="text-xs font-mono text-[#4F7FFF] pt-1">
            {t.interactiveHint}
          </p>
        </div>

        {/* Blueprint Visualizer Container */}
        <div className="p-6 md:p-10 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-macOS-subtle space-y-8">
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-foreground">
                Hollowmoon OS Core • v4.2 Pipeline Active
              </span>
              <span className="text-border">|</span>
              <span className="font-mono text-xs text-muted-foreground">
                LatAm Node: Panama City 01
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSimulatePulse}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary text-xs font-mono text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-[#4F7FFF]" />
                <span>Simulate Event ({pulseCount})</span>
              </button>
              <div className="px-3 py-1 rounded-lg bg-[#4F7FFF]/10 border border-[#4F7FFF]/20 text-[11px] font-mono text-[#4F7FFF]">
                99.98% Healthy
              </div>
            </div>
          </div>

          {/* Interactive Node Flowchart */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {hollowmoonOSNodes.map((node, index) => {
              const isSelected = activeNodeId === node.id;
              return (
                <div key={node.id} className="relative">
                  <button
                    onClick={() => setActiveNodeId(node.id)}
                    className={`w-full h-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-[#4F7FFF] bg-[#4F7FFF]/10 shadow-macOS-lift scale-[1.02]'
                        : 'border-border/70 bg-background/50 hover:bg-secondary/40 hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-card border border-border/50">
                        {getNodeIcon(node.id)}
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        Step 0{index + 1}
                      </span>
                    </div>

                    <div>
                      <p className="font-display font-semibold text-xs sm:text-sm text-foreground line-clamp-1">
                        {node.label}
                      </p>
                      <p className="text-[11px] font-mono text-[#4F7FFF] mt-0.5">
                        {node.metrics}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <span className="capitalize">{node.type}</span>
                      <span className="inline-flex items-center gap-1 text-emerald-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {node.status}
                      </span>
                    </div>
                  </button>

                  {/* Flow arrow on desktop */}
                  {index < hollowmoonOSNodes.length - 1 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <div className="w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center">
                        <ArrowRight className="w-2.5 h-2.5 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Node Detail Inspector */}
          <div className="p-6 rounded-2xl bg-secondary/30 border border-border/60 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#4F7FFF] font-semibold">
                  Active Node Telemetry
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  [ID: {activeNode.id.toUpperCase()}]
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">
                {activeNode.label}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeNode.description}
              </p>
            </div>

            <div className="space-y-3 bg-card p-4 rounded-xl border border-border/60 font-mono text-xs">
              <div className="flex justify-between text-muted-foreground pb-1.5 border-b border-border/40">
                <span>Latency Benchmark:</span>
                <span className="text-emerald-500 font-semibold">4.2ms avg</span>
              </div>
              <div className="flex justify-between text-muted-foreground pb-1.5 border-b border-border/40">
                <span>Throughput:</span>
                <span className="text-foreground">{activeNode.metrics}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Fault Tolerance:</span>
                <span className="text-[#4F7FFF]">Self-Healing Active</span>
              </div>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground">
              Need a tailored architecture review for your enterprise data and workflows?
            </p>
            <Button
              onClick={() => onNavigate('contact')}
              className="text-xs px-5 py-2 cursor-pointer"
            >
              Request Custom System Architecture
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
