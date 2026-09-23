import React from 'react';

interface PageLoadingFallbackProps {
  label?: string;
}

export const PageLoadingFallback: React.FC<PageLoadingFallbackProps> = ({
  label = 'Loading view...'
}) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-24 select-none">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing halo */}
        <div className="absolute w-16 h-16 rounded-full bg-[#4F7FFF]/20 blur-xl animate-pulse" />
        
        {/* Rotating ring */}
        <div className="w-10 h-10 rounded-full border-2 border-border/40 border-t-[#4F7FFF] animate-spin" />
        
        {/* Center dot */}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-[#4F7FFF] shadow-[0_0_8px_#4F7FFF]" />
      </div>

      <p className="mt-6 text-xs font-mono tracking-widest text-muted-foreground uppercase animate-pulse">
        {label}
      </p>
    </div>
  );
};

export default PageLoadingFallback;
