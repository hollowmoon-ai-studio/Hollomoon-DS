import React, { useState, useRef, useEffect } from 'react';
import {
  Moon,
  Sun,
  Search,
  Menu,
  X,
  Globe,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Layout,
  Smartphone,
  Cpu,
  Layers,
  Cloud
} from 'lucide-react';
import { Button } from '../ui/button';
import { Language } from '../../types';
import { siteTranslations, servicesData } from '../../data/sitemapData';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
  onToggleLang: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  lang,
  onToggleLang,
  isDark,
  onToggleTheme,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const t = siteTranslations[lang].nav;

  // Primary desktop nav links: Overview removed for decluttering; Hollowmoon OS nested under Services
  const primaryNavLinks = [
    { id: 'case-studies', label: t.caseStudies, route: 'case-studies' },
    { id: 'insights', label: t.insights, route: 'blog' },
    { id: 'about', label: t.about, route: 'about' },
    { id: 'contact', label: t.contact, route: 'contact' }
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleNavClick = (route: string, slug?: string) => {
    onNavigate(route, slug);
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleMouseEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    setServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 220);
  };

  const isServicesActive = currentRoute === 'services' || currentRoute === 'service-detail' || currentRoute === 'os';

  const serviceIconMap: Record<string, React.ReactNode> = {
    'web-design-development': <Layout className="w-4 h-4 text-[#4F7FFF]" />,
    'app-development': <Smartphone className="w-4 h-4 text-[#4F7FFF]" />,
    'ai-automation': <Cpu className="w-4 h-4 text-[#4F7FFF]" />,
    'cloud-infrastructure': <Cloud className="w-4 h-4 text-[#4F7FFF]" />
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 glass-nav border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - clicking returns to home overview */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            aria-label="Hollowmoon Digital Studio Home"
          >
            <div className="relative w-9 h-9 rounded-xl bg-[#0A0A0C] border border-[#D9DBE1]/20 dark:border-white/20 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-[#4F7FFF]/50 transition-colors">
              {/* Crescent Hollowmoon Emblem */}
              <div className="w-5 h-5 rounded-full border-2 border-[#D9DBE1] relative">
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0A0A0C]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4F7FFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-foreground flex items-center gap-1.5">
                Hollowmoon <span className="text-[#4F7FFF] font-mono text-sm tracking-normal">DS</span>
              </span>
              <p className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase hidden sm:block">
                Digital Studio
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links (Clean, uncrowded layout with Services Dropdown) */}
          <nav className="hidden lg:flex items-center space-x-1 border border-border/50 bg-secondary/30 px-3 py-1.5 rounded-full backdrop-blur-md">
            {/* Services Dropdown Trigger */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setServicesDropdownOpen((prev) => !prev)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isServicesActive
                    ? 'bg-foreground text-background font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
                aria-expanded={servicesDropdownOpen}
                aria-haspopup="true"
              >
                <span>{t.services}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    servicesDropdownOpen ? 'rotate-180 text-foreground' : 'text-muted-foreground'
                  }`}
                />
              </button>

              {/* Dropdown Menu Overlay */}
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-84 sm:w-96 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-macOS-lift p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Overview link */}
                  <button
                    onClick={() => handleNavClick('services')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-secondary/80 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[#4F7FFF]/10 text-[#4F7FFF]">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground group-hover:text-[#4F7FFF] transition-colors">
                          {lang === 'es' ? 'Explorar Todos los Servicios' : 'All Services Overview'}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {lang === 'es' ? 'Capacidades de transformación integral' : 'Full transformation architecture & methodology'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[#4F7FFF] group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <div className="h-px bg-border/50 my-1" />
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2.5 py-1">
                    {lang === 'es' ? 'Prácticas Especializadas & OS' : 'Practices & Operating System'}
                  </p>

                  {/* Individual Services */}
                  <div className="space-y-1">
                    {servicesData.map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => handleNavClick('service-detail', s.slug)}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-secondary/70 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-secondary text-foreground group-hover:bg-[#4F7FFF]/10 group-hover:text-[#4F7FFF] transition-colors">
                            {serviceIconMap[s.slug] || <Layout className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground group-hover:text-[#4F7FFF] transition-colors">
                              {s.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                              {s.tagline}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}

                    {/* Hollowmoon OS - Nested prominently under Services */}
                    <button
                      onClick={() => handleNavClick('os')}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left bg-gradient-to-r from-[#4F7FFF]/10 via-[#4F7FFF]/5 to-transparent hover:from-[#4F7FFF]/20 border border-[#4F7FFF]/30 transition-all group cursor-pointer mt-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#4F7FFF] text-white shadow-sm">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-foreground group-hover:text-[#4F7FFF] transition-colors">
                              Hollowmoon OS
                            </p>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#4F7FFF]/20 text-[#4F7FFF]">
                              CORE BACKBONE
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {lang === 'es' ? 'Sistema nervioso empresarial y canal de datos' : 'Bespoke enterprise autonomous nervous system'}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#4F7FFF] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Other top-level links: Case Studies, Insights, About, Contact */}
            {primaryNavLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.route)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-foreground text-background font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Actions: Search, Lang, Theme, CTA */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground bg-secondary/50 hover:bg-secondary border border-border/50 rounded-lg transition-colors cursor-pointer"
              title="Search website (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="hidden md:inline">{t.searchPrompt}</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-background border border-border rounded text-muted-foreground">
                {t.searchShortcut}
              </kbd>
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg text-foreground hover:bg-secondary/70 border border-transparent hover:border-border/60 transition-all cursor-pointer"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#4F7FFF]" />
              <span className="uppercase">{lang}</span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/70 border border-transparent hover:border-border/60 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Book Call Primary CTA */}
            <Button
              onClick={() => handleNavClick('contact')}
              className="bg-[#4F7FFF] hover:bg-[#3D6CE6] text-white shadow-sm hover:shadow-aurora-glow text-xs px-4 py-2 font-medium flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.bookCall}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg text-foreground hover:bg-secondary"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-foreground hover:bg-secondary"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-foreground hover:bg-secondary border border-border/50"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-border bg-card px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200 max-h-[80vh] overflow-y-auto">
          {/* Services Accordion */}
          <div className="rounded-xl border border-border/60 bg-secondary/20 p-2 space-y-1">
            <button
              onClick={() => setMobileServicesExpanded(!mobileServicesExpanded)}
              className="w-full flex items-center justify-between px-2 py-2 text-sm font-semibold text-foreground"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4F7FFF]" />
                <span>{t.services}</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${mobileServicesExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            {mobileServicesExpanded && (
              <div className="pl-3 space-y-1 pt-1 border-t border-border/40">
                <button
                  onClick={() => handleNavClick('services')}
                  className="w-full text-left px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground flex items-center justify-between"
                >
                  <span>{lang === 'es' ? 'Ver Todos los Servicios' : 'All Services Overview'}</span>
                  <ArrowRight className="w-3 h-3 opacity-50" />
                </button>

                {servicesData.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => handleNavClick('service-detail', s.slug)}
                    className="w-full text-left px-2 py-1.5 text-xs text-foreground/80 hover:text-[#4F7FFF] flex items-center justify-between"
                  >
                    <span>{s.title}</span>
                  </button>
                ))}

                {/* Hollowmoon OS nested under services */}
                <button
                  onClick={() => handleNavClick('os')}
                  className="w-full text-left px-2.5 py-2 mt-1 rounded-lg bg-[#4F7FFF]/10 text-[#4F7FFF] text-xs font-semibold flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Hollowmoon OS</span>
                  </span>
                  <span className="text-[9px] font-mono uppercase bg-[#4F7FFF]/20 px-1 rounded">
                    Core OS
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Other primary links */}
          <div className="space-y-1">
            {primaryNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.route)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-left ${
                  currentRoute === link.route
                    ? 'bg-[#4F7FFF]/10 text-[#4F7FFF]'
                    : 'text-foreground hover:bg-secondary/60'
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <button
              onClick={onToggleLang}
              className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-foreground bg-secondary/50 rounded-lg"
            >
              <Globe className="w-4 h-4 text-[#4F7FFF]" />
              <span>Language: {lang.toUpperCase()}</span>
            </button>

            <Button
              onClick={() => handleNavClick('contact')}
              className="w-full ml-3 text-xs bg-[#4F7FFF] hover:bg-[#3D6CE6] text-white"
            >
              {t.bookCall}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
