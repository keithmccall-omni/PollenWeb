"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  {
    name: "Platform",
    href: "/platform",
  },
  {
    name: "Technology",
    href: "/technology",
  },
  {
    name: "Crops",
    href: "/crops",
  },
  {
    name: "Case Studies",
    href: "/case-studies",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "About",
    href: "/about",
  },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-black/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 transition hover:opacity-80"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 font-bold text-black">
              P
            </div>

            <div>
              <p className="text-xl font-bold tracking-tight text-white">
                Pollen Systems
              </p>

              <p className="text-xs uppercase tracking-[0.25em] text-green-400">
                Agricultural Intelligence
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-zinc-300 transition hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:block">
            <button className="rounded-2xl bg-green-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-green-400">
              Schedule Demo
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white backdrop-blur lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            <div className="flex h-24 items-center justify-between border-b border-white/10 px-6">
              <div>
                <p className="text-xl font-bold text-white">
                  Pollen Systems
                </p>

                <p className="text-xs uppercase tracking-[0.25em] text-green-400">
                  Agricultural Intelligence
                </p>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-8 px-6 py-12"
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-semibold text-white"
                >
                  {item.name}
                </Link>
              ))}

              <button className="mt-6 rounded-2xl bg-green-500 px-6 py-4 text-lg font-semibold text-black">
                Schedule Demo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
