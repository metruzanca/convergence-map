import { Item } from "~/firebase";
import cn from "~/lib/styling";
import Copy from "./Copy";
import {
  RestoreIcon,
  PencilSquareIcon,
  TrashIcon,
  GotoIcon,
  LinkIcon,
} from "./Icons";
import { getMap } from "./Map";
import { useSearchParams } from "@solidjs/router";
import { MapSearchParams } from "~/lib/types";
import { FOCUS_ZOOM } from "~/lib/constants";

export function ItemCard(props: { item: Item; edit?: () => void }) {
  const [params, setParams] = useSearchParams<MapSearchParams>();
  return (
    <div
      class={cn(
        "bg-primary-content min-h-16 rounded relative p-1",
        props.item.data.deleted && "bg-error-content text-error"
      )}
    >
      <div>
        <h4 class="text-sm">{props.item.data.name}</h4>

        <div class="flex justify-between">
          <div class="text-xs">
            <span>
              <span>X</span>: {props.item.data.latlng?.[0]}
            </span>
            <span>
              <span>Y</span>: {props.item.data.latlng?.[1]}
            </span>
          </div>
          <p class="text-xs">
            author: {props.item.data.author.substring(0, 3)}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div class="absolute top-1 right-1 flex gap-1">
        {props.edit ? (
          <>
            {props.item.data.deleted ? (
              <RestoreIcon
                class="text-base-content"
                size="small"
                onClick={() => {
                  props.item.restore();
                }}
              />
            ) : (
              props.edit && (
                <>
                  <PencilSquareIcon size="small" onClick={props.edit} />
                  <TrashIcon
                    size="small"
                    onClick={() => {
                      props.item.softDelete();
                    }}
                  />
                  <Copy text={props.item.embedUrl} />
                </>
              )
            )}
          </>
        ) : (
          <>
            <GotoIcon
              size="small"
              onClick={() => {
                getMap().setView(props.item.data.latlng, FOCUS_ZOOM);
                setParams({
                  item: props.item.data.name,
                });
              }}
            />
            <LinkIcon size="small" onClick={() => {}} />
          </>
        )}
      </div>

      {props.item.data.deleted && (
        <p class="text-xs absolute bottom-1 left-1">
          deleted on {props.item.data.updatedAt?.toDate().toDateString()}
        </p>
      )}
    </div>
  );
}
