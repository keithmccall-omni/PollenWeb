"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">

      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-16 md:grid-cols-2">

          {/* BRAND */}
          <div>

            <div className="mb-6">
              <Image
                src="/logos/PollenLogo.png"
                alt="Pollen Systems"
                width={320}
                height={90}
                className="h-auto w-[260px] object-contain"
                priority
              />
            </div>

            <p className="max-w-sm leading-relaxed text-zinc-400">
              AI-powered agricultural intelligence built on drone,
              satellite, IoT, and geospatial analytics infrastructure.
            </p>

          </div>

          {/* CONTACT */}
          <div>

            <h3 className="mb-6 text-lg font-semibold text-white">
              Contact
            </h3>

            <div className="flex flex-col gap-4 text-zinc-400">

              <p>
                Woodinville, Washington
              </p>

              <Link
                href="/contact#contact-form"
                className="transition hover:text-white"
              >
                Schedule a Demo
              </Link>

              <Link
                href="/contact#contact-form"
                className="transition hover:text-white"
              >
                Contact Sales
              </Link>

              <a
                href="mailto:ops@pollensystems.com"
                className="transition hover:text-white"
              >
                ops@pollensystems.com
              </a>

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