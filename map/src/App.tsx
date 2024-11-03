import "leaflet/dist/leaflet.css";
import { useParams, useSearchParams } from "@solidjs/router";
import Map, { MapUrlParams, Position } from "./components/Map";
import { Stringify } from "./lib/types";
import { Drawer } from "./components/Drawer";
import { Protected } from "./firebase/auth";
import MapSidebar from "./components/MapSidebar";
import { createPersistedSignal } from "./lib/signals";
import { EDITOR_SIDEBAR, MAP_SIDEBAR } from "./lib/constants";
import { isInIframe } from "./lib/iframe";
import EditorSiderbar from "./components/EditorSidebar";
import { onHotkey, registerHotkeys } from "./lib/hotkeys";
import { onMount, onCleanup } from "solid-js";
import { minWidth } from "./lib/styling";

export default function App() {
  const params = useParams<MapUrlParams>();
  const [search, setSearch] = useSearchParams<Stringify<Position>>();

  const [openLeft, setOpenLeft] = createPersistedSignal(MAP_SIDEBAR, false);
  const [openRight, setOpenRight] = createPersistedSignal(
    EDITOR_SIDEBAR,
    false
  );

  onMount(() => {
    onCleanup(
      registerHotkeys([
        { key: "k", ctrl: true },
        { key: "Escape" },
        { key: "1", ctrl: true },
        { key: "2", ctrl: true },
        { key: "3", ctrl: true },
      ])
    );
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
      <Map map={params.map} onMove={setSearch} position={search} />

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
