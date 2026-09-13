import { type Variants } from 'motion/react';

// Apple-inspired optical timing constants
export const appleEase = [0.16, 1, 0.3, 1] as const;
export const appleSpring = {
  type: 'spring',
  stiffness: 300,
  damping: 26,
} as const;

// Viewport trigger settings for scroll animations (clean, fires once, smooth threshold)
export const defaultViewport = {
  once: true,
  amount: 0.2,
} as const;

// Container variants with customizable stagger
export const staggerContainer = (
  staggerChildren = 0.08,
  delayChildren = 0.05
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Subtle fade-in up for cards, list items, and section headings
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Subtle fade-in without vertical shift
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
};

// Scale-fade for badges, popovers, and indicators
export const scaleFadeIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Micro-interaction props for cards
export const cardHoverMotion = {
  whileHover: {
    y: -4,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  whileTap: {
    scale: 0.99,
  },
};

// Micro-interaction props for buttons and clickable chips
export const buttonTapMotion = {
  whileHover: {
    scale: 1.015,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  whileTap: {
    scale: 0.97,
    transition: { duration: 0.1, ease: 'easeIn' },
  },
};
