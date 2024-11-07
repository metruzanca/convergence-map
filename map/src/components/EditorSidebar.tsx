import { Item } from "../firebase";
import { createSignal, For, Show } from "solid-js";
import {
  CloseMarkIcon,
  PencilSquareIcon,
  RestoreIcon,
  SearchIcon,
  TrashIcon,
} from "./Icons";
import { Button } from "./Core";
import { useCurrentUser } from "../firebase/auth";
import cn from "../lib/styling";
import { ItemForm } from "./Forms";
import { setMapMarkers } from "../lib/map";

export default function EditorSiderbar() {
  // const params = useParams<MapUrlParams>();
  const [items, setItems] = createSignal<Item[]>([]);
  Item.liveCollection(setItems);

  const [item, setItem] = createSignal<Item>();

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
            {import.meta.env.DEV && items().length > 0 && (
              <Button
                class="btn-xs btn-error"
                onClick={() => {
                  if (confirm(`About to delete all ${items().length} pins`)) {
                    items().forEach((i) => {
                      i.delete();
                      setMapMarkers(new Map());
                    });
                  }
                }}
              >
                DevTool: delete all
              </Button>
            )}
            <For
              each={items().sort(
                (a, b) => Number(a.data.deleted) - Number(b.data.deleted)
              )}
              children={(item) => (
                <ItemCard item={item} edit={() => setItem(item)} />
              )}
            />
          </div>
        </div>

        <Show when={item()}>
          <div class="relative">
            <CloseMarkIcon
              class="absolute top-0 right-0 hover:text-error"
              onClick={() => setItem()}
            />
            <ItemForm item={item()!} onSubmit={setItem} />
          </div>
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
        props.item.data.deleted && "bg-error-content text-error"
      )}
    >
      <div>
        <h4 class="text-sm">{props.item.data.name}</h4>

        <div class="text-xs">
          <span>
            <span>X</span>: {props.item.data.latlng?.[0]}
          </span>
          <span>
            <span>Y</span>: {props.item.data.latlng?.[1]}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div class="absolute top-1 right-1 flex gap-1">
        {props.item.data.deleted ? (
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
                props.item.softDelete();
              }}
            />
          </>
        )}
      </div>

      {props.item.data.deleted && (
        <p class="text-xs absolute bottom-1 left-1">
          deleted on {props.item.data.updatedAt?.toDate().toLocaleString()}
        </p>
      )}
    </div>
  );
}
