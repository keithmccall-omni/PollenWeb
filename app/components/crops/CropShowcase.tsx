"use client";

import Image from "next/image";

// Dynamically load every PNG inside:
// app/public/images/crops

const req = require.context(
  "../../public/images/crops",
  false,
  /\.(png|jpe?g|webp|svg)$/i
);

const crops = req.keys().map((key: string) => {
  const imageModule = req(key);

  const filename = key
    .replace("./", "")
    .replace(/\.(png|jpe?g|webp|svg)$/i, "");

  const prettyName = filename
    .replace(/[0-9]/g, "")
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  return {
    name: prettyName,
    image: imageModule.default || imageModule,
  };
});

export default function CropShowcase() {
  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-[#071d12] via-[#0d2f1d] to-[#071d12]">

      {/* Background Glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(132,255,0,0.15),_transparent_70%)]" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">

          <div className="inline-block px-5 py-2 rounded-full border border-lime-400/30 bg-lime-400/10 text-lime-300 text-sm tracking-[0.25em] uppercase mb-6">
            Precision Agriculture
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Enterprise Intelligence
            <span className="block text-lime-400">
              Across Global Crops
            </span>
          </h2>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
            AI-ready drone, satellite, and IoT analytics powering
            vineyards, orchards, specialty crops, and agricultural
            operations worldwide.
          </p>

        </div>

        {/* Crop Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">

          {crops.map((crop: any) => (
            <div
              key={crop.name}
              className="group relative flex flex-col items-center"
            >

              {/* Glow */}
              <div className="absolute inset-0 rounded-full blur-3xl bg-lime-400/20 opacity-0 group-hover:opacity-100 transition-all duration-700 scale-75 group-hover:scale-125" />

              {/* Image */}
              <div className="relative transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">

                <Image
                  src={crop.image}
                  alt={crop.name}
                  width={180}
                  height={180}
                  className="object-contain drop-shadow-[0_0_30px_rgba(132,255,0,0.18)]"
                />

              </div>

              {/* Name */}
              <div className="mt-6 text-center">

                <h3 className="text-white font-semibold text-lg tracking-wide group-hover:text-lime-300 transition-colors duration-300">
                  {crop.name}
                </h3>

              </div>

            </div>
          ))}

        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">

          {[
            {
              value: "10M+",
              label: "Acres Modeled",
            },
            {
              value: "AI",
              label: "Driven Analytics",
            },
            {
              value: "Drone",
              label: "Satellite + IoT",
            },
            {
              value: "Global",
              label: "Crop Coverage",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm p-8"
            >

              <div className="text-4xl md:text-5xl font-bold text-lime-400 mb-3">
                {metric.value}
              </div>

              <div className="text-gray-300 uppercase tracking-[0.2em] text-sm">
                {metric.label}
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}