import "leaflet/dist/leaflet.css";
import { useParams, useSearchParams } from "@solidjs/router";
import Map, { Position } from "./components/Map";
import { Stringify } from "./lib/types";
import { Drawer } from "./components/Drawer";
import { createSignal } from "solid-js";
import { Protected } from "./firebase/auth";

export default function App() {
  const params = useParams<{ map: string }>();
  const [search, setSearch] = useSearchParams<Stringify<Position>>();

  const [open, setOpen] = createSignal(false);

  //@ts-ignore
  window.setOpen = setOpen;

  return (
    <div class="w-screen h-screen">
      <div class="absolute top-0 left-0 z-[500] bg-base-300">
        <label>
          Map:
          <select
            onChange={(e) => {
              window.location.pathname = `/${e.target.value}`;
            }}
            value={params.map ?? "overworld"}
          >
            <option value="overworld">overworld</option>
            <option value="underworld">underworld</option>
            <option value="scadutree">scadutree</option>
          </select>
        </label>
      </div>
      <Map map={params.map} onMove={setSearch} position={search} />
      <Protected>
        <Drawer onChange={setOpen} open={open}>
          Testing drawer
        </Drawer>
      </Protected>
    </div>
  );
}
