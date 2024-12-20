import { useParams, useSearchParams } from "@solidjs/router";
import MapComponent from "~/components/Map";
import { MapSearchParams, MapUrlParams } from "~/lib/types";
import { Drawer } from "~/components/Drawer";
import { Protected } from "~/firebase/auth";
import MapSidebar from "~/components/MapSidebar";
import { createPersistedSignal } from "~/lib/signals";
import {
  BASE_URL,
  EDITOR_SIDEBAR,
  HOTKEYS,
  MAP_SIDEBAR,
} from "~/lib/constants";
import { isInIframe } from "~/lib/iframe";
import EditorSiderbar from "~/components/EditorSidebar";
import { onHotkey, registerHotkeys } from "~/lib/hotkeys";
import { onMount, onCleanup, createMemo, createEffect } from "solid-js";
import cn, { minWidth } from "~/lib/styling";

import "leaflet/dist/leaflet.css";
import {
  ArrowsPointingOutIcon,
  ArrowUTurnLeftIcon,
  GotoIcon,
  MinusIcon,
  PlusIcon,
} from "~/components/Icons";
import { refocusItem, useAppContext } from "~/lib/context";
import OverlayElement from "~/components/OverlayElement";

export default function Map() {
  const context = useAppContext();
  const params = useParams<MapUrlParams>();
  const [search, setSearch] = useSearchParams<MapSearchParams>();

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

  const focussedItem = createMemo(() => {
    const focusItem = context.items.find((i) => i.data.name === search.item);

    const [itemLat, itemLng] = focusItem?.data.latlng ?? [0, 0];
    const searchLat = +(search.lat ?? "0"),
      searchLng = +(search.lng ?? "0");

    return itemLat === searchLat && itemLng === searchLng;
  });

  return (
    <div class="w-screen h-screen">
      <MapComponent map={params.map} onMove={setSearch} search={search} />

      {isInIframe() ? (
        <>
          <OverlayElement
            class={cn(
              "top-1 right-1 bg-base-100 rounded-tl rounded-bl p-1 block",
              focussedItem() && "hidden"
            )}
          >
            <GotoIcon onClick={() => refocusItem(search.item)} />
          </OverlayElement>

          <OverlayElement class="bottom-1 right-1 bg-base-100 rounded-tl rounded-bl p-1 block">
            <PlusIcon onClick={() => context.map.zoomIn()} />
            <hr class="border-neutral-700 my-1" />
            <MinusIcon onClick={() => context.map.zoomOut()} />
            <hr class="border-neutral-700 my-1" />
            <ArrowsPointingOutIcon
              onClick={() => window.open(window.location.href)}
            />
          </OverlayElement>
        </>
      ) : (
        <>
          <Drawer position="left" onChange={setOpenLeft} open={openLeft}>
            <MapSidebar />
          </Drawer>
          {widthQuery() && (
            <Protected>
              <Drawer onChange={setOpenRight} open={openRight}>
                <EditorSiderbar />
              </Drawer>
            </Protected>
          )}
        </>
      )}
    </div>
  );
}
