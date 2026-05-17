"use client";

import { useEffect, useRef, useState } from "react";

import maplibregl from "maplibre-gl";

import * as turf from "@turf/turf";

import {
  ChevronDown,
  ChevronRight,
  Folder,
  Layers3,
  FileText,
} from "lucide-react";

import "maplibre-gl/dist/maplibre-gl.css";

interface PrefixResponse {
  prefixes: string[];
}

interface BucketResponse {
  buckets: string[];
}

interface Feature {
  type: "Feature";

  properties: {
    file: string;
    severity: "low" | "medium" | "high";
    meanIntensity: number;
    altitude: number;
    heading: number;
    infrared: boolean;
  };

  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

interface AnalysisFile {
  name: string;
  progress: number;
  status:
    | "Queued"
    | "Loading"
    | "Analyzing"
    | "Complete";
}

export default function FieldAnomalyMap() {
  const mapContainer =
    useRef<HTMLDivElement | null>(null);

  const mapRef =
    useRef<maplibregl.Map | null>(null);

  const [buckets, setBuckets] = useState<
    string[]
  >([]);

  const [selectedBucket, setSelectedBucket] =
    useState("");

  const [selectedPrefix, setSelectedPrefix] =
    useState("");

  const [expandedPrefixes, setExpandedPrefixes] =
    useState<string[]>([]);

  const [prefixTree, setPrefixTree] = useState<
    Record<string, string[]>
  >({});

  const [analysisFiles, setAnalysisFiles] =
    useState<AnalysisFile[]>([]);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  useEffect(() => {
    fetch("/api/aws/buckets")
      .then((r) => r.json())
      .then((data: BucketResponse) => {
        setBuckets(data.buckets || []);
      })
      .catch(console.error);
  }, []);

  async function loadPrefixes(prefix: string) {
    try {
      const response = await fetch(
        `/api/aws/prefixes?bucket=${selectedBucket}&prefix=${encodeURIComponent(
          prefix
        )}`
      );

      const data: PrefixResponse =
        await response.json();

      setPrefixTree((prev) => ({
        ...prev,
        [prefix]: data.prefixes || [],
      }));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!selectedBucket) return;

    setPrefixTree({});
    setExpandedPrefixes([]);
    setSelectedPrefix("");
    setAnalysisFiles([]);

    loadPrefixes("");
  }, [selectedBucket]);

  function togglePrefix(prefix: string) {
    const expanded =
      expandedPrefixes.includes(prefix);

    if (expanded) {
      setExpandedPrefixes((prev) =>
        prev.filter((p) => p !== prefix)
      );

      return;
    }

    setExpandedPrefixes((prev) => [
      ...prev,
      prefix,
    ]);

    if (!prefixTree[prefix]) {
      loadPrefixes(prefix);
    }
  }

