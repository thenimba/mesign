import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShinyButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton = ({ children, className, ...props }: ShinyButtonProps) => {
  return (
    <motion.button
      className={cn(
        "relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-lg",
        "bg-primary px-6 font-medium text-primary-foreground",
        "transition-all duration-300",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        "before:translate-x-[-200%] before:animate-shimmer",
        "hover:shadow-glow-lg hover:scale-[1.02]",
        "active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
