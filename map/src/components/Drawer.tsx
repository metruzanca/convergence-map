import { Accessor, Setter, ParentComponent } from "solid-js";
import cn from "../lib/cn";
import { DoubleChevronRightIcon, DoubleChevronLeftIcon } from "./Icons";

type SidebarProps = {
  open: Accessor<boolean>;
  onChange: Setter<boolean>;
  class?: string;
};

export const Drawer: ParentComponent<SidebarProps> = (props) => {
  return (
    <div class="fixed z-[500]">
      <aside
        class={cn(
          "fixed top-0 right-0 w-64 h-screen ease-in-out duration-300 bg-base-300",
          props.open() ? "translate-x-0 " : "translate-x-full",
          props.class
        )}
      >
        <button
          onClick={() => props.onChange((prev) => !prev)}
          class="absolute left-[-24px] text-white bg-primary h-[40px]"
        >
          {props.open() ? (
            <DoubleChevronRightIcon class="stroke-primary-content" />
          ) : (
            <DoubleChevronLeftIcon class="stroke-primary-content" />
          )}
        </button>
        {props.children}
      </aside>
    </div>
  );
};
