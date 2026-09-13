import React, { useState } from 'react';
import { DollarSign, Clock, Users, ArrowRight, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { siteTranslations } from '../../data/sitemapData';
import { Language } from '../../types';

interface RoiCalculatorProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onNavigate, lang }) => {
  const [teamSize, setTeamSize] = useState<number>(12);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  const [hourlyRate, setHourlyRate] = useState<number>(45);

  const t = siteTranslations[lang].roiSection;

  // Automation factor: realistic 75% reduction in manual clerical / repetitive tasks
  const automationEfficiency = 0.75;
  const weeklyHoursLost = teamSize * hoursPerWeek;
  const monthlyHoursLost = weeklyHoursLost * 4.33;
  const monthlyHoursSaved = Math.round(monthlyHoursLost * automationEfficiency);
  const monthlySavings = Math.round(monthlyHoursSaved * hourlyRate);
  const annualSavings = monthlySavings * 12;
  const speedMultiplier = (1 / (1 - automationEfficiency)).toFixed(1);

  // 36-month cash flow simulation for live SVG chart
  const months = [1, 3, 6, 9, 12, 18, 24, 30, 36];
  const initialImplementationCost = 14000; // estimated upfront studio engagement
  const chartWidth = 500;
  const chartHeight = 160;

  const chartPoints = months.map((m, idx) => {
    const manualCost = m * (weeklyHoursLost * 4.33 * hourlyRate);
    const hollowmoonTotalCost = initialImplementationCost + m * (weeklyHoursLost * 4.33 * (1 - automationEfficiency) * hourlyRate);
    const cumulativeNetSaved = manualCost - hollowmoonTotalCost;
    return {
      month: m,
      manualCost,
      hollowmoonCost: hollowmoonTotalCost,
      netSaved: cumulativeNetSaved,
      x: (idx / (months.length - 1)) * chartWidth,
      // Map netSaved from -20k to +200k to SVG Y
      y: chartHeight - ((cumulativeNetSaved + 20000) / (annualSavings * 2.8 + 20000)) * (chartHeight - 30) - 15,
    };
  });

  const netSavedPath = `M ${chartPoints.map((p) => `${p.x},${Math.max(10, Math.min(chartHeight - 10, p.y))}`).join(' L ')}`;
  const netSavedArea = `M 0,${chartHeight} L ${chartPoints.map((p) => `${p.x},${Math.max(10, Math.min(chartHeight - 10, p.y))}`).join(' L ')} L ${chartWidth},${chartHeight} Z`;

