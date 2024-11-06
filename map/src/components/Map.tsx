import { createEffect, createSignal, onMount } from "solid-js";
import * as L from "leaflet";
import { z } from "zod";
import { Stringify } from "../lib/types";
import { LEAFLET_BASE_URL } from "../lib/constants";
import { formatLatLng } from "../lib/map";
import { Item } from "../firebase";

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
  `${LEAFLET_BASE_URL}${encodeURIComponent(`maps/${mapName}/`)}{z}-{x}-{y}.jpg?alt=media`;

export type MapUrlParams = { map: string };

// In theory, should never run into the situation where this "{} as L.Map" will be problematic..
const [map, setMap] = createSignal<L.Map>({} as L.Map);

export const getMap = map;

export default function Map(props: {
  onMove: (pos: Position) => void;
  map: MapNames | (string & {});
  /** This is coming from params, so string here */
  position: Partial<Stringify<Position>>;
}) {
  const mapName = MapSchema.safeParse(props.map).data!;

  const [items, setItems] = createSignal<Item[]>([]);
  Item.liveCollection(setItems);

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

    L.tileLayer(TILES_URL(mapName), {
      maxZoom: 7,
      noWrap: true,
    }).addTo(map);

    setMap(map);
  });

  createEffect(() => {
    const map = getMap();
    if (!map) return;

    const customIcon = L.icon({
      iconUrl: "/icons/grace.webp",
      iconSize: [32, 32], // size of the icon
      iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
    });

    for (const item of items()) {
      L.marker(item.data.coords, { icon: customIcon }).addTo(map);
    }
  });

  return <div id={MAP_ID} class="h-screen" />;
}
