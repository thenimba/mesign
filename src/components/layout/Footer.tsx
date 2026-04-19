import { Info } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full py-4 px-6 lg:px-8 border-t border-border/40 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} <span className="text-foreground font-medium">MeSign</span> · Email Signature Generator
        </p>
        <p className="flex items-center gap-1.5 text-center">
          <Info className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>
            המידע נשמר זמנית בלבד — יימחק לאחר רענון הדף או 5 דקות של חוסר פעילות.
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
