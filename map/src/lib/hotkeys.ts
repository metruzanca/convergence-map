type Modifiers = {
  ctrl?: boolean;
  shift?: boolean;
};

export type HotkeyDetails = { key: string } & Modifiers;

function hotkeyName({ key, ctrl, shift }: HotkeyDetails) {
  return `hotkey:${ctrl || ""}+${shift || ""}+${key}`;
}

function hotkeyPressed(detail: HotkeyDetails) {
  const hotkeyEvent = new CustomEvent(hotkeyName(detail), { detail });
  document.dispatchEvent(hotkeyEvent);
}

type HotkeyEvent = CustomEvent<{ key: string; mod: Modifiers }>;

/** Hotkeys registered will preventDefault.
 ** Important to prevent browser behaviors e.g. ctrl/cmd+k on Chrome */
export function registerHotkeys(supportedHotkeys: HotkeyDetails[]) {
  const handler = (event: KeyboardEvent) => {
    if (
      supportedHotkeys.some((options) => {
        return (
          options.key === event.key &&
          (!!options.ctrl === event.ctrlKey || event.metaKey) &&
          !!options.shift === event.shiftKey
        );
      })
    ) {
      event.preventDefault();
      hotkeyPressed({
        key: event.key,
        ctrl: event.ctrlKey || event.metaKey,
        shift: event.shiftKey,
      });
    }
  };
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}

export function onHotkey(
  options: { key: string; ctrl?: boolean; shift?: boolean },
  callback: (event: HotkeyEvent) => void
) {
  //@ts-ignore no clue how to register the hotkey name
  document.addEventListener(hotkeyName(options), callback);
  return () =>
    //@ts-ignore same as above
    document.removeEventListener(hotkeyName(options), callback);
}
