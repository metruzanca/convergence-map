import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "./init";
import {
  createSignal,
  JSXElement,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";

type LoggedIn = {
  type: "user";
  user: User;
};
type LoggedOut = {
  type: "no-user";
};
type AuthLoading = {
  type: "loading";
};

type AuthState = AuthLoading | LoggedOut | LoggedIn;

const [user, setUser] = createSignal<AuthState>({ type: "loading" });

let listenerInitialized = false;

if (!listenerInitialized) {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      setUser({ type: "user", user: firebaseUser });
    } else {
      setUser({ type: "no-user" });
    }
  });
  listenerInitialized = true;
}

export async function login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  console.info("Logged in as", cred.user);
  setUser({ type: "user", user: cred.user });
}

export async function logout() {
  await signOut(auth);
  setUser({ type: "no-user" });
}

if (import.meta.env.DEV) {
  //@ts-ignore
  window.logout = logout;
}

export const getUser = user;

/** If spinner is on screen for longer than 50ms, will show loading spinner */
export const Spinner = () => {
  const [show, setShow] = createSignal(false);

  onMount(() => {
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  });

  return (
    <Show when={show()}>
      <div class="w-full h-full flex items-center justify-center">
        <span class="loading loading-ring loading-lg"></span>
      </div>
    </Show>
  );
};

export function Protected(props: {
  children: JSXElement;
  fallback?: JSXElement;
  loading?: true | JSXElement;
  class?: string;
}) {
  return (
    <div class={props.class}>
      <Switch>
        <Match when={getUser().type === "loading"}>
          {/* IF truethy, check if its just true, then show default spinner, else show custom element */}
          {props.loading && props.loading === true ? (
            <Spinner />
          ) : (
            props.loading
          )}
        </Match>
        <Match when={getUser().type === "no-user"}>{props.fallback}</Match>
        <Match when={getUser().type === "user"}>{props.children}</Match>
      </Switch>
    </div>
  );
}
