import { motion } from "framer-motion";
import { PenLine, Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full py-6 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 glow-border">
            <PenLine className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Me<span className="text-gradient">Sign</span>
            </h1>
            <p className="text-xs text-muted-foreground">Email Signature Generator</p>
          </div>
        </motion.div>

        {/* Pro Badge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">Free Forever</span>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
