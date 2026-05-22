import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

export function initializeFieldMap(
  container: HTMLDivElement
) {
  const map = new maplibregl.Map({
    container,

    style: {
      version: 8,

      sources: {
        satellite: {
          type: "raster",

          tiles: [
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],

          tileSize: 256,

          attribution: "© Esri",
        },

        labels: {
          type: "raster",

          tiles: [
            "https://basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
          ],

          tileSize: 256,

          attribution:
            "© OpenStreetMap contributors © CARTO",
        },
      },

      layers: [
        {
          id: "satellite-layer",

          type: "raster",

          source: "satellite",
        },

        {
          id: "label-layer",

          type: "raster",

          source: "labels",
        },
      ],
    },

    center: [-120.5, 46.2],

    zoom: 10,

    pitch: 35,
  });

  map.addControl(
    new maplibregl.NavigationControl(),
    "top-right"
  );

  map.on("load", () => {
    /*
      BOUNDARY SOURCE
    */

    map.addSource("boundaries", {
      type: "geojson",

      data: {
        type: "FeatureCollection",

        features: [],
      },
    });

    /*
      STRESS SOURCE
    */

    map.addSource("stress", {
      type: "geojson",

      data: {
        type: "FeatureCollection",

        features: [],
      },
    });

    /*
      FOOTPRINT OUTLINES
    */

    map.addLayer({
      id: "boundary-outline",

      type: "line",

      source: "boundaries",

      paint: {
        "line-color": "#a8d84f",

        "line-width": 1.5,

        "line-opacity": 0.6,
      },
    });

    /*
      STRESS POLYGONS
    */

    map.addLayer({
      id: "stress-polygons",

      type: "fill",

      source: "stress",

      paint: {
        "fill-color": [
          "match",

          ["get", "severity"],

          /*
            HIGH STRESS
          */
          "high",
          "#ff0000",

          /*
            MODERATE STRESS
          */
          "medium",
          "#ffd000",

          /*
            HEALTHY
          */
          "low",
          "#00ff66",

          /*
            FALLBACK
          */
          "#00ff66",
        ],

        "fill-opacity": 0.55,
      },
    });

    /*
      POLYGON EDGES
    */

    map.addLayer({
      id: "stress-outline",

      type: "line",

      source: "stress",

      paint: {
        "line-color": [
          "match",

          ["get", "severity"],

          "high",
          "#ff5555",

          "medium",
          "#ffe066",

          "low",
          "#66ff99",

          "#66ff99",
        ],

        "line-width": 0.5,

        "line-opacity": 0.4,
      },
    });
  });

  return map;
}