import type { Metadata } from "next";
import { pageMetadata } from "../_lib/seo";

export const metadata: Metadata = pageMetadata(
  "Crop Intelligence for Orchards & Vineyards",
  "Explore AI-powered agricultural analytics for apples, almonds, avocados, berries, grapes, and other crops.",
  "/crops"
);

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
