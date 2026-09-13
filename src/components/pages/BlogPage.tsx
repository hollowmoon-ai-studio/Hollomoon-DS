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
            className="flex flex-col justify-between hover:shadow-macOS-lift hover:scale-[1.01] hover:border-[#4F7FFF]/40 transition-all duration-300 group cursor-pointer"
            onClick={() => setSelectedArticle(post)}
          >
            <CardHeader>
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-3">
                <Badge variant="secondary" className="text-[10px]">
                  {post.category}
                </Badge>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#4F7FFF]" />
                  {post.readTime}
                </span>
              </div>

              <CardTitle className="group-hover:text-[#4F7FFF] transition-colors text-lg sm:text-xl">
                {post.title}
              </CardTitle>
              <CardDescription className="pt-2 line-clamp-3">
                {post.excerpt}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
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

            <CardFooter className="pt-4 border-t border-border/50 flex items-center justify-between text-xs">
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

          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-macOS-lift z-10 animate-in fade-in zoom-in-95 duration-200 space-y-6">
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
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
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

            <div className="space-y-4">
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center gap-3 pt-2 text-xs font-mono text-muted-foreground">
                <span className="font-semibold text-foreground">{selectedArticle.author.name}</span>
                <span>•</span>
                <span>{selectedArticle.author.role}</span>
              </div>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-4 text-base text-foreground/90 leading-relaxed font-sans pt-4 border-t border-border/60">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
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
                className="text-xs px-5 py-2 cursor-pointer"
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
