import { A, useParams } from "@solidjs/router";
import { MapNames, MapUrlParams } from "./Map";
import { onCleanup } from "solid-js";
import { onHotkey } from "../lib/hotkeys";
import { Sprite } from "./Icons";
import { getCurrentUser } from "../firebase/auth";

export default function MapSidebar() {
  const params = useParams<MapUrlParams>();
  let inputRef!: HTMLInputElement;

  onCleanup(
    onHotkey({ key: "k", ctrl: true }, () => {
      inputRef.focus();
    })
  );

  const changeMap = (mapname: MapNames) => {
    if (window.location.href.includes(mapname)) return;
    if (window.location.href.includes("scadutree")) {
      window.location.href = `/${mapname}`;
    } else {
      window.location.pathname = `/${mapname}`;
    }
  };

  onCleanup(onHotkey({ key: "1", ctrl: true }, () => changeMap("overworld")));
  onCleanup(onHotkey({ key: "2", ctrl: true }, () => changeMap("underworld")));
  onCleanup(onHotkey({ key: "3", ctrl: true }, () => changeMap("scadutree")));

  return (
    <div class="h-full px-2 flex flex-col justify-between">
      <div>
        <label>
          <h2>Map</h2>
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
            />
            <kbd class="kbd text-nowrap">ctrl + K</kbd>
          </label>
        </label>

        <p class="py-2">More to come...</p>

        <Sprite sprite="grace" size={2} />
      </div>
      <div class="pb-10 flex items-center justify-center">
        <A href="/login" class="btn-link">
          {getCurrentUser().type === "user" ? "Account" : "Login"}
        </A>
      </div>
    </div>
  );
}
