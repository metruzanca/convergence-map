import { createContext, createEffect, JSXElement, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import * as L from "leaflet";
import { FOCUS_ZOOM } from "./constants";
import { MapNames, MapSearchParams, MapUrlSegments } from "./types";
import { MapPinSolidIcon, SwordIcon } from "~/components/Icons";
import { MapPopup } from "~/components/Map";
import { componentToElement } from "./signals";
import { getItems, getLatlng } from "./markers";
import { FlatItem } from "./sticher";
import { useNavigate } from "@solidjs/router";

type MarkerKey = number;

type AppState = {
  // categories: string[];
  items: FlatItem[];
  markers: Map<MarkerKey, L.Marker>;
  mapReference: L.Map;
};

const initial: AppState = {
  // categories: [],
  items: [],
  markers: new Map<MarkerKey, L.Marker>(),
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

if (import.meta.env.DEV) {
  createEffect(() => {
    console.log("store changed", store);
  });
}

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

export function createPopup(item: FlatItem, marker: L.Marker) {
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
  switch (true) {
    case category.includes("weapons"):
      return swordIcon;
    default:
      return defaultIcon;
  }
}

export function AppContextProvider(props: { children: JSXElement }) {
  const items = getItems();

  const hashmap = new Map<MarkerKey, L.Marker>();
  for (const item of items) {
    if (store.markers.has(item.ID)) {
      store.markers.get(item.ID)!.setLatLng(getLatlng(item));
    } else {
      // TODO multiple items in same coordinate can use the same pin, maybe
      const marker = L.marker(getLatlng(item), {
        icon: iconByCategory(item.Category),
      });
      marker.bindPopup(createPopup(item, marker));

      hashmap.set(item.ID, marker);
    }
  }

  setStore("items", items);
  setStore("markers", hashmap);

  // const navigate = useNavigate();
  // const location = useLocation();

  // const params = useParams<MapUrlSegments>();
  // const [initialQuery] = useSearchParams<MapSearchParams>();

  return (
    <appContext.Provider value={store}>{props.children}</appContext.Provider>
  );
}

export const setMapInstance = (instance: L.Map) =>
  setStore("mapReference", instance);

/** Update url search query params & history */
export function setSearchParams(newQuery: Partial<MapSearchParams>) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  for (const [k, v] of Object.entries(newQuery)) {
    params.set(k, v);
  }
  url.search = params.toString();
  window.history.replaceState({}, "", url);
}

/** Focus Position and update url with lat,lng */
export function focusPosition(position: L.LatLngTuple) {
  const context = useAppContext();
  context.mapReference?.setView(position, FOCUS_ZOOM);
  setSearchParams({
    lat: position[0].toString(),
    lng: position[1].toString(),
  });
}

/** Focus Position and update url with lat,lng,item */
export function focusItem(item: FlatItem) {
  focusPosition(getLatlng(item));
  setSearchParams({ item: item.Name });
}

export function focusItemByName(name?: string) {
  const context = useAppContext();

  const foundItem = context.items.find((item) => item.Name === name);
  if (foundItem) {
    focusItem(foundItem);
  }
}

export function useChangeMap() {
  const navigate = useNavigate();

  return (mapname: string) => {
    if (window.location.href.includes(mapname)) return;

    // Between overworld & underworld, keep positions in sync, so things like sofia river elevators line up
    return navigate(`/${mapname}${window.location.search.toString()}`);
  };
}

type UseUrlState = {
  segments: MapUrlSegments;
  query: Partial<MapSearchParams>;
};

type UseUrlActions = {
  changeMap: (mapname: MapNames) => void;
};

// export function useUrl(): [Store<UseUrlState>, UseUrlActions] {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const params = useParams<MapUrlSegments>();
//   const [initialQuery] = useSearchParams<MapSearchParams>();

//   const [state, setState] = createStore<UseUrlState>({
//     segments: {
//       map: MapSchema.safeParse(params.map).data!,
//     },
//     query: initialQuery,
//   });

//   createEffect(() => {
//     navigate(`/${state.segments.map}${location.search.toString()}`);
//   });

//   return [
//     state,
//     {
//       changeMap: (map: string) =>
//         setState("segments", "map", (prev) => {
//           if (prev === map) return prev;
//           return MapSchema.safeParse(map).data!;
//         }),
//     },
//   ];
// }
