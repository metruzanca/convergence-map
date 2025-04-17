import { useParams } from "@solidjs/router";
import { createMemo, createSignal, For, onCleanup } from "solid-js";
import { onHotkey } from "~/lib/hotkeys";
import { ItemCard } from "./Item";
import { MapNames, MapUrlSegments } from "~/lib/types";
import { useAppContext, useChangeMap } from "~/lib/context";

export default function MapSidebar() {
  const context = useAppContext();
  const params = useParams<MapUrlSegments>();
  const mapName = params.map ?? "overworld";
  let inputRef!: HTMLInputElement;

  onCleanup(
    onHotkey({ key: "k", ctrl: true }, () => {
      inputRef.focus();
    })
  );

  const changeMap = useChangeMap();

  // NOTE: there might be a memory leak with event handlers when you change map. Noticible when spamming it tf out of it.
  onCleanup(onHotkey({ key: "1", ctrl: true }, () => changeMap("overworld")));
  onCleanup(onHotkey({ key: "2", ctrl: true }, () => changeMap("underworld")));
  onCleanup(onHotkey({ key: "3", ctrl: true }, () => changeMap("scadutree")));

  const [markFilter, setMarkFilter] = createSignal("");
  const filteredItems = createMemo(() =>
    context.items
      // .filter((i) => locationToMap(i.Location) === mapName)
      .filter((i) => i.Name.toLowerCase().includes(markFilter().toLowerCase()))
  );

  return (
    <div class="h-[100vh] px-2 flex flex-col justify-between">
      <div>
        <h2>Map</h2>
        <label>
          <select
            class="select w-full"
            onChange={(e) => changeMap(e.target.value as MapNames)}
            value={mapName}
          >
            <option value="overworld">overworld</option>
            <option value="underworld">underworld</option>
            <option value="scadutree">scadutree</option>
          </select>
        </label>

        {/* TODO search should show all items, and change map if its on another map */}

        <label class="input input-bordered flex items-center gap-2">
          <input
            type="text"
            class="grow"
            placeholder="Search"
            ref={inputRef}
            onInput={(e) => setMarkFilter(e.target.value)}
          />
          <kbd class="kbd text-nowrap">ctrl + K</kbd>
        </label>

        <div class="flex flex-col gap-1 overflow-scroll h-[80vh]">
          <For
            each={filteredItems()}
            children={(item) => <ItemCard item={item} />}
          />
        </div>
      </div>
    </div>
  );
}
