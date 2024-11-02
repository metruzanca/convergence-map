import "leaflet/dist/leaflet.css";
import { useParams, useSearchParams } from "@solidjs/router";
import Map, { Position } from "./components/Map";
import { Stringify } from "./lib/types";

export default function App() {
  const params = useParams<{ map: string }>();
  const [search, setSearch] = useSearchParams<Stringify<Position>>();

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
      <Map map={params.map} onMove={setSearch} position={search} />
    </div>
  );
}
