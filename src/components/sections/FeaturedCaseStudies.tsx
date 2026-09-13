import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, Quote, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { caseStudiesData, siteTranslations } from '../../data/sitemapData';
import { Language } from '../../types';

interface FeaturedCaseStudiesProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const FeaturedCaseStudies: React.FC<FeaturedCaseStudiesProps> = ({ onNavigate, lang }) => {
  const t = siteTranslations[lang].caseStudiesSection;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
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
            onClick={() => onNavigate('case-studies')}
            className="self-start md:self-auto text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{lang === 'es' ? 'Ver Todos los Casos' : 'Explore All Transformations'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudiesData.map((study) => (
            <Card
              key={study.id}
              className="flex flex-col justify-between hover:shadow-macOS-lift hover:scale-[1.01] hover:border-[#4F7FFF]/40 transition-all duration-300 group cursor-pointer"
              onClick={() => onNavigate('case-studies')}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {study.industry}
                  </Badge>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {study.location}
                  </span>
                </div>

                <p className="text-xs font-mono text-[#4F7FFF] font-semibold">
                  {study.client}
                </p>
                <CardTitle className="group-hover:text-[#4F7FFF] transition-colors text-lg md:text-xl">
                  {study.title}
                </CardTitle>
                <CardDescription className="pt-2">
                  {study.summary}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 3 Results Highlights */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-border/50 bg-secondary/20 rounded-xl px-3">
                  {study.results.map((res, i) => (
                    <div key={i} className="text-center">
                      <p className="text-base font-display font-bold text-foreground">
                        {res.metric}
                      </p>
                      <p className="text-[9px] font-mono text-muted-foreground line-clamp-1">
                        {res.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                {study.quote && (
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs italic text-muted-foreground relative">
                    <Quote className="w-3 h-3 text-[#4F7FFF] mb-1 inline mr-1 not-italic" />
                    "{study.quote.text}"
                    <p className="text-[10px] font-mono font-semibold text-foreground not-italic mt-2">
                      — {study.quote.author}, {study.quote.role}
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-[#4F7FFF]">
                <span>{lang === 'es' ? 'Ver Arquitectura Completa' : 'Inspect Architecture'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
