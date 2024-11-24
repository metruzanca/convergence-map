import { createContext, JSXElement, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Item } from "~/firebase";
import * as L from "leaflet";
import { Category } from "~/firebase/models/category";
import { FOCUS_ZOOM } from "./constants";
import { MapSearchParams } from "./types";
import { useLocation } from "@solidjs/router";

type AppState = {
  categories: Category[];
  items: Item[];
  markers: Map<string, L.Marker>;
  map: L.Map;

  focus?: Item;
};

const initial: AppState = {
  categories: [],
  items: [],
  markers: new Map<string, L.Marker>(),
  map: {} as L.Map, // we're mounting the map immediately, so this shouldn't be an issue
};

const appContext = createContext<AppState>(initial satisfies AppState);

export const useAppContext = () => {
  const value = useContext(appContext);
  if (value === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return value;
};

// const GraceIcon = L.icon({
//   iconUrl: "/icons/grace.webp",
//   iconSize: [32, 32],
//   iconAnchor: [16, 16],
//   // popupAnchor: [0, -32],
// });

const [store, setStore] = createStore<AppState>(initial);

export function AppContextProvider(props: { children: JSXElement }) {
  Category.liveCollection((data) => setStore("categories", data));
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
        const marker = L.marker(item.data.latlng);
        marker.bindPopup("<b>Hello world!</b><br>I am a popup.");

        setStore("markers", (prev) => new Map(prev).set(item.id, marker));
      }
    }
  });

  return (
    <appContext.Provider value={store}>{props.children}</appContext.Provider>
  );
}

export const setMapInstance = (instance: L.Map) => setStore("map", instance);

function setSearchParams(newQuery: Partial<MapSearchParams>) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  for (const [k, v] of Object.entries(newQuery)) {
    params.set(k, v);
  }
  url.search = params.toString();
  window.history.replaceState({}, "", url);
}

export function focusPosition(position: L.LatLngTuple | Item) {
  if (!Array.isArray(position) && "data" in position) {
    position = (position as Item).data.latlng;
  }

  const context = useAppContext();
  context.map?.setView(position, FOCUS_ZOOM);
  setSearchParams({
    lat: position[0].toString(),
    lng: position[1].toString(),
  });
}

export function refocusItem(itemName?: string) {
  const context = useAppContext();

  const foundItem = context.items.find((item) => item.data.name === itemName);
  if (foundItem) {
    focusPosition(foundItem);
  }
}
