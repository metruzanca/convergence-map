import { createContext, JSXElement, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Item } from "~/firebase";

type AppState = {
  categories: string[];
  items: Item[];
};

const initial: AppState = {
  categories: [],
  items: [],
};

const appContext = createContext<AppState>(initial satisfies AppState);

export const useAppContext = () => useContext(appContext);

// FIXME move lib/map to here

export function AppContextProvider(props: { children: JSXElement }) {
  const [store, setStore] = createStore<AppState>(initial);

  Item.liveCollection((data) => setStore("items", data));
  // Category.liveCollection((data) => setStore("category", data));

  return (
    <appContext.Provider value={store}>{props.children}</appContext.Provider>
  );
}
