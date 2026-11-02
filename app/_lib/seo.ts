import type { Metadata } from "next";

/** Shared, route-specific SEO metadata; canonical paths resolve against metadataBase. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: "Pollen Systems", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
