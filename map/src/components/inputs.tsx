import { LatLngTuple } from "leaflet";
import { JSX } from "solid-js/h/jsx-runtime";

export function CoordinatesInput(props: { latlng: LatLngTuple }) {
  return (
    <div class="flex gap-2 text-sm items-center">
      <div>
        <span>X</span>:{" "}
        <input class="max-w-10" type="number" value={props.latlng?.[0]} />
      </div>
      <div>
        <span>Y</span>:{" "}
        <input class="max-w-10" type="number" value={props.latlng?.[1]} />
      </div>
    </div>
  );
}

type Replace<T, R> = Omit<T, keyof R> & R;

/** Input that hooks into a solid store */
export function Input<T extends { [key: string]: any }>(
  props: Replace<
    JSX.InputHTMLAttributes<HTMLInputElement>,
    {
      name: keyof T;
      value: T;
      onChange: (name: string, value: any) => void;
      label?: string;
    }
  >
) {
  return (
    <label>
      {props.label && props.label}
      {/* @ts-ignore */}
      <input
        {...props}
        name={props.name as string}
        value={props.value[props.name]}
        onChange={(e) => props.onChange(props.name as string, e.target.value)}
      />
    </label>
  );
}
