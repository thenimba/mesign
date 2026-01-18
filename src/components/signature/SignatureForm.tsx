import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignatureData, FontFamily, Direction } from "@/types/signature";
import { FloatingInput } from "@/components/ui/floating-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Briefcase,
  Building2,
  Mail,
  Phone,
  MapPin,
  Image,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Github,
  Globe,
  Palette,
  Type,
  AlignLeft,
  AlignRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SignatureFormProps {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
}

const tabVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
};

export const SignatureForm = ({ data, onChange }: SignatureFormProps) => {
  const [activeTab, setActiveTab] = useState("personal");

  const updateField = <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const updateSocial = (platform: keyof typeof data.socials, value: string) => {
    onChange({ ...data, socials: { ...data.socials, [platform]: value } });
  };

  const updateColor = (key: keyof typeof data.colors, value: string) => {
    onChange({ ...data, colors: { ...data.colors, [key]: value } });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Signature Editor</h2>
        <p className="text-sm text-muted-foreground">Customize your email signature</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 mb-6 bg-secondary/50 p-1 rounded-lg">
          <TabsTrigger
            value="personal"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
          >
            <User className="w-4 h-4 mr-2" />
            Personal
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
          >
            <Globe className="w-4 h-4 mr-2" />
            Social
          </TabsTrigger>
          <TabsTrigger
            value="style"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
          >
            <Palette className="w-4 h-4 mr-2" />
            Style
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto pr-2">
          <AnimatePresence mode="wait">
            {/* Personal Tab */}
            <TabsContent value="personal" className="mt-0 space-y-4" asChild>
              <motion.div
                key="personal"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <FloatingInput
                  label="Full Name"
                  icon={<User className="w-4 h-4" />}
                  value={data.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
                <FloatingInput
                  label="Job Title"
                  icon={<Briefcase className="w-4 h-4" />}
                  value={data.jobTitle}
                  onChange={(e) => updateField("jobTitle", e.target.value)}
                />
                <FloatingInput
                  label="Company Name"
                  icon={<Building2 className="w-4 h-4" />}
                  value={data.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                />
                <FloatingInput
                  label="Email"
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  value={data.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
                <FloatingInput
                  label="Phone"
                  type="tel"
                  icon={<Phone className="w-4 h-4" />}
                  value={data.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
                <FloatingInput
                  label="Address"
                  icon={<MapPin className="w-4 h-4" />}
                  value={data.address}
                  onChange={(e) => updateField("address", e.target.value)}
                />
                <FloatingInput
                  label="Logo/Avatar URL"
                  icon={<Image className="w-4 h-4" />}
                  value={data.logoUrl}
                  onChange={(e) => updateField("logoUrl", e.target.value)}
                  placeholder="https://..."
                />
              </motion.div>
            </TabsContent>

            {/* Social Tab */}
            <TabsContent value="social" className="mt-0 space-y-4" asChild>
              <motion.div
                key="social"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <FloatingInput
                  label="LinkedIn URL"
                  icon={<Linkedin className="w-4 h-4" />}
                  value={data.socials.linkedin || ""}
                  onChange={(e) => updateSocial("linkedin", e.target.value)}
                />
                <FloatingInput
                  label="Twitter URL"
                  icon={<Twitter className="w-4 h-4" />}
                  value={data.socials.twitter || ""}
                  onChange={(e) => updateSocial("twitter", e.target.value)}
                />
                <FloatingInput
                  label="Instagram URL"
                  icon={<Instagram className="w-4 h-4" />}
                  value={data.socials.instagram || ""}
                  onChange={(e) => updateSocial("instagram", e.target.value)}
                />
                <FloatingInput
                  label="Facebook URL"
                  icon={<Facebook className="w-4 h-4" />}
                  value={data.socials.facebook || ""}
                  onChange={(e) => updateSocial("facebook", e.target.value)}
                />
                <FloatingInput
                  label="GitHub URL"
                  icon={<Github className="w-4 h-4" />}
                  value={data.socials.github || ""}
                  onChange={(e) => updateSocial("github", e.target.value)}
                />
                <FloatingInput
                  label="Website URL"
                  icon={<Globe className="w-4 h-4" />}
                  value={data.socials.website || ""}
                  onChange={(e) => updateSocial("website", e.target.value)}
                />
              </motion.div>
            </TabsContent>

            {/* Style Tab */}
            <TabsContent value="style" className="mt-0 space-y-6" asChild>
              <motion.div
                key="style"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                {/* Colors */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Colors
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Primary</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={data.colors.primary}
                          onChange={(e) => updateColor("primary", e.target.value)}
                          className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={data.colors.primary}
                          onChange={(e) => updateColor("primary", e.target.value)}
                          className="flex-1 h-10 px-3 text-xs rounded-lg border border-input bg-secondary/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Secondary</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={data.colors.secondary}
                          onChange={(e) => updateColor("secondary", e.target.value)}
                          className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={data.colors.secondary}
                          onChange={(e) => updateColor("secondary", e.target.value)}
                          className="flex-1 h-10 px-3 text-xs rounded-lg border border-input bg-secondary/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Text</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={data.colors.text}
                          onChange={(e) => updateColor("text", e.target.value)}
                          className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={data.colors.text}
                          onChange={(e) => updateColor("text", e.target.value)}
                          className="flex-1 h-10 px-3 text-xs rounded-lg border border-input bg-secondary/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Font Family */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Font Family
                  </Label>
                  <Select
                    value={data.fontFamily}
                    onValueChange={(value) => updateField("fontFamily", value as FontFamily)}
                  >
                    <SelectTrigger className="bg-secondary/50 border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Rubik">Rubik</SelectItem>
                      <SelectItem value="Heebo">Heebo</SelectItem>
                      <SelectItem value="Arimo">Arimo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Direction Toggle */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Text Direction
                  </Label>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-input">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-md transition-all",
                          data.direction === "ltr" ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}
                      >
                        <AlignLeft className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {data.direction === "ltr" ? "Left to Right" : "Right to Left"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {data.direction === "ltr" ? "English, Spanish..." : "Hebrew, Arabic..."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">LTR</span>
                      <Switch
                        checked={data.direction === "rtl"}
                        onCheckedChange={(checked) =>
                          updateField("direction", checked ? "rtl" : "ltr")
                        }
                      />
                      <span className="text-xs text-muted-foreground">RTL</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
};

export default SignatureForm;
