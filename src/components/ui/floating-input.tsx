import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, icon, type, value, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = value !== undefined && value !== "";

    return (
      <div className="relative">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-lg border border-input bg-secondary/50 px-4 py-3 text-sm",
              "transition-all duration-200",
              "placeholder:text-transparent",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "hover:border-muted-foreground/50",
              icon && "pl-10",
              (isFocused || hasValue) && "pt-5 pb-1",
              className
            )}
            ref={ref}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={label}
            {...props}
          />
          <AnimatePresence>
            <motion.label
              initial={false}
              animate={{
                top: isFocused || hasValue ? "6px" : "50%",
                y: isFocused || hasValue ? 0 : "-50%",
                fontSize: isFocused || hasValue ? "10px" : "14px",
                color: isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "absolute pointer-events-none font-medium",
                icon ? "left-10" : "left-4"
              )}
            >
              {label}
            </motion.label>
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
