import { MetaProvider, Title } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import "./app.css";
import Login from "./routes/Login";
import Map from "./routes/Map";
import { AppContextProvider } from "./lib/context";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Convergence Mod Map</Title>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <AppContextProvider>
        <Route path="/:map?" component={Map} />
      </AppContextProvider>
      <Route path="/login" component={Login} />
    </Router>
  );
}
