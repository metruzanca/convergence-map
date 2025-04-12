import { Combobox } from "@kobalte/core/combobox";
import { Tabs as KTabs } from "@kobalte/core/tabs";
import { CaretDownIcon, CheckmarkIcon } from "./Icons";
import cn, { Size } from "~/lib/styling";
import { Component, For } from "solid-js";

// NOTE: Leafletjs uses 500 for the map by default
const ZINDEX = 1000;
const TW_ZINDEX = `z-[${ZINDEX}]`;

export function Select(props: {
  options: string[];
  placeholder?: string;
  name?: string;
  size?: Size;
  defaultValue?: any;
}) {
  return (
    <Combobox
      defaultValue={props.defaultValue}
      name={props.name}
      class={`relative ${TW_ZINDEX}`}
      options={props.options}
      placeholder={props.placeholder}
      itemComponent={(props) => (
        <Combobox.Item
          item={props.item}
          class={`cursor-pointer flex items-center justify-between px-4 py-2 hover:bg-neutral hover:text-neutral-content data-[highlighted]:bg-neutral data-[highlighted]:text-neutral-content ${TW_ZINDEX}`}
        >
          <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
          <Combobox.ItemIndicator>
            <CheckmarkIcon />
          </Combobox.ItemIndicator>
        </Combobox.Item>
      )}
    >
      <Combobox.Control aria-label={props.name} class="join">
        <Combobox.Input
          class={cn(
            "input input-bordered w-full join-item",
            props.size === "small" && "input-sm"
          )}
        />
        <Combobox.Trigger class="btn btn-neutral btn-sm join-item">
          <Combobox.Icon>
            <CaretDownIcon class="w-5 h-5" />
          </Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      <Combobox.Portal>
        <Combobox.Content
          class={`absolute w-full mt-2 bg-base-100 rounded-lg shadow-lg border border-base-300 overflow-hidden ${TW_ZINDEX}`}
        >
          <Combobox.Listbox class={`max-h-60 overflow-auto ${TW_ZINDEX}`}>
            {/* List items will render here */}
          </Combobox.Listbox>
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox>
  );
}

export function Tabs(props: {
  items: Array<{
    title: string;
    content: Component;
  }>;
}) {
  return (
    <KTabs class="w-full">
      <KTabs.List class="tabs tabs-bordered ">
        <For
          each={props.items}
          children={(item) => (
            <KTabs.Trigger class="tab" value={item.title}>
              {item.title}
            </KTabs.Trigger>
          )}
        />
        {/* <KTabs.Indicator class="bg-blue-600 transition-all duration-250 bottom-[-1px] h-0.5" /> */}
      </KTabs.List>

      <For
        each={props.items}
        children={(item) => (
          <KTabs.Content class="p-4" value={item.title}>
            <item.content />
          </KTabs.Content>
        )}
      />
    </KTabs>
  );
}
