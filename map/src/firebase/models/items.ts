import { LatLngTuple } from "leaflet";
import { CollectionRef } from "../types";
import { collection, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { firestore } from "../init";
import { Firestore, Timestamps } from "../firestore";
import { DeepPartial } from "../../lib/types";

export type ItemData = Timestamps & {
  meta: {
    username: string;
    deleted?: boolean;
  };
  name: string;
  wikiUrl: string;
  coords: LatLngTuple;
  category: string;
};

export class Item {
  static collection = "item";
  constructor(
    public id: string,
    public data: ItemData
  ) {}

  static liveCollection(
    onChange: (data: Item[]) => void,
    ref: CollectionRef = collection(firestore, Item.collection)
  ) {
    return onSnapshot(ref, (snapshot: QuerySnapshot) => {
      onChange(
        snapshot.docs.map((snap) => new Item(snap.id, snap.data() as ItemData))
      );
    });
  }

  async delete() {
    await Firestore.upsert<ItemData>(Item, this, { meta: { deleted: true } });
    // await Firestore.remove(Item, this);
  }

  async restore() {
    await Firestore.upsert<ItemData>(Item, this, { meta: { deleted: false } });
  }

  static async create(username: string): Promise<Item> {
    return Firestore.create(Item, {
      meta: { username },
      name: "new item",
      coords: [0, 0],
      wikiUrl: "",
      category: "",
    });
  }

  async update(newData: DeepPartial<ItemData>) {
    await Firestore.upsert<ItemData>(Item, this, newData);
  }
}
