import { Accessor, Setter, ParentComponent } from "solid-js";
import cn from "../lib/styling";
import {
  DoubleChevronRightIcon,
  DoubleChevronLeftIcon,
  CloseIcon,
} from "./Icons";

type SidebarProps = {
  open: Accessor<boolean>;
  onChange: Setter<boolean>;
  class?: string;
  position?: "right" | "left";
};

export const Drawer: ParentComponent<SidebarProps> = (props) => {
  if (props.position === "left") {
    return LeftDrawer(props);
  }
  return RightDrawer(props);
};

export const RightDrawer: ParentComponent<Omit<SidebarProps, "position">> = (
  props
) => {
  return (
    <aside
      class={cn(
        "fixed z-[500] top-0 right-0 h-screen ease-in-out duration-300 bg-base-300 w-full xs:w-fit",
        props.open() ? "translate-x-0" : "translate-x-full",
        props.class
      )}
    >
      <button
        onClick={() => props.onChange((prev) => !prev)}
        class={cn(
          "top-[80px] rounded-l absolute left-[-24px] text-white bg-primary hover: h-[40px]",
          props.open() && "hidden xs:block"
        )}
      >
        {props.open() ? (
          <DoubleChevronRightIcon class="stroke-primary-content" />
        ) : (
          <DoubleChevronLeftIcon class="stroke-primary-content" />
        )}
      </button>
      {props.children}
      <button
        class="block xs:hidden absolute top-0 right-0"
        onClick={() => props.onChange(false)}
      >
        <CloseIcon />
      </button>
    </aside>
  );
};

export const LeftDrawer: ParentComponent<Omit<SidebarProps, "position">> = (
  props
) => {
  return (
    <aside
      class={cn(
        "fixed z-[500] top-0 left-0 h-screen ease-in-out duration-300 bg-base-300 w-full xs:w-fit",
        props.open() ? "translate-x-0" : "-translate-x-full",
        props.class
      )}
    >
      <button
        onClick={() => props.onChange((prev) => !prev)}
        class={cn(
          "top-5 rounded-r absolute right-[-24px] text-white bg-primary h-[40px]",
          props.open() && "hidden xs:block"
        )}
      >
        {props.open() ? (
          <DoubleChevronLeftIcon class="stroke-primary-content" />
        ) : (
          <DoubleChevronRightIcon class="stroke-primary-content" />
        )}
      </button>
      {props.children}
      <button
        class="block xs:hidden absolute top-0 right-0"
        onClick={() => props.onChange(false)}
      >
        <CloseIcon />
      </button>
    </aside>
  );
};
