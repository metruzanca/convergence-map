import { CollectionReference, Query } from "firebase/firestore";

export type CollectionRef = Query | CollectionReference;

// export type OmitModelInternals<M, Other extends string = string> = Omit<
//   M,
//   "createdAt" | "updatedAt" | Other
// >;
