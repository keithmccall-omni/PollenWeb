import { NextRequest } from "next/server";

import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

import * as exifr from "exifr";

import sharp from "sharp";

export const runtime = "nodejs";

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
      degreesToRadians(assumedFov / 2)
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
    lowerKey.includes("nir") ||
    lowerKey.includes("infrared") ||
    lowerKey.includes(
      "multispectral"
    ) ||
    lowerKey.includes("rededge") ||
    lowerKey.includes("thermal") ||
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
  if (meanIntensity < 70) {
    return "high";
  }

  if (meanIntensity < 130) {
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

    return total / data.length;
  } catch (error) {
    console.error(error);

    return 128;
  }
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

    let continuationToken:
      | string
      | undefined = undefined;

    const allObjects: any[] = [];

    do {
      const response = await s3.send(
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

    const files = allObjects.filter(
      (item) =>
        !!item.Key &&
        !item.Key.endsWith("/") &&
        (item.Key.endsWith(".jpg") ||
          item.Key.endsWith(".jpeg") ||
          item.Key.endsWith(".tif") ||
          item.Key.endsWith(".tiff"))
    );

    console.log(
      `Enumerated ${files.length.toLocaleString()} files`
    );

    const stream = new ReadableStream({
      async start(controller) {
        const encoder =
          new TextEncoder();

        for (const file of files) {
          try {
            const objectResponse =
              await s3.send(
                new GetObjectCommand({
                  Bucket: bucket,

                  Key: file.Key,
                })
              );

            if (!objectResponse.Body) {
              continue;
            }

            const buffer =
              await streamToBuffer(
                objectResponse.Body
              );

            const metadata =
              await exifr.parse(buffer, {
                gps: true,
                xmp: true,
                tiff: true,
              });

            if (
              !isInfraredImage(
                file.Key || "",
                metadata
              )
            ) {
              continue;
            }

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
              continue;
            }

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

            const meanIntensity =
              await calculateMeanIntensity(
                buffer
              );

            const severity =
              classifySeverity(
                meanIntensity
              );

            const polygon =
              createFootprintPolygon(
                longitude,
                latitude,
                altitude,
                heading
              );

            const feature: GeoJSONFeature =
              {
                type: "Feature",

                properties: {
                  file:
                    file.Key || "unknown",

                  status: "Complete",

                  altitude,

                  heading,

                  infrared: true,

                  meanIntensity,

                  severity,
                },

                geometry: {
                  type: "Polygon",

                  coordinates: [polygon],
                },
              };

            controller.enqueue(
              encoder.encode(
                JSON.stringify(feature) +
                  "\n"
              )
            );

            console.log(
              `Processed IR image: ${file.Key}`
            );
          } catch (fileError) {
            console.error(
              "File processing failed:",
              file.Key,
              fileError
            );
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type":
          "application/x-ndjson",

        "Cache-Control":
          "no-cache",

        Connection: "keep-alive",
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