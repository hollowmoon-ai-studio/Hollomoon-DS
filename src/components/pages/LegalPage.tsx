import React, { useState } from 'react';
import { ArrowLeft, Shield, FileText, Cookie } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Language } from '../../types';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms' | 'cookies';
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'privacy', onNavigate, lang }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>(initialTab);

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'es' ? 'Volver al Inicio' : 'Back to Studio'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/60 gap-4">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'privacy'
              ? 'border-[#4F7FFF] text-[#4F7FFF]'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Privacy Policy</span>
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'terms'
              ? 'border-[#4F7FFF] text-[#4F7FFF]'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Terms of Service</span>
        </button>
        <button
          onClick={() => setActiveTab('cookies')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'cookies'
              ? 'border-[#4F7FFF] text-[#4F7FFF]'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Cookie className="w-4 h-4" />
          <span>Cookies Policy</span>
        </button>
      </div>

      {/* Legal Content */}
      <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border/80 shadow-macOS-subtle space-y-8 text-sm text-foreground/90 leading-relaxed font-sans">
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#4F7FFF] uppercase">Effective Date: September 2026</span>
              <h1 className="text-3xl font-display font-bold text-foreground">Hollowmoon Privacy Policy</h1>
              <p className="text-xs text-muted-foreground font-mono">Hollowmoon Digital Studio Inc. • Republic of Panama</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h2 className="text-lg font-display font-bold text-foreground">1. Commitment to Data Integrity</h2>
              <p>
                At Hollowmoon Digital Studio ("Hollowmoon", "we", "our"), data sovereignty and privacy are core engineering imperatives. We do not sell, rent, or monetize client data. Any information ingested through our web interfaces or autonomous pipelines is treated with zero-trust confidentiality.
              </p>

              <h2 className="text-lg font-display font-bold text-foreground">2. Client Data & AI Pipelines</h2>
              <p>
                Enterprise data processed by Hollowmoon OS or custom AI agents is isolated within private cloud instances. We enforce zero-retention agreements with foundational model providers ensuring proprietary enterprise data is never used to train public models.
              </p>

              <h2 className="text-lg font-display font-bold text-foreground">3. Security Standards</h2>
              <p>
                All network communication utilizes TLS 1.3 encryption. Stored records are safeguarded with AES-256 encryption at rest. Inquiries regarding data deletion or security audits may be directed to <span className="font-mono text-[#4F7FFF]">security@hollowmoon.digital</span>.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#4F7FFF] uppercase">Last Updated: September 2026</span>
              <h1 className="text-3xl font-display font-bold text-foreground">Terms of Service</h1>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h2 className="text-lg font-display font-bold text-foreground">1. Engagement & Scope</h2>
              <p>
                All digital engineering, web development, and AI pipeline deployment services are governed by formal bilateral Statements of Work (SOW) executed between Hollowmoon Digital Studio and the client organization.
              </p>

              <h2 className="text-lg font-display font-bold text-foreground">2. Intellectual Property Ownership</h2>
              <p>
                Upon final project delivery and settlement, the client holds 100% intellectual property ownership of custom source code, application assets, and bespoke operational workflows developed specifically for their organization.
              </p>

              <h2 className="text-lg font-display font-bold text-foreground">3. SLA & System Reliability</h2>
              <p>
                For cloud infrastructures managed under our ongoing telemetry service, we commit to an operational SLA of 99.9% uptime, backed by automated multi-region replication.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'cookies' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#4F7FFF] uppercase">Transparency Notice</span>
              <h1 className="text-3xl font-display font-bold text-foreground">Cookie & Local Storage Policy</h1>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h2 className="text-lg font-display font-bold text-foreground">1. Minimalist Telemetry</h2>
              <p>
                Our digital flagship uses only essential client-side tokens for dark/light mode preferences and language localization (English/Spanish). We do not deploy invasive third-party ad retargeting pixels or behavioral tracking scripts.
              </p>

              <h2 className="text-lg font-display font-bold text-foreground">2. Preference Persistence</h2>
              <p>
                Your theme selection (Deep Space Black vs. Lunar Silver) and language choice are stored locally on your device to ensure sub-100ms subsequent render times.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
