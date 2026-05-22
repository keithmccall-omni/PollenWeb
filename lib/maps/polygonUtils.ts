import * as turf from "@turf/turf";

export function mergeOverlappingPolygons(
  polygons: any[]
) {
  if (polygons.length === 0) {
    return [];
  }

  const merged: any[] = [];

  for (const polygon of polygons) {
    let mergedIntoExisting = false;

    for (
      let i = 0;
      i < merged.length;
      i++
    ) {
      try {
        const intersects =
          turf.booleanIntersects(
            merged[i],
            polygon
          );

        if (intersects) {
          const unioned = turf.union(
            turf.featureCollection([
              merged[i],
              polygon,
            ])
          );

          if (unioned) {
            merged[i] = unioned;

            mergedIntoExisting = true;

            break;
          }
        }
      } catch (error) {
        console.error(
          "Polygon merge failed:",
          error
        );
      }
    }

    if (!mergedIntoExisting) {
      merged.push(polygon);
    }
  }

  return merged;
}

export async function waitForNextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(true);
    });
  });
}