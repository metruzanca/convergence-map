import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "./init";
import { createSignal, JSXElement, Match, Switch } from "solid-js";
import { Button } from "../components/Core";

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

const Spinner = () => <span class="loading loading-ring loading-lg"></span>;

export function Protected(props: {
  children: JSXElement;
  fallback?: JSXElement;
  class?: string;
}) {
  return (
    <div class={props.class}>
      <Switch>
        <Match when={getUser().type === "loading"}>
          <div class="w-full h-full flex items-center justify-center">
            <Spinner />
          </div>
        </Match>
        <Match when={getUser().type === "user"}>{props.children}</Match>
        <Match when={getUser().type === "no-user"}>
          {props.fallback ?? <Button>Log in to access</Button>}
        </Match>
      </Switch>
    </div>
  );
}
