import { marker, LatLngTuple } from "leaflet";
import { onMount, createSignal, createEffect, onCleanup } from "solid-js";
import { Item, ItemData } from "../firebase";
import { formatLatLng } from "../lib/map";
import cn from "../lib/styling";
import { OnSubmit } from "../lib/types";
import { Button } from "./Core";
import { PinIcon } from "./Icons";
import { getMap } from "./Map";

export function ItemForm(props: { item: Item; onSubmit: OnSubmit<Item> }) {
  let newItemName!: HTMLInputElement;

  onMount(() => {
    newItemName.focus();
  });

  const map = getMap();

  const [pin, setPin] = createSignal<ItemData["coords"]>(
    props.item.data.coords
  );
  const [editingPin, setEditingPin] = createSignal(false);
  const addMarker = (e: L.LeafletMouseEvent) => {
    setPin([formatLatLng(e.latlng.lat), formatLatLng(e.latlng.lng)]);
    marker(e.latlng).addTo(map);
    setEditingPin(false);
  };
  createEffect(() => {
    if (editingPin()) {
      map.on("click", addMarker);
    }
    onCleanup(() => map.off("click", addMarker));
  });

  return (
    <form
      class="flex flex-col"
      onSubmit={(e) => {
        const fd = new FormData(e.target as HTMLFormElement);
        props.item.update({
          name: fd.get("name")?.toString() ?? "new item",
          wikiUrl: fd.get("wikiUrl")?.toString() ?? "",
          coords: pin(),
        });
        e.preventDefault();
      }}
    >
      <h3>New Pin</h3>
      <div class="flex flex-col gap-2">
        <input
          name="name"
          ref={newItemName}
          class="input input-bordered input-sm w-full max-w-xs"
          placeholder="Item name"
          type="text"
          value={props.item.data.name}
        />
        <input
          name="wikiUrl"
          ref={newItemName}
          class="input input-bordered input-sm w-full max-w-xs"
          placeholder="wiki URL"
          type="url"
          value={props.item.data.wikiUrl}
        />
        <div class="flex gap-2 items-center justify-around input input-sm">
          <CoordinatesInput latlng={pin()} edit />
          <PinIcon
            onClick={() => setEditingPin(true)}
            class={cn(editingPin() && "stroke-accent")}
          />
        </div>
        <Button class="btn w-full btn-xs">Save</Button>
      </div>
    </form>
  );
}

export function CoordinatesInput(props: {
  latlng: LatLngTuple;
  edit?: boolean;
}) {
  return (
    <div class="flex gap-2 text-sm items-center">
      {props.edit ? (
        <>
          <div>
            <span>X</span>:{" "}
            <input class="max-w-10" type="number" value={props.latlng[0]} />
          </div>
          <div>
            <span>Y</span>:{" "}
            <input class="max-w-10" type="number" value={props.latlng[1]} />
          </div>
        </>
      ) : (
        <>
          <span>
            <span>X</span>: {props.latlng[0]}
          </span>
          <span>
            <span>Y</span>: {props.latlng[1]}
          </span>
        </>
      )}
    </div>
  );
}
