import { createSignal } from "solid-js";
import { copyToClipboard } from "~/lib/utils";
import { CheckmarkIcon, CopyIcon } from "./Icons";

export default function Copy(props: { text: string }) {
  const [copied, setCopied] = createSignal(false);

  const handleClick = () => {
    copyToClipboard(props.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

  return (
    <>
      {copied() === true ? (
        <CheckmarkIcon size="small" class="text-green-500" />
      ) : (
        <CopyIcon size="small" onClick={handleClick} />
      )}
    </>
  );
}
