import { CollectionReference, Query } from "firebase/firestore";
import { z } from "zod";

export type CollectionRef = Query | CollectionReference;

// export type OmitModelInternals<M, Other extends string = string> = Omit<
//   M,
//   "createdAt" | "updatedAt" | Other
// >;

const convergenceItemSchema = z.object({
  ID: z.number(),
  Name: z.string(),
  Category: z.string(),
});

const locationSchema = z.enum([
  // "Default",
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
