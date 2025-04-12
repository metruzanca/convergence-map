import { createContext, JSXElement, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Item } from "~/firebase";
import * as L from "leaflet";
import { Category } from "~/firebase/models/category";
import { FOCUS_ZOOM } from "./constants";
import { MapSearchParams } from "./types";
import { MapPinSolidIcon, SwordIcon } from "~/components/Icons";
import { MapPopup } from "~/components/Map";
import { componentToElement } from "./signals";

type AppState = {
  categories: Category[];
  items: Item[];
  markers: Map<string, L.Marker>;
  mapReference: L.Map;

  focus?: Item;
};

const initial: AppState = {
  categories: [],
  items: [],
  markers: new Map<string, L.Marker>(),
  mapReference: {} as L.Map, // we're mounting the map immediately, so this shouldn't be an issue
};

const appContext = createContext<AppState>(initial satisfies AppState);

export const useAppContext = () => {
  const value = useContext(appContext);
  if (value === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return value;
};

const [store, setStore] = createStore<AppState>(initial);

export function createMarkerIcon(Icon: () => JSXElement) {
  const markerIconDiv = componentToElement(Icon);

  const markerDiv = L.divIcon({
    html: markerIconDiv.innerHTML,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, 0],
    className: "transparent",
  });
  return markerDiv;
}

export function createPopup(item: Item, marker: L.Marker) {
  return () =>
    componentToElement(() => <MapPopup item={item} marker={marker} />);
}

// Keep these createMarkerIcon calls outside the iconByCategory so they can be reused

const defaultIcon = createMarkerIcon(() => (
  <MapPinSolidIcon size="large" class="text-primary stroke-black stroke-1" />
));

const swordIcon = createMarkerIcon(() => (
  <span class="relative flex justify-center items-center">
    <MapPinSolidIcon size="large" class="text-primary stroke-black stroke-1" />
    <SwordIcon class="w-3 h-3 fill-black absolute" />
  </span>
));

function iconByCategory(category: string) {
  switch (category) {
    case "weapons":
      return swordIcon;
    default:
      return defaultIcon;
  }
}

export function AppContextProvider(props: { children: JSXElement }) {
  Category.liveCollection((data) => setStore("categories", data));
  Item.liveCollection((items) => {
    setStore("items", items);

    // clear
    const hashmap = new Map<string, L.Marker>();
    for (const item of items) {
      if (store.markers.has(item.id)) {
        store.markers.get(item.id)!.setLatLng(item.data.latlng);
      } else {
        const marker = L.marker(item.data.latlng, {
          icon: iconByCategory(item.data.category),
        });
        marker.bindPopup(createPopup(item, marker));

        hashmap.set(item.id, marker);
      }
    }
    setStore("markers", hashmap);
  });

  return (
    <appContext.Provider value={store}>{props.children}</appContext.Provider>
  );
}

export const setMapInstance = (instance: L.Map) =>
  setStore("mapReference", instance);

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
  context.mapReference?.setView(position, FOCUS_ZOOM);
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
