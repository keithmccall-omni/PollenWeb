import {
  ChevronDown,
  ChevronRight,
  Folder,
} from "lucide-react";

interface PrefixTreeProps {
  prefixTree: Record<string, string[]>;

  expandedPrefixes: string[];

  selectedPrefix: string;

  setSelectedPrefix: (
    prefix: string
  ) => void;

  togglePrefix: (
    prefix: string
  ) => void;
}

export default function PrefixTree({
  prefixTree,

  expandedPrefixes,

  selectedPrefix,

  setSelectedPrefix,

  togglePrefix,
}: PrefixTreeProps) {
  function renderPrefix(
    prefix: string,
    level = 0
  ) {
    const expanded =
      expandedPrefixes.includes(prefix);

    const children =
      prefixTree[prefix] || [];

    const name =
      prefix
        .split("/")
        .filter(Boolean)
        .pop() || prefix;

    return (
      <div
        key={prefix}
        className="border-b border-[#2d4318]"
      >
        <div
          className={`flex items-center justify-between px-2 py-1.5 transition-all hover:bg-[#1a260f] ${
            selectedPrefix === prefix
              ? "bg-[#24360f]"
              : ""
          }`}
          style={{
            paddingLeft: `${
              level * 14 + 8
            }px`,
          }}
        >
          <button
            onClick={() =>
              togglePrefix(prefix)
            }
            className="flex flex-1 items-center gap-1.5 text-left"
          >
            {expanded ? (
              <ChevronDown className="h-3 w-3 shrink-0 text-[#9ccc52]" />
            ) : (
              <ChevronRight className="h-3 w-3 shrink-0 text-[#9ccc52]" />
            )}

            <Folder className="h-3 w-3 shrink-0 text-[#d9a441]" />

            <span className="truncate text-[11px] font-medium text-[#d7e8bf]">
              {name}
            </span>
          </button>

          <button
            onClick={() =>
              setSelectedPrefix(prefix)
            }
            className={`rounded px-2 py-[1px] text-[9px] font-bold transition-all ${
              selectedPrefix === prefix
                ? "bg-[#7fa52e] text-white"
                : "bg-[#314915] text-[#d9efb0] hover:bg-[#4f7520]"
            }`}
          >
            OPEN
          </button>
        </div>

        {expanded &&
          children.map((child) =>
            renderPrefix(
              child,
              level + 1
            )
          )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#2d4318] bg-[#10180b] max-h-[320px] overflow-y-auto">
      {(prefixTree[""] || []).map(
        (prefix) =>
          renderPrefix(prefix)
      )}
    </div>
  );
}