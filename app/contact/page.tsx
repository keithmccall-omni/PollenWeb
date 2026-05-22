"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import Navigation from "@/components/navigation/Navigation";

export default function ContactPage() {
  const mapContainer =
    useRef<HTMLDivElement | null>(null);

  const coordsRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,

      attributionControl: false,

      style: {
        version: 8,

        sources: {
          satellite: {
            type: "raster",

            tiles: [
              "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],

            tileSize: 256,
          },

          roads: {
            type: "raster",

            tiles: [
              "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
            ],

            tileSize: 256,
          },

          labels: {
            type: "raster",

            tiles: [
              "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
            ],

            tileSize: 256,
          },
        },

        layers: [
          {
            id: "satellite",
            type: "raster",
            source: "satellite",
          },

          {
            id: "roads",
            type: "raster",
            source: "roads",
            paint: {
              "raster-opacity": 1,
            },
          },

          {
            id: "labels",
            type: "raster",
            source: "labels",
            paint: {
              "raster-opacity": 1,
            },
          },
        ],
      },

      center: [-122.14878, 47.73502],

      zoom: 15,

      pitch: 0,

      bearing: 0,
    });

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    map.on("load", () => {
      const markerElement =
        document.createElement("div");

      markerElement.innerHTML = `
        <div class="relative flex items-center justify-center">
          <div class="absolute h-20 w-20 rounded-full bg-[#00ff88]/20 animate-ping"></div>

          <div class="absolute h-10 w-10 rounded-full bg-[#00ff88]/30 blur-xl"></div>

          <div
            class="
              relative
              h-5
              w-5
              rounded-full
              border-[4px]
              border-white
              bg-[#00ff88]
              shadow-[0_0_28px_rgba(0,255,136,1)]
            "
          ></div>
        </div>
      `;

      new maplibregl.Marker({
        element: markerElement,
      })
        .setLngLat([
          -122.14919,
          47.73447,
        ])
        .addTo(map);

      const attribution =
        document.querySelector(
          ".maplibregl-ctrl-bottom-right"
        );

      if (attribution) {
        (
          attribution as HTMLElement
        ).style.display = "none";
      }

      const controls =
        document.querySelectorAll(
          ".maplibregl-ctrl-group"
        );

      controls.forEach((control) => {
        (
          control as HTMLElement
        ).style.borderRadius = "18px";

        (
          control as HTMLElement
        ).style.overflow = "hidden";

        (
          control as HTMLElement
        ).style.background =
          "rgba(3, 21, 40, 0.92)";

        (
          control as HTMLElement
        ).style.backdropFilter =
          "blur(12px)";
      });
    });

    // CLICK POPUP
    map.on("click", (e) => {
      const lng =
        e.lngLat.lng.toFixed(6);

      const lat =
        e.lngLat.lat.toFixed(6);

      new maplibregl.Popup({
        closeButton: true,
        closeOnClick: true,
        offset: 18,
      })
        .setLngLat(e.lngLat)
        .setHTML(`
          <div
            style="
              padding: 8px 10px;
              font-family: Inter, sans-serif;
              color: white;
              background: #031528;
              border-radius: 12px;
              min-width: 180px;
            "
          >
            <div
              style="
                font-size: 11px;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: #8DFF00;
                margin-bottom: 8px;
              "
            >
              Coordinates
            </div>

            <div
              style="
                font-size: 14px;
                line-height: 1.8;
              "
            >
              <strong>Lat:</strong> ${lat}
              <br />
              <strong>Lng:</strong> ${lng}
            </div>
          </div>
        `)
        .addTo(map);
    });

    // LIVE COORDINATES
    map.on("mousemove", (e) => {
      if (!coordsRef.current) return;

      coordsRef.current.innerHTML = `
        ${e.lngLat.lat.toFixed(5)},
        ${e.lngLat.lng.toFixed(5)}
      `;
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navigation />

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-250px] top-[-250px] h-[700px] w-[700px] rounded-full bg-[#00ff88]/5 blur-3xl" />

        <div className="absolute bottom-[-250px] right-[-250px] h-[700px] w-[700px] rounded-full bg-[#00ff88]/5 blur-3xl" />
      </div>

      {/* MAIN HERO */}
      <section className="relative z-10 px-7 pb-8 pt-[120px]">
        <div className="mx-auto grid max-w-[1600px] gap-7 lg:grid-cols-[420px_1fr]">
          {/* LEFT ADDRESS HERO */}
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.45,
            }}
            className="
              flex
              h-[515px]
              flex-col
              justify-between
              rounded-[34px]
              border
              border-[#163B5E]
              bg-[radial-gradient(circle_at_top_left,#072544_0%,#031528_100%)]
              p-10
              shadow-[0_0_60px_rgba(0,0,0,0.45)]
            "
          >
            <div className="space-y-5">
              {/* ADDRESS */}
              <div>
                <p className="text-[11px] uppercase tracking-[0.38em] text-[#8DFF00]">
                  Address
                </p>

                <div className="mt-4 space-y-1">
                  <p className="text-[21px] leading-[1.35] text-[#F3F7FC]">
                    14400 NE 145th St, STE 302
                  </p>

                  <p className="text-[21px] leading-[1.35] text-[#F3F7FC]">
                    Woodinville, WA 98072
                  </p>

                  <p className="text-[21px] leading-[1.35] text-[#F3F7FC]">
                    United States
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <p className="text-[11px] uppercase tracking-[0.38em] text-[#8DFF00]">
                  Email
                </p>

                <a
                  href="mailto:info@pollensystems.com"
                  className="
                    mt-3
                    block
                    text-[19px]
                    text-white
                    transition-colors
                    hover:text-[#8DFF00]
                  "
                >
                  info@pollensystems.com
                </a>
              </div>

              {/* PHONE */}
              <div>
                <p className="text-[11px] uppercase tracking-[0.38em] text-[#8DFF00]">
                  Phone
                </p>

                <a
                  href="tel:+14255031693"
                  className="
                    mt-3
                    block
                    text-[19px]
                    text-white
                    transition-colors
                    hover:text-[#8DFF00]
                  "
                >
                  (425) 503-1693
                </a>
              </div>
            </div>

            {/* DIRECTIONS BUTTON */}
            <a
              href="https://maps.apple.com/?address=14400%20NE%20145th%20St,%20STE%20302,%20Woodinville,%20WA%2098072"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                h-[68px]
                w-full
                items-center
                justify-center
                rounded-[22px]
                bg-[#00D84F]
                text-[22px]
                font-semibold
                text-black
                transition-all
                duration-300
                hover:scale-[1.01]
                hover:bg-[#18F36A]
              "
            >
              Directions
            </a>
          </motion.div>

          {/* MAP HERO */}
          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.45,
            }}
            className="
              relative
              h-[515px]
              overflow-hidden
              rounded-[34px]
              border
              border-[#163B5E]
              bg-[#071B30]
              shadow-[0_0_60px_rgba(0,0,0,0.45)]
            "
          >
            <div
              ref={mapContainer}
              className="h-full w-full"
            />

            {/* DARK OVERLAY */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />

            {/* LIVE COORDS */}
            <div
              ref={coordsRef}
              className="
                absolute
                bottom-6
                right-6
                rounded-xl
                border
                border-white/10
                bg-[#031528]/90
                px-4
                py-2
                font-mono
                text-sm
                text-[#8DFF00]
                backdrop-blur-xl
              "
            >
              47.73447, -122.14919
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section
        id="contact-form"
        className="relative z-10 px-7 py-24"
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="
            mx-auto
            max-w-5xl
            rounded-[34px]
            border
            border-white/10
            bg-[#071B30]
            p-8
            shadow-[0_0_70px_rgba(0,0,0,0.4)]
            lg:p-14
          "
        >
          <p className="text-[11px] uppercase tracking-[0.38em] text-[#8DFF00]">
            Contact Pollen Systems
          </p>

          <h2 className="mt-5 text-5xl font-light tracking-tight">
            Start a Conversation
          </h2>

          <form className="mt-12 space-y-7">
            <div className="grid gap-7 lg:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-black/30
                  px-5
                  py-4
                  text-white
                  outline-none
                  transition-all
                  placeholder:text-[#6F8CA8]
                  focus:border-[#00ff88]
                "
              />

              <input
                type="email"
                placeholder="Email Address"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-black/30
                  px-5
                  py-4
                  text-white
                  outline-none
                  transition-all
                  placeholder:text-[#6F8CA8]
                  focus:border-[#00ff88]
                "
              />
            </div>

            <input
              type="text"
              placeholder="Company"
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/30
                px-5
                py-4
                text-white
                outline-none
                transition-all
                placeholder:text-[#6F8CA8]
                focus:border-[#00ff88]
              "
            />

            <textarea
              rows={7}
              placeholder="Tell us about your agriculture, drone, geospatial, or AI requirements."
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/30
                px-5
                py-4
                text-white
                outline-none
                transition-all
                placeholder:text-[#6F8CA8]
                focus:border-[#00ff88]
              "
            />

            <button
              type="submit"
              className="
                w-full
                rounded-2xl
                bg-[#00D84F]
                px-6
                py-5
                text-lg
                font-semibold
                text-black
                transition-all
                duration-300
                hover:bg-[#18F36A]
              "
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </section>
    </main>
  );
}