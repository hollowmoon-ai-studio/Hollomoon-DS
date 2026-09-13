import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Calendar, Clock, MapPin, Mail, Phone, MessageSquare, Shield, Sparkles, Check, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Language, BookingSubmission } from '../../types';

interface ContactPageProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, lang }) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    serviceInterest: 'AI Workflows & Automation',
    fullName: '',
    email: '',
    company: '',
    role: '',
    budgetRange: '$25k - $50k',
    timeline: 'Within 30 Days',
    challenges: ['Manual data entry & transcription'],
    notes: '',
    scheduledDate: '2026-09-18',
    scheduledTime: '10:00 AM (EST / Panama)'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<BookingSubmission | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const servicesList = [
    'Web Design & Development',
    'Custom App Development',
    'AI Workflows & Automation',
    'Hollowmoon OS Unified Backbone',
    'Cloud Infrastructure & Scalability'
  ];

  const budgetOptions = [
    'Under $15,000',
    '$15,000 - $35,000',
    '$35,000 - $75,000',
    '$75,000+'
  ];

  const commonChallenges = [
    'Manual data entry & transcription',
    'Disconnected software & siloed tools',
    'Slow client onboarding & intake',
    'Unreliable legacy web/app performance',
    'High overhead in clerical operations'
  ];

  const availableDates = [
    { day: 'Wed, Sep 16', val: '2026-09-16' },
    { day: 'Thu, Sep 17', val: '2026-09-17' },
    { day: 'Fri, Sep 18', val: '2026-09-18' },
    { day: 'Mon, Sep 21', val: '2026-09-21' },
    { day: 'Tue, Sep 22', val: '2026-09-22' }
  ];

  const availableTimes = [
    '09:30 AM EST',
    '11:00 AM EST',
    '02:00 PM EST',
    '03:30 PM EST',
    '05:00 PM EST'
  ];

  const toggleChallenge = (item: string) => {
    setFormData((prev) => {
      const exists = prev.challenges.includes(item);
      return {
        ...prev,
        challenges: exists
          ? prev.challenges.filter((c) => c !== item)
          : [...prev.challenges, item]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const submission: BookingSubmission = {
        id: 'HM-' + Math.floor(100000 + Math.random() * 900000),
        ...formData,
        submittedAt: new Date().toISOString()
      };
      setSubmittedBooking(submission);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono tracking-widest text-[#4F7FFF] uppercase font-semibold">
          {lang === 'es' ? 'AUDITORÍA & SESIÓN ESTRATÉGICA' : 'DISCOVERY & STRATEGY SESSION'}
        </span>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-foreground tracking-tight">
          {lang === 'es' ? 'Reserve su Sesión de Arquitectura' : 'Book Your Architectural Strategy Session'}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {lang === 'es'
            ? 'Una consulta técnica de 30 minutos con nuestros ingenieros principales para analizar sus cuellos de botella y diseñar su hoja de ruta digital.'
            : 'A dedicated 30-minute high-value technical call with our principal engineers to diagnose bottlenecks and map your digital modernization.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Main Booking Form */}
        <div className="lg:col-span-8 p-8 sm:p-12 rounded-3xl bg-card border border-border/80 shadow-macOS-subtle">
          {!submittedBooking ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Stepper Header */}
              <div className="flex items-center justify-between pb-6 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#4F7FFF] text-white flex items-center justify-center text-xs font-mono font-bold">
                    {step}
                  </span>
                  <span className="font-display font-bold text-sm text-foreground">
                    {step === 1 && (lang === 'es' ? 'Alcance & Servicios' : 'Scope & Service Need')}
                    {step === 2 && (lang === 'es' ? 'Perfil Empresarial' : 'Company Profile')}
                    {step === 3 && (lang === 'es' ? 'Agendar Fecha y Hora' : 'Calendar Scheduling')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <span>Step {step} of 3</span>
                </div>
              </div>

              {/* Step 1: Services & Challenges */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-3">
                    <label className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                      Select Primary Service Focus
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {servicesList.map((service) => (
                        <button
                          type="button"
                          key={service}
                          onClick={() => setFormData({ ...formData, serviceInterest: service })}
                          className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                            formData.serviceInterest === service
                              ? 'border-[#4F7FFF] bg-[#4F7FFF]/10 text-foreground shadow-sm'
                              : 'border-border/70 hover:bg-secondary/50 text-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{service}</span>
                            {formData.serviceInterest === service && (
                              <CheckCircle2 className="w-4 h-4 text-[#4F7FFF]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Challenges Checkboxes */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                      What is your largest operational bottleneck? (Select all that apply)
                    </label>
                    <div className="space-y-2">
                      {commonChallenges.map((challenge) => {
                        const selected = formData.challenges.includes(challenge);
                        return (
                          <button
                            type="button"
                            key={challenge}
                            onClick={() => toggleChallenge(challenge)}
                            className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                              selected
                                ? 'border-[#4F7FFF]/70 bg-[#4F7FFF]/5 text-foreground'
                                : 'border-border/60 text-muted-foreground hover:bg-secondary/40'
                            }`}
                          >
                            <span>{challenge}</span>
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${selected ? 'bg-[#4F7FFF] border-[#4F7FFF]' : 'border-border'}`}>
                              {selected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full text-xs py-3 cursor-pointer"
                  >
                    <span>Proceed to Company Profile</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              )}

              {/* Step 2: Company Profile & Budget */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-muted-foreground">Full Name *</label>
                      <Input
                        required
                        placeholder="Mateo de la Guardia"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-muted-foreground">Work Email *</label>
                      <Input
                        required
                        type="email"
                        placeholder="mateo@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-muted-foreground">Company Name *</label>
                      <Input
                        required
                        placeholder="Acme Enterprises SA"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-muted-foreground">Your Role</label>
                      <Input
                        placeholder="CEO / Operations Director"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">Anticipated Scope Investment</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {budgetOptions.map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setFormData({ ...formData, budgetRange: opt })}
                          className={`p-2.5 rounded-xl border text-center text-xs font-mono transition-all cursor-pointer ${
                            formData.budgetRange === opt
                              ? 'border-[#4F7FFF] bg-[#4F7FFF]/10 text-foreground font-bold'
                              : 'border-border/70 text-muted-foreground hover:bg-secondary'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="w-1/3 text-xs"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (formData.fullName && formData.email) {
                          setStep(3);
                        } else {
                          alert('Please enter your name and email to proceed.');
                        }
                      }}
                      className="w-2/3 text-xs"
                    >
                      Select Meeting Slot →
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Calendar & Final Confirmation */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-3">
                    <label className="text-xs font-mono uppercase text-muted-foreground font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#4F7FFF]" />
                      Select Preferred Date (EST / Panama City)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {availableDates.map((date) => (
                        <button
                          type="button"
                          key={date.val}
                          onClick={() => setFormData({ ...formData, scheduledDate: date.val })}
                          className={`p-3 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                            formData.scheduledDate === date.val
                              ? 'border-[#4F7FFF] bg-[#4F7FFF]/15 text-foreground font-bold shadow-sm'
                              : 'border-border/70 text-muted-foreground hover:bg-secondary'
                          }`}
                        >
                          {date.day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-mono uppercase text-muted-foreground font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#4F7FFF]" />
                      Select Preferred Time Slot
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setFormData({ ...formData, scheduledTime: time })}
                          className={`p-2.5 rounded-xl border text-center text-xs font-mono transition-all cursor-pointer ${
                            formData.scheduledTime === time
                              ? 'border-[#4F7FFF] bg-[#4F7FFF]/15 text-foreground font-bold shadow-sm'
                              : 'border-border/70 text-muted-foreground hover:bg-secondary'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border/70 text-xs font-mono space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Attendee:</span>
                      <span className="text-foreground font-semibold">{formData.fullName} ({formData.company})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scope:</span>
                      <span className="text-[#4F7FFF]">{formData.serviceInterest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Meeting Schedule:</span>
                      <span className="text-emerald-500 font-semibold">{formData.scheduledDate} @ {formData.scheduledTime}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="w-1/3 text-xs"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-2/3 text-xs py-3 font-semibold"
                    >
                      {isSubmitting ? 'Confirming Session...' : 'Confirm Strategy Session'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            /* Post-Booking Success Receipt */
            <div className="space-y-6 text-center py-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest font-semibold">
                  Session Confirmed & Locked
                </span>
                <h2 className="text-3xl font-display font-bold text-foreground">
                  We Look Forward to Meeting, {submittedBooking.fullName}
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  A calendar invite and preparation brief has been dispatched to{' '}
                  <span className="font-mono text-foreground">{submittedBooking.email}</span>.
                </p>
              </div>

              {/* Receipt Details Card */}
              <div className="p-6 rounded-2xl bg-secondary/30 border border-border/70 text-left font-mono text-xs max-w-md mx-auto space-y-2.5">
                <div className="flex justify-between pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Booking Reference:</span>
                  <span className="font-bold text-[#4F7FFF]">{submittedBooking.id}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Scheduled Date:</span>
                  <span className="text-foreground">{submittedBooking.scheduledDate}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Time Slot:</span>
                  <span className="text-foreground">{submittedBooking.scheduledTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Focus Scope:</span>
                  <span className="text-foreground">{submittedBooking.serviceInterest}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => {
                    navigator.clipboard?.writeText(`https://hollowmoon.digital/session/${submittedBooking.id}`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 3000);
                  }}
                  variant="outline"
                  className="text-xs flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied' : 'Copy Calendar Reference'}</span>
                </Button>

                <Button
                  onClick={() => onNavigate('home')}
                  className="text-xs"
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Information */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-display font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#4F7FFF]" />
              Panama City Headquarters
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Costa del Este Financial District
              <br />
              Oceania Business Plaza & Torre de las Américas
              <br />
              Panama City, Republic of Panama
            </p>
            <div className="pt-2 border-t border-border/40 text-[11px] font-mono text-muted-foreground space-y-1">
              <p>Timezone: UTC -5 (EST Synchronous)</p>
              <p>Operations: Bilingual English & Spanish</p>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="text-base font-display font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              Direct Executive Communication
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Prefer direct messaging? Reach our engineering team directly via secure channel:
            </p>
            <div className="pt-2 space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-secondary/50 flex items-center justify-between text-foreground">
                <span>Email:</span>
                <span className="text-[#4F7FFF]">contact@hollowmoon.digital</span>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/50 flex items-center justify-between text-foreground">
                <span>WhatsApp Desk:</span>
                <span className="text-emerald-500">+507 6200-8800</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-3 bg-[#0A0A0C] text-white border border-[#D9DBE1]/20">
            <span className="text-[11px] font-mono text-[#4F7FFF] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Strict Enterprise NDA
            </span>
            <p className="text-xs text-[#D9DBE1]/80 leading-relaxed">
              All discussions, architecture schemas, and business metrics shared during discovery are protected under strict bilateral confidentiality.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
