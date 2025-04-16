import { MetaProvider, Title } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import "./app.css";
import "./leaflet.css";
import MapPage from "./routes/MapPage";
import { AppContextProvider } from "./lib/context";
import IframeDemo from "./routes/IframeDemo";

export default function App() {
  return (
    <AppContextProvider>
      <Router
        root={(props) => (
          <MetaProvider>
            <Title>Convergence Mod Map</Title>
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        )}
      >
        <Route path="/:map?" component={MapPage} />
        {/* Disabling login until that's reimplemented for optional logged in features later */}
        {/* <Route path="/login" component={Login} /> */}
        <Route path="/iframedemo" component={IframeDemo} />
      </Router>
    </AppContextProvider>
  );
}
