import { createMemo } from "solid-js";
import gameItems from "../../Output.json";
import {
  ConvergenceImport,
  ConvergenceLocation,
  FlatItem,
  convergenceImportSchema,
  getCoordinates,
} from "./sticher";
import { LatLngTuple } from "leaflet";
import { MapNames } from "./types";

// TODO look into maybe making this a solidjs store with custom getters for latlang
export const getItems = createMemo(() => {
  const itemData = convergenceImportSchema.safeParse(gameItems);
  if (!itemData.success) {
    console.error(itemData.error);
  } else if (import.meta.env.DEV) {
    console.log(itemData.data);
  }

  const data = itemData.data as ConvergenceImport;

  // Flatten data to be item w/ their own data
  const flattenedData = data.flatMap((drop) => {
    const coords = drop.Location === "Overworld" ? getCoordinates(drop) : drop;

    return drop.Items.map(
      (item) =>
        ({
          // Item
          Category: item.Category,
          Name: item.Name,
          ID: item.ID,
          // Drop
          CordX: coords.CordX,
          CordZ: coords.CordZ,
          Location: drop.Location,
          MapArea: drop.MapArea,
          MapBlock: drop.MapBlock,
          MapRegion: drop.MapRegion,
        } satisfies FlatItem)
    );
  });

  return flattenedData;
});

export function formatLatLng(latlng: number): number {
  return +latlng.toFixed(2);
}

export function getLatlng(item: FlatItem): LatLngTuple {
  return [formatLatLng(item.CordX), formatLatLng(item.CordZ)];
}

/** @deprecated drop this, just use the raw values used from Output.json. Don't add extra values to complicate things. */
export function locationToMap(location: ConvergenceLocation) {
  switch (location) {
    case "DLC_Overworld":
      return "scadutree";
    case "Underworld":
      return "underworld";

    case "Overworld":
      return "overworld";

    // TODO
    default:
    case "DLC_LegacyDungeon":
    case "DLC_MinorDungeon":
    case "MinorDungeon":
    case "LegacyDungeon":
      return "other" as MapNames;
  }
}
