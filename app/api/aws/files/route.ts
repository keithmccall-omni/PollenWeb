import { NextRequest, NextResponse } from "next/server";

import {
  S3Client,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

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
      return NextResponse.json(
        {
          error:
            "Missing bucket parameter",
        },
        {
          status: 400,
        }
      );
    }

    /*
      PAGINATED ENUMERATION
    */

    let continuationToken:
      | string
      | undefined = undefined;

    const allFiles: any[] = [];

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

      allFiles.push(...contents);

      continuationToken =
        response.NextContinuationToken;
    } while (continuationToken);

    /*
      FILTER FILES
    */

    const files = allFiles
      .filter(
        (item) =>
          !!item.Key &&
          !item.Key.endsWith("/")
      )
      .map((item) => ({
        key: item.Key as string,

        size: item.Size || 0,

        lastModified:
          item.LastModified || null,
      }))
      .sort((a, b) =>
        a.key.localeCompare(b.key)
      );

    return NextResponse.json({
      files,

      count: files.length,
    });
  } catch (error: any) {
    console.error(
      "Failed to enumerate S3 files:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to enumerate S3 files",
      },
      {
        status: 500,
      }
    );
  }
}