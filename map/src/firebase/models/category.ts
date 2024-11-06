import { collection, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { firestore } from "../init";
import { CollectionRef } from "../types";
import { Sprites } from "../../components/Icons";

export namespace Category {
  export type Data = {
    name: string;
    sprite: Sprites;
  };
}

export class Category {
  static collection = "item";
  constructor(
    public id: string,
    public data: Category.Data
  ) {}

  static liveCollection(
    onChange: (data: Category[]) => void,
    ref: CollectionRef = collection(firestore, Category.collection)
  ) {
    return onSnapshot(ref, (snapshot: QuerySnapshot) => {
      onChange(
        snapshot.docs.map(
          (snap) => new Category(snap.id, snap.data() as Category.Data)
        )
      );
    });
  }

  static create() {
    return new Category("", {
      name: "",
      sprite: "grace",
    } satisfies Category.Data);
  }

  save() {
    // if (this.id === '')
  }
}