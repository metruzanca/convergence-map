import cn from "~/lib/styling";
import { GotoIcon, LinkIcon } from "./Icons";
import { useSearchParams } from "@solidjs/router";
import { MapSearchParams } from "~/lib/types";
import { focusPosition, useAppContext } from "~/lib/context";
import { itemLink } from "~/lib/wiki-integration";
import { FlatItem } from "~/lib/sticher";
import { getLatlng } from "~/lib/markers";

export function ItemCard(props: { item: FlatItem }) {
  const [params, setParams] = useSearchParams<MapSearchParams>();
  const context = useAppContext();
  return (
    <div class={cn("bg-primary-content min-h-16 rounded relative p-1")}>
      <div>
        <h4 class="text-sm">{props.item.Name}</h4>

        <div class="flex justify-between">
          <div class="text-xs">
            <span>X: {props.item.CordX}</span>
            <span>Y: {props.item.CordZ}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div class="absolute top-1 right-1 flex gap-1">
        <GotoIcon
          size="small"
          onClick={() => {
            focusPosition(getLatlng(props.item));
            setParams({
              item: props.item.Name,
            });
            context.markers.get(props.item.ID)?.openPopup();
          }}
        />
        <a
          href={itemLink(props.item.Category, props.item.Name)}
          target="_blank"
        >
          <LinkIcon size="small" class="text-primary" />
        </a>
      </div>
    </div>
  );
}
