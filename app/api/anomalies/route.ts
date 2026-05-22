import { NextRequest } from "next/server";

import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
  type ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";

import * as exifr from "exifr";

import sharp from "sharp";

import {
  analyzeNDVIRaster,
} from "@/lib/geospatial/nirRasterAnalyzer";

export const runtime = "nodejs";

export const dynamic =
  "force-dynamic";

const s3 = new S3Client({
  region:
    process.env.AWS_REGION ||
    "us-east-1",

  credentials: {
    accessKeyId:
      process.env.AWS_ACCESS_KEY_ID || "",

    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

interface GeoJSONFeature {
  type: "Feature";

  properties: {
    file: string;

    status: string;

    altitude: number;

    heading: number;

    severity:
      | "low"
      | "medium"
      | "high";

    infrared: boolean;

    meanIntensity: number;
  };

  geometry: {
    type: "Polygon";

    coordinates: number[][][];
  };
}

function degreesToRadians(
  degrees: number
) {
  return (degrees * Math.PI) / 180;
}

function rotatePoint(
  x: number,
  y: number,
  angleDegrees: number
) {
  const angle = degreesToRadians(
    angleDegrees
  );

  return {
    x:
      x * Math.cos(angle) -
      y * Math.sin(angle),

    y:
      x * Math.sin(angle) +
      y * Math.cos(angle),
  };
}

function createFootprintPolygon(
  longitude: number,
  latitude: number,
  altitude: number,
  heading: number
) {
  const assumedFov = 78;

  const groundWidthMeters =
    2 *
    altitude *
    Math.tan(
      degreesToRadians(
        assumedFov / 2
      )
    );

  const groundHeightMeters =
    groundWidthMeters * 0.75;

  const metersToDegreesLat =
    1 / 111320;

  const metersToDegreesLng =
    1 /
    (111320 *
      Math.cos(
        degreesToRadians(latitude)
      ));

  const halfWidth =
    groundWidthMeters / 2;

  const halfHeight =
    groundHeightMeters / 2;

  const corners = [
    {
      x: -halfWidth,
      y: -halfHeight,
    },

    {
      x: halfWidth,
      y: -halfHeight,
    },

    {
      x: halfWidth,
      y: halfHeight,
    },

    {
      x: -halfWidth,
      y: halfHeight,
    },
  ];

  const rotatedCorners = corners.map(
    (corner) =>
      rotatePoint(
        corner.x,
        corner.y,
        heading
      )
  );

  const coordinates =
    rotatedCorners.map((corner) => [
      longitude +
        corner.x *
          metersToDegreesLng,

      latitude +
        corner.y *
          metersToDegreesLat,
    ]);

  coordinates.push(coordinates[0]);

  return coordinates;
}

async function streamToBuffer(
  stream: any
): Promise<Buffer> {
  const chunks: Buffer[] = [];

  return new Promise(
    (resolve, reject) => {
      stream.on(
        "data",
        (chunk: Buffer) =>
          chunks.push(chunk)
      );

      stream.on("error", reject);

      stream.on("end", () =>
        resolve(Buffer.concat(chunks))
      );
    }
  );
}

function isInfraredImage(
  key: string,
  metadata: any
) {
  const lowerKey =
    key.toLowerCase();

  const model =
    (
      metadata?.Model ||
      metadata?.model ||
      ""
    ).toLowerCase();

  return (
    lowerKey.includes("_0004") ||
    lowerKey.includes("nir") ||
    lowerKey.includes("rededge") ||
    lowerKey.includes(
      "multispectral"
    ) ||
    model.includes("m3m") ||
    model.includes("multispectral") ||
    model.includes("rededge")
  );
}

function classifySeverity(
  meanIntensity: number
):
  | "low"
  | "medium"
  | "high" {
  if (meanIntensity < 0.2) {
    return "high";
  }

  if (meanIntensity < 0.45) {
    return "medium";
  }

  return "low";
}

async function calculateMeanIntensity(
  buffer: Buffer
): Promise<number> {
  try {
    const { data } =
      await sharp(buffer)
        .greyscale()
        .raw()
        .toBuffer({
          resolveWithObject: true,
        });

    let total = 0;

    for (
      let i = 0;
      i < data.length;
      i++
    ) {
      total += data[i];
    }

    return (
      total / data.length / 255
    );
  } catch (error) {
    console.error(error);

    return 0.5;
  }
}

function getMatchingNIRKey(
  redKey: string
) {
  return redKey
    .replace("_3.tif", "_4.tif")
    .replace("_3.tiff", "_4.tiff")
    .replace("_3.TIF", "_4.TIF")
    .replace("_3.TIFF", "_4.TIFF")
    .replace("_0003", "_0004");
}

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const bucket =
      searchParams.get("bucket");

    const prefix =
      searchParams.get("prefix") || "";

    if (!bucket) {
      return new Response(
        JSON.stringify({
          error: "Missing bucket",
        }),
        {
          status: 400,
        }
      );
    }

    /*
      FULL PAGINATED ENUMERATION
    */

    let continuationToken:
      | string
      | undefined = undefined;

    const allObjects: any[] = [];

    do {
      const response: ListObjectsV2CommandOutput =
        await s3.send(
          new ListObjectsV2Command({
            Bucket: bucket,

            Prefix: prefix,

            ContinuationToken:
              continuationToken,
          })
        );

      const contents =
        response.Contents || [];

      allObjects.push(...contents);

      continuationToken =
        response.NextContinuationToken;
    } while (continuationToken);

    /*
      ALTUM:

      _3 = RED
      _4 = NIR
    */

    const redFiles = allObjects.filter(
      (item) => {
        if (!item.Key) {
          return false;
        }

        const key =
          item.Key.toLowerCase();

        const isBand3 =
          key.includes("_0003") ||
          key.endsWith("_3.tif") ||
          key.endsWith("_3.tiff");

        return (
          !key.endsWith("/") &&
          isBand3 &&
          (key.endsWith(".tif") ||
            key.endsWith(".tiff"))
        );
      }
    );

    console.log(
      `Enumerated ${redFiles.length.toLocaleString()} RED band files`
    );

    /*
      STREAMING NDJSON
    */

    const stream = new ReadableStream({
      async start(controller) {
        const encoder =
          new TextEncoder();

        let processedCount = 0;

        for (const redFile of redFiles) {
          try {
            console.log(
              `Processing ${processedCount + 1}/${redFiles.length}: ${redFile.Key}`
            );

            const redKey =
              redFile.Key;

            if (!redKey) {
              continue;
            }

            /*
              FIND MATCHING NIR
            */

            const nirKey =
              getMatchingNIRKey(
                redKey
              );

            const nirFile =
              allObjects.find(
                (item) =>
                  item.Key === nirKey
              );

            if (!nirFile) {
              console.warn(
                `Missing NIR pair for ${redKey}`
              );

              continue;
            }

            /*
              FETCH RED
            */

            const redObjectResponse =
              await s3.send(
                new GetObjectCommand({
                  Bucket: bucket,

                  Key: redKey,
                })
              );

            /*
              FETCH NIR
            */

            const nirObjectResponse =
              await s3.send(
                new GetObjectCommand({
                  Bucket: bucket,

                  Key: nirKey,
                })
              );

            if (
              !redObjectResponse.Body ||
              !nirObjectResponse.Body
            ) {
              continue;
            }

            /*
              BUFFER IMAGES
            */

            const redBuffer =
              await streamToBuffer(
                redObjectResponse.Body
              );

            const nirBuffer =
              await streamToBuffer(
                nirObjectResponse.Body
              );

            /*
              EXIF

              Use RED image EXIF
              for positioning.
            */

            const metadata =
              await exifr.parse(
                redBuffer,
                {
                  gps: true,
                  xmp: true,
                  tiff: true,
                }
              );

            const infrared =
              isInfraredImage(
                nirKey,
                metadata
              );

            /*
              GPS
            */

            const latitude =
              metadata?.latitude ||
              metadata?.lat;

            const longitude =
              metadata?.longitude ||
              metadata?.lon;

            if (
              !latitude ||
              !longitude
            ) {
              console.log(
                `Skipping ${redKey} due to missing GPS`
              );

              continue;
            }

            /*
              FLIGHT METADATA
            */

            const altitude =
              metadata?.relativeAltitude ||
              metadata?.GPSAltitude ||
              metadata?.altitude ||
              120;

            const heading =
              metadata?.FlightYawDegree ||
              metadata?.GimbalYawDegree ||
              metadata?.yaw ||
              0;

            /*
              ORIGINAL FOOTPRINT
            */

            const footprintPolygon =
              createFootprintPolygon(
                longitude,
                latitude,
                altitude,
                heading
              );

            /*
              TRUE NDVI ANALYSIS
            */

            const anomalyPolygons =
              await analyzeNDVIRaster(
                redBuffer,
                nirBuffer,
                {
                  longitude,
                  latitude,
                  altitude,
                  heading,
                }
              );

            /*
              FALLBACK
            */

            if (
              anomalyPolygons.length === 0
            ) {
              const meanIntensity =
                await calculateMeanIntensity(
                  nirBuffer
                );

              const severity =
                classifySeverity(
                  meanIntensity
                );

              const feature: GeoJSONFeature =
                {
                  type: "Feature",

                  properties: {
                    file:
                      redKey ||
                      "unknown",

                    status:
                      "Complete",

                    altitude,

                    heading,

                    infrared,

                    meanIntensity,

                    severity,
                  },

                  geometry: {
                    type: "Polygon",

                    coordinates: [
                      footprintPolygon,
                    ],
                  },
                };

              controller.enqueue(
                encoder.encode(
                  JSON.stringify(feature) +
                    "\n"
                )
              );
            } else {
              /*
                STREAM ANOMALIES
              */

              for (const anomaly of anomalyPolygons) {
                controller.enqueue(
                  encoder.encode(
                    JSON.stringify({
                      type: "Feature",

                      properties: {
                        file:
                          redKey ||
                          "unknown",

                        status:
                          "Complete",

                        altitude,

                        heading,

                        infrared,

                        meanIntensity:
                          anomaly
                            .properties
                            .meanNdvi,

                        severity:
                          anomaly
                            .properties
                            .severity,
                      },

                      geometry:
                        anomaly.geometry,
                    }) + "\n"
                  )
                );
              }
            }

            processedCount++;

            console.log(
              `Processed ${processedCount}/${redFiles.length}: ${redKey}`
            );

            /*
              ALLOW UI STREAMING
            */

            await new Promise((resolve) =>
              setTimeout(resolve, 5)
            );
          } catch (fileError) {
            console.error(
              "File processing failed:",
              redFile.Key,
              fileError
            );
          }
        }

        controller.close();

        console.log(
          `Streaming complete. ${processedCount} files processed.`
        );
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type":
          "application/x-ndjson",

        "Cache-Control":
          "no-cache, no-transform",

        Connection:
          "keep-alive",

        "X-Accel-Buffering":
          "no",
      },
    });
  } catch (error: any) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error:
          error?.message ||
          "Failed generating anomalies",
      }),
      {
        status: 500,
      }
    );
  }
}