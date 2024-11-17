import { LatLngTuple } from "leaflet";
import { CollectionRef } from "../types";
import { collection, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { firestore } from "../init";
import { Firestore, Timestamps } from "../firestore";
import { DeepPartial } from "../~/lib/types";
import { MapNames } from "../.~/components/Map";

export type ItemData = Timestamps & {
  author: string;
  deleted: boolean;
  name: string;
  wikiUrl: string;
  latlng: LatLngTuple;
  category: string;
  map: MapNames;
};

export class Item {
  static collection = "item";
  constructor(public id: string, public data: ItemData) {}

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

  async softDelete() {
    await Firestore.upsert<ItemData>(Item, this, { deleted: true });
  }

  async delete() {
    await Firestore.remove(Item, this);
  }

  async restore() {
    await Firestore.upsert<ItemData>(Item, this, { deleted: false });
  }

  static async create(
    author: string,
    map: MapNames = "overworld"
  ): Promise<Item> {
    return Firestore.create(Item, {
      author,
      map,
      name: "new item",
      latlng: [0, 0],
      wikiUrl: "",
      category: "",
      deleted: false,
    });
  }

  async update(newData: DeepPartial<ItemData>) {
    await Firestore.upsert<ItemData>(Item, this, newData);
  }
}
