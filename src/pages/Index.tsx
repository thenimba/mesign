import { useState } from "react";
import { motion } from "framer-motion";
import { SignatureData, defaultSignatureData } from "@/types/signature";
import { SignatureForm } from "@/components/signature/SignatureForm";
import { SignaturePreview } from "@/components/signature/SignaturePreview";
import { AuroraBackground } from "@/components/layout/AuroraBackground";
import { Header } from "@/components/layout/Header";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings2, Eye } from "lucide-react";

const Index = () => {
  const [signatureData, setSignatureData] = useState<SignatureData>(defaultSignatureData);
  const [mobileView, setMobileView] = useState<"preview" | "editor">("editor");

  return (
    <div className="min-h-screen flex flex-col relative">
      <AuroraBackground />
      <Header />

      {/* Desktop Layout */}
      <main className="flex-1 px-6 lg:px-8 pb-8 hidden lg:block">
        <div className="max-w-7xl mx-auto h-[calc(100vh-140px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-8 h-full"
          >
            {/* Editor Panel */}
            <div className="glass rounded-2xl p-6 overflow-hidden">
              <SignatureForm data={signatureData} onChange={setSignatureData} />
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
          <div className="flex gap-2 mb-4">
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

          {/* Mobile Content */}
          <div className="glass rounded-2xl p-4 flex-1 overflow-hidden">
            {mobileView === "editor" ? (
              <SignatureForm data={signatureData} onChange={setSignatureData} />
            ) : (
              <SignaturePreview data={signatureData} />
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
