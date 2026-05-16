"use client";

import { motion } from "framer-motion";

const metrics = [
  {
    value: "4,000+",
    label: "Drone Pilots",
    description:
      "Global drone operations supporting agriculture and geospatial intelligence.",
  },
  {
    value: "10M+",
    label: "Images Processed",
    description:
      "Enterprise-scale orthomosaic and analytics processing workflows.",
  },
  {
    value: "100TB+",
    label: "Geospatial Data",
    description:
      "AI-ready agricultural intelligence datasets and time-series analytics.",
  },
  {
    value: "24/7",
    label: "Operational Intelligence",
    description:
      "Continuous monitoring across vineyards, orchards, and agricultural operations.",
  },
];

export default function Metrics() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-black py-32">
      {/* BACKGROUND GLOW */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />

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
            Enterprise Agricultural Intelligence
          </p>

          <h2 className="mb-6 text-5xl font-bold md:text-6xl">
            Built for Geospatial Scale
          </h2>

          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-zinc-400">
            Modern agricultural intelligence requires hyperscale
            geospatial infrastructure, AI-ready data pipelines, and
            operational visibility across every acre.
          </p>
        </motion.div>

        {/* METRIC GRID */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
              }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl"
            >
              {/* HOVER GLOW */}
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent" />
              </div>

              <div className="relative z-10">
                <div className="mb-4 text-5xl font-bold text-white">
                  {metric.value}
                </div>

                <h3 className="mb-4 text-xl font-semibold text-green-400">
                  {metric.label}
                </h3>

                <p className="leading-relaxed text-zinc-400">
                  {metric.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}