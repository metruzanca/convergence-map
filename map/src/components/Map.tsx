import { createEffect, createMemo, onMount } from "solid-js";
import * as L from "leaflet";
import {
  DEFAULT_MAP,
  MapNames,
  MapSchema,
  MapSearchParams,
  Position,
} from "~/lib/types";
import { LEAFLET_BASE_URL } from "~/lib/constants";
import { formatLatLng } from "~/lib/leaflet";
import { focusPosition, setMapInstance, useAppContext } from "~/lib/context";
import { Item } from "~/firebase";
import { LinkIcon, PinIcon } from "./Icons";
import { copyToClipboard, kebabToHuman } from "~/lib/utils";

const MAP_ID = "map";

const TILES_URL = (mapName: MapNames) =>
  `${LEAFLET_BASE_URL}${encodeURIComponent(
    `maps/${mapName}/`
  )}{z}-{x}-{y}.jpg?alt=media`;

const tileLayerOptions: L.TileLayerOptions = {
  maxZoom: 7,
  noWrap: true,
};

export default function MapComponent(props: {
  onMove: (pos: Position) => void;
  map: MapNames | (string & {});
  search: Partial<MapSearchParams>;
}) {
  const context = useAppContext();
  const mapName = createMemo(
    () => MapSchema.safeParse(props.map ?? DEFAULT_MAP).data!
  );

  let currentLayer: L.TileLayer;

  createEffect(() => {
    const mapNameValue = mapName(); // keep above return for reactivity purposes
    if (currentLayer === undefined) return;

    context.mapReference
      ?.removeLayer(currentLayer)
      ?.addLayer(L.tileLayer(TILES_URL(mapNameValue), tileLayerOptions));
  });

  onMount(async () => {
    const map = L.map(MAP_ID, {
      zoomControl: false,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 7,
      zoom: +(props.search.zoom ?? "1"),
      center: [+(props.search.lat ?? "0"), +(props.search.lng ?? "0")],
    });

    map.on("zoomend moveend", () => {
      const zoom = map.getZoom();
      const center = map.getCenter();

      props.onMove({
        zoom,
        lat: formatLatLng(center.lat),
        lng: formatLatLng(center.lng),
      });
    });

    map.on("click", (event) => {
      console.log(event.latlng);
    });

    currentLayer = L.tileLayer(TILES_URL(mapName()), tileLayerOptions).addTo(
      map
    );

    setMapInstance(map);
  });

  createEffect(() => {
    if (!context.mapReference) return;

    context.markers.forEach((marker) => marker.addTo(context.mapReference!));
  });

  // If the map loads with item in url, its an embedded map
  createEffect(() => {
    if (props.search.item) {
      Item.byName(props.search.item, (foundItem) => {
        if (foundItem) {
          focusPosition(foundItem);

          focusPosition(foundItem.data.latlng);
        }
      });
    }
  });

  return <div id={MAP_ID} class="h-screen" />;
}

export function MapPopup(props: { marker: L.Marker; item: Item }) {
  return (
    <div class="w-40 p-1 pt-2  bg-black opacity-80 border-primary border">
      <div class="pb-1">
        <h3 class="flex items-center text-neutral-content border-0 mb-0">
          {kebabToHuman(props.item.data.name)}
          <LinkIcon
            size="small"
            class="text-primary"
            onClick={() => window.open(props.item.data.url)}
          />
        </h3>

        <h4 class="text-primary">{props.item.data.category}</h4>
      </div>

      <p
        class="text-base-content flex items-center cursor-pointer"
        onClick={() => {
          focusPosition(props.item.data.latlng);
          copyToClipboard(location.href);
        }}
      >
        Map coordinates
        <PinIcon size="small" class="text-primary" />
      </p>
    </div>
  );
}
