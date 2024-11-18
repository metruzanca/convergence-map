// import { Title } from "@solidjs/meta";

import { useParams, useSearchParams } from "@solidjs/router";
import MapComponent, { MapUrlParams, Position } from "~/components/Map";
import { MapSearchParams, Stringify } from "~/lib/types";
import { Drawer } from "~/components/Drawer";
import { Protected } from "~/firebase/auth";
import MapSidebar from "~/components/MapSidebar";
import { createPersistedSignal } from "~/lib/signals";
import { EDITOR_SIDEBAR, HOTKEYS, MAP_SIDEBAR } from "~/lib/constants";
import { isInIframe } from "~/lib/iframe";
import EditorSiderbar from "~/components/EditorSidebar";
import { onHotkey, registerHotkeys } from "~/lib/hotkeys";
import { onMount, onCleanup } from "solid-js";
import { minWidth } from "~/lib/styling";

import "leaflet/dist/leaflet.css";

export default function Map() {
  const params = useParams<MapUrlParams>();
  const [search, setSearch] = useSearchParams<MapSearchParams>();

  // TODO search.item zoom on item

  const [openLeft, setOpenLeft] = createPersistedSignal(MAP_SIDEBAR, false);
  const [openRight, setOpenRight] = createPersistedSignal(
    EDITOR_SIDEBAR,
    false
  );

  onMount(() => {
    onCleanup(registerHotkeys(HOTKEYS));
    onCleanup(
      onHotkey({ key: "k", ctrl: true }, () => {
        setOpenLeft(true);
      })
    );
    onCleanup(
      onHotkey({ key: "Escape" }, (e) => {
        if (e.detail.target?.tagName === "INPUT") {
          e.detail.target.blur();
          return;
        }

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
