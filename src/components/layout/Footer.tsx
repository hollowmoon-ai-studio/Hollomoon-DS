import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Send, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { Language } from '../../types';
import { siteTranslations } from '../../data/sitemapData';

interface FooterProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, lang }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const t = siteTranslations[lang].footer;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-border/80 bg-background text-foreground transition-colors pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-border/60">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0A0A0C] border border-[#D9DBE1]/30 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-[#D9DBE1] relative">
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#0A0A0C]" />
                </div>
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Hollowmoon <span className="text-[#4F7FFF] font-mono text-sm">DS</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {t.description}
            </p>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.status}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#4F7FFF]" />
              <span>{t.location}</span>
            </div>
          </div>

          {/* Capabilities Col */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              {lang === 'es' ? 'Capacidades' : 'Capabilities'}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'web-design-development')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Web Design & Dev
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'app-development')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Custom App Dev
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'ai-automation')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  AI Workflows & Agents
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'hollowmoon-os')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Hollowmoon OS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'cloud-infrastructure')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Cloud Scalability
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation & Resources */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              {lang === 'es' ? 'Estudio' : 'Studio'}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  {lang === 'es' ? 'Sobre Nosotros' : 'About Studio'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('os')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Hollowmoon OS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('case-studies')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  {lang === 'es' ? 'Casos de Éxito' : 'Case Studies'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  {lang === 'es' ? 'Artículos & Insights' : 'Articles & Insights'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  {lang === 'es' ? 'Contacto & Auditoría' : 'Contact & Discovery'}
                </button>
              </li>
            </ul>
          </div>

          {/* Intelligence Briefing / Newsletter */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              {lang === 'es' ? 'Boletín Ejecutivo' : 'Executive Briefing'}
            </p>
            <p className="text-xs text-muted-foreground">
              {lang === 'es'
                ? 'Análisis mensual sobre automatización con IA y arquitectura web para líderes empresariales.'
                : 'Monthly strategic analysis on enterprise AI workflows and modern digital systems.'}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="executive@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#4F7FFF]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1 text-white bg-[#4F7FFF] hover:bg-[#3D6CE6] rounded-lg transition-colors cursor-pointer"
                  title="Subscribe"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'es' ? 'Suscripción confirmada' : 'Subscribed successfully'}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>{t.copyright}</div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('legal', 'privacy')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              {lang === 'es' ? 'Privacidad' : 'Privacy Policy'}
            </button>
            <button
              onClick={() => onNavigate('legal', 'terms')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              {lang === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
            </button>
            <button
              onClick={() => onNavigate('legal', 'cookies')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              {lang === 'es' ? 'Cookies' : 'Cookies Policy'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
