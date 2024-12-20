import { A } from "@solidjs/router";
import { doc, getFirestore, writeBatch, WriteBatch } from "firebase/firestore";
import { Dropzone } from "~/components/dropzone";
import { Item } from "~/firebase";
import {
  ConvergenceImport,
  convergenceImportSchema,
  ConvergenceItem,
  ConvergenceLocation,
  FlatItem,
} from "~/firebase/types";
import { useAppContext } from "~/lib/context";

const createWikiUrl = (item: ConvergenceItem) =>
  `https://convergencemod.com/${item.Category}/${item.Name}`;

function locationToMap(location: ConvergenceLocation) {
  switch (location) {
    case "DLC_LegacyDungeon":
    case "DLC_Overworld":
    case "DLC_MinorDungeon":
      return "scadutree";
    case "Underworld":
      return "underworld";
    default:
    case "LegacyDungeon":
    case "MinorDungeon":
    case "Overworld":
      return "overworld";
  }
}

const SCALE = 0.2;

export default function AdminPage() {
  const context = useAppContext();

  const handleImport = async (files: FileList) => {
    const file = files[0];
    const text = await file.text();
    const json = JSON.parse(text);
    const itemData = convergenceImportSchema.safeParse(json);
    if (!itemData.success) {
      console.error(itemData.error);
    } else {
      console.log(itemData.data);
    }

    const data = itemData.data as ConvergenceImport;

    // Flatten data to be item w/ their own data
    const flattenedData = data.flatMap((drop) =>
      drop.Items.map(
        (item) =>
          ({
            ...item,
            CordX: drop.CordX,
            CordZ: drop.CordZ,
            Location: drop.Location,
            MapArea: drop.MapArea,
            MapBlock: drop.MapBlock,
            MapRegion: drop.MapRegion,
          } satisfies FlatItem)
      )
    );

    const firestore = getFirestore();

    console.log(flattenedData);
    console.log(flattenedData.length);

    if (!confirm("Import?")) return;

    const batch = writeBatch(firestore);

    for (const item of flattenedData) {
      const ref = doc(firestore, Item.collection, item.ID.toString());
      batch.set(
        ref,

        new Item(
          item.ID.toString(),
          // @ts-ignore ughh need to get rid of things like createdAt being required here
          {
            name: item.Name,
            latlng: [item.CordX * SCALE, item.CordZ * SCALE],
            map: locationToMap(item.Location),
            category: item.Category,
            url: createWikiUrl(item),
          }
        ).data
      );
    }

    await batch.commit();
  };

  return (
    <div>
      <div class="w-full bg-base-300 mb-2 p-1 flex gap-1 items-center">
        <A href="/">
          <img src="/favicon.png" class="w-8 h-8" />
        </A>

        <A href="/">
          <h1 class="m-0">Admin Panel</h1>
        </A>
        <A href="/" class="link ml-auto">
          Back to map
        </A>
      </div>
      <div>
        <div>Items: {context.items.length}</div>
        <div>Categories: {context.categories.length}</div>
      </div>

      <button
        class="btn btn-primary btn-xs btn-error w-full "
        onClick={async () => {
          if (confirm(`About to delete all ${context.items.length} pins`)) {
            const firestore = getFirestore();
            const batch = writeBatch(firestore);

            for (const item of context.items) {
              batch.delete(doc(firestore, Item.collection, item.id));
            }

            await batch.commit();
          }
        }}
      >
        DevTool: delete all
      </button>

      <form>
        <Dropzone callback={handleImport}>Import item data</Dropzone>
      </form>
    </div>
  );
}
