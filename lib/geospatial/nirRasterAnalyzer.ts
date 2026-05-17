import sharp from "sharp";

export interface NDVIAnomalyPolygon {
  type: "Feature";

  properties: {
    severity:
      | "low"
      | "medium"
      | "high";

    meanNdvi: number;

    pixelCount: number;
  };

  geometry: {
    type: "Polygon";

    coordinates: number[][][];
  };
}

export interface AnalyzeRasterOptions {
  longitude: number;

  latitude: number;

  altitude: number;

  heading: number;

  gridResolution?: number;

  overlapMultiplier?: number;
}

function metersToLongitudeDegrees(
  meters: number,
  latitude: number
) {
  return (
    meters /
    (111320 *
      Math.cos(
        (latitude * Math.PI) / 180
      ))
  );
}

function metersToLatitudeDegrees(
  meters: number
) {
  return meters / 111320;
}

function estimateGroundDimensions(
  altitude: number
) {
  const assumedFov = 78;

  const width =
    2 *
    altitude *
    Math.tan(
      ((assumedFov / 2) * Math.PI) /
        180
    );

  const height = width * 0.75;

  return {
    width,
    height,
  };
}

function rotatePoint(
  x: number,
  y: number,
  angleDegrees: number
) {
  const angle =
    (angleDegrees * Math.PI) / 180;

  return {
    x:
      x * Math.cos(angle) -
      y * Math.sin(angle),

    y:
      x * Math.sin(angle) +
      y * Math.cos(angle),
  };
}

/*
  SMALL OVERLAP

  Enough to blend neighboring
  polygons without creating
  giant sheets.
*/

function buildPixelPolygon(
  centerLng: number,
  centerLat: number,
  sizeMeters: number,
  heading: number
) {
  const half = sizeMeters / 2;

  const corners = [
    {
      x: -half,
      y: -half,
    },

    {
      x: half,
      y: -half,
    },

    {
      x: half,
      y: half,
    },

    {
      x: -half,
      y: half,
    },
  ];

  const rotated = corners.map((c) =>
    rotatePoint(
      c.x,
      c.y,
      heading
    )
  );

  const polygon = rotated.map((c) => [
    centerLng +
      metersToLongitudeDegrees(
        c.x,
        centerLat
      ),

    centerLat +
      metersToLatitudeDegrees(c.y),
  ]);

  polygon.push(polygon[0]);

  return polygon;
}

/*
  PRIORITY PRESERVATION

  Green stays green.
  Yellow stays yellow.
*/

const severityPriority = {
  low: 3,
  medium: 2,
  high: 1,
};

export async function analyzeNearInfraredRaster(
  buffer: Buffer,
  options: AnalyzeRasterOptions
): Promise<NDVIAnomalyPolygon[]> {
  const {
    longitude,
    latitude,
    altitude,
    heading,

    /*
      HIGHER RESOLUTION

      Previous:
        36

      New:
        72

      Produces smoother
      transitions and less
      chunky quilting.
    */

    gridResolution = 72,

    overlapMultiplier = 1.12,
  } = options;

  /*
    SMOOTHED RASTER

    IMPORTANT:
    Blur removes the harsh
    checkerboard effect from
    individual raster cells.
  */

  const resized =
    await sharp(buffer)
      .resize({
        width: gridResolution,
        height: gridResolution,
        fit: "fill",
      })

      /*
        SMOOTHING
      */
      .blur(1.2)

      /*
        BAND-4 GRAYSCALE
      */
      .greyscale()

      .raw()

      .toBuffer({
        resolveWithObject: true,
      });

  const pixels = resized.data;

  const width = resized.info.width;

  const height = resized.info.height;

  const {
    width: groundWidth,
    height: groundHeight,
  } = estimateGroundDimensions(
    altitude
  );

  const cellWidthMeters =
    groundWidth / width;

  const cellHeightMeters =
    groundHeight / height;

  const polygonSizeMeters =
    Math.max(
      cellWidthMeters,
      cellHeightMeters
    ) * overlapMultiplier;

  /*
    GRID DEDUP

    Preserves healthier states.
  */

  const polygonMap =
    new Map<
      string,
      NDVIAnomalyPolygon
    >();

  for (
    let y = 0;
    y < height;
    y++
  ) {
    for (
      let x = 0;
      x < width;
      x++
    ) {
      const idx =
        y * width + x;

      /*
        RAW BAND-4 VALUE

        Your imagery appears
        inverted:

          dark canopy
          bright roads

        So invert it.
      */

      const raw =
        pixels[idx] / 255;

      const vegetationScore =
        1 - raw;

      /*
        CONTRAST ENHANCEMENT
      */

      const enhanced =
        Math.pow(
          vegetationScore,
          1.35
        );

      /*
        HEALTHY = GREEN
      */

      const severity =
        enhanced >= 0.72
          ? "low"
          : enhanced >= 0.48
          ? "medium"
          : "high";

      /*
        IMAGE POSITION
      */

      const relativeX =
        x / width - 0.5;

      const relativeY =
        y / height - 0.5;

      const meterX =
        relativeX * groundWidth;

      const meterY =
        relativeY * groundHeight;

      /*
        APPLY FLIGHT ROTATION
      */

      const rotated = rotatePoint(
        meterX,
        meterY,
        heading
      );

      const pointLng =
        longitude +
        metersToLongitudeDegrees(
          rotated.x,
          latitude
        );

      const pointLat =
        latitude +
        metersToLatitudeDegrees(
          rotated.y
        );

      /*
        BUILD POLYGON
      */

      const polygon =
        buildPixelPolygon(
          pointLng,
          pointLat,
          polygonSizeMeters,
          heading
        );

      /*
        GRID KEY

        Used to arbitrate overlap.
      */

      const gridKey = `${Math.round(
        pointLng * 100000
      )}_${Math.round(
        pointLat * 100000
      )}`;

      const existing =
        polygonMap.get(gridKey);

      /*
        HEALTHIER STATE WINS

        Prevents:
          green -> yellow
          yellow -> red
      */

      if (existing) {
        const existingPriority =
          severityPriority[
            existing.properties
              .severity
          ];

        const incomingPriority =
          severityPriority[
            severity
          ];

        if (
          existingPriority >=
          incomingPriority
        ) {
          continue;
        }
      }

      polygonMap.set(gridKey, {
        type: "Feature",

        properties: {
          severity,

          meanNdvi: enhanced,

          pixelCount: 1,
        },

        geometry: {
          type: "Polygon",

          coordinates: [polygon],
        },
      });
    }
  }

  return Array.from(
    polygonMap.values()
  );
}