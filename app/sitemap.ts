import type { MetadataRoute } from "next";
import crops from "@/data/crops.json";

const origin = "https://pollensystems.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/team", "/contact", "/crops"];
  return [
    ...routes.map((route) => ({ url: `${origin}${route}`, changeFrequency: "monthly" as const })),
    ...crops.map((crop) => ({
      url: `${origin}/crops/${encodeURIComponent(crop.slug)}`,
      changeFrequency: "monthly" as const,
    })),
  ];
}
