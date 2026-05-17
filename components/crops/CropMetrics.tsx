interface CropMetricsProps {
  metrics: {
    label: string;
    value: string;
  }[];
}

export default function CropMetrics({
  metrics,
}: CropMetricsProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950 py-20">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,255,0,0.06),transparent_65%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="group rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-lime-400/30 hover:bg-white/[0.08]"
            >

              {/* METRIC VALUE */}
              <div className="mb-4 text-5xl font-black text-lime-400 transition-transform duration-500 group-hover:scale-105">
                {metric.value}
              </div>

              {/* LABEL */}
              <div className="text-sm uppercase tracking-[0.25em] text-zinc-300">
                {metric.label}
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}