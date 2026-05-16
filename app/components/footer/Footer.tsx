import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-16 md:grid-cols-4">
          {/* BRAND */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 font-bold text-black">
                P
              </div>

              <div>
                <p className="text-xl font-bold text-white">
                  Pollen Systems
                </p>

                <p className="text-xs uppercase tracking-[0.25em] text-green-400">
                  Agricultural Intelligence
                </p>
              </div>
            </div>

            <p className="max-w-sm leading-relaxed text-zinc-400">
              AI-powered agricultural intelligence built on drone,
              satellite, IoT, and geospatial analytics infrastructure.
            </p>
          </div>

          {/* PLATFORM */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Platform
            </h3>

            <div className="flex flex-col gap-4 text-zinc-400">
              <Link href="/" className="transition hover:text-white">
                PrecisionView
              </Link>

              <Link href="/" className="transition hover:text-white">
                Drone Operations
              </Link>

              <Link href="/" className="transition hover:text-white">
                AI Analytics
              </Link>

              <Link href="/" className="transition hover:text-white">
                Crop Intelligence
              </Link>
            </div>
          </div>

          {/* CROPS */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Supported Crops
            </h3>

            <div className="flex flex-col gap-4 text-zinc-400">
              <Link href="/" className="transition hover:text-white">
                Wine Grapes
              </Link>

              <Link href="/" className="transition hover:text-white">
                Pistachios
              </Link>

              <Link href="/" className="transition hover:text-white">
                Apples
              </Link>

              <Link href="/" className="transition hover:text-white">
                Cherries
              </Link>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Contact
            </h3>

            <div className="flex flex-col gap-4 text-zinc-400">
              <p>Woodinville, Washington</p>

              <Link
                href="/"
                className="transition hover:text-white"
              >
                Schedule a Demo
              </Link>

              <Link
                href="/"
                className="transition hover:text-white"
              >
                Contact Sales
              </Link>

              <Link
                href="/"
                className="transition hover:text-white"
              >
                Partnership Inquiries
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-sm text-zinc-500 md:flex-row">
          <p>
            © 2026 Pollen Systems. All rights reserved.
          </p>

          <p>
            Powered by Omniris Geospatial Infrastructure
          </p>
        </div>
      </div>
    </footer>
  );
}