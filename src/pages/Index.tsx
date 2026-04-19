import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SignatureData, defaultSignatureData } from "@/types/signature";
import { SignatureForm } from "@/components/signature/SignatureForm";
import { SignaturePreview } from "@/components/signature/SignaturePreview";
import { AuroraBackground } from "@/components/layout/AuroraBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Settings2, Eye, Save, FolderDown, Info } from "lucide-react";
import { useDraftStorage } from "@/hooks/useDraftStorage";

const Index = () => {
  const [signatureData, setSignatureData] = useState<SignatureData>(defaultSignatureData);
  const [mobileView, setMobileView] = useState<"preview" | "editor">("editor");
  const { save, load, touch } = useDraftStorage(signatureData, setSignatureData);

  // Track activity to refresh draft expiration
  const handleChange = useCallback(
    (next: SignatureData) => {
      setSignatureData(next);
      void touch();
    },
    [touch]
  );

  useEffect(() => {
    const handler = () => void touch();
    window.addEventListener("mousemove", handler);
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [touch]);

  const SaveControls = () => (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => void load()}>
        <FolderDown className="w-4 h-4 mr-2" />
        Load
      </Button>
      <Button size="sm" onClick={() => void save()}>
        <Save className="w-4 h-4 mr-2" />
        Save Draft
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      <AuroraBackground />
      <Header />

      {/* Inactivity / persistence notice */}
      <div className="px-4 lg:px-8 -mt-2 mb-2">
        <div className="max-w-7xl mx-auto flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p>
            <span className="text-foreground font-medium">Note:</span> Drafts are keyed by
            <span className="text-foreground"> email + phone</span> and auto-saved as you type.
            Your work is restored on refresh, but data is automatically deleted after
            <span className="text-foreground"> 5 minutes of inactivity</span>.
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <main className="flex-1 px-6 lg:px-8 pb-8 hidden lg:block">
        <div className="max-w-7xl mx-auto h-[calc(100vh-220px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-8 h-full"
          >
            {/* Editor Panel */}
            <div className="glass rounded-2xl p-6 overflow-hidden flex flex-col">
              <div className="flex items-center justify-end mb-3">
                <SaveControls />
              </div>
              <div className="flex-1 overflow-hidden">
                <SignatureForm data={signatureData} onChange={handleChange} />
              </div>
            </div>

            {/* Preview Panel */}
            <div className="glass rounded-2xl p-6 overflow-hidden">
              <SignaturePreview data={signatureData} />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Mobile Layout */}
      <main className="flex-1 px-4 pb-4 lg:hidden flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex flex-col"
        >
          {/* Mobile Toggle */}
          <div className="flex gap-2 mb-3">
            <Button
              variant={mobileView === "editor" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setMobileView("editor")}
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Editor
            </Button>
            <Button
              variant={mobileView === "preview" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setMobileView("preview")}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>

          <div className="flex justify-end mb-3">
            <SaveControls />
          </div>

          {/* Mobile Content */}
          <div className="glass rounded-2xl p-4 flex-1 overflow-hidden">
            {mobileView === "editor" ? (
              <SignatureForm data={signatureData} onChange={handleChange} />
            ) : (
              <SignaturePreview data={signatureData} />
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
