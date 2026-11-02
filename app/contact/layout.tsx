import type { Metadata } from "next";
import { pageMetadata } from "../_lib/seo";

export const metadata: Metadata = pageMetadata(
  "Contact Pollen Systems for Precision Agriculture",
  "Contact Pollen Systems to discuss agricultural monitoring, drone imagery, crop analytics, and geospatial intelligence.",
  "/contact"
);

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
