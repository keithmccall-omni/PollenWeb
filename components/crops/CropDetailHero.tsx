import Image from "next/image";

interface CropHeroProps {
  crop: {
    name: string;
    headline: string;
    subheadline: string;
    description: string;
    circleImage: string;
  };
}

export default function CropDetailHero({
  crop,
}: CropHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-black py-28">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,255,0,0.10),transparent_60%)]" />

      {/* GRID OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

        {/* LEFT CONTENT */}
        <div>

          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-lime-400">
            Precision Agriculture
          </p>

          <h1 className="mb-8 text-5xl font-black leading-none text-white md:text-7xl">
            {crop.name}
          </h1>

          <h2 className="mb-8 text-2xl font-semibold leading-tight text-lime-400 md:text-4xl">
            {crop.headline}
          </h2>

          <p className="mb-10 text-xl leading-relaxed text-zinc-300">
            {crop.description}
          </p>

          <div className="flex flex-col gap-6 sm:flex-row">

            <button className="rounded-2xl bg-lime-500 px-10 py-5 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-lime-400">
              Schedule a Demo
            </button>

            <button className="rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-semibold text-white backdrop-blur transition-all duration-300 hover:border-lime-400/30 hover:bg-white/10">
              Explore PrecisionView™
            </button>

          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center">

          {/* IMAGE GLOW */}
          <div className="absolute h-[500px] w-[500px] rounded-full bg-lime-500/10 blur-3xl" />

          <Image
            src={crop.circleImage}
            alt={crop.name}
            width={520}
            height={520}
            priority
            className="relative z-10 object-contain drop-shadow-[0_0_50px_rgba(132,255,0,0.22)]"
          />

        </div>

      </div>

    </section>
  );
}