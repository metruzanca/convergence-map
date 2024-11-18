import { Item } from "~/firebase";
import cn from "~/lib/styling";
import Copy from "./Copy";
import { RestoreIcon, PencilSquareIcon, TrashIcon, GotoIcon } from "./Icons";
import { getMap } from "./Map";

export function ItemCard(props: { item: Item; edit?: () => void }) {
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
        {props.edit ? (
          <>
            <p class="text-xs">
              author: {props.item.data.author.substring(0, 3)}
            </p>
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
                </>
              )
            )}

            <Copy text={props.item.embedUrl} />
          </>
        ) : (
          <GotoIcon
            onClick={() => {
              const map = getMap();
              // TODO instead of 5, have some const
              map.setView(props.item.data.latlng, 5);
            }}
          />
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
