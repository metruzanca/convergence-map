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
import { focusPosition, setMapInstance, useAppContext } from "~/lib/context";
import { LinkIcon, PinIcon } from "./Icons";
import { copyToClipboard, kebabToHuman } from "~/lib/utils";
import { itemLink } from "~/lib/wiki-integration";
import { FlatItem } from "~/lib/sticher";
import {
  getItems,
  getLatlng,
  locationToMap,
  formatLatLng,
} from "~/lib/markers";

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
      // https://leafletjs.com/examples/crs-simple/crs-simple.html
      crs: L.CRS.Simple,
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
      console.log("Clicked map at", JSON.stringify(event.latlng));
    });

    currentLayer = L.tileLayer(TILES_URL(mapName()), tileLayerOptions).addTo(
      map
    );
    // map.fitBounds(overworldBounds);

    setMapInstance(map);
  });

  let markerLayer: L.LayerGroup<any>;

  createEffect(() => {
    if (!context.mapReference) return;

    // SUPER JANK, I'll fix it later
    // and switching maps doesn't change this atm

    if (markerLayer) context.mapReference!.removeLayer(markerLayer);
    markerLayer = L.layerGroup().addTo(context.mapReference!);

    context.items
      .filter((item) => locationToMap(item.Location) === mapName())
      .forEach((item) => {
        if (context.markers.has(item.ID)) {
          context.markers.get(item.ID)!.addTo(markerLayer);
        }
      });
  });

  // If the map loads with item in url, its an embedded map
  createEffect(() => {
    if (props.search.item) {
      const foundItem = getItems().find(
        (item) => item.Name === props.search.item
      );
      if (foundItem) {
        focusPosition(getLatlng(foundItem));
      }
    }
  });

  return <div id={MAP_ID} class="h-screen" />;
}

export function MapPopup(props: { marker: L.Marker; item: FlatItem }) {
  return (
    <div class="w-40 p-1 pt-2  bg-black opacity-80 border-primary border">
      <div class="pb-1">
        <h3 class="flex items-center text-neutral-content border-0 mb-0">
          {kebabToHuman(props.item.Name)}

          <a
            href={itemLink(props.item.Category, props.item.Name)}
            target="_blank"
          >
            <LinkIcon size="small" class="text-primary" />
          </a>
        </h3>

        <h4 class="text-primary">{props.item.Category}</h4>
      </div>

      <p
        class="text-base-content flex items-center cursor-pointer"
        onClick={() => {
          focusPosition(getLatlng(props.item));
          copyToClipboard(location.href);
        }}
      >
        Map coordinates
        <PinIcon size="small" class="text-primary" />
      </p>
    </div>
  );
}
