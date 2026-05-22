"use client";

import { useEffect, useRef, useState } from "react";

import maplibregl from "maplibre-gl";

import { Layers3 } from "lucide-react";

import {
  initializeFieldMap,
} from "@/lib/maps/initializeFieldMap";

import PrefixTree from "./components/PrefixTree";

import AnalysisQueue from "./components/AnalysisQueue";

import {
  usePrefixTree,
} from "./hooks/usePrefixTree";

import {
  useAnomalyLoader,
} from "./hooks/useAnomalyLoader";

interface BucketResponse {
  buckets: string[];
}

export default function FieldAnomalyMap() {
  const mapContainer =
    useRef<HTMLDivElement | null>(null);

  const mapRef =
    useRef<maplibregl.Map | null>(null);

  /*
    IMPORTANT:
    BLOCK PROCESSING UNTIL
    MAP FULLY LOADS
  */

  const [mapReady, setMapReady] =
    useState(false);

  const [buckets, setBuckets] = useState<
    string[]
  >([]);

  const [selectedBucket, setSelectedBucket] =
    useState("");

  /*
    PREFIX TREE
  */

  const {
    prefixTree,

    expandedPrefixes,

    selectedPrefix,

    setSelectedPrefix,

    togglePrefix,
  } = usePrefixTree(selectedBucket);

  /*
    ANOMALY LOADER
  */

  const {
    analysisFiles,

    isAnalyzing,

    loadAnomalies,
  } = useAnomalyLoader({
    selectedBucket,

    selectedPrefix,

    mapRef,
  });

  /*
    LOAD S3 BUCKETS
  */

  useEffect(() => {
    fetch("/api/aws/buckets")
      .then((r) => r.json())
      .then((data: BucketResponse) => {
        setBuckets(data.buckets || []);
      })
      .catch(console.error);
  }, []);

  /*
    INITIALIZE MAP
  */

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    const map =
      initializeFieldMap(
        mapContainer.current
      );

    mapRef.current = map;

    /*
      WAIT FOR REAL TILE RENDER
    */

    map.once("idle", () => {
      console.log(
        "Map fully ready"
      );

      /*
        FORCE A FINAL REPAINT
      */

      map.resize();

      map.triggerRepaint();

      /*
        GIVE BROWSER TIME
        TO RENDER TILES
      */

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMapReady(true);
        });
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <section className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#89ba2d] text-black">
            <Layers3 className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#8fd84f]">
              S3 FIELD INTELLIGENCE
            </p>

            <h1 className="text-3xl font-black">
              Field Anomaly Map
            </h1>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-[#080811] p-4">
          <div className="grid items-start gap-4 xl:grid-cols-[240px_420px_1fr]">

            {/* BUCKET */}

            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-[#a8a8bc]">
                S3 Bucket
              </label>

              <select
                value={selectedBucket}
                onChange={(e) =>
                  setSelectedBucket(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-[#2d4318] bg-[#11190b] px-3 py-2 text-[11px] text-[#d7e8bf]"
              >
                <option value="">
                  Select Bucket
                </option>

                {buckets.map((bucket) => (
                  <option
                    key={bucket}
                    value={bucket}
                  >
                    {bucket}
                  </option>
                ))}
              </select>
            </div>

            {/* PREFIX TREE */}

            <PrefixTree
              prefixTree={prefixTree}
              expandedPrefixes={
                expandedPrefixes
              }
              selectedPrefix={
                selectedPrefix
              }
              setSelectedPrefix={
                setSelectedPrefix
              }
              togglePrefix={togglePrefix}
            />

            {/* ANALYSIS */}

            <div className="space-y-3">

              {!mapReady && (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-300">
                  Initializing map tiles...
                </div>
              )}

              <button
                onClick={loadAnomalies}
                disabled={
                  !selectedPrefix ||
                  isAnalyzing ||
                  !mapReady
                }
                className="w-full rounded-lg bg-[#7fa52e] px-6 py-3 text-sm font-black text-black transition hover:bg-[#97bf42] disabled:opacity-40"
              >
                {!mapReady
                  ? "Loading Map..."
                  : isAnalyzing
                  ? `Processing ${analysisFiles.length.toLocaleString()} files...`
                  : analysisFiles.length > 0
                  ? `Load Anomalies from ${analysisFiles.length.toLocaleString()} files`
                  : "Load Anomalies"}
              </button>

              <AnalysisQueue
                analysisFiles={
                  analysisFiles
                }
              />
            </div>
          </div>
        </div>

        {/* MAP */}

        <div className="overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
          <div
            ref={mapContainer}
            className="h-[850px] w-full"
          />
        </div>
      </div>
    </section>
  );
}