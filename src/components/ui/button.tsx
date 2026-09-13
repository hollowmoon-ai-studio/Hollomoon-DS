import * as React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'accent' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none';

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
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.018 }}
        whileTap={{ scale: 0.975 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
