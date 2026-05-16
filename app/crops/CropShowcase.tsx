import fs from "fs";
import path from "path";
import Image from "next/image";

const cropsDirectory = path.join(
  process.cwd(),
  "public/images/crops"
);

function getCrops() {
  if (!fs.existsSync(cropsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(cropsDirectory);

  return files
    .filter((file) =>
      /\.(png|jpg|jpeg|webp|svg)$/i.test(file)
    )
    .map((file) => {
      const filename = file.replace(
        /\.(png|jpg|jpeg|webp|svg)$/i,
        ""
      );

      const prettyName = filename
        .replace(/[0-9]/g, "")
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        name: prettyName,
        image: `/images/crops/${file}`,
      };
    });
}

export default function CropShowcase() {
  const crops = getCrops();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#071d12] via-[#0d2f1d] to-[#071d12] py-24">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(132,255,0,0.15),_transparent_70%)] opacity-20" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mb-20 text-center">

          <div className="mb-6 inline-block rounded-full border border-lime-400/30 bg-lime-400/10 px-5 py-2 text-sm uppercase tracking-[0.25em] text-lime-300">
            Precision Agriculture
          </div>

          <h2 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl">
            Enterprise Intelligence
            <span className="block text-lime-400">
              Across Global Crops
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
            AI-ready drone, satellite, and IoT analytics powering
            vineyards, orchards, specialty crops, and agricultural
            operations worldwide.
          </p>

        </div>

        {/* Crop Grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-5">

          {crops.map((crop) => (
            <div
              key={crop.name}
              className="group relative flex flex-col items-center"
            >

              {/* Glow */}
              <div className="absolute inset-0 scale-75 rounded-full bg-lime-400/20 opacity-0 blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:opacity-100" />

              {/* Image */}
              <div className="relative transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110">

                <Image
                  src={crop.image}
                  alt={crop.name}
                  width={180}
                  height={180}
                  className="h-[180px] w-[180px] object-contain drop-shadow-[0_0_30px_rgba(132,255,0,0.18)]"
                />

              </div>

              {/* Name */}
              <div className="mt-6 text-center">

                <h3 className="text-lg font-semibold tracking-wide text-white transition-colors duration-300 group-hover:text-lime-300">
                  {crop.name}
                </h3>

              </div>

            </div>
          ))}

        </div>

        {/* Metrics */}
        <div className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4">

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
              className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm"
            >

              <div className="mb-3 text-4xl font-bold text-lime-400 md:text-5xl">
                {metric.value}
              </div>

              <div className="text-sm uppercase tracking-[0.2em] text-gray-300">
                {metric.label}
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}