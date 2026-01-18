import { motion } from "framer-motion";

export const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 aurora-bg" />

      {/* Animated aurora blobs */}
      <motion.div
        className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(174 72% 56% / 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(199 89% 48% / 0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(262 83% 58% / 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
    </div>
  );
};

export default AuroraBackground;
