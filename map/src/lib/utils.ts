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

export function kebabToHuman(str: string) {
  const human = str.split("-").join(" ");
  return human[0].toUpperCase() + human.slice(1, human.length);
}
