import { JSXElement } from "solid-js";
import cn from "~/lib/styling";

export default function OverlayElement(props: {
  class?: string;
  children: JSXElement;
}) {
  return <div class={cn("fixed z-[500]", props.class)}>{props.children}</div>;
}
