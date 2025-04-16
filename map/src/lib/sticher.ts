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

// TODO add latlang property to FlatItem
export type FlatItem = Omit<ConvergenceDrop, "Items"> & ConvergenceItem;

const SIZE = 255;

// https://cdn.discordapp.com/attachments/1291764947180716055/1298158799504408576/mapcoords.jpg?ex=67fbf6d8&is=67faa558&hm=dbda96573b19365512f9e61de044c745969a11ddd7276154a39aff5d56fc0e65&
// [MapBlock, MapRegion]

export function getCoordinates(
  drop: ConvergenceDrop
): Pick<ConvergenceDrop, "CordX" | "CordZ"> {
  return {
    CordX: drop.CordX + SIZE * drop.MapRegion,
    CordZ: drop.CordZ + SIZE * drop.MapBlock,
  };
}
