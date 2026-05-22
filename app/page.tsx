"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/footer/Footer";
import Metrics from "@/components/metrics/Metrics";
import CropShowcase from "@/app/crops/CropShowcase";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">

      {/* NAVIGATION */}
      <Navigation />

      {/* HEADER SPACER */}
      <div className="h-20" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black">

        {/* BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden">

          <Image
            src="/SeeYourWorld.png"
            alt="See Your World"
            priority
            fill
            className="object-cover object-center opacity-20"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/82" />

          {/* GRID */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(74,222,128,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(74,222,128,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "100px 100px",
            }}
          />

          {/* GREEN GLOW */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.18),transparent_65%)]" />

        </div>

        {/* CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-6 pt-16 pb-32 text-center">

          {/* LABEL */}
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
            }}
            className="rounded-full border border-green-500/30 bg-green-500/10 px-8 py-3 backdrop-blur"
          >
            <p className="text-[11px] uppercase tracking-[0.38em] text-[#B8FF3B]">
              Precision Agriculture
            </p>
          </motion.div>

          {/* TITLE */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              delay: 0.05,
            }}
            className="mt-4 max-w-6xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl xl:text-[7rem]"
          >
            Agricultural Intelligence

            <span className="mt-5 block text-[#8DFF00]">
              Save Our Planet™
            </span>
          </motion.h1>

          {/* SUBTEXT */}
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.12,
            }}
            className="mt-12 max-w-5xl text-2xl leading-relaxed text-zinc-300"
          >
            AI-enabled agricultural intelligence powered by drones,
            satellite imagery, IoT telemetry, and hyperscale
            geospatial infrastructure.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.18,
            }}
            className="mt-16 flex flex-col gap-6 sm:flex-row"
          >

            <Link
              href="/contact#contact-form"
              className="rounded-2xl bg-green-500 px-10 py-5 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-green-400"
            >
              Schedule a Demo
            </Link>

            <a
              href="https://portal.pollensystems.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-semibold text-white backdrop-blur transition-all duration-300 hover:border-green-400/30 hover:bg-white/10"
            >
              Explore PrecisionView™
            </a>

          </motion.div>

        </div>

      </section>

      {/* CROPS SECTION */}
      <CropShowcase />

      {/* METRICS */}
      <Metrics />

      {/* DATA STACK */}
      <section className="relative overflow-hidden border-t border-white/10 bg-zinc-950 py-24">

        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">

          {/* SECTION HEADER */}
          <div className="mb-20 text-center">

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-green-400">
              Enterprise Agricultural Intelligence
            </p>

            <h2 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              The Modern
              <span className="block text-green-400">
                Agricultural Data Stack
              </span>
            </h2>

            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-zinc-400">
              Integrating drones, satellites, IoT sensors, and AI into
              a unified operational intelligence platform built for
              modern growers and enterprise agriculture.
            </p>

          </div>

          {/* DATA GRID */}
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {[
              {
                title: "Drone Imagery",
                desc: "High-resolution RGB, NDVI, thermal, and multispectral capture at field scale.",
              },
              {
                title: "Satellite Data",
                desc: "Historical trend analysis and regional intelligence across large agricultural operations.",
              },
              {
                title: "IoT Sensors",
                desc: "Real-time environmental monitoring, irrigation telemetry, and climate intelligence.",
              },
              {
                title: "AI Analytics",
                desc: "Predictive modeling, operational recommendations, and geospatial crop intelligence.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-green-400/30 hover:bg-white/[0.08]"
              >

                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 text-green-400">
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                <h3 className="mb-4 text-2xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="leading-relaxed text-zinc-400">
                  {item.desc}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* PLATFORM SECTION */}
      <section className="relative overflow-hidden border-t border-white/10 bg-black py-28">

        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-20 lg:grid-cols-2">

            {/* LEFT CONTENT */}
            <div>

              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-green-400">
                Unified Platform
              </p>

              <h2 className="mb-8 text-4xl font-bold leading-tight md:text-6xl">
                From Field Data
                <span className="block text-green-400">
                  to Operational Intelligence
                </span>
              </h2>

              <p className="mb-8 text-lg leading-relaxed text-zinc-400">
                Pollen Systems combines drone imagery, satellite
                intelligence, AI analytics, and geospatial workflows
                into a unified operational platform for modern
                agriculture.
              </p>

              <div className="space-y-5">

                {[
                  "Drone + Satellite Intelligence",
                  "NDVI + Multispectral Analysis",
                  "AI-enabled Crop Analytics",
                  "Irrigation + Environmental Monitoring",
                  "Enterprise Geospatial Infrastructure",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-4"
                  >

                    <div className="h-3 w-3 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]" />

                    <span className="text-lg text-zinc-300">
                      {feature}
                    </span>

                  </div>
                ))}

              </div>

            </div>

            {/* RIGHT PANEL */}
            <div className="relative">

              <div className="absolute inset-0 rounded-[3rem] bg-green-500/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-10 backdrop-blur">

                <div className="mb-10 flex items-center justify-between">

                  <div>

                    <p className="text-sm uppercase tracking-[0.3em] text-green-400">
                      Live Analytics
                    </p>

                    <h3 className="mt-3 text-3xl font-bold">
                      Operational Overview
                    </h3>

                  </div>

                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>

                </div>

                <div className="space-y-6">

                  {[
                    {
                      label: "Field Coverage",
                      value: "98.4%",
                    },
                    {
                      label: "Irrigation Efficiency",
                      value: "+21%",
                    },
                    {
                      label: "AI Detection Accuracy",
                      value: "96.7%",
                    },
                    {
                      label: "Yield Prediction Confidence",
                      value: "94.2%",
                    },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6"
                    >

                      <div className="mb-3 flex items-center justify-between">

                        <span className="text-zinc-400">
                          {metric.label}
                        </span>

                        <span className="text-2xl font-bold text-green-400">
                          {metric.value}
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">

                        <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-green-400 to-lime-300" />

                      </div>

                    </div>
                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/10 bg-zinc-950 py-28">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15),transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-green-400">
            Ready to Modernize Your Farm?
          </p>

          <h2 className="mb-8 text-5xl font-bold leading-tight md:text-7xl">
            See Your Farm
            <span className="block text-green-400">
              Differently
            </span>
          </h2>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-zinc-400">
            Bring AI-enabled geospatial intelligence into your
            agricultural workflows with drones, satellites,
            IoT sensors, and enterprise analytics.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">

            <Link
              href="/contact#contact-form"
              className="rounded-2xl bg-green-500 px-10 py-5 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-green-400"
            >
              Schedule a Demo
            </Link>

            <button className="rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-semibold text-white backdrop-blur transition-all duration-300 hover:border-green-400/30 hover:bg-white/10">
              Explore Platform
            </button>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <Footer />

    </main>
  );
}