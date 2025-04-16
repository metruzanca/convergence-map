import { useParams, useSearchParams } from "@solidjs/router";
import MapComponent from "~/components/Map";
import { MapSearchParams, MapUrlParams } from "~/lib/types";
import { Drawer } from "~/components/Drawer";
import MapSidebar from "~/components/MapSidebar";
import { createPersistedSignal } from "~/lib/signals";
import { HOTKEYS, MAP_SIDEBAR } from "~/lib/constants";
import { isInIframe } from "~/lib/iframe";
import { onHotkey, registerHotkeys } from "~/lib/hotkeys";
import { onMount, onCleanup, createMemo } from "solid-js";
import cn from "~/lib/styling";

import "leaflet/dist/leaflet.css";
import {
  ArrowsPointingOutIcon,
  GotoIcon,
  MinusIcon,
  PlusIcon,
} from "~/components/Icons";
import { refocusItem, useAppContext } from "~/lib/context";
import OverlayElement from "~/components/OverlayElement";
import { getLatlng } from "~/lib/markers";

export default function MapPage() {
  const context = useAppContext();
  const params = useParams<MapUrlParams>();
  const [search, setSearch] = useSearchParams<MapSearchParams>();

  const [openLeft, setOpenLeft] = createPersistedSignal(MAP_SIDEBAR, false);
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
      })
    );
  });

  // const widthQuery = minWidth(640);

  const focussedItem = createMemo(() => {
    const focusItem = context.items.find((i) => i.Name === search.item);

    const [itemLat, itemLng] = focusItem ? getLatlng(focusItem) : [0, 0];
    const searchLat = +(search.lat ?? "0"),
      searchLng = +(search.lng ?? "0");

    console.log({ itemLat, itemLng }, { searchLat, searchLng });

    return itemLat === searchLat && itemLng === searchLng;
  });

  return (
    <div class="w-screen h-screen">
      <MapComponent map={params.map} onMove={setSearch} search={search} />

      {isInIframe() ? (
        <>
          <OverlayElement
            class={cn(
              "top-1 right-1 bg-base-300 rounded-tl rounded-bl p-1 block",
              (focussedItem() || !search.item) && "hidden"
            )}
          >
            <GotoIcon onClick={() => refocusItem(search.item)} />
          </OverlayElement>

          <OverlayElement class="bottom-1 right-1 bg-base-300 rounded-tl rounded-bl p-1 block">
            <PlusIcon onClick={() => context.mapReference.zoomIn()} />
            <hr class="border-neutral-700 my-1" />
            <MinusIcon onClick={() => context.mapReference.zoomOut()} />
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

          <OverlayElement class="bottom-8 right-8 bg-base-300 border-primary border rounded p-1 block">
            <PlusIcon onClick={() => context.mapReference.zoomIn()} />
            <hr class="border-neutral-700 my-1" />
            <MinusIcon onClick={() => context.mapReference.zoomOut()} />
          </OverlayElement>
        </>
      )}
    </div>
  );
}
