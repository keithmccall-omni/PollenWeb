import Image from "next/image";

type Props = { compact?: boolean };

export default function TorenthalAttribution({ compact = false }: Props) {
  return (
    <a
      href="https://www.torenthal.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="A Torenthal company — visit Torenthal Enterprises"
      className={`inline-flex items-center gap-2 text-zinc-400 transition hover:text-white ${compact ? "text-[10px]" : "text-sm"}`}
    >
      <span>by</span>
      <Image
        src="/logos/torenthal.svg"
        alt="Torenthal Enterprises"
        width={140}
        height={44}
        className={compact ? "h-5 w-auto max-w-24 object-contain" : "h-8 w-auto max-w-36 object-contain"}
      />
      <span className="text-xs font-medium text-zinc-300">
        Torenthal
      </span>
    </a>
  );
}
