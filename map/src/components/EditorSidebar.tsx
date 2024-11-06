import { Item, ItemData } from "../firebase";
import {
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import {
  PencilSquareIcon,
  PinIcon,
  RestoreIcon,
  SearchIcon,
  TrashIcon,
} from "./Icons";
import { Button } from "./Core";
import { useCurrentUser } from "../firebase/auth";
import { LatLngTuple, marker } from "leaflet";
import { getMap } from "./Map";
import cn from "../lib/styling";
import { formatLatLng } from "../lib/map";
import { OnSubmit } from "../lib/types";

export default function EditorSiderbar() {
  // const params = useParams<MapUrlParams>();
  const [items, setItems] = createSignal<Item[]>();
  Item.liveCollection(setItems);

  const [item, setItem] = createSignal<Item>();
  createEffect(() => {
    console.log(item());
  });

  const current = useCurrentUser();

  return (
    <div class="flex flex-col px-2">
      <h2 class="border-b-neutral-700 border-b">Editor Panel</h2>
      <div class="flex gap-2">
        <div>
          <h3>Map Pins</h3>
          <label class="input input-bordered flex items-center gap-2">
            <input type="text" class="grow" placeholder="Search" />
            <SearchIcon class="w-4 h-4 opacity-70" />
          </label>

          <Button
            class="btn-neutral w-full btn-xs"
            onClick={async () => {
              const item = await Item.create(current.user.uid);
              setItem(item);
            }}
          >
            Add Pin
          </Button>

          <div class="flex flex-col gap-2 overflow-y-scroll">
            <For
              each={items()}
              children={(item) => (
                <ItemCard item={item} edit={() => setItem(item)} />
              )}
            />
          </div>
        </div>

        <Show when={item()}>
          <ItemForm item={item()!} onSubmit={setItem} />
        </Show>
      </div>
    </div>
  );
}

function ItemCard(props: { item: Item; edit: () => void }) {
  return (
    <div
      class={cn(
        "bg-primary-content min-h-16 rounded relative p-1",
        props.item.data?.meta?.deleted && "bg-error-content text-error"
      )}
    >
      <div>
        <h4 class="text-sm">{props.item.data.name}</h4>

        <Coordinates latlng={props.item.data.coords} />
      </div>

      {/* Controls */}
      <div class="absolute top-1 right-1 flex gap-1">
        {props.item.data?.meta?.deleted ? (
          <RestoreIcon
            class="text-base-content"
            size="small"
            onClick={() => {
              props.item.restore();
            }}
          />
        ) : (
          <>
            <PencilSquareIcon size="small" onClick={props.edit} />
            <TrashIcon
              size="small"
              onClick={() => {
                props.item.delete();
              }}
            />
          </>
        )}
      </div>

      {props.item.data.meta.deleted && (
        <p class="text-xs absolute bottom-1 left-1">
          deleted on {props.item.data.updatedAt?.toDate().toLocaleString()}
        </p>
      )}
    </div>
  );
}

function ItemForm(props: { item: Item; onSubmit: OnSubmit<Item> }) {
  let newItemName!: HTMLInputElement;

  onMount(() => {
    newItemName.focus();
  });

  const map = getMap();

  const [pin, setPin] = createSignal<ItemData["coords"]>(
    props.item.data.coords
  );
  const [editingPin, setEditingPin] = createSignal(false);
  const addMarker = (e: L.LeafletMouseEvent) => {
    setPin([formatLatLng(e.latlng.lat), formatLatLng(e.latlng.lng)]);
    marker(e.latlng).addTo(map);
    setEditingPin(false);
  };
  createEffect(() => {
    if (editingPin()) {
      map.on("click", addMarker);
    }
    onCleanup(() => map.off("click", addMarker));
  });

  return (
    <form
      class="flex flex-col"
      onSubmit={(e) => {
        const fd = new FormData(e.target as HTMLFormElement);
        props.item.update({
          name: fd.get("name")?.toString() ?? "new item",
          wikiUrl: fd.get("wikiUrl")?.toString() ?? "",
          coords: pin(),
        });
        e.preventDefault();
      }}
    >
      <h3>New Pin</h3>
      <div class="flex flex-col gap-2">
        <input
          name="name"
          ref={newItemName}
          class="input input-bordered input-sm w-full max-w-xs"
          placeholder="Item name"
          type="text"
          value={props.item.data.name}
        />
        <input
          name="wikiUrl"
          ref={newItemName}
          class="input input-bordered input-sm w-full max-w-xs"
          placeholder="Item name"
          type="url"
          value={props.item.data.wikiUrl}
        />
        <div class="flex gap-2 items-center justify-around input input-sm">
          <Coordinates latlng={pin()} edit />
          <PinIcon
            onClick={() => setEditingPin(true)}
            class={cn(editingPin() && "stroke-accent")}
          />
        </div>
        <Button class="btn w-full btn-xs">Save</Button>
      </div>
    </form>
  );
}

function Coordinates(props: { latlng: LatLngTuple; edit?: boolean }) {
  return (
    <div class="flex gap-2 text-sm items-center">
      {props.edit ? (
        <>
          <div>
            <span>X</span>:{" "}
            <input class="max-w-10" type="number" value={props.latlng[0]} />
          </div>
          <div>
            <span>Y</span>:{" "}
            <input class="max-w-10" type="number" value={props.latlng[1]} />
          </div>
        </>
      ) : (
        <>
          <span>
            <span>X</span>: {props.latlng[0]}
          </span>
          <span>
            <span>Y</span>: {props.latlng[1]}
          </span>
        </>
      )}
    </div>
  );
}
