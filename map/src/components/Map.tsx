import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import * as L from "leaflet";
import { z } from "zod";
import { Stringify } from "~/lib/types";
import { LEAFLET_BASE_URL } from "~/lib/constants";
import { formatLatLng, store } from "~/lib/map";

const MAP_ID = "map";

export type Position = {
  zoom: number;
  lat: number;
  lng: number;
};

const MapSchema = z
  .union([
    z.literal("overworld"),
    z.literal("underworld"),
    z.literal("scadutree"),
  ])
  .default("overworld");

export type MapNames = z.infer<typeof MapSchema>;

const TILES_URL = (mapName: MapNames) =>
  `${LEAFLET_BASE_URL}${encodeURIComponent(
    `maps/${mapName}/`
  )}{z}-{x}-{y}.jpg?alt=media`;

export type MapUrlParams = { map: string };
export type MapSearchParams = Stringify<Position>;

// In theory, should never run into the situation where this "{} as L.Map" will be problematic..
const [map, setMap] = createSignal<L.Map>({} as L.Map);

export const getMap = map;

const tileLayerOptions: L.TileLayerOptions = {
  maxZoom: 7,
  noWrap: true,
};

export default function MapComponent(props: {
  onMove: (pos: Position) => void;
  map: MapNames | (string & {});
  /** This is coming from params, so string here */
  position: Partial<Stringify<Position>>;
}) {
  const mapName = createMemo(() => MapSchema.safeParse(props.map).data!);

  let currentLayer: L.TileLayer;

  createEffect(() => {
    const mapNameValue = mapName(); // keep above return for reactivity purposes
    if (currentLayer === undefined) return;

    getMap()
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
      zoom: +(props.position.zoom ?? "1"),
      center: [+(props.position.lat ?? "0"), +(props.position.lng ?? "0")],
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

    setMap(map);
  });

  createEffect(() => {
    const map = getMap();
    if (!map) return;

    store.markers.forEach((marker) => marker.addTo(map));
  });

  return <div id={MAP_ID} class="h-screen" />;
}
