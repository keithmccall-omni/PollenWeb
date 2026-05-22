import { useState } from "react";

import maplibregl from "maplibre-gl";

import {
  mergeOverlappingPolygons,
  waitForNextFrame,
} from "@/lib/maps/polygonUtils";

interface Feature {
  type: "Feature";

  properties: {
    file: string;

    severity:
      | "low"
      | "medium"
      | "high";

    meanIntensity: number;

    altitude: number;

    heading: number;

    infrared: boolean;

    imageUrl?: string;

    footprint?: number[][];
  };

  geometry: {
    type: "Polygon";

    coordinates: number[][][];
  };
}

export interface AnalysisFile {
  name: string;

  progress: number;

  status:
    | "Queued"
    | "Loading"
    | "Analyzing"
    | "Complete"
    | "Error";
}

interface UseAnomalyLoaderProps {
  selectedBucket: string;

  selectedPrefix: string;

  mapRef: React.RefObject<
    maplibregl.Map | null
  >;
}

export function useAnomalyLoader({
  selectedBucket,

  selectedPrefix,

  mapRef,
}: UseAnomalyLoaderProps) {
  const [analysisFiles, setAnalysisFiles] =
    useState<AnalysisFile[]>([]);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  async function loadAnomalies() {
    if (
      !selectedBucket ||
      !selectedPrefix
    ) {
      return;
    }

    setIsAnalyzing(true);

    setAnalysisFiles([]);

    try {
      /*
        WAIT FOR MAP
      */

      const map = mapRef.current;

      if (!map) {
        return;
      }

      if (!map.isStyleLoaded()) {
        await new Promise<void>(
          (resolve) => {
            map.once("idle", () => {
              resolve();
            });
          }
        );
      }

      /*
        LOAD FILE LIST
      */

      const filesResponse =
        await fetch(
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
            file.key.endsWith(".tif") ||
            file.key.endsWith(".tiff")
        );

      /*
        BUILD QUEUE
      */

      const queue =
        imageryFiles.map((file: any) => ({
          name:
            file.key
              .split("/")
              .pop() || file.key,

          progress: 0,

          status: "Queued" as const,
        }));

      setAnalysisFiles(queue);

      await waitForNextFrame();

      /*
        STREAM ANALYSIS
      */

      const response = await fetch(
        `/api/anomalies?bucket=${selectedBucket}&prefix=${encodeURIComponent(
          selectedPrefix
        )}`,
        {
          method: "GET",

          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Streaming failed"
        );
      }

      if (!response.body) {
        throw new Error(
          "No response body"
        );
      }

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let buffer = "";

      let featureIndex = 0;

      const renderedBoundaries: any[] =
        [];

      const quiltPolygons: any[] = [];

      const renderedStress: any[] = [];

      const loadedImages =
        new Set<string>();

      const boundarySource =
        map.getSource(
          "boundaries"
        ) as maplibregl.GeoJSONSource;

      const stressSource =
        map.getSource(
          "stress"
        ) as maplibregl.GeoJSONSource;

      const bounds =
        new maplibregl.LngLatBounds();

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines =
          buffer.split("\n");

        buffer =
          lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }

          let feature: Feature;

          try {
            feature = JSON.parse(line);
          } catch {
            continue;
          }

          /*
            QUEUE: LOADING
          */

          setAnalysisFiles((prev) =>
            prev.map((item, idx) =>
              idx === featureIndex
                ? {
                    ...item,

                    status: "Loading",

                    progress: 25,
                  }
                : item
            )
          );

          await waitForNextFrame();

          /*
            LOAD REAL NIR IMAGE
          */

          if (
            feature.properties
              .imageUrl &&
            feature.properties
              .footprint &&
            !loadedImages.has(
              feature.properties.file
            )
          ) {
            const imageId = `nir-${feature.properties.file}`;
            const layerId = `nir-layer-${feature.properties.file}`;

            try {
              if (
                !map.getSource(imageId)
              ) {
                map.addSource(imageId, {
                  type: "image",

                  url:
                    feature.properties
                      .imageUrl,

                  coordinates:
                    feature.properties
                      .footprint as any,
                });

                map.addLayer({
                  id: layerId,

                  type: "raster",

                  source: imageId,

                  paint: {
                    /*
                      SEMI TRANSPARENT
                      REAL NIR IMAGE
                    */

                    "raster-opacity":
                      0.58,

                    /*
                      SOFTEN IMAGE
                    */

                    "raster-fade-duration":
                      0,
                  },
                });

                loadedImages.add(
                  feature.properties.file
                );
              }
            } catch (imageError) {
              console.error(
                imageError
              );
            }
          }

          /*
            QUEUE: ANALYZING
          */

          setAnalysisFiles((prev) =>
            prev.map((item, idx) =>
              idx === featureIndex
                ? {
                    ...item,

                    status: "Analyzing",

                    progress: 70,
                  }
                : item
            )
          );

          /*
            POLYGONS
          */

          renderedBoundaries.push(
            feature
          );

          quiltPolygons.push(feature);

          let quilt: any[] = [];

          try {
            quilt =
              mergeOverlappingPolygons(
                quiltPolygons
              );
          } catch {
            quilt =
              renderedBoundaries;
          }

          boundarySource.setData({
            type: "FeatureCollection",

            features: quilt,
          } as any);

          renderedStress.push(feature);

          stressSource.setData({
            type: "FeatureCollection",

            features: renderedStress,
          } as any);

          /*
            FIT MAP
          */

          const polygon =
            feature.geometry
              .coordinates[0];

          polygon.forEach((coord) => {
            bounds.extend([
              coord[0],
              coord[1],
            ]);
          });

          map.fitBounds(bounds, {
            padding: 80,

            duration: 0,
          });

          map.triggerRepaint();

          await waitForNextFrame();

          /*
            COMPLETE
          */

          setAnalysisFiles((prev) =>
            prev.map((item, idx) =>
              idx === featureIndex
                ? {
                    ...item,

                    status: "Complete",

                    progress: 100,
                  }
                : item
            )
          );

          featureIndex++;

          await waitForNextFrame();
        }
      }
    } catch (error) {
      console.error(
        "loadAnomalies failed:",
        error
      );

      setAnalysisFiles((prev) =>
        prev.map((item) => ({
          ...item,

          status: "Error",
        }))
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return {
    analysisFiles,

    isAnalyzing,

    loadAnomalies,

    setAnalysisFiles,
  };
}