import { onMount } from "solid-js";
import * as L from "leaflet";
import { z } from "zod";
import { Stringify } from "../lib/types";
import { LEAFLET_BASE_URL } from "../lib/constants";

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

type Maps = z.infer<typeof MapSchema>;

const TILES_URL = (mapName: Maps) =>
  `${LEAFLET_BASE_URL}${encodeURIComponent(`maps/${mapName}/`)}{z}-{x}-{y}.jpg?alt=media`;

export default function Map(props: {
  onMove: (pos: Position) => void;
  map: Maps | (string & {});
  /** This is coming from params, so string here */
  position: Partial<Stringify<Position>>;
}) {
  const mapName = MapSchema.safeParse(props.map).data!;

  onMount(() => {
    // TODO check that params is a valid value

    const map = L.map(MAP_ID, {
      zoomControl: false,
      attributionControl: false,
      minZoom: 1,
      maxZoom: 7,
      zoom: +(props.position.zoom ?? "1"),
      center: [+(props.position.lat ?? "0"), +(props.position.lng ?? "0")],
    });
    // map.addControl(
    //   L.control.zoom({
    //     position: "bottomright",
    //   })
    // );
    // .on("click", (e: L.LeafletMouseEvent) => {
    //   L.marker(e.latlng).addTo(map);
    // });

    map.on("zoomend moveend", () => {
      const zoom = map.getZoom();
      const center = map.getCenter();

      props.onMove({
        zoom,
        lat: +center.lat.toFixed(0),
        lng: +center.lng.toFixed(0),
      });
    });

    L.tileLayer(TILES_URL(mapName), {
      maxZoom: 7,
      noWrap: true,
    }).addTo(map);
  });

  return <div id={MAP_ID} class="h-screen" />;
}