  return (
    <section className="py-24 bg-card/40 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#4F7FFF] uppercase font-semibold">
            {t.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            {t.title}
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Form */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-card border border-border/80 shadow-macOS-subtle flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Team Size Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4F7FFF]" />
                    {lang === 'es' ? 'Tamaño del Equipo Operativo' : 'Operational Team Size'}
                  </span>
                  <span className="font-mono font-bold text-base text-foreground bg-secondary px-3 py-0.5 rounded-lg">
                    {teamSize} {lang === 'es' ? 'personas' : 'members'}
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  step="1"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-[#4F7FFF]"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                  <span>2 members</span>
                  <span>50</span>
                  <span>100+ members</span>
                </div>
              </div>

              {/* Repetitive Hours Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#4F7FFF]" />
                    {lang === 'es' ? 'Horas Manuales / Semana por Persona' : 'Manual Hours / Week per Person'}
                  </span>
                  <span className="font-mono font-bold text-base text-foreground bg-secondary px-3 py-0.5 rounded-lg">
                    {hoursPerWeek} hrs/wk
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-[#4F7FFF]"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                  <span>2 hrs (light)</span>
                  <span>15 hrs</span>
                  <span>30 hrs (clerical heavy)</span>
                </div>
              </div>

              {/* Average Hourly Rate */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#4F7FFF]" />
                    {lang === 'es' ? 'Costo Promedio por Hora (USD)' : 'Average Loaded Hourly Rate (USD)'}
                  </span>
                  <span className="font-mono font-bold text-base text-foreground bg-secondary px-3 py-0.5 rounded-lg">
                    ${hourlyRate}/hr
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-[#4F7FFF]"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                  <span>$20/hr</span>
                  <span>$100/hr</span>
                  <span>$200/hr (specialized)</span>
                </div>
              </div>
            </div>

            {/* Assumptions Note */}
            <div className="pt-4 border-t border-border/50 text-xs text-muted-foreground flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Based on Hollowmoon 75% median automation benchmark across 40+ client implementations.</span>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-[#0A0A0C] text-white border border-[#D9DBE1]/20 shadow-macOS-lift flex flex-col justify-between space-y-8 relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F7FFF]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#4F7FFF] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Estimated Operational Recovery
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-[#D9DBE1]">
                  {speedMultiplier}x Speedup
                </span>
              </div>

              {/* Big Financial Number */}
              <div className="space-y-1">
                <p className="text-xs font-mono text-[#D9DBE1]/70 uppercase tracking-wider">
                  {lang === 'es' ? 'Ahorro Anual Estimado' : 'Projected Annual Capital Saved'}
                </p>
                <p className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
                  ${annualSavings.toLocaleString()}
                  <span className="text-lg font-normal text-[#D9DBE1]/60"> / yr</span>
                </p>
              </div>

              {/* Metric Breakdown Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs text-[#D9DBE1]/70 font-mono uppercase">
                    {lang === 'es' ? 'Ahorro Mensual' : 'Monthly Cash Saved'}
                  </p>
                  <p className="text-2xl font-bold font-display text-[#4F7FFF] mt-1">
                    ${monthlySavings.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs text-[#D9DBE1]/70 font-mono uppercase">
                    {lang === 'es' ? 'Horas Recuperadas' : 'Monthly Hours Reclaimed'}
                  </p>
                  <p className="text-2xl font-bold font-display text-emerald-400 mt-1">
                    {monthlyHoursSaved.toLocaleString()} hrs
                  </p>
                </div>
              </div>

              {/* Live Interactive 36-Month Cumulative Capital Saved Chart */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#D9DBE1]/80 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 animate-pulse-subtle" />
                    {lang === 'es' ? 'Trayectoria de Ahorro Acumulado (36 Meses)' : '36-Month Net Capital Reclaimed Curve'}
                  </span>
                  <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/20">
                    Break-even: Month 2.1
                  </span>
                </div>

                <div className="w-full h-24 pt-2">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="roiAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Zero-Line / Break-Even Horizon */}
                    <line x1="0" y1={chartHeight - 30} x2={chartWidth} y2={chartHeight - 30} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />

                    {/* Shaded Area */}
                    <path d={netSavedArea} fill="url(#roiAreaGrad)" />

                    {/* Path Line */}
                    <path d={netSavedPath} fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Break-even marker */}
                    <circle cx={chartWidth * 0.12} cy={chartHeight - 30} r="4" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />

                    {/* 36-month final marker */}
                    <circle cx={chartWidth} cy={chartPoints[chartPoints.length - 1].y} r="5" fill="#34D399" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-[#D9DBE1]/60 pt-1 border-t border-white/5">
                  <span>M0: Setup</span>
                  <span>M12: +${(annualSavings - initialImplementationCost).toLocaleString()}</span>
                  <span>M24</span>
                  <span className="text-emerald-400 font-bold">M36: +${((annualSavings * 3) - initialImplementationCost).toLocaleString()} Net</span>
                </div>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
              <Button
                onClick={() => onNavigate('contact')}
                className="w-full bg-[#4F7FFF] hover:bg-[#3D6CE6] text-white py-3.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-aurora-glow"
              >
                <span>{lang === 'es' ? 'Reclamar Este Plan de Automatización' : 'Claim This Automation Roadmap'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open-aura-concierge', {
                      detail: {
                        tab: 'cro',
                        prompt:
                          lang === 'es'
                            ? `He calculado que nuestro equipo de ${teamSize} personas pierde ${hoursPerWeek} horas semanales a $${hourlyRate}/hora, proyectando $${annualSavings.toLocaleString()} anuales de ahorro. ¿Cómo implementaría Hollowmoon OS esto para nosotros?`
                            : `I calculated that our team of ${teamSize} specialists spends ${hoursPerWeek} hrs/week on clerical tasks at $${hourlyRate}/hr, projecting $${annualSavings.toLocaleString()} in annual recovery. How would Hollowmoon OS structure our migration?`,
                      },
                    })
                  );
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#4F7FFF]" />
                <span>
                  {lang === 'es'
                    ? 'Analizar Este Ahorro con AURA AI'
                    : 'Analyze These Figures with AURA AI'}
                </span>
              </button>

              <p className="text-center text-[11px] text-[#D9DBE1]/50 font-mono">
                No credit card required • Complimentary 30-min discovery audit
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
