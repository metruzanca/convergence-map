import {
  deleteDoc,
  doc,
  DocumentReference,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { v4 as uuidV4 } from "uuid";
import { firestore } from "./init";
import { DeepPartial } from "../lib/types";

export type Timestamps = {
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};
export type OmitTimestamps<T> = Omit<T, keyof Timestamps>;

const timeStamps = (data: any): Timestamps => {
  if (data.createdAt) {
    return {
      createdAt: data.createdAt,
      // updatedAt: new Date().toISOString(),
      //@ts-ignore when receiving document, it should be a different type..
      updatedAt: serverTimestamp(),
    };
  } else {
    return {
      //@ts-ignore
      createdAt: serverTimestamp(),
    };
  }
};

/** Helper method to remove values that firebase doesn't want in documents */
function sanitizeDocument<T = any>(tree: T) {
  // Using for..in, we can iterate both objects and arrays together
  for (const key in tree) {
    if (tree[key] === undefined) delete tree[key];
    if (tree[key] !== null && typeof tree[key] == "object") {
      sanitizeDocument(tree[key]);
    }
  }
  return tree;
}

async function upsertDoc<Prev, Next = Partial<Prev>>(
  ref: DocumentReference,
  data: Prev,
  next?: Next
): Promise<Prev & Timestamps> {
  const newItem =
    next === undefined
      ? {
          ...sanitizeDocument(data),
          ...timeStamps(data),
        }
      : {
          // start with previous
          ...data,
          // add new data
          ...sanitizeDocument(next),
          // add updated timestamps over top
          ...timeStamps(data),
        };

  await setDoc(ref, newItem);
  return newItem;
}

async function removeDoc(ref: DocumentReference) {
  await deleteDoc(ref);
}

/** Tightly coupled to the Class-based system */
export namespace Firestore {
  type Instance = { id: string; data: any };

  export async function create<D, C>(
    base: { new (id: string, data: D): C; collection: string },
    data: OmitTimestamps<D>
  ): Promise<C> {
    const id = uuidV4();
    const createdData = await upsertDoc<D>(
      doc(firestore, base.collection, id),
      data as D
    );
    return new base(id, createdData);
  }

  export async function upsert<D, I extends Instance = Instance>(
    base: { collection: string },
    instance: I,
    next?: DeepPartial<D>
  ): Promise<D> {
    return upsertDoc(
      doc(firestore, base.collection, instance.id),
      instance.data,
      next
    );
  }

  export async function remove<I extends Instance>(
    base: { collection: string },
    instance: I
  ) {
    return removeDoc(doc(firestore, base.collection, instance.id));
  }
}
