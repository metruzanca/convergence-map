import {
  A,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "@solidjs/router";
import { MapNames, MapUrlParams } from "./Map";
import { createMemo, createSignal, For, onCleanup } from "solid-js";
import { onHotkey } from "~/lib/hotkeys";
import { getCurrentUser } from "~/firebase/auth";
import { Item } from "~/firebase";
import { ItemCard } from "./Item";
import { MapSearchParams } from "~/lib/types";
import { useAppContext } from "~/lib/context";

export default function MapSidebar() {
  const context = useAppContext();
  const params = useParams<MapUrlParams>();
  const [search, setSearch] = useSearchParams<MapSearchParams>();
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
      .filter((i) =>
        i.data.name.toLowerCase().includes(markFilter().toLowerCase())
      )
      .filter((i) => !i.data.deleted)
      .sort((a, b) => Number(a.data.deleted) - Number(b.data.deleted))
  );

  return (
    <div class="h-full px-2 flex flex-col justify-between">
      <div>
        <label>
          <h2>Map</h2>\
          <select
            class="select w-full"
            onChange={(e) => changeMap(e.target.value as MapNames)}
            value={params.map ?? "overworld"}
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

        {/* <Sprite sprite="grace" size={2} /> */}
      </div>
      <div class="pb-10 flex items-center justify-center">
        <A href="/login" class="btn-link">
          {getCurrentUser().type === "user" ? "Account" : "Login"}
        </A>
      </div>
    </div>
  );
}
