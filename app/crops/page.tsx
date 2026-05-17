import Navigation from "../../components/navigation/Navigation";
import Footer from "../../components/footer/Footer";
import CropShowcase from "../crops/CropShowcase";

export default function CropsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">

      {/* NAVIGATION */}
      <Navigation />

      {/* CROP SHOWCASE */}
      <CropShowcase />

      {/* ANALYTICS SECTION */}
      <section className="relative overflow-hidden border-t border-white/10 bg-zinc-950 py-28">

        {/* GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,255,0,0.08),transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">

          <div className="mb-20 text-center">

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-lime-400">
              PrecisionView™
            </p>

            <h2 className="text-4xl font-bold leading-tight text-white md:text-6xl">
              AI-Powered Crop
              <span className="block text-lime-400">
                Operational Intelligence
              </span>
            </h2>

          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {[
              {
                title: "NDVI Analytics",
                desc: "Vegetation health monitoring and field variability analysis using multispectral imagery.",
              },
              {
                title: "Irrigation Modeling",
                desc: "Optimize water usage with geospatial irrigation intelligence and environmental telemetry.",
              },
              {
                title: "Yield Prediction",
                desc: "AI-driven forecasting models combining satellite, drone, and historical field data.",
              },
              {
                title: "Disease Detection",
                desc: "Early identification of crop stress, disease pressure, and nutrient deficiencies.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-lime-400/30 hover:bg-white/[0.08]"
              >

                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-lime-400/20 bg-lime-400/10">
                  <div className="h-3 w-3 rounded-full bg-lime-400" />
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

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/10 bg-black py-28">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,255,0,0.12),transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-lime-400">
            Modern Agricultural Intelligence
          </p>

          <h2 className="mb-8 text-5xl font-bold leading-tight text-white md:text-7xl">
            Optimize Every
            <span className="block text-lime-400">
              Acre You Manage
            </span>
          </h2>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-zinc-400">
            Bring together drone imagery, satellite intelligence,
            IoT telemetry, and AI-powered analytics into a single
            operational agriculture platform.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">

            <button className="rounded-2xl bg-lime-500 px-10 py-5 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-lime-400">
              Schedule a Demo
            </button>

            <button className="rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-semibold text-white backdrop-blur transition-all duration-300 hover:border-lime-400/30 hover:bg-white/10">
              Explore PrecisionView™
            </button>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <Footer />

    </main>
  );
}

