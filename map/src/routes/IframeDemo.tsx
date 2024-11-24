import { useSearchParams } from "@solidjs/router";
import { BASE_URL } from "~/lib/constants";
import { MapSearchParams } from "~/lib/types";

export default function IframeDemo() {
  const [search] = useSearchParams<MapSearchParams>();

  return (
    <div class="h-screen flex flex-col items-center justify-center">
      <h2>This is what it'll look like in an Iframe!</h2>
      <iframe
        src={`${BASE_URL}/?item=${search.item ?? "blade-of-valor"}`}
        height="300"
        width="300"
      />
    </div>
  );
}
