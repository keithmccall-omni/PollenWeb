"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function LiveMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,

      style:
        "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",

      center: [-120.5, 46.2], // Eastern Washington vineyards
      zoom: 6,
      pitch: 45,
      bearing: -17
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // MARKERS
    const locations = [
      {
        lng: -119.7,
        lat: 46.25,
      },
      {
        lng: -120.1,
        lat: 46.4,
      },
      {
        lng: -120.7,
        lat: 46.1,
      },
    ];

    locations.forEach((location) => {
      const el = document.createElement("div");

      el.className =
        "h-5 w-5 rounded-full bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.9)]";

      new maplibregl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .addTo(map);
    });

    // FLIGHT PATH
    map.on("load", () => {
      map.addSource("flight-path", {
        type: "geojson",

        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [-120.7, 46.1],
              [-120.3, 46.2],
              [-119.7, 46.25],
            ],
          },

          properties: {},
        },
      });

      map.addLayer({
        id: "flight-path-layer",

        type: "line",

        source: "flight-path",

        paint: {
          "line-color": "#4ade80",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });
    });

    return () => map.remove();
  }, []);

  return (
    <section className="relative bg-black py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-green-400">
            Live Geospatial Intelligence
          </p>

          <h2 className="mb-6 text-5xl font-bold md:text-6xl">
            Real Agricultural GIS Infrastructure
          </h2>

          <p className="mx-auto max-w-3xl text-xl text-zinc-400">
            Interactive geospatial intelligence powered by modern
            open-source mapping infrastructure.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10">
          <div
            ref={mapContainer}
            className="h-[700px] w-full"
          />
        </div>
      </div>
    </section>
  );
}