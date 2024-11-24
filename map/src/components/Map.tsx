import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import * as L from "leaflet";
import { z } from "zod";
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

    context.map
      .removeLayer(currentLayer)
      .addLayer(L.tileLayer(TILES_URL(mapNameValue), tileLayerOptions));
  });

  onMount(() => {
    // TODO check that params is a valid value

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

    currentLayer = L.tileLayer(TILES_URL(mapName()), tileLayerOptions).addTo(
      map
    );

    setMapInstance(map);
  });

  createEffect(() => {
    if (!context.map) return;

    context.markers.forEach((marker) => marker.addTo(context.map));
  });

  // If the map loads with item in url, its an embedded map
  if (props.search.item) {
    Item.byName(props.search.item, (items) => {
      const foundItem = items[0];
      if (foundItem) {
        focusPosition(foundItem);
      }
    });
  }

  return <div id={MAP_ID} class="h-screen" />;
}
