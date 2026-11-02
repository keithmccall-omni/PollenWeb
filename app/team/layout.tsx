import type { Metadata } from "next";
import { pageMetadata } from "../_lib/seo";

export const metadata: Metadata = pageMetadata(
  "Leadership Team & AgTech Experts",
  "Meet the Pollen Systems team building drone, satellite, and AI-powered precision agriculture technology.",
  "/team"
);

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
