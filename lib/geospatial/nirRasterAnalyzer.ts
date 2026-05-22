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

  /*
    REAL IMAGE DIMENSIONS
  */

  imageWidth?: number;

  imageHeight?: number;

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

function degreesToRadians(
  degrees: number
) {
  return (degrees * Math.PI) / 180;
}

/*
  MUCH CLOSER TO ALTUM

  Previous:
    78 degrees

  Actual Altum:
    closer to ~48 horizontal
*/

function estimateGroundDimensions(
  altitude: number,

  imageWidth = 2064,

  imageHeight = 1544
) {
  /*
    ALTUM APPROXIMATE HFOV
  */

  const horizontalFov = 48;

  const groundWidth =
    2 *
    altitude *
    Math.tan(
      degreesToRadians(
        horizontalFov / 2
      )
    );

  /*
    PRESERVE ASPECT RATIO
  */

  const aspectRatio =
    imageHeight / imageWidth;

  const groundHeight =
    groundWidth * aspectRatio;

  return {
    width: groundWidth,

    height: groundHeight,
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

/*
  TRUE NDVI ANALYSIS

  Altum:
    _3 = RED
    _4 = NIR
*/

export async function analyzeNDVIRaster(
  redBuffer: Buffer,
  nirBuffer: Buffer,
  options: AnalyzeRasterOptions
): Promise<NDVIAnomalyPolygon[]> {
  const {
    longitude,
    latitude,
    altitude,
    heading,

    imageWidth = 2064,

    imageHeight = 1544,

    /*
      HIGHER RESOLUTION

      Produces smoother
      transitions and less
      chunky quilting.
    */

    gridResolution = 72,

    /*
      REDUCED OVERLAP

      Previous:
        1.12

      Tightens alignment
      substantially.
    */

    overlapMultiplier = 0.82,
  } = options;

  /*
    RED BAND
  */

  const redResized =
    await sharp(redBuffer)
      .resize({
        width: gridResolution,
        height: gridResolution,
        fit: "fill",
      })

      /*
        SMOOTHING
      */
      .blur(1.2)

      .greyscale()

      .raw()

      .toBuffer({
        resolveWithObject: true,
      });

  /*
    NIR BAND
  */

  const nirResized =
    await sharp(nirBuffer)
      .resize({
        width: gridResolution,
        height: gridResolution,
        fit: "fill",
      })

      /*
        SMOOTHING
      */
      .blur(1.2)

      .greyscale()

      .raw()

      .toBuffer({
        resolveWithObject: true,
      });

  const redPixels =
    redResized.data;

  const nirPixels =
    nirResized.data;

  const width =
    nirResized.info.width;

  const height =
    nirResized.info.height;

  const {
    width: groundWidth,
    height: groundHeight,
  } = estimateGroundDimensions(
    altitude,
    imageWidth,
    imageHeight
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
        TRUE NDVI

        Altum:
          _3 = RED
          _4 = NIR
      */

      const red =
        redPixels[idx] / 255;

      const nir =
        nirPixels[idx] / 255;

      /*
        NDVI
      */

      const ndvi =
        (nir - red) /
        (nir + red + 0.0001);

      /*
        NORMALIZE

        Converts:
          -1 -> 0
           0 -> 0.5
           1 -> 1
      */

      const enhanced =
        Math.max(
          0,
          Math.min(
            1,
            (ndvi + 1) / 2
          )
        );

      /*
        REAL NDVI THRESHOLDS

        roads/dirt -> RED
        stressed crops -> YELLOW
        healthy crops -> GREEN
      */

      const severity =
        ndvi >= 0.45
          ? "low"
          : ndvi >= 0.2
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