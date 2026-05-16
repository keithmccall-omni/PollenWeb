"use client";

import { motion } from "framer-motion";
import {
  Map,
  Satellite,
  ScanSearch,
  Radar,
  Route,
} from "lucide-react";

const layers = [
  {
    icon: Satellite,
    title: "Satellite Intelligence",
    description:
      "Historical and large-scale agricultural monitoring across massive growing regions.",
  },
  {
    icon: ScanSearch,
    title: "NDVI Analytics",
    description:
      "Vegetation stress analysis and crop health intelligence at scale.",
  },
  {
    icon: Radar,
    title: "AI Detection",
    description:
      "Machine learning-powered anomaly detection and operational insights.",
  },
  {
    icon: Route,
    title: "Drone Operations",
    description:
      "Recurring autonomous capture workflows and hyperscale imagery collection.",
  },
];

export default function AnimatedMap() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-32">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/5 blur-3xl" />

        {/* GRID */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-green-400">
            Geospatial Intelligence Platform
          </p>

          <h2 className="mb-6 text-5xl font-bold md:text-6xl">
            Operational Intelligence Across Every Acre
          </h2>

          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-zinc-400">
            Combining drone imagery, satellite intelligence, IoT data,
            AI analytics, and geospatial infrastructure into a unified
            agricultural intelligence platform.
          </p>
        </motion.div>

        {/* MAP + SIDEBAR */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_0.8fr]">
          {/* MAP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black"
          >
            {/* SATELLITE IMAGE */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center opacity-50" />

              {/* NDVI OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-yellow-500/10 to-red-500/20 mix-blend-screen" />

              {/* GRID OVERLAY */}
              <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />

              {/* PULSE MARKERS */}
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.4, scale: 0.8 }}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                  className={`absolute h-5 w-5 rounded-full bg-green-400 shadow-[0_0_40px_rgba(74,222,128,0.8)] ${
                    i === 1
                      ? "left-[20%] top-[30%]"
                      : i === 2
                        ? "left-[55%] top-[25%]"
                        : i === 3
                          ? "left-[70%] top-[60%]"
                          : "left-[35%] top-[70%]"
                  }`}
                />
              ))}

              {/* FLIGHT PATHS */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1000 600"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M150 150 C300 80 500 120 700 220"
                  fill="none"
                  stroke="rgba(74,222,128,0.7)"
                  strokeWidth="3"
                  strokeDasharray="12 12"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />

                <motion.path
                  d="M250 450 C420 320 600 350 820 180"
                  fill="none"
                  stroke="rgba(74,222,128,0.5)"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2.5 }}
                />
              </svg>

              {/* FLOATING CARD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 left-6 rounded-2xl border border-white/10 bg-black/70 p-5 backdrop-blur-xl"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-black">
                    <Map className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">
                      Live Geospatial Analysis
                    </p>

                    <p className="font-semibold text-white">
                      Eastern Washington Vineyards
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500">NDVI Score</p>
                    <p className="font-semibold text-green-400">
                      0.87
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500">Coverage</p>
                    <p className="font-semibold text-white">
                      4,280 Acres
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {layers.map((layer, index) => {
              const Icon = layer.icon;

              return (
                <motion.div
                  key={layer.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ x: 6 }}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/15 text-green-400">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mb-4 text-2xl font-semibold text-white">
                    {layer.title}
                  </h3>

                  <p className="leading-relaxed text-zinc-400">
                    {layer.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
