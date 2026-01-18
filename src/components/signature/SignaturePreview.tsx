import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignatureData } from "@/types/signature";
import { SignatureTemplate } from "./SignatureTemplate";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Copy, Check, Sun, Moon, Code, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignaturePreviewProps {
  data: SignatureData;
}

export const SignaturePreview = ({ data }: SignaturePreviewProps) => {
  const [isDarkPreview, setIsDarkPreview] = useState(true);
  const [copied, setCopied] = useState<"html" | "rich" | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const getSignatureHTML = () => {
    if (!previewRef.current) return "";
    return previewRef.current.innerHTML;
  };

  const copyRichText = async () => {
    try {
      const html = getSignatureHTML();
      const blob = new Blob([html], { type: "text/html" });
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": blob,
          "text/plain": new Blob([html], { type: "text/plain" }),
        }),
      ]);
      setCopied("rich");
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      // Fallback for browsers that don't support ClipboardItem
      const html = getSignatureHTML();
      await navigator.clipboard.writeText(html);
      setCopied("html");
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const copyRawHTML = async () => {
    const html = getSignatureHTML();
    await navigator.clipboard.writeText(html);
    setCopied("html");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Live Preview</h2>
          <p className="text-sm text-muted-foreground">See how your signature looks</p>
        </div>

        {/* Preview Mode Toggle */}
        <button
          onClick={() => setIsDarkPreview(!isDarkPreview)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            "border border-border hover:border-primary/50",
            "bg-secondary/50 hover:bg-secondary"
          )}
        >
          <AnimatePresence mode="wait">
            {isDarkPreview ? (
              <motion.div
                key="dark"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <Moon className="w-4 h-4" />
                Dark
              </motion.div>
            ) : (
              <motion.div
                key="light"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <Sun className="w-4 h-4" />
                Light
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Preview Area */}
      <motion.div
        layout
        className={cn(
          "flex-1 rounded-xl p-8 transition-colors duration-300 overflow-auto",
          "border border-border",
          isDarkPreview ? "bg-zinc-900" : "bg-white"
        )}
      >
        <div ref={previewRef}>
          <SignatureTemplate data={data} />
        </div>
      </motion.div>

      {/* Copy Actions */}
      <div className="mt-6 flex gap-3">
        <ShinyButton
          onClick={copyRichText}
          className="flex-1"
        >
          <AnimatePresence mode="wait">
            {copied === "rich" ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                Copied!
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Copy Signature
              </motion.div>
            )}
          </AnimatePresence>
        </ShinyButton>

        <button
          onClick={copyRawHTML}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
            "border border-border hover:border-primary/50",
            "bg-secondary/50 hover:bg-secondary",
            copied === "html" && "border-primary bg-primary/10"
          )}
        >
          <AnimatePresence mode="wait">
            {copied === "html" ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="w-5 h-5 text-primary" />
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Code className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
          HTML
        </button>
      </div>
    </div>
  );
};

export default SignaturePreview;
