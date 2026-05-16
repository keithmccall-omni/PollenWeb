"use client";

import { motion } from "framer-motion";

export default function CinematicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* VIDEO / IMAGE LAYER */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-30"
        >
          <source src="/videos/wheat.mp4" type="video/mp4" />
        </video>

        {/* FALLBACK IMAGE */}
        <div className="absolute inset-0 bg-[url('/images/wheat.jpg')] bg-cover bg-center opacity-40" />
      </div>

      {/* GREEN ATMOSPHERIC GLOW */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-500/20 via-transparent to-green-900/30" />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/55" />

      {/* MOVING TOPOGRAPHIC LINES */}
      <motion.div
        animate={{
          x: [0, -120, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-[-20%] opacity-30"
      >
        <svg
          viewBox="0 0 1600 1200"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d9ff75" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#b8ff4d" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#7fff00" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {Array.from({ length: 32 }).map((_, i) => (
            <motion.path
              key={i}
              d={`
                M -200 ${120 + i * 38}
                C 300 ${i * 12},
                  700 ${350 + i * 8},
                  1800 ${120 + i * 30}
              `}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ opacity: 0.15 }}
              animate={{
                opacity: [0.15, 0.4, 0.15],
              }}
              transition={{
                duration: 6 + i * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </motion.div>

      {/* RADIAL GLOW */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-10%] top-[10%] h-[800px] w-[800px] rounded-full bg-lime-400/10 blur-3xl"
      />

      {/* SCAN LINES */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "100% 5px",
        }}
      />
    </div>
  );
}
