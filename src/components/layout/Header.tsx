import React, { useState } from 'react';
import { Moon, Sun, Search, Menu, X, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Language } from '../../types';
import { siteTranslations } from '../../data/sitemapData';

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
  const t = siteTranslations[lang].nav;

  const navLinks = [
    { id: 'home', label: lang === 'es' ? 'Inicio' : 'Overview', route: 'home' },
    { id: 'services', label: t.services, route: 'services' },
    { id: 'os', label: t.os, route: 'os' },
    { id: 'case-studies', label: t.caseStudies, route: 'case-studies' },
    { id: 'insights', label: t.insights, route: 'blog' },
    { id: 'about', label: t.about, route: 'about' },
    { id: 'contact', label: t.contact, route: 'contact' }
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 glass-nav border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 border border-border/50 bg-secondary/30 px-3 py-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route || (link.route === 'services' && currentRoute === 'service-detail');
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
        <div className="sm:hidden border-b border-border bg-card px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
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
              className="w-full ml-3 text-xs"
            >
              {t.bookCall}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
