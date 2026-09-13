import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CommandMenu } from './components/layout/CommandMenu';
import { HomePage } from './components/pages/HomePage';
import { ServicesPage } from './components/pages/ServicesPage';
import { ServiceDetailPage } from './components/pages/ServiceDetailPage';
import { HollowmoonOSPage } from './components/pages/HollowmoonOSPage';
import { CaseStudiesPage } from './components/pages/CaseStudiesPage';
import { BlogPage } from './components/pages/BlogPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { LegalPage } from './components/pages/LegalPage';
import { AuraConcierge } from './components/concierge/AuraConcierge';
import { Language } from './types';

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

    // Check URL hash or path for initial route
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) {
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
    }
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
      </main>

      {/* Modern High-Contrast Footer */}
      <Footer onNavigate={handleNavigate} lang={lang} />

      {/* Global Cmd+K Search Command Palette */}
      <CommandMenu
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
        lang={lang}
      />

      {/* Multimodal Voice-Enabled Virtual Business Development AI Concierge (AURA) */}
      <AuraConcierge
        onNavigate={handleNavigate}
        lang={lang}
        onToggleLang={handleToggleLang}
      />
    </div>
  );
}
