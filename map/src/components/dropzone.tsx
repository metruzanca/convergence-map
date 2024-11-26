import { Component, JSX, onMount } from "solid-js";
import cn from "~/lib/styling";

export const Dropzone: Component<{
  callback: (fileList: FileList) => void;
  children?: JSX.Element;

  unstyled?: boolean;
  class?: string;
}> = (props) => {
  let dropzone: HTMLDivElement | undefined;

  onMount(() => {
    if (!dropzone) return;
    dropzone.addEventListener("dragover", function (e: DragEvent) {
      e.stopPropagation();
      e.preventDefault();
      if (!e.dataTransfer) return;

      e.dataTransfer.dropEffect = "copy";
    });

    // Get file data on drop
    dropzone.addEventListener("drop", async (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!e.dataTransfer) return;
      props.callback(e.dataTransfer.files);
    });
  });

  return (
    <div
      ref={dropzone}
      class={cn(
        props.class,
        !props.unstyled && "border-2 border-dotted border-gray-500 p-4"
      )}
    >
      {props.children}
    </div>
  );
};
