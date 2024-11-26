import { LatLngTuple } from "leaflet";
import { CollectionRef } from "../types";
import {
  collection,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { firestore } from "../init";
import { Firestore, Timestamps } from "../firestore";
import { DeepPartial, MapNames } from "~/lib/types";
import { BASE_URL } from "~/lib/constants";

export type ItemData = Timestamps & {
  author?: string;
  deleted: boolean;
  name: string;
  url: string;
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

  static byName(name: string, onChange: (data?: Item) => void) {
    return onSnapshot(
      query(collection(firestore, Item.collection), where("name", "==", name)),
      (snapshot: QuerySnapshot) => {
        const item = snapshot.docs[0];
        onChange(new Item(item.id, item.data() as ItemData));
      }
    );
  }

  get embedUrl() {
    const params = new URLSearchParams();
    params.append("item", this.data.name);
    // TODO embed url to include item_name to focus, ideally no lat, lng, zoom.
    return `${BASE_URL}?${params.toString()}`;
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
    data: Partial<ItemData> = {}
  ): Promise<Item> {
    return Firestore.create(Item, {
      author,
      map: data.map ?? "overworld",
      name: data.name ?? "new item",
      category: data.category ?? "",
      latlng: [0, 0],
      url: data.url ?? "",
      deleted: false,
    });
  }

  async update(newData: DeepPartial<ItemData>) {
    await Firestore.upsert<ItemData>(Item, this, newData);
  }
}
