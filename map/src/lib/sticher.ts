import { z } from "zod";

const convergenceItemSchema = z.object({
  ID: z.number(),
  Name: z.string(),
  Category: z.string(),
});

const locationSchema = z.enum([
  "Default", // Exe's default value, we shouldn't have these. TODO fix this
  "Overworld",
  "Underworld",
  "LegacyDungeon",
  "MinorDungeon",
  "DLC_Overworld",
  "DLC_LegacyDungeon",
  "DLC_MinorDungeon",
]);

const convergenceDropSchema = z.object({
  Items: z.array(convergenceItemSchema),
  MapArea: z.number(),
  MapBlock: z.number(),
  MapRegion: z.number(),
  Location: locationSchema,
  CordX: z.number(),
  CordZ: z.number(),
});

export const convergenceImportSchema = z.array(convergenceDropSchema);

export type ConvergenceLocation = z.infer<typeof locationSchema>;
export type ConvergenceItem = z.infer<typeof convergenceItemSchema>;
export type ConvergenceDrop = z.infer<typeof convergenceDropSchema>;
export type ConvergenceImport = z.infer<typeof convergenceImportSchema>;

export type FlatItem = Omit<ConvergenceDrop, "Items"> & ConvergenceItem;

const SIZE = 255;

// const ranges: Partial<
//   Record<ConvergenceLocation, { x: [number, number]; y: [number, number] }>
// > = {
//   Overworld: {
//     x: [8, 14],
//     y: [15, 7],
//   },
// };

// https://cdn.discordapp.com/attachments/1291764947180716055/1298158799504408576/mapcoords.jpg?ex=67fbf6d8&is=67faa558&hm=dbda96573b19365512f9e61de044c745969a11ddd7276154a39aff5d56fc0e65&

// type MapBlock = number
// type MapRegion = number
// prettier-ignore
// const Overworld: [MapBlock, MapRegion][][] = [
//   [[8, 15], [9, 15], [10, 15], [11, 15], [12, 15], [13, 15], [14, 15]],
//   [[8, 14], [9, 14], [10, 14], [11, 14], [12, 14], [13, 14], [14, 14]],
//   [[8, 13], [9, 13], [10, 13], [11, 13], [12, 13], [13, 13], [14, 13]],
//   [[8, 12], [9, 12], [10, 12], [11, 12], [12, 12], [13, 12], [14, 12]],
//   [[8, 11], [9, 11], [10, 11], [11, 11], [12, 11], [13, 11], [14, 11]],
//   [[8, 10], [9, 10], [10, 10], [11, 10], [12, 10], [13, 10], [14, 10]],
//   [[8, 9],  [9, 9],  [10, 9],  [11, 9],  [12, 9],  [13, 9],  [14, 9]],
//   [[8, 8],  [9, 8],  [10, 8],  [11, 8],  [12, 8],  [13, 8],  [14, 8]],
//   [[8, 7],  [9, 7],  [10, 7],  [11, 7],  [12, 7],  [13, 7],  [14, 7]],
// ]

const MIN_WIDTH = SIZE * 8
const MAX_WIDTH = SIZE * 14;
const MIN_HEIGHT = SIZE * 7;
const MAX_HEIGHT = SIZE * 15;

// doesn't seem to work
// export const overworldBounds = L.latLngBounds(
//   L.latLng(MIN_HEIGHT, MIN_WIDTH),
//   L.latLng(MAX_HEIGHT, MAX_WIDTH)
// );

export function getCoordinates(
  drop: ConvergenceDrop
): Pick<ConvergenceDrop, "CordX" | "CordZ"> {
  return {
    CordX: drop.CordX + SIZE * drop.MapRegion,
    CordZ: drop.CordZ + SIZE * drop.MapBlock,
  };
}
