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