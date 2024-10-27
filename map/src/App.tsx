import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { onMount } from "solid-js";
import { useParams } from "@solidjs/router";

const MAP_ID = "map";

// TODO add env variable to use local map files for map development
const TILES_URL = (mapName: Maps) =>
  `https://firebasestorage.googleapis.com/v0/b/convergence-mod-map.appspot.com/o/` +
  encodeURIComponent(`maps/${mapName}/`) +
  "{z}-{x}-{y}.jpg?alt=media";

type Maps = "overworld" | "underworld" | "scadutree";

export default function App() {
  const params = useParams<{ map: string }>();

  onMount(() => {
    // TODO check that params is a valid value
    const mapName = (params.map as Maps) || "overworld";
    const map = L.map(MAP_ID, {
      zoomControl: false,
      attributionControl: false,
    })
      .setView([0, 0], 1)
      .addControl(
        L.control.zoom({
          position: "bottomright",
        })
      )
      .on("click", (e: L.LeafletMouseEvent) => {
        L.marker(e.latlng).addTo(map);
      });

    L.tileLayer(TILES_URL(mapName), {
      maxZoom: 7,
      noWrap: true,
    }).addTo(map);
  });

  return (
    <div class="bg-black w-screen h-screen">
      <div class="absolute top-0 right-0 z-[500]">
        <select
          onChange={(e) => {
            window.location.pathname = `/${e.target.value}`;
          }}
          value={params.map}
        >
          <option value="overworld">overworld</option>
          <option value="underworld">underworld</option>
          <option value="scadutree">scadutree</option>
        </select>
      </div>
      <div id={MAP_ID} class="h-screen" />
    </div>
  );
}
