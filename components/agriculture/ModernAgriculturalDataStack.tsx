"use client";

import Image from "next/image";

const stackItems = [
  {
    title: "Drone Imagery",
    desc: "RGB, multispectral, thermal, and LiDAR capture at field scale.",
    image: "/images/DroneImagery.png?v=2",
  },
  {
    title: "Satellite Data",
    desc: "Historical trend analysis and regional intelligence across large agricultural operations.",
    image: "/images/SatelliteImagery.png?v=2",
  },
  {
    title: "IoT Sensors",
    desc: "Real-time environmental monitoring, irrigation telemetry, and climate intelligence.",
    image: "/images/IotSensors.png?v=2",
  },
  {
    title: "AI Analytics",
    desc: "Predictive modeling, operational recommendations, and geospatial crop intelligence.",
    image: "/images/AIAnalytics.png?v=2",
  },
];

export default function ModernAgriculturalDataStack() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-zinc-950 py-24">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* SECTION HEADER */}
        <div className="mb-20 text-center">

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-green-400">
            Enterprise Agricultural Intelligence
          </p>

          <h2 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl">
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
        <div className="grid gap-8 md:grid-cols-2">

          {stackItems.map((item) => (
            <div
              key={item.title}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 transition-all duration-500 hover:-translate-y-2 hover:border-green-400/30"
            >

              {/* IMAGE */}
              <div className="relative h-72 w-full overflow-hidden bg-black">

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain object-center scale-[0.98] transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />

                {/* OVERLAY */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              </div>

              {/* CONTENT */}
              <div className="px-8 pb-8 pt-6">

                <h3 className="mb-4 text-3xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="text-lg leading-relaxed text-zinc-400">
                  {item.desc}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}