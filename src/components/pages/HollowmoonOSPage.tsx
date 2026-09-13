import React from 'react';
import { HollowmoonOSBlueprint } from '../sections/HollowmoonOSBlueprint';
import { RoiCalculator } from '../sections/RoiCalculator';
import { LeadCaptureSection } from '../sections/LeadCaptureSection';
import { CheckCircle2, XCircle, ShieldCheck, Zap, Database, Cpu, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Language } from '../../types';

interface HollowmoonOSPageProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const HollowmoonOSPage: React.FC<HollowmoonOSPageProps> = ({ onNavigate, lang }) => {
  const comparison = [
    {
      feature: 'Source Code & IP Ownership',
      hollowmoon: '100% Owned by Your Enterprise',
      saas: 'Rented indefinitely from 3rd party vendor'
    },
    {
      feature: 'Seat-Based Pricing',
      hollowmoon: 'Zero per-seat licensing fees',
      saas: '$40 - $250 / user / month escalating cost'
    },
    {
      feature: 'Bespoke Workflow Adaptation',
      hollowmoon: 'Engineered exactly around your internal operations',
      saas: 'Forced to fit generic pre-built template constraints'
    },
    {
      feature: 'AI Execution Model',
      hollowmoon: 'Autonomous agent pipelines with zero data leakage',
      saas: 'Generic AI add-on that shares training data'
    },
    {
      feature: 'Cross-Department Latency',
      hollowmoon: 'Instant sub-second event bus orchestration',
      saas: 'Manual CSV exports and zapier webhook fragility'
    }
  ];

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono tracking-widest text-[#4F7FFF] uppercase font-semibold">
          THE BESPOKE ENTERPRISE ENGINE
        </span>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-foreground tracking-tight">
          Hollowmoon OS
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          The unified digital operating backbone linking communications, billing, AI automation, and executive telemetry into one high-velocity nerve center.
        </p>
      </div>

      {/* Interactive Blueprint Visualizer */}
      <HollowmoonOSBlueprint onNavigate={onNavigate} lang={lang} />

      {/* Comparison Table */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-display font-bold text-foreground">
            Bespoke Operating System vs. SaaS Sprawl
          </h2>
          <p className="text-sm text-muted-foreground">
            Why forward-thinking enterprises are leaving generic subscription software behind.
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-macOS-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/40 border-b border-border text-xs font-mono text-muted-foreground">
                <tr>
                  <th className="p-4 sm:p-6 font-semibold uppercase">Operational Dimension</th>
                  <th className="p-4 sm:p-6 font-semibold uppercase text-[#4F7FFF] bg-[#4F7FFF]/5">Hollowmoon OS</th>
                  <th className="p-4 sm:p-6 font-semibold uppercase">Generic Multi-SaaS Stack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {comparison.map((row, i) => (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 sm:p-6 font-medium text-foreground font-display">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-6 font-semibold text-foreground bg-[#4F7FFF]/5 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{row.hollowmoon}</span>
                    </td>
                    <td className="p-4 sm:p-6 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{row.saas}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <RoiCalculator onNavigate={onNavigate} lang={lang} />

      {/* Direct CTA */}
      <LeadCaptureSection onNavigate={onNavigate} lang={lang} />
    </div>
  );
};
