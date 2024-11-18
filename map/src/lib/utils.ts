import { createSignal, onCleanup, onMount } from "solid-js";

// TODO use Result type and remove try catch
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

export async function readFromClipboard() {
  return navigator.clipboard.readText();
}
