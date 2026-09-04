import * as React from "react";
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface MotionContainerProps extends HTMLMotionProps<"div"> {
  staggerChildren?: number | undefined;
  delayChildren?: number | undefined;
  className?: string | undefined;
  children: React.ReactNode;
}

/**
 * MotionContainer orchestrates staggered entrance animations for child `MotionItem`s.
 * Honors user reduced-motion system preferences.
 */
export const MotionContainer = React.forwardRef<HTMLDivElement, MotionContainerProps>(
  (
    {
      children,
      className,
      staggerChildren = 0.06,
      delayChildren = 0,
      variants,
      ...props
    },
    ref,
  ) => {
    const shouldReduceMotion = useReducedMotion();

    const containerVariants: Variants = React.useMemo(() => {
      if (variants) return variants;

      return {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : staggerChildren,
            delayChildren: shouldReduceMotion ? 0 : delayChildren,
          },
        },
      };
    }, [variants, shouldReduceMotion, staggerChildren, delayChildren]);

    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
MotionContainer.displayName = "MotionContainer";

export interface MotionItemProps extends HTMLMotionProps<"div"> {
  className?: string | undefined;
  children: React.ReactNode;
}

/**
 * MotionItem provides a smooth fade-in-up transition when nested inside MotionContainer.
 * Uses cubic-bezier(0.16, 1, 0.3, 1) ease for organic fluid feel.
 */
export const MotionItem = React.forwardRef<HTMLDivElement, MotionItemProps>(
  ({ children, className, variants, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    const itemVariants: Variants = React.useMemo(() => {
      if (variants) return variants;

      if (shouldReduceMotion) {
        return {
          hidden: { opacity: 0, y: 0 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.15 },
          },
        };
      }

      return {
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      };
    }, [variants, shouldReduceMotion]);

    return (
      <motion.div
        ref={ref}
        variants={itemVariants}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
MotionItem.displayName = "MotionItem";
