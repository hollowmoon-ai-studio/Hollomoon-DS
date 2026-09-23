import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/pages/HomePage';
import { DynamicSEO } from './components/layout/DynamicSEO';
import { ScrollProgressBar } from './components/layout/ScrollProgressBar';
import { PageLoadingFallback } from './components/layout/PageLoadingFallback';
import { Language } from './types';

// Code-split and lazy-load secondary pages and heavy overlays
const ServicesPage = lazy(() => import('./components/pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('./components/pages/ServiceDetailPage').then((m) => ({ default: m.ServiceDetailPage })));
const HollowmoonOSPage = lazy(() => import('./components/pages/HollowmoonOSPage').then((m) => ({ default: m.HollowmoonOSPage })));
const CaseStudiesPage = lazy(() => import('./components/pages/CaseStudiesPage').then((m) => ({ default: m.CaseStudiesPage })));
const BlogPage = lazy(() => import('./components/pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./components/pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const LegalPage = lazy(() => import('./components/pages/LegalPage').then((m) => ({ default: m.LegalPage })));

// Overlays lazy-loaded on demand
const CommandMenu = lazy(() => import('./components/layout/CommandMenu').then((m) => ({ default: m.CommandMenu })));
const AuraConcierge = lazy(() => import('./components/concierge/AuraConcierge').then((m) => ({ default: m.AuraConcierge })));

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [activeSlug, setActiveSlug] = useState<string>('web-design-development');
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'cookies'>('privacy');
  const [lang, setLang] = useState<Language>('en');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // Initialize theme and language on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('hm_theme');
    if (savedTheme) {
      const dark = savedTheme === 'dark';
      setIsDark(dark);
      document.documentElement.classList.toggle('dark', dark);
    } else {
      document.documentElement.classList.add('dark');
    }

    const savedLang = localStorage.getItem('hm_lang') as Language;
    if (savedLang === 'en' || savedLang === 'es') {
      setLang(savedLang);
    }

    const syncRouteFromHash = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) {
        setCurrentRoute('home');
        return;
      }
      if (hash.startsWith('service-')) {
        const slug = hash.replace('service-', '');
        setCurrentRoute('service-detail');
        setActiveSlug(slug);
      } else if (['services', 'os', 'case-studies', 'blog', 'about', 'contact', 'privacy', 'terms', 'cookies'].includes(hash)) {
        if (['privacy', 'terms', 'cookies'].includes(hash)) {
          setCurrentRoute('legal');
          setLegalTab(hash as 'privacy' | 'terms' | 'cookies');
        } else {
          setCurrentRoute(hash);
        }
      }
    };

    syncRouteFromHash();
    window.addEventListener('hashchange', syncRouteFromHash);
    return () => window.removeEventListener('hashchange', syncRouteFromHash);
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('hm_theme', next ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  const handleToggleLang = () => {
    setLang((prev) => {
      const next = prev === 'en' ? 'es' : 'en';
      localStorage.setItem('hm_lang', next);
      return next;
    });
  };

  const handleNavigate = (route: string, slug?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (route === 'legal') {
      setCurrentRoute('legal');
      if (slug && ['privacy', 'terms', 'cookies'].includes(slug)) {
        setLegalTab(slug as 'privacy' | 'terms' | 'cookies');
      }
      window.location.hash = slug || 'privacy';
      return;
    }

    if (route === 'service-detail' && slug) {
      setActiveSlug(slug);
      setCurrentRoute('service-detail');
      window.location.hash = `service-${slug}`;
      return;
    }

    setCurrentRoute(route);
    window.location.hash = route === 'home' ? '' : route;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-[#4F7FFF]/30 selection:text-white transition-colors duration-300">
      {/* Dynamic SEO, Meta Tags & Schema.org JSON-LD */}
      <DynamicSEO
        currentRoute={currentRoute}
        activeSlug={activeSlug}
        lang={lang}
        legalTab={legalTab}
      />

      {/* Reading Scroll Progress Bar for Long-Form Content */}
      <ScrollProgressBar
        currentRoute={currentRoute}
        lang={lang}
      />

      {/* Sticky Glassmorphism Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        lang={lang}
        onToggleLang={handleToggleLang}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Content View Container */}
      <main className="flex-grow">
        <Suspense fallback={<PageLoadingFallback />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute + (currentRoute === 'service-detail' ? `-${activeSlug}` : '') + (currentRoute === 'legal' ? `-${legalTab}` : '')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentRoute === 'home' && (
                <HomePage onNavigate={handleNavigate} lang={lang} />
              )}

              {currentRoute === 'services' && (
                <ServicesPage onNavigate={handleNavigate} lang={lang} />
              )}

              {currentRoute === 'service-detail' && (
                <ServiceDetailPage
                  slug={activeSlug}
                  onNavigate={handleNavigate}
                  lang={lang}
                />
              )}

              {currentRoute === 'os' && (
                <HollowmoonOSPage onNavigate={handleNavigate} lang={lang} />
              )}

              {currentRoute === 'case-studies' && (
                <CaseStudiesPage onNavigate={handleNavigate} lang={lang} />
              )}

              {currentRoute === 'blog' && (
                <BlogPage onNavigate={handleNavigate} lang={lang} />
              )}

              {currentRoute === 'about' && (
                <AboutPage onNavigate={handleNavigate} lang={lang} />
              )}

              {currentRoute === 'contact' && (
                <ContactPage onNavigate={handleNavigate} lang={lang} />
              )}

              {currentRoute === 'legal' && (
                <LegalPage
                  initialTab={legalTab}
                  onNavigate={handleNavigate}
                  lang={lang}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Modern High-Contrast Footer */}
      <Footer onNavigate={handleNavigate} lang={lang} />

      {/* Global Cmd+K Search Command Palette (Loaded on demand) */}
      <Suspense fallback={null}>
        {searchOpen && (
          <CommandMenu
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
            onNavigate={handleNavigate}
            lang={lang}
          />
        )}
      </Suspense>

      {/* Multimodal Voice-Enabled Virtual Business Development AI Concierge (AURA) */}
      <Suspense fallback={null}>
        <AuraConcierge
          onNavigate={handleNavigate}
          lang={lang}
          onToggleLang={handleToggleLang}
        />
      </Suspense>
    </div>
  );
}
