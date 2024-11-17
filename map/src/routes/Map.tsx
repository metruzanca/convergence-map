// import { Title } from "@solidjs/meta";

import "leaflet/dist/leaflet.css";
import { useParams, useSearchParams } from "@solidjs/router";
import MapComponent, { MapUrlParams, Position } from "~/components/Map";
import { Stringify } from "~/lib/types";
import { Drawer } from "~/components/Drawer";
import { Protected } from "~/firebase/auth";
import MapSidebar from "~/components/MapSidebar";
import { createPersistedSignal } from "~/lib/signals";
import { EDITOR_SIDEBAR, MAP_SIDEBAR } from "~/lib/constants";
import { isInIframe } from "~/lib/iframe";
import EditorSiderbar from "~/components/EditorSidebar";
import { HotkeyDetails, onHotkey, registerHotkeys } from "~/lib/hotkeys";
import { onMount, onCleanup, createEffect } from "solid-js";
import { minWidth } from "~/lib/styling";

const hotkeys: Array<HotkeyDetails & { description: string }> = [
  { key: "Escape", description: "Close all drawers" },
  { key: "k", ctrl: true, description: "Open and focus item search" },
  { key: "1", ctrl: true, description: "Quick switch to Map 1" },
  { key: "2", ctrl: true, description: "Quick switch to Map 2" },
  { key: "3", ctrl: true, description: "Quick switch to Map 3" },
];

export default function Map() {
  const params = useParams<MapUrlParams>();

  createEffect(() => {
    console.log("params", params.map);
  });

  const [search, setSearch] = useSearchParams<Stringify<Position>>();

  const [openLeft, setOpenLeft] = createPersistedSignal(MAP_SIDEBAR, false);
  const [openRight, setOpenRight] = createPersistedSignal(
    EDITOR_SIDEBAR,
    false
  );

  onMount(() => {
    onCleanup(registerHotkeys(hotkeys));
    onCleanup(
      onHotkey({ key: "k", ctrl: true }, () => {
        setOpenLeft(true);
      })
    );
    onCleanup(
      onHotkey({ key: "Escape" }, () => {
        setOpenLeft(false);
        setOpenRight(false);
      })
    );
  });

  const widthQuery = minWidth(640);

  return (
    <div class="w-screen h-screen">
      <MapComponent
        map={params.map || "overworld"}
        onMove={setSearch}
        position={search}
      />

      {!isInIframe() && (
        <>
          <Drawer
            position="left"
            onChange={setOpenLeft}
            open={openLeft}
            children={<MapSidebar />}
          />
          {widthQuery() && (
            <Protected>
              <Drawer
                onChange={setOpenRight}
                open={openRight}
                children={<EditorSiderbar />}
              />
            </Protected>
          )}
        </>
      )}
    </div>
  );
}