  function initializeMap() {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,

      style:
        "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",

      center: [-120.5, 46.2],

      zoom: 10,

      pitch: 35,
    });

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    map.on("load", () => {
      map.addSource("boundaries", {
        type: "geojson",

        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addSource("stress", {
        type: "geojson",

        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      /*
        IMAGE OUTLINES
      */

      map.addLayer({
        id: "boundary-outline",

        type: "line",

        source: "boundaries",

        paint: {
          "line-color": "#a8d84f",
          "line-width": 2,
        },
      });

      /*
        STRESS PIXELS
      */

      map.addLayer({
        id: "stress-pixels",

        type: "circle",

        source: "stress",

        paint: {
          "circle-radius": 1.5,

          "circle-color": [
            "match",

            ["get", "severity"],

            "high",
            "#ff0000",

            "medium",
            "#ffaa00",

            "low",
            "#ffff66",

            "#00ff66",
          ],

          "circle-opacity": 0.9,
        },
      });
    });

    mapRef.current = map;
  }

  useEffect(() => {
    initializeMap();

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  function generateStressPoints(
    polygon: number[][],
    severity:
      | "low"
      | "medium"
      | "high"
  ) {
    const points: any[] = [];

    const minLng = Math.min(
      ...polygon.map((p) => p[0])
    );

    const maxLng = Math.max(
      ...polygon.map((p) => p[0])
    );

    const minLat = Math.min(
      ...polygon.map((p) => p[1])
    );

    const maxLat = Math.max(
      ...polygon.map((p) => p[1])
    );

    const count =
      severity === "high"
        ? 40
        : severity === "medium"
        ? 20
        : 8;

    for (let i = 0; i < count; i++) {
      const lng =
        minLng +
        Math.random() *
          (maxLng - minLng);

      const lat =
        minLat +
        Math.random() *
          (maxLat - minLat);

      points.push({
        type: "Feature",

        properties: {
          severity,
        },

        geometry: {
          type: "Point",

          coordinates: [lng, lat],
        },
      });
    }

    return points;
  }

  function mergeOverlappingPolygons(
  polygons: any[]
) {
  if (polygons.length === 0) {
    return [];
  }

  const merged: any[] = [];

  for (const polygon of polygons) {
    let mergedIntoExisting = false;

    for (
      let i = 0;
      i < merged.length;
      i++
    ) {
      try {
        const intersects =
          turf.booleanIntersects(
            merged[i],
            polygon
          );

        if (intersects) {
          const unioned = turf.union(
            turf.featureCollection([
              merged[i],
              polygon,
            ])
          );

          if (unioned) {
            merged[i] = unioned;
            mergedIntoExisting = true;
            break;
          }
        }
      } catch (error) {
        console.error(
          "Polygon union error:",
          error
        );
      }
    }

    if (!mergedIntoExisting) {
      merged.push(polygon);
    }
  }

  return merged;
}

async function loadAnomalies() {
    if (!selectedBucket || !selectedPrefix)
      return;

    setIsAnalyzing(true);

    setAnalysisFiles([]);

    try {
      /*
        ENUMERATE FILES FIRST
      */

      const filesResponse = await fetch(
        `/api/aws/files?bucket=${selectedBucket}&prefix=${encodeURIComponent(
          selectedPrefix
        )}`
      );

      const filesJson =
        await filesResponse.json();

      const allFiles =
        filesJson.files || [];

      const imageryFiles =
        allFiles.filter(
          (file: any) =>
            file.key.endsWith(".jpg") ||
            file.key.endsWith(".jpeg") ||
            file.key.endsWith(".tif") ||
            file.key.endsWith(".tiff")
        );

      /*
        BUILD QUEUE IMMEDIATELY
      */

      const queue =
        imageryFiles.map((file: any) => ({
          name:
            file.key.split("/").pop() ||
            file.key,

          progress: 0,

          status: "Queued" as const,
        }));

      setAnalysisFiles(queue);

      /*
        REAL ANALYSIS
      */

      const response = await fetch(
        `/api/anomalies?bucket=${selectedBucket}&prefix=${encodeURIComponent(
          selectedPrefix
        )}`
      );

      const geojson: FeatureCollection =
        await response.json();

      console.log(
        "Returned features:",
        geojson.features.length
      );

      const map = mapRef.current;

      if (!map) return;

      const boundarySource =
        map.getSource(
          "boundaries"
        ) as maplibregl.GeoJSONSource;

      const stressSource =
        map.getSource(
          "stress"
        ) as maplibregl.GeoJSONSource;

      const renderedBoundaries: any[] = [];

      const quiltPolygons: any[] = [];

      const renderedStress: any[] = [];

      for (
        let i = 0;
        i < geojson.features.length;
        i++
      ) {
        const feature =
          geojson.features[i];

        /*
          STATUS UPDATE
        */

        setAnalysisFiles((prev) =>
          prev.map((item, idx) =>
            idx === i
              ? {
                  ...item,
                  status: "Analyzing",
                  progress: 70,
                }
              : item
          )
        );

        /*
          ADD REAL BOUNDARY
        */

        renderedBoundaries.push(
          feature
        );

        quiltPolygons.push(feature);

        let quilt: any[] = [];

        try {
          quilt = mergeOverlappingPolygons(
            quiltPolygons
          );
        } catch (error) {
          console.error(
            "Quilt merge failed:",
            error
          );

          quilt = renderedBoundaries;
        }

        boundarySource.setData({
          type: "FeatureCollection",

          features: quilt,
        } as any);

        /*
          STRESS PIXELS
        */

        const polygon =
          feature.geometry.coordinates[0];

        const stressPoints =
          generateStressPoints(
            polygon,
            feature.properties
              .severity
          );

        renderedStress.push(
          ...stressPoints
        );

        stressSource.setData({
          type: "FeatureCollection",

          features: renderedStress,
        } as any);

        /*
          COMPLETE
        */

        setAnalysisFiles((prev) =>
          prev.map((item, idx) =>
            idx === i
              ? {
                  ...item,
                  status: "Complete",
                  progress: 100,
                }
              : item
          )
        );

        await new Promise((r) =>
          setTimeout(r, 5)
        );
      }

      /*
        FIT MAP
      */

      if (
        geojson.features.length > 0
      ) {
        const bounds =
          new maplibregl.LngLatBounds();

        geojson.features.forEach(
          (f) => {
            f.geometry.coordinates[0].forEach(
              (coord) => {
                bounds.extend([
                  coord[0],
                  coord[1],
                ]);
              }
            );
          }
        );

        map.fitBounds(bounds, {
          padding: 100,
          duration: 1200,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function renderPrefix(
    prefix: string,
    level = 0
  ) {
    const expanded =
      expandedPrefixes.includes(prefix);

    const children =
      prefixTree[prefix] || [];

    const name =
      prefix
        .split("/")
        .filter(Boolean)
        .pop() || prefix;

    return (
      <div
        key={prefix}
        className="border-b border-[#2d4318]"
      >
        <div
          className={`flex items-center justify-between px-2 py-1.5 transition-all hover:bg-[#1a260f] ${
            selectedPrefix === prefix
              ? "bg-[#24360f]"
              : ""
          }`}
          style={{
            paddingLeft: `${
              level * 14 + 8
            }px`,
          }}
        >
          <button
            onClick={() =>
              togglePrefix(prefix)
            }
            className="flex flex-1 items-center gap-1.5 text-left"
          >
            {expanded ? (
              <ChevronDown className="h-3 w-3 shrink-0 text-[#9ccc52]" />
            ) : (
              <ChevronRight className="h-3 w-3 shrink-0 text-[#9ccc52]" />
            )}

            <Folder className="h-3 w-3 shrink-0 text-[#d9a441]" />

            <span className="truncate text-[11px] font-medium text-[#d7e8bf]">
              {name}
            </span>
          </button>

          <button
            onClick={async () => {
              setSelectedPrefix(prefix);

              try {
                const filesResponse = await fetch(
                  `/api/aws/files?bucket=${selectedBucket}&prefix=${encodeURIComponent(prefix)}`
                );

                const filesJson = await filesResponse.json();

                const allFiles = filesJson.files || [];

                const imageryFiles = allFiles.filter(
                  (file: any) =>
                    file.key.endsWith(".jpg") ||
                    file.key.endsWith(".jpeg") ||
                    file.key.endsWith(".tif") ||
                    file.key.endsWith(".tiff")
                );

                const queue = imageryFiles.map(
                  (file: any) => ({
                    name:
                      file.key.split("/").pop() ||
                      file.key,

                    progress: 0,

                    status: "Queued" as const,
                  })
                );

                setAnalysisFiles(queue);
              } catch (error) {
                console.error(error);
              }
            }}
            className={`rounded px-2 py-[1px] text-[9px] font-bold transition-all ${
              selectedPrefix === prefix
                ? "bg-[#7fa52e] text-white"
                : "bg-[#314915] text-[#d9efb0] hover:bg-[#4f7520]"
            }`}
          >
            OPEN
          </button>
        </div>

        {expanded &&
          children.map((child) =>
            renderPrefix(
              child,
              level + 1
            )
          )}
      </div>
    );
  }

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

            <div className="overflow-hidden rounded-xl border border-[#2d4318] bg-[#10180b] max-h-[320px] overflow-y-auto">
              {(prefixTree[""] || []).map(
                (prefix) =>
                  renderPrefix(prefix)
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={loadAnomalies}
                disabled={
                  !selectedPrefix ||
                  isAnalyzing
                }
                className="w-full rounded-lg bg-[#7fa52e] px-6 py-3 text-sm font-black text-black transition hover:bg-[#97bf42] disabled:opacity-40"
              >
                {isAnalyzing
                  ? `Processing ${analysisFiles.length.toLocaleString()} files...`
                  : analysisFiles.length > 0
                  ? `Load Anomalies from ${analysisFiles.length.toLocaleString()} files`
                  : "Load Anomalies"}
              </button>

              <div className="rounded-xl border border-[#2d4318] bg-[#10180b] p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white">
                      Real IR Analysis
                    </h3>

                    <p className="text-[10px] text-[#91a28b]">
                      EXIF + intensity analysis
                    </p>
                  </div>

                  <div className="rounded-full bg-[#23350d] px-2 py-1 text-[9px] font-black text-[#b7ea6f]">
                    {analysisFiles.length} FILES
                  </div>
                </div>

                <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                  {analysisFiles.map(
                    (file) => (
                      <div
                        key={file.name}
                        className="rounded-lg border border-white/5 bg-black/30 p-2"
                      >
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="h-3 w-3 shrink-0 text-[#8fd84f]" />

                            <div className="truncate text-[10px] font-semibold text-white">
                              {file.name}
                            </div>
                          </div>

                          <div className="text-[9px] font-black uppercase tracking-wide text-[#8fcf4f]">
                            {file.status}
                          </div>
                        </div>

                        <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-[#182512]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#6cae2d] to-[#b4e15f] transition-all duration-300"
                            style={{
                              width: `${file.progress}%`,
                            }}
                          />
                        </div>

                        <div className="text-right text-[9px] font-bold text-[#9fb28f]">
                          {file.progress}%
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

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
