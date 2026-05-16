import Hero from "./components/hero/Hero";
import Footer from "./components/footer/Footer";
import Metrics from "./components/metrics/Metrics";
import LiveMap from "./components/map/LiveMap";
import CropShowcase from "./components/crops/CropShowcase";

import Image from "next/image";
import logo from "./public/logos/PollenLogo.png";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">

      {/* CUSTOM NAVIGATION */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-14">

            {/* LOGO */}
            <Image
              src={logo}
              alt="Pollen Systems"
              width={340}
              height={90}
              priority
              className="h-14 w-auto object-contain"
            />

            {/* NAVIGATION */}
            <nav className="hidden items-center gap-8 lg:flex">

              {[
                "Platform",
                "Analytics",
                "Crops",
                "Technology",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[13px] font-medium uppercase tracking-[0.22em] text-zinc-300 transition-all duration-300 hover:text-green-400"
                >
                  {item}
                </a>
              ))}

            </nav>

          </div>

          {/* CTA */}
          <button className="rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-green-400 transition-all duration-300 hover:border-green-400 hover:bg-green-500 hover:text-black">
            Schedule Demo
          </button>

        </div>

      </header>

      {/* HEADER SPACER */}
      <div className="h-20" />

      {/* HERO */}
      <Hero />

      {/* METRICS */}
      <Metrics />

      {/* LIVE MAP */}
      <LiveMap />

      {/* DATA STACK */}
      <section className="relative overflow-hidden border-t border-white/10 bg-zinc-950 py-24">

        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">

          {/* SECTION HEADER */}
          <div className="mb-20 text-center">

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-green-400">
              Modern Agricultural Intelligence
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

      {/* CROP SHOWCASE */}
      <CropShowcase />

      {/* PLATFORM SECTION */}
      <section className="relative overflow-hidden border-t border-white/10 bg-black py-28">

        {/* BACKGROUND GLOW */}
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
                  "AI-Powered Crop Analytics",
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
            Ready to Modernize Your Operations?
          </p>

          <h2 className="mb-8 text-5xl font-bold leading-tight md:text-7xl">
            See Your Farm
            <span className="block text-green-400">
              Differently
            </span>
          </h2>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-zinc-400">
            Bring AI-powered geospatial intelligence into your
            agricultural workflows with drones, satellites,
            IoT sensors, and enterprise analytics.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">

            <button className="rounded-2xl bg-green-500 px-10 py-5 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-green-400">
              Schedule a Demo
            </button>

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