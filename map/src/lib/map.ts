import { Item } from "../firebase";
import * as L from "leaflet";
import { createSignal } from "solid-js";

export function formatLatLng(latlng: number): number {
  return +latlng.toFixed(0);
}

export const GraceIcon = L.icon({
  iconUrl: "/icons/grace.webp",
  iconSize: [32, 32], // size of the icon
  iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});

const [mapMarkers, setMapMarkers] = createSignal<Map<string, L.Marker>>(
  new Map<string, L.Marker>()
);

Item.liveCollection((items) => {
  console.log(items);

  for (const item of items) {
    if (mapMarkers().has(item.id)) {
      mapMarkers().get(item.id)!.setLatLng(item.data.latlng);
    } else {
      const marker = L.marker(item.data.latlng, { icon: GraceIcon });

      setMapMarkers((prev) => new Map(prev).set(item.id, marker));
    }
  }
});

export { mapMarkers, setMapMarkers };
