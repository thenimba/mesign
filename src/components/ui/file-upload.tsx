import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, icon, value, onChange, accept = "image/*,.svg" }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [urlMode, setUrlMode] = React.useState(false);
    const [urlInput, setUrlInput] = React.useState(value || "");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onChange(result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    };

    const handleUrlSubmit = () => {
      if (urlInput.trim()) {
        onChange(urlInput.trim());
        setUrlMode(false);
      }
    };

    const handleClear = () => {
      onChange("");
      setUrlInput("");
    };

    const hasValue = Boolean(value);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            {icon}
            {label}
          </label>
          {!hasValue && (
            <button
              type="button"
              onClick={() => setUrlMode(!urlMode)}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              {urlMode ? "Upload file" : "Use URL"}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {hasValue ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative group"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-input">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                  <img
                    src={value}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {value.startsWith("data:") ? "Uploaded image" : "Image URL"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {value.startsWith("data:") 
                      ? `${(value.length / 1024).toFixed(1)} KB`
                      : value.substring(0, 40) + (value.length > 40 ? "..." : "")
                    }
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : urlMode ? (
            <motion.div
              key="url"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-2"
            >
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                placeholder="https://example.com/logo.png"
                className={cn(
                  "flex-1 h-12 rounded-lg border border-input bg-secondary/50 px-4 text-sm",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                  "hover:border-muted-foreground/50",
                  "placeholder:text-muted-foreground/50"
                )}
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className={cn(
                  "px-4 h-12 rounded-lg font-medium text-sm transition-all",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Add
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onKeyDown={(e) => e.key === "Enter" && handleClick()}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed",
                  "transition-all duration-200 cursor-pointer",
                  "hover:border-primary/50 hover:bg-primary/5",
                  isDragging 
                    ? "border-primary bg-primary/10" 
                    : "border-input bg-secondary/30"
                )}
              >
                <div className={cn(
                  "p-3 rounded-full transition-colors",
                  isDragging ? "bg-primary/20" : "bg-muted"
                )}>
                  <Upload className={cn(
                    "w-5 h-5 transition-colors",
                    isDragging ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    Drop image here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    SVG, PNG, JPG (max 2MB)
                  </p>
                </div>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export { FileUpload };
