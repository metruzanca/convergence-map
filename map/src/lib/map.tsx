import { Item } from "~/firebase";
import * as L from "leaflet";
import { createStore } from "solid-js/store";

export function formatLatLng(latlng: number): number {
  return +latlng.toFixed(0);
}

const GraceIcon = L.icon({
  iconUrl: "/icons/grace.webp",
  iconSize: [32, 32], // size of the icon
  iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
});

// FIXME move this to lib/context
const [store, setStore] = createStore<{
  items: Item[];
  markers: Map<string, L.Marker>;
}>({
  items: [],
  markers: new Map<string, L.Marker>(),
});

Item.liveCollection((items) => {
  // Items raw
  setStore("items", items);

  // Markers
  for (const item of items) {
    if (store.markers.has(item.id)) {
      store.markers.get(item.id)!.setLatLng(item.data.latlng);
    } else {
      const marker = L.marker(item.data.latlng, { icon: GraceIcon });

      setStore("markers", (prev) => new Map(prev).set(item.id, marker));
    }
  }
});

export { store, setStore };
