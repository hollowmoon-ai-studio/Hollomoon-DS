import React, { useEffect, useRef } from 'react';

interface AuraThinkingWaveformProps {
  isVoiceProcessing?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export const AuraThinkingWaveform: React.FC<AuraThinkingWaveformProps> = ({
  isVoiceProcessing = true,
  className = '',
  width = 380,
  height = 56,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Particle nodes along the wave
    const particleCount = 12;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      xRatio: (i + 0.5) / particleCount,
      speed: 0.003 + Math.random() * 0.002,
      size: 2 + Math.random() * 1.5,
      alpha: 0.4 + Math.random() * 0.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      step += 0.045;
      const centerY = height / 2;

      // Draw background subtle grid lines for tech blueprint feel
      ctx.strokeStyle = 'rgba(79, 127, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Wave parameters
      const waves = [
        {
          color: 'rgba(79, 127, 255, 0.85)', // Aurora Blue
          glow: 'rgba(79, 127, 255, 0.4)',
          freq: 0.022,
          speed: 1.2,
          amp: height * 0.32,
          phaseOffset: 0,
          lineWidth: 2.5,
        },
        {
          color: 'rgba(56, 189, 248, 0.75)', // Sky / Cyan
          glow: 'rgba(56, 189, 248, 0.3)',
          freq: 0.034,
          speed: -1.4,
          amp: height * 0.24,
          phaseOffset: Math.PI * 0.4,
          lineWidth: 1.8,
        },
        {
          color: isVoiceProcessing ? 'rgba(52, 211, 153, 0.8)' : 'rgba(217, 219, 225, 0.5)', // Emerald for voice, Silver for standard
          glow: isVoiceProcessing ? 'rgba(52, 211, 153, 0.35)' : 'rgba(217, 219, 225, 0.2)',
          freq: 0.016,
          speed: 0.8,
          amp: height * 0.18,
          phaseOffset: Math.PI * 0.8,
          lineWidth: 1.5,
        },
      ];

      // Draw each wave
      waves.forEach((w) => {
        ctx.save();
        ctx.shadowColor = w.glow;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.lineWidth;
        ctx.beginPath();

        // Organic amplitude breathing envelope
        const envelope = 0.85 + 0.15 * Math.sin(step * 0.8);

        for (let x = 0; x <= width; x += 2) {
          // Attenuate wave at edges (Hanning-like window) so it blends cleanly to 0
          const windowFactor = Math.sin((x / width) * Math.PI);
          const y =
            centerY +
            Math.sin(x * w.freq + step * w.speed + w.phaseOffset) *
              Math.cos(x * 0.01 + step * 0.5) *
              w.amp *
              windowFactor *
              envelope;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.restore();
      });

      // Draw floating synapse particles riding the primary wave
      particles.forEach((p) => {
        p.xRatio = (p.xRatio + p.speed) % 1;
        const px = p.xRatio * width;
        const windowFactor = Math.sin(p.xRatio * Math.PI);
        const py =
          centerY +
          Math.sin(px * 0.022 + step * 1.2) *
            Math.cos(px * 0.01 + step * 0.5) *
            (height * 0.32) *
            windowFactor;

        ctx.save();
        ctx.shadowColor = '#4F7FFF';
        ctx.shadowBlur = 8;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * windowFactor})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVoiceProcessing, width, height]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="block max-w-full"
      />
    </div>
  );
};
