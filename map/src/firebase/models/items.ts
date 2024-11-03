import { LatLngTuple } from "leaflet";
import { CollectionRef } from "../types";
import { collection, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { firestore } from "../init";

export namespace Item {
  export type Data = {
    name: string;
    wikiUrl: string;
    coords: LatLngTuple;
  };
}

export class Item {
  static collection = "item";
  constructor(
    public id: string,
    public data: Item.Data
  ) {}

  static liveCollection(
    onChange: (data: Item[]) => void,
    ref: CollectionRef = collection(firestore, Item.collection)
  ) {
    return onSnapshot(ref, (snapshot: QuerySnapshot) => {
      onChange(
        snapshot.docs.map((snap) => new Item(snap.id, snap.data() as Item.Data))
      );
    });
  }

  static create() {
    return new Item("", {
      name: "",
      coords: [0, 0],
      wikiUrl: "",
    } satisfies Item.Data);
  }

  async save() {
    // TODO zod parse this.data
    // await Firestore.createDoc(
    //   doc(firestore, Item.collection, this.id),
    //   this.data
    // );
  }
}
