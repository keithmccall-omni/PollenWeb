export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center opacity-30" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <p className="mb-6 text-sm uppercase tracking-[0.4em] text-green-400">
          AI-Driven Agricultural Intelligence
        </p>

        <h1 className="mx-auto mb-8 max-w-5xl text-5xl font-bold leading-tight md:text-7xl">
          Precision Agriculture at AI Scale
        </h1>

        <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-zinc-300 md:text-2xl">
          Pollen Systems helps growers optimize irrigation, fertilizer,
          crop health, and yield using drone, satellite, IoT, and
          AI-driven geospatial analytics.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-2xl bg-green-500 px-8 py-4 text-lg font-semibold text-black transition hover:bg-green-400">
            Schedule a Demo
          </button>

          <button className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold backdrop-blur transition hover:bg-white/10">
            Explore PrecisionView
          </button>
        </div>
      </div>
    </section>
  );
}