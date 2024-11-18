import { createSignal, onCleanup, onMount } from "solid-js";

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

export async function readFromClipboard() {
  return navigator.clipboard.readText();
}
