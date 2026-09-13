import React, { useEffect, useRef } from 'react';

interface AuraAudioVisualizerProps {
  isActive: boolean; // whether speaking, listening, or thinking
  isListening: boolean;
  isSpeaking: boolean;
  isThinking?: boolean;
  barCount?: number;
}

export const AuraAudioVisualizer: React.FC<AuraAudioVisualizerProps> = ({
  isActive,
  isListening,
  isSpeaking,
  isThinking = false,
  barCount = 28,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const spacing = 3;
      const totalSpacing = spacing * (barCount - 1);
      const barWidth = Math.max(2, (width - totalSpacing) / barCount);

      phase += isActive ? 0.08 : 0.02;

      for (let i = 0; i < barCount; i++) {
        // Calculate dynamic height based on sine wave harmonics
        let amplitude = 0.15; // idle ambient wave
        if (isSpeaking) {
          amplitude = 0.35 + 0.45 * Math.sin(phase * 2 + i * 0.4) * Math.cos(phase + i * 0.2);
        } else if (isListening) {
          amplitude = 0.4 + 0.5 * Math.abs(Math.sin(phase * 3 + i * 0.6));
        } else if (isThinking) {
          amplitude = 0.25 + 0.35 * Math.sin(phase * 1.8 + i * 0.5) * Math.sin(phase * 0.9 + i * 0.2);
        }

        amplitude = Math.max(0.08, Math.min(0.95, Math.abs(amplitude)));
        const barHeight = amplitude * height;

        const x = i * (barWidth + spacing);
        const y = (height - barHeight) / 2;

        // Gradient for bars
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isListening) {
          // Emerald glow when listening
          grad.addColorStop(0, '#34D399');
          grad.addColorStop(1, '#059669');
        } else if (isSpeaking) {
          // Aurora Blue glow when speaking
          grad.addColorStop(0, '#7B9EFF');
          grad.addColorStop(1, '#4F7FFF');
        } else if (isThinking) {
          // Sky Cyan / Aurora shimmer when thinking
          grad.addColorStop(0, '#38BDF8');
          grad.addColorStop(0.5, '#818CF8');
          grad.addColorStop(1, '#4F7FFF');
        } else {
          // Neutral soft graphite/silver
          grad.addColorStop(0, '#8C909E');
          grad.addColorStop(1, '#4A4D57');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        // Rounded pills
        const radius = barWidth / 2;
        ctx.roundRect(x, y, barWidth, barHeight, radius);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, isListening, isSpeaking, barCount]);

  return (
    <div className="flex items-center justify-center w-full h-8 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={240}
        height={32}
        className="w-full max-w-[240px] h-8 block"
      />
    </div>
  );
};
