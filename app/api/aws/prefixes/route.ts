import { NextResponse } from "next/server";

import {
  S3Client,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",

  credentials: {
    accessKeyId:
      process.env.AWS_ACCESS_KEY_ID || "",

    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const bucket =
      searchParams.get("bucket") || "";

    const prefix =
      searchParams.get("prefix") || "";

    if (!bucket) {
      return NextResponse.json({
        prefixes: [],
      });
    }

    const result = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,

        Prefix: prefix,

        Delimiter: "/",
      })
    );

    const prefixes =
      result.CommonPrefixes?.map(
        (p) => p.Prefix || ""
      ) || [];

    return NextResponse.json({
      currentPrefix: prefix,

      prefixes,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error: err.message,
        prefixes: [],
      },
      {
        status: 500,
      }
    );
  }
}