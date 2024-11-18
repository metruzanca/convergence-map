import { Item } from "~/firebase";
import { createMemo, createSignal, For, Show } from "solid-js";
import { CloseMarkIcon, SearchIcon } from "./Icons";
import { useCurrentUser } from "~/firebase/auth";
import { setStore } from "~/lib/map";
import ItemForm from "./ItemForm";
import { readFromClipboard } from "~/lib/utils";
import { ItemCard } from "./Item";
import { parseWikiLink } from "~/lib/wiki-integration";

export default function EditorSiderbar() {
  // const params = useParams<MapUrlParams>();

  const [item, setItem] = createSignal<Item>();

  const current = useCurrentUser();

  const [items, setItems] = createSignal<Item[]>([]);
  Item.liveCollection(setItems);

  const [markFilter, setMarkFilter] = createSignal("");
  const filteredItems = createMemo(() =>
    items()
      .filter((i) =>
        i.data.name.toLowerCase().includes(markFilter().toLowerCase())
      )
      .sort((a, b) => Number(a.data.deleted) - Number(b.data.deleted))
  );

  return (
    <div class="flex flex-col px-2">
      <h2 class="border-b-neutral-700 border-b">Editor Panel</h2>
      <div class="flex gap-2">
        <div>
          <h3>Map Pins</h3>
          <label class="input input-bordered flex items-center gap-2">
            <input
              type="text"
              class="grow"
              placeholder="Filter"
              onInput={(e) => setMarkFilter(e.target.value)}
            />
            <SearchIcon class="w-4 h-4 opacity-70" />
          </label>

          <button
            class="btn btn-neutral w-full btn-xs"
            onClick={async () => {
              const item = await Item.create(current.user.email!.split("@")[0]);

              setItem(item);
            }}
          >
            Add Pin
          </button>

          <button
            class="btn btn-neutral w-full btn-xs"
            onClick={async () => {
              const text = await readFromClipboard();
              const wikiData = parseWikiLink(text);
              const item = await Item.create(
                current.user.email!.split("@")[0],
                wikiData
              );

              console.log(item);

              setItem(item);
            }}
          >
            Add from clipboard
          </button>

          <div class="flex flex-col gap-2 overflow-y-scroll">
            {import.meta.env.DEV && items().length > 0 && (
              <button
                class="btn btn-primary btn-xs btn-error"
                onClick={() => {
                  if (confirm(`About to delete all ${items().length} pins`)) {
                    items().forEach((i) => {
                      i.delete();
                      setStore("markers", new Map());
                    });
                  }
                }}
              >
                DevTool: delete all
              </button>
            )}
            <For
              each={filteredItems()}
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
