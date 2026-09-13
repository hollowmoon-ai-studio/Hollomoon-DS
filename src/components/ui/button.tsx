import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'accent' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]';

    const variants = {
      default:
        'bg-[#4F7FFF] text-white hover:bg-[#3D6CE6] shadow-sm hover:shadow-aurora-glow rounded-md',
      accent:
        'bg-foreground text-background hover:opacity-90 rounded-md font-semibold',
      outline:
        'border border-border/80 bg-transparent hover:bg-secondary/60 text-foreground rounded-md',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md',
      ghost:
        'hover:bg-secondary/60 text-foreground hover:text-foreground rounded-md',
      link:
        'text-[#4F7FFF] underline-offset-4 hover:underline'
    };

    const sizes = {
      default: 'h-10 px-5 py-2.5',
      sm: 'h-8 px-3.5 text-xs',
      lg: 'h-12 px-7 text-base',
      icon: 'h-9 w-9 p-0'
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
