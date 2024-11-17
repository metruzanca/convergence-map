import { HotkeyDetails } from "./hotkeys";

export const PROJECT_ID = "convergence-mod-map";
export const BUCKET_NAME = `${PROJECT_ID}.appspot.com`;
export const LEAFLET_BASE_URL = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/`;

export const MAP_SIDEBAR = "left-sidebar";
export const EDITOR_SIDEBAR = "right-sidebar";

export const LOGOUT_CLEAR = [MAP_SIDEBAR, EDITOR_SIDEBAR];

export const HOTKEYS: Array<HotkeyDetails & { description: string }> = [
  { key: "Escape", description: "Close all drawers" },
  { key: "k", ctrl: true, description: "Open and focus item search" },
  { key: "1", ctrl: true, description: "Quick switch to Map 1" },
  { key: "2", ctrl: true, description: "Quick switch to Map 2" },
  { key: "3", ctrl: true, description: "Quick switch to Map 3" },
];
