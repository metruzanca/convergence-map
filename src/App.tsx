import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { onMount } from "solid-js";

const COORDS = "{z}/{x}/{y}.jpg";

const MAP_ID = "map";

const PARAMS = {
  area: "area",
} as const;

type Area = "main" | "ashen" | "scadu" | "sofia";

const AREA: Record<Area, string> = {
  // TODO Save these in repo
  main: `${import.meta.env.VITE_MAP_MAIN_URL}/${COORDS}`,
  scadu: `${import.meta.env.VITE_MAP_SCADU_URL}/${COORDS}`,
  sofia: `${import.meta.env.VITE_MAP_SOFIA_URL}/${COORDS}`,
  ashen: `${import.meta.env.VITE_MAP_ASHEN_URL}/${COORDS}`,
};

export default function App() {
  onMount(() => {
    const params = new URLSearchParams(location.search);
    const areaName = (params.get(PARAMS.area) as Area) ?? "main";
    const mapUrl = AREA[areaName];

    const map = L.map(MAP_ID).setView([0, 0], 1);

    L.tileLayer(mapUrl, {
      maxZoom: 7,
      noWrap: true,
    }).addTo(map);
  });

  return (
    <div class="bg-black w-screen h-screen">
      <div id={MAP_ID} class="h-screen "></div>
    </div>
  );
}
