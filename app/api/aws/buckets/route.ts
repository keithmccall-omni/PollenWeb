import { NextResponse } from "next/server";
import {
  S3Client,
  ListBucketsCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const response = await s3.send(
      new ListBucketsCommand({})
    );

    const buckets =
      response.Buckets?.map((b) => b.Name || "") || [];

    return NextResponse.json({
      buckets,
    });
  } catch (error: any) {
    console.error("Bucket list error:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}