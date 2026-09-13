import React, { useState } from 'react';
import { ArrowRight, Layout, Smartphone, Cpu, Layers, Cloud, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { servicesData, siteTranslations } from '../../data/sitemapData';
import { Language } from '../../types';

interface ServicesOverviewProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const ServicesOverview: React.FC<ServicesOverviewProps> = ({ onNavigate, lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = siteTranslations[lang].servicesOverview;

  const categories = [
    { id: 'all', label: lang === 'es' ? 'Todas las Capacidades' : 'All Capabilities' },
    { id: 'web', label: lang === 'es' ? 'Web & Flagships' : 'Web & Flagships' },
    { id: 'app', label: lang === 'es' ? 'Apps Móviles' : 'Mobile Apps' },
    { id: 'ai', label: lang === 'es' ? 'Automatización IA' : 'AI Automation' },
    { id: 'system', label: lang === 'es' ? 'Sistemas & Cloud' : 'Systems & Cloud' }
  ];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout': return <Layout className="w-5 h-5 text-[#4F7FFF]" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-[#4F7FFF]" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-[#4F7FFF]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#4F7FFF]" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-[#4F7FFF]" />;
      default: return <Sparkles className="w-5 h-5 text-[#4F7FFF]" />;
    }
  };

  const filteredServices = servicesData.filter((service) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'web' && service.slug === 'web-design-development') return true;
    if (selectedCategory === 'app' && service.slug === 'app-development') return true;
    if (selectedCategory === 'ai' && service.slug === 'ai-automation') return true;
    if (selectedCategory === 'system' && (service.slug === 'hollowmoon-os' || service.slug === 'cloud-infrastructure')) return true;
    return true;
  });

  return (
    <section className="py-24 bg-card/30 border-t border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
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

          <Button
            variant="outline"
            onClick={() => onNavigate('services')}
            className="self-start md:self-auto text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-foreground text-background font-semibold shadow-sm'
                  : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Modular Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredServices.map((service) => (
            <Card
              key={service.slug}
              className="flex flex-col justify-between hover:shadow-macOS-lift hover:scale-[1.01] hover:border-[#4F7FFF]/40 transition-all duration-300 group cursor-pointer"
              onClick={() => onNavigate('service-detail', service.slug)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#4F7FFF]/10 border border-[#4F7FFF]/20 flex items-center justify-center group-hover:bg-[#4F7FFF]/20 transition-colors">
                    {getServiceIcon(service.icon)}
                  </div>
                  <Badge variant="accent">
                    {service.metrics[0].value}
                  </Badge>
                </div>

                <CardTitle className="group-hover:text-[#4F7FFF] transition-colors">
                  {service.title}
                </CardTitle>
                <p className="text-xs font-mono text-[#4F7FFF] tracking-tight">
                  {service.tagline}
                </p>
                <CardDescription className="pt-2">
                  {service.shortDesc}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 2 Key Feature Bullet Points */}
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  {service.features.slice(0, 2).map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-mono text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                  {service.techStack.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-secondary text-[10px] font-mono text-muted-foreground">
                      +{service.techStack.length - 3}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground group-hover:text-[#4F7FFF] transition-colors flex items-center gap-1">
                  {t.learnMore}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {service.metrics[1].label}: <span className="font-semibold text-foreground">{service.metrics[1].value}</span>
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
