import React, { useState } from 'react';
import { ArrowRight, BookOpen, Clock, Tag, X, Share2, Check, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { blogPostsData } from '../../data/sitemapData';
import { Language, BlogPost } from '../../types';

interface BlogPageProps {
  onNavigate: (route: string, slug?: string) => void;
  lang: Language;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, lang }) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [copied, setCopied] = useState(false);

  const tags = ['all', 'Autonomous AI', 'Architecture', 'UI/UX', 'Performance', 'Panama'];

  const filteredPosts = blogPostsData.filter((post) => {
    if (selectedTag === 'all') return true;
    return post.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
  });

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono tracking-widest text-[#4F7FFF] uppercase font-semibold">
          {lang === 'es' ? 'INVESTIGACIÓN & PENSAMIENTO' : 'RESEARCH & INSIGHTS'}
        </span>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-foreground tracking-tight">
          {lang === 'es' ? 'Artículos de Ingeniería Digital' : 'Engineering & Systems Insights'}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {lang === 'es'
            ? 'Perspectivas técnicas sobre agentes de IA, rendimiento web con latencia cero y arquitectura empresarial.'
            : 'Technical essays on autonomous AI pipelines, sub-second web performance, and modern enterprise modernization.'}
        </p>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
              selectedTag === tag
                ? 'bg-foreground text-background font-semibold shadow-sm'
                : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {tag === 'all' ? (lang === 'es' ? 'Todos los Temas' : 'All Topics') : tag}
          </button>
        ))}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            className="flex flex-col justify-between hover:shadow-macOS-lift hover:scale-[1.01] hover:border-[#4F7FFF]/40 transition-all duration-300 group cursor-pointer overflow-hidden p-0"
            onClick={() => setSelectedArticle(post)}
          >
            {/* Post Featured Image Banner */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary/40 border-b border-border/50">
              <img
                src={post.featuredImage}
                alt={post.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-50 transition-opacity" />
              
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="text-[10px] font-mono bg-black/60 backdrop-blur-md text-white border-white/20">
                  {post.category}
                </Badge>
              </div>

              {post.keyMetric && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{post.keyMetric.label}: <strong className="text-white">{post.keyMetric.value}</strong></span>
                </div>
              )}
            </div>

            <CardHeader className="p-6 pb-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                <span className="text-[11px]">{post.date}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#4F7FFF]" />
                  {post.readTime}
                </span>
              </div>

              <CardTitle className="group-hover:text-[#4F7FFF] transition-colors text-lg sm:text-xl leading-snug">
                {post.title}
              </CardTitle>
              <CardDescription className="pt-2 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 py-2 space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-mono text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">{post.author.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{post.author.role}</span>
              </div>
              <span className="text-[#4F7FFF] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Article →
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedArticle(null)}
          />

          <div
            data-scroll-container="reading-modal"
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-macOS-lift z-10 animate-in fade-in zoom-in-95 duration-200 space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Badge variant="accent" className="font-mono text-xs">
                  {selectedArticle.category}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  {selectedArticle.readTime} • {selectedArticle.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  title="Share Article Link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-muted-foreground" />}
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Featured Image Banner */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border/70 shadow-sm bg-secondary/30">
              <img
                src={selectedArticle.featuredImage}
                alt={selectedArticle.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {selectedArticle.caption && (
                <div className="absolute bottom-3 left-4 right-4 text-[11px] font-mono text-white/80 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  {selectedArticle.caption}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight leading-tight">
                {selectedArticle.title}
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono text-muted-foreground border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{selectedArticle.author.name}</span>
                  <span>•</span>
                  <span>{selectedArticle.author.role}</span>
                </div>
                {selectedArticle.keyMetric && (
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                    {selectedArticle.keyMetric.label}: {selectedArticle.keyMetric.value}
                  </span>
                )}
              </div>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-4 text-base text-foreground/90 leading-relaxed font-sans pt-2">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}

              {/* Appropriate Inline Architectural Breakdown Card */}
              <div className="p-4 rounded-2xl bg-secondary/40 border border-[#4F7FFF]/30 space-y-2 mt-4 font-mono text-xs">
                <div className="flex items-center gap-2 text-[#4F7FFF] font-semibold">
                  <BookOpen className="w-4 h-4" />
                  <span>STUDIO ARCHITECTURAL SPECIFICATION</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {selectedArticle.id === 'death-of-unintelligent-saas' &&
                    'Autonomous multi-agent pipelines decouple presentation from execution, delegating clerical transcription to deterministic Gemini reasoning models running behind zero-trust audit proxies.'}
                  {selectedArticle.id === 'sub-100ms-web-architecture' &&
                    'Optical layout discipline leverages strict 1.25+ typographical step ratios, computed outer/inner corner radius formulas, and CDN edge-cached micro-frontends with sub-64ms global time-to-interactive.'}
                  {selectedArticle.id === 'modernizing-latam-enterprise' &&
                    'Panama serves as the premier hemispheric bridge for fintech and logistics, delivering bilingual automated customs pipelines and SOC2-aligned banking portals with resilient multi-region fallbacks.'}
                </p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-secondary text-xs font-mono text-muted-foreground">
                    #{t}
                  </span>
                ))}
              </div>

              <Button
                onClick={() => {
                  setSelectedArticle(null);
                  onNavigate('contact');
                }}
                className="text-xs px-5 py-2 cursor-pointer bg-[#4F7FFF] hover:bg-[#3D6CE6] text-white shadow-sm"
              >
                Discuss Implementation With Author
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
