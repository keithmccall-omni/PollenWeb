import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/fam"] },
    sitemap: "https://pollensystems.com/sitemap.xml",
    host: "https://pollensystems.com",
  };
}
