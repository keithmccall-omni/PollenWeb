import Image from "next/image";

interface CropProfileDiagramProps {
  title: string;
  image: string;
}

export default function CropProfileDiagram({
  title,
  image,
}: CropProfileDiagramProps) {

  return (
    <section className="relative overflow-hidden bg-[#06110a] py-28">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(132,255,0,0.12),_transparent_70%)] opacity-30" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mb-16 text-center">

          <div className="mb-5 inline-block rounded-full border border-lime-400/20 bg-lime-400/10 px-5 py-2 text-sm uppercase tracking-[0.25em] text-lime-300">
            Crop Intelligence
          </div>

          <h2 className="text-5xl font-bold leading-tight text-white md:text-6xl">
            {title}
          </h2>

        </div>

        {/* Diagram */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm">

          <Image
            src={image}
            alt={title}
            width={1600}
            height={900}
            className="h-auto w-full rounded-2xl object-cover"
          />

        </div>

      </div>

    </section>
  );
}