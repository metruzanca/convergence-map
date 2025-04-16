import { useLocation, useNavigate, useParams } from "@solidjs/router";
import { createMemo, createSignal, For, onCleanup } from "solid-js";
import { onHotkey } from "~/lib/hotkeys";
import { ItemCard } from "./Item";
import { MapNames, MapUrlParams } from "~/lib/types";
import { useAppContext } from "~/lib/context";
import { locationToMap } from "~/lib/markers";

export default function MapSidebar() {
  const context = useAppContext();
  const params = useParams<MapUrlParams>();
  const mapName = params.map ?? "overworld";
  let inputRef!: HTMLInputElement;

  onCleanup(
    onHotkey({ key: "k", ctrl: true }, () => {
      inputRef.focus();
    })
  );

  const navigate = useNavigate();
  const location = useLocation();

  const changeMap = (mapname: MapNames) => {
    if (window.location.href.includes(mapname)) return;
    if (window.location.href.includes("scadutree")) {
      return navigate(`/${mapname}`);
    }

    return navigate(`/${mapname}${location.search.toString()}`);
  };

  // NOTE: there might be a memory leak with event handlers when you change map. Noticible when spamming it tf out of it.
  onCleanup(onHotkey({ key: "1", ctrl: true }, () => changeMap("overworld")));
  onCleanup(onHotkey({ key: "2", ctrl: true }, () => changeMap("underworld")));
  onCleanup(onHotkey({ key: "3", ctrl: true }, () => changeMap("scadutree")));

  const [markFilter, setMarkFilter] = createSignal("");
  const filteredItems = createMemo(() =>
    context.items
      .filter((i) => locationToMap(i.Location) === mapName)
      .filter((i) => i.Name.toLowerCase().includes(markFilter().toLowerCase()))
  );

  return (
    <div class="h-full px-2 flex flex-col justify-between">
      <div>
        <label>
          <h2>Map</h2>
          <select
            class="select w-full"
            onChange={(e) => changeMap(e.target.value as MapNames)}
            value={mapName}
          >
            <option value="overworld">overworld</option>
            <option value="underworld">underworld</option>
            <option value="scadutree">scadutree</option>
          </select>
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
        </label>

        <For
          each={filteredItems()}
          children={(item) => <ItemCard item={item} />}
        />
      </div>
    </div>
  );
}
