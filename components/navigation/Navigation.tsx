"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  {
    name: "Home",
    href: "/",
    external: false,
  },
  {
    name: "PrecisionView™",
    href: "https://portal.pollensystems.com",
    external: true,
  },
  {
    name: "Crops",
    href: "/crops",
    external: false,
  },
  {
    name: "Team",
    href: "/team",
    external: false,
  },
  {
    name: "Contact",
    href: "/contact",
    external: false,
  },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const handleScheduleDemo = () => {
    if (
      window.location.pathname !== "/contact"
    ) {
      window.location.href =
        "/contact#contact-form";

      return;
    }

    const section =
      document.getElementById(
        "contact-form"
      );

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-black/85 backdrop-blur-xl"
            : "bg-black"
        }`}
      >
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">

          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center transition hover:opacity-80"
          >
            <Image
              src="/logos/PollenLogo.png"
              alt="Pollen Systems"
              priority
              width={320}
              height={90}
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-10 lg:flex">

            {navigation.map((item) =>
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium tracking-wide text-zinc-300 transition hover:text-green-400"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium tracking-wide text-zinc-300 transition hover:text-green-400"
                >
                  {item.name}
                </Link>
              )
            )}

          </nav>

          {/* CTA */}
          <div className="hidden lg:block">

            <button
              onClick={handleScheduleDemo}
              className="
                rounded-2xl
                bg-green-500
                px-8
                py-4
                text-sm
                font-semibold
                text-black
                transition-all
                duration-300
                hover:scale-105
                hover:bg-green-400
              "
            >
              Schedule a Demo
            </button>

          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() =>
              setMobileMenuOpen(true)
            }
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

              <Link
                href="/"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                <Image
                  src="/logos/PollenLogo.png"
                  alt="Pollen Systems"
                  width={260}
                  height={70}
                  className="h-12 w-auto object-contain"
                />
              </Link>

              <button
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white"
              >
                <X className="h-6 w-6" />
              </button>

            </div>

            <motion.div
              initial={{
                y: 30,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 30,
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="flex flex-col gap-8 px-6 py-12"
            >

              {navigation.map((item) =>
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="text-3xl font-semibold text-white"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="text-3xl font-semibold text-white"
                  >
                    {item.name}
                  </Link>
                )
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);

                  handleScheduleDemo();
                }}
                className="
                  mt-6
                  rounded-2xl
                  bg-green-500
                  px-6
                  py-4
                  text-lg
                  font-semibold
                  text-black
                "
              >
                Schedule a Demo
              </button>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}