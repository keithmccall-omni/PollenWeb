import { useEffect, useState } from "react";

interface PrefixResponse {
  prefixes: string[];
}

export function usePrefixTree(
  selectedBucket: string
) {
  const [selectedPrefix, setSelectedPrefix] =
    useState("");

  const [expandedPrefixes, setExpandedPrefixes] =
    useState<string[]>([]);

  const [prefixTree, setPrefixTree] = useState<
    Record<string, string[]>
  >({});

  async function loadPrefixes(
    prefix: string
  ) {
    if (!selectedBucket) {
      return;
    }

    try {
      const response = await fetch(
        `/api/aws/prefixes?bucket=${selectedBucket}&prefix=${encodeURIComponent(
          prefix
        )}`
      );

      const data: PrefixResponse =
        await response.json();

      setPrefixTree((prev) => ({
        ...prev,

        [prefix]: data.prefixes || [],
      }));
    } catch (error) {
      console.error(
        "Failed to load prefixes:",
        error
      );
    }
  }

  useEffect(() => {
    if (!selectedBucket) {
      return;
    }

    setPrefixTree({});

    setExpandedPrefixes([]);

    setSelectedPrefix("");

    loadPrefixes("");
  }, [selectedBucket]);

  function togglePrefix(
    prefix: string
  ) {
    const expanded =
      expandedPrefixes.includes(prefix);

    if (expanded) {
      setExpandedPrefixes((prev) =>
        prev.filter((p) => p !== prefix)
      );

      return;
    }

    setExpandedPrefixes((prev) => [
      ...prev,
      prefix,
    ]);

    if (!prefixTree[prefix]) {
      loadPrefixes(prefix);
    }
  }

  return {
    prefixTree,

    expandedPrefixes,

    selectedPrefix,

    setSelectedPrefix,

    togglePrefix,

    loadPrefixes,
  };
}