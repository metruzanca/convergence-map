import { Item } from "../firebase";
import { createSignal, For, Show } from "solid-js";
import { SearchIcon } from "./Icons";
import { Button } from "./Core";

export default function EditorSiderbar() {
  // const params = useParams<MapUrlParams>();
  const [items, setItems] = createSignal<Item[]>();
  Item.liveCollection(setItems);

  const [item, setItem] = createSignal<Item>();

  let newItemName: HTMLInputElement;

  return (
    <div class="flex flex-col px-2">
      <h2 class="border-b-neutral-700 border-b">Editor Panel</h2>
      <div class="flex gap-2">
        <div>
          <h3>Map Pins</h3>
          <label class="input input-bordered flex items-center gap-2">
            <input type="text" class="grow" placeholder="Search" />
            <SearchIcon class="w-4 h-4 opacity-70" />
          </label>

          <Button
            class="btn-neutral w-full btn-xs"
            onClick={() => {
              // TODO add temporary pin
              setItem(Item.create());
              newItemName.focus();
              // const map = getMap();

              // const addMarker = (e: L.LeafletMouseEvent) => {
              //   marker(e.latlng).addTo(map);
              //   // TODO figure out how to not have this here...
              //   // map.off("click", addMarker);
              // };

              // map.on("click", addMarker);
            }}
          >
            Add Pin
          </Button>

          <div class="flex flex-col overflow-y-scroll">
            <For
              each={items()}
              children={(item) => <div>{item.data.name}</div>}
            />
          </div>
        </div>

        <Show when={item()}>
          {(thing) => (
            <div class="flex flex-col">
              <h3>New Pin</h3>
              <div class="flex flex-col gap-2">
                <input
                  ref={newItemName}
                  class="input input-bordered input-sm w-full max-w-xs"
                  placeholder="Item name"
                  type="text"
                  value={thing().data.name}
                />
                <div class="flex gap-2 items-center input input-sm">
                  <span>Coordinates: </span>
                  <div>
                    <span>X</span>: {thing().data.coords[0]}
                  </div>
                  <div>
                    <span>Y</span>: {thing().data.coords[1]}
                  </div>
                </div>
                <Button class="btn w-full btn-xs">Save</Button>
                <Button
                  class="btn-neutral w-full btn-xs"
                  onClick={() => {
                    setItem(undefined);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
}
