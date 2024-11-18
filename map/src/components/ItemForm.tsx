import { LatLngTuple, marker } from "leaflet";
import { onMount, createSignal, createEffect, onCleanup } from "solid-js";
import { Item } from "~/firebase";
import { formatLatLng, store } from "~/lib/map";
import cn from "~/lib/styling";
import { OnSubmit } from "~/lib/types";
import { PinIcon } from "./Icons";
import { getMap } from "./Map";
import { CoordinatesInput, Input } from "./inputs";
import { createStore } from "solid-js/store";
import { Select } from "./kobalte";

function latlngUnset(latlng: LatLngTuple) {
  return latlng[0] === 0 && latlng[1] === 0;
}

export default function ItemForm(props: {
  item: Item;
  onSubmit: OnSubmit<Item>;
}) {
  const [inputs, setInputs] = createStore(props.item.data);
  const [editingPin, setEditingPin] = createSignal(
    latlngUnset(props.item.data.latlng)
  );

  const map = getMap();

  const addMarker = (e: L.LeafletMouseEvent) => {
    const existingMarkers = store.markers;
    if (existingMarkers.has(props.item.id)) {
      existingMarkers
        .get(props.item.id)
        ?.setLatLng([formatLatLng(e.latlng.lat), formatLatLng(e.latlng.lng)]);
    } else {
      marker(e.latlng).addTo(map);
    }

    setInputs("latlng", [
      formatLatLng(e.latlng.lat),
      formatLatLng(e.latlng.lng),
    ]);
    setEditingPin(false);
  };

  createEffect(() => {
    if (editingPin()) {
      map.on("click", addMarker);
    }
    onCleanup(() => map.off("click", addMarker));
  });

  let newItemName!: HTMLInputElement;

  onMount(() => {
    newItemName.focus();
  });

  return (
    <form
      class="flex flex-col"
      onSubmit={(e) => {
        props.item.update(inputs);
        e.preventDefault();
      }}
    >
      <h3>New Pin</h3>
      <div class="flex flex-col gap-2">
        <Input
          label="Item name"
          placeholder="Blade of Valor"
          name="name"
          ref={newItemName}
          class="input input-bordered input-sm w-full max-w-xs"
          type="text"
          value={inputs}
          onChange={setInputs}
        />

        <Select
          size="small"
          name="category"
          placeholder="Category"
          // FIXME add category list
          options={[]}
        />

        <Input
          label="Category"
          placeholder="weapons"
          class="input input-bordered input-sm w-full max-w-xs"
          name="category"
          value={inputs}
          onChange={setInputs}
        />
        <Input
          label="Wiki url"
          placeholder="https://convergencemod.com/..."
          name="url"
          class="input input-bordered input-sm w-full max-w-xs"
          type="url"
          value={inputs}
          onChange={setInputs}
        />
        <div class="flex gap-2 items-center justify-around input input-sm">
          <CoordinatesInput latlng={inputs.latlng} />
          <PinIcon
            onClick={() => setEditingPin((prev) => !prev)}
            class={cn(editingPin() && "stroke-accent")}
          />
        </div>
        <button class="btn btn-primary w-full btn-xs">Save</button>
      </div>
    </form>
  );
}
