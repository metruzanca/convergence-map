import { Component, JSX } from "solid-js";
import { z } from "zod";

export type Position = {
  zoom: number;
  lat: number;
  lng: number;
};

export type Stringify<T> = {
  [K in keyof T]: string;
};

// eslint-disable-next-line
export type Styled<P = {}> = Component<
  P & {
    children?: JSX.Element;
    class?: string;
  }
>;

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type DeepPartial<Thing> = Thing extends Function
  ? Thing
  : Thing extends Array<infer InferrerArrayMember>
  ? DeepPartialArray<InferrerArrayMember>
  : Thing extends object
  ? DeepPartialObject<Thing>
  : Thing | undefined;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeepPartialArray<Thing> extends Array<DeepPartial<Thing>> {}

type DeepPartialObject<Thing> = {
  [Key in keyof Thing]?: DeepPartial<Thing[Key]>;
};

export type OnSubmit<T> = (thing: T) => void;

type EmbedMapSearchParams = {
  item: string;
};

export type MapSearchParams = Stringify<Position & EmbedMapSearchParams>;

export type MapUrlParams = { map: string };

export const DEFAULT_MAP = "overworld";

export const MapSchema = z
  .union([
    z.literal("overworld"),
    z.literal("underworld"),
    z.literal("scadutree"),
  ])
  .default(DEFAULT_MAP);

export type MapNames = z.infer<typeof MapSchema>;
