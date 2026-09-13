import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Layout, Smartphone, Cpu, Layers, Cloud, BookOpen, FileText } from 'lucide-react';
import { servicesData, caseStudiesData, blogPostsData, hollowmoonOSNodes } from '../../data/sitemapData';
import { Language } from '../../types';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose, onNavigate, lang }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or trigger
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredServices = servicesData.filter(
    (s) =>
      s.title.toLowerCase().includes(normalizedQuery) ||
      s.shortDesc.toLowerCase().includes(normalizedQuery) ||
      s.category.toLowerCase().includes(normalizedQuery)
  );

  const filteredCaseStudies = caseStudiesData.filter(
    (c) =>
      c.title.toLowerCase().includes(normalizedQuery) ||
      c.client.toLowerCase().includes(normalizedQuery) ||
      c.industry.toLowerCase().includes(normalizedQuery)
  );

  const filteredPosts = blogPostsData.filter(
    (p) =>
      p.title.toLowerCase().includes(normalizedQuery) ||
      p.excerpt.toLowerCase().includes(normalizedQuery)
  );

  const handleSelect = (route: string, slug?: string) => {
    onNavigate(route, slug);
    onClose();
    setQuery('');
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout': return <Layout className="w-4 h-4 text-[#4F7FFF]" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4 text-[#4F7FFF]" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-[#4F7FFF]" />;
      case 'Layers': return <Layers className="w-4 h-4 text-[#4F7FFF]" />;
      case 'Cloud': return <Cloud className="w-4 h-4 text-[#4F7FFF]" />;
      default: return <FileText className="w-4 h-4 text-[#4F7FFF]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-macOS-lift overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-background/50">
          <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            placeholder={lang === 'es' ? 'Buscar servicios, casos de éxito, artículos o módulos...' : 'Search services, case studies, insights, or OS modules...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 p-1 text-muted-foreground hover:text-foreground rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Quick Links */}
          {!query && (
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 px-2">
                {lang === 'es' ? 'Secciones Rápidas' : 'Quick Navigation'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelect('services')}
                  className="flex items-center justify-between p-2.5 rounded-xl text-sm text-foreground hover:bg-secondary/70 transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#4F7FFF]" />
                    {lang === 'es' ? 'Todos los Servicios' : 'All Capabilities'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleSelect('os')}
                  className="flex items-center justify-between p-2.5 rounded-xl text-sm text-foreground hover:bg-secondary/70 transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#4F7FFF]" />
                    Hollowmoon OS
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleSelect('case-studies')}
                  className="flex items-center justify-between p-2.5 rounded-xl text-sm text-foreground hover:bg-secondary/70 transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#4F7FFF]" />
                    {lang === 'es' ? 'Casos de Éxito' : 'Case Studies'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleSelect('contact')}
                  className="flex items-center justify-between p-2.5 rounded-xl text-sm text-foreground hover:bg-secondary/70 transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#4F7FFF]" />
                    {lang === 'es' ? 'Agendar Consulta' : 'Strategy Session'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          )}

          {/* Services */}
          {filteredServices.length > 0 && (
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 px-2">
                {lang === 'es' ? 'Servicios & Soluciones' : 'Services & Solutions'}
              </p>
              <div className="space-y-1">
                {filteredServices.map((service) => (
                  <button
                    key={service.slug}
                    onClick={() => handleSelect('service-detail', service.slug)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-sm text-foreground hover:bg-secondary/80 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-[#4F7FFF]/10 shrink-0">
                        {getServiceIcon(service.icon)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground group-hover:text-[#4F7FFF] transition-colors">
                          {service.title}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {service.tagline}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Case Studies */}
          {filteredCaseStudies.length > 0 && (
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 px-2">
                {lang === 'es' ? 'Casos de Éxito' : 'Case Studies'}
              </p>
              <div className="space-y-1">
                {filteredCaseStudies.map((study) => (
                  <button
                    key={study.id}
                    onClick={() => handleSelect('case-studies')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-sm text-foreground hover:bg-secondary/80 transition-colors text-left group"
                  >
                    <div>
                      <div className="font-medium text-foreground group-hover:text-[#4F7FFF] transition-colors">
                        {study.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {study.client} • {study.industry}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Blog / Insights */}
          {filteredPosts.length > 0 && (
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 px-2">
                {lang === 'es' ? 'Artículos & Pensamiento' : 'Articles & Insights'}
              </p>
              <div className="space-y-1">
                {filteredPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => handleSelect('blog')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-sm text-foreground hover:bg-secondary/80 transition-colors text-left group"
                  >
                    <div>
                      <div className="font-medium text-foreground group-hover:text-[#4F7FFF] transition-colors">
                        {post.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {post.category} • {post.readTime}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {query &&
            filteredServices.length === 0 &&
            filteredCaseStudies.length === 0 &&
            filteredPosts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {lang === 'es'
                  ? 'No se encontraron resultados para "' + query + '"'
                  : 'No results found for "' + query + '"'}
              </div>
            )}
        </div>

        <div className="px-4 py-2.5 bg-secondary/40 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#4F7FFF]">Hollowmoon DS Search Engine</span>
        </div>
      </div>
    </div>
  );
};
