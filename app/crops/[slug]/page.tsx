import type { Metadata } from "next";
import { pageMetadata } from "../../_lib/seo";
import crops from "@/data/crops.json";

import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/footer/Footer";

import CropDetailHero from "@/components/crops/CropDetailHero";
import CropMetrics from "@/components/crops/CropMetrics";
import CropProfileDiagram from "@/components/crops/CropProfileDiagram";

import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const crop = crops.find((item) => item.slug === slug);
  if (!crop) return { title: "Crop Not Found", robots: { index: false, follow: false } };
  return pageMetadata(
    `${crop.name} Crop Monitoring & AI Analytics`,
    // Keep the search snippet within the monitor's 70–165 character guideline.
    crop.description.length <= 165
      ? crop.description
      : crop.description.slice(0, 162).replace(/\s+\S*$/, "").replace(/[,;:.\s]+$/, "") + ".",
    `/crops/${encodeURIComponent(crop.slug)}`
  );
}

export default async function CropDetailPage({
  params,
}: PageProps) {

  const { slug } = await params;

  const crop = crops.find((c) => c.slug === slug);

  if (!crop) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <Navigation />

      <CropDetailHero crop={crop} />

      <CropMetrics metrics={crop.metrics} />

      <CropProfileDiagram
        title={crop.profileDiagram.title}
        image={crop.profileDiagram.image}
      />

      <Footer />

    </main>
  );
}