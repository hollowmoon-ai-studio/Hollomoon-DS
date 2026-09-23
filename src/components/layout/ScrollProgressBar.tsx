import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../../types';

interface ScrollProgressBarProps {
  currentRoute: string;
  lang?: Language;
  /** Explicitly force enable or disable on certain views */
  forceActive?: boolean;
}

// Routes designated as long-form reading content
const LONG_FORM_ROUTES = new Set([
  'blog',
  'case-studies',
  'service-detail',
  'legal',
  'os'
]);

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  currentRoute,
  lang = 'en',
  forceActive
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const activeContainerRef = useRef<HTMLElement | null>(null);

  const isLongFormRoute = forceActive || LONG_FORM_ROUTES.has(currentRoute);

  const updateProgress = useCallback(() => {
    let currentScroll = 0;
    let maxScroll = 0;

    // Check if an article modal or specialized scroll container is active
    const modalContainer = document.querySelector('[data-scroll-container="reading-modal"]') as HTMLElement | null;
    if (modalContainer && modalContainer.scrollHeight > modalContainer.clientHeight) {
      activeContainerRef.current = modalContainer;
      currentScroll = modalContainer.scrollTop;
      maxScroll = modalContainer.scrollHeight - modalContainer.clientHeight;
    } else {
      activeContainerRef.current = null;
      currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
      maxScroll = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
    }

    if (maxScroll <= 10) {
      setProgress(0);
      return;
    }

    const calculatedProgress = Math.min(Math.max((currentScroll / maxScroll) * 100, 0), 100);
    setProgress(calculatedProgress);
  }, []);

  useEffect(() => {
    // Reset scroll progress upon route change
    setProgress(0);
    setIsScrolling(false);

    // Only activate for long-form reading pages
    if (!isLongFormRoute) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const handleScroll = (e: Event) => {
      // Trigger update via requestAnimationFrame for 60/120fps GPU performance
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        updateProgress();
      });

      // Show reading indicator pill during scroll activity
      setIsScrolling(true);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      idleTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1400);
    };

    // Attach scroll listener with capture to detect both window and modal scrolling
    document.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    // Initial check
    updateProgress();

    return () => {
      document.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('resize', updateProgress);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [currentRoute, isLongFormRoute, updateProgress]);

  // Click on the progress bar track to smoothly jump to that section of the document
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;

    if (activeContainerRef.current) {
      const targetScroll = clickRatio * (activeContainerRef.current.scrollHeight - activeContainerRef.current.clientHeight);
      activeContainerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: clickRatio * maxScroll, behavior: 'smooth' });
    }
  };

  if (!isVisible) {
    return null;
  }

  const roundedProgress = Math.round(progress);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-1 group cursor-pointer select-none"
      onClick={handleTrackClick}
      title={`${lang === 'es' ? 'Progreso de lectura' : 'Reading progress'}: ${roundedProgress}%`}
      role="progressbar"
      aria-valuenow={roundedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={lang === 'es' ? 'Progreso de lectura' : 'Reading progress'}
    >
      {/* Background Track */}
      <div className="absolute inset-0 bg-white/[0.04] dark:bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 group-hover:h-1.5" />

      {/* Dynamic Progress Fill with Apple/Linear-grade Gradient */}
      <div
        className="h-full bg-gradient-to-r from-[#4F7FFF] via-[#638EFF] to-[#A07CFE] relative transition-transform duration-75 ease-out origin-left group-hover:h-1.5"
        style={{
          transform: `scaleX(${progress / 100})`,
          boxShadow: progress > 1 ? '0 0 10px rgba(79, 127, 255, 0.7), 0 0 4px rgba(160, 124, 254, 0.9)' : 'none',
        }}
      >
        {/* Leading Tip Glow & Pulse Dot */}
        {progress > 1 && progress < 99.5 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_14px_#4F7FFF] pointer-events-none" />
        )}
      </div>

      {/* Floating Reading Percentage Pill (appears smoothly while actively scrolling or hovering) */}
      <div
        className={`fixed top-4 right-4 sm:right-8 z-[61] transition-all duration-300 pointer-events-none ${
          isScrolling || progress > 99
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2'
        }`}
      >
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#121217]/90 dark:bg-[#0A0A0C]/90 text-white backdrop-blur-xl border border-white/10 shadow-xl shadow-black/40 text-[11px] font-mono tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F7FFF] animate-pulse" />
          <span className="text-white/70">
            {lang === 'es' ? 'Lectura' : 'Reading'}
          </span>
          <span className="font-bold text-white tabular-nums">
            {roundedProgress}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressBar;
