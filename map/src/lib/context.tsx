import { createContext, JSXElement, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Item } from "~/firebase";
import * as L from "leaflet";

type AppState = {
  categories: string[];
  items: Item[];
  markers: Map<string, L.Marker>;
  map: L.Map;
};

const initial: AppState = {
  categories: [],
  items: [],
  markers: new Map<string, L.Marker>(),
  map: {} as L.Map,
};

const appContext = createContext<AppState>(initial satisfies AppState);

export const useAppContext = () => useContext(appContext);

const GraceIcon = L.icon({
  iconUrl: "/icons/grace.webp",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const [store, setStore] = createStore<AppState>(initial);

export function AppContextProvider(props: { children: JSXElement }) {
  Item.liveCollection((items) => {
    // Clear markers whenever items is updated
    setStore("markers", new Map());
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
  // Category.liveCollection((data) => setStore("category", data));

  return (
    <appContext.Provider value={store}>{props.children}</appContext.Provider>
  );
}

export const setMapInstance = (instance: L.Map) => setStore("map", instance);
