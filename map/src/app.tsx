import { MetaProvider, Title } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import "./app.css";
import "./leaflet.css";
import Login from "./routes/Login";
import MapPage from "./routes/MapPage";
import { AppContextProvider } from "./lib/context";
import IframeDemo from "./routes/IframeDemo";
import AdminPage from "./routes/Admin";

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
        <Route path="/admin" component={AdminPage} />
        <Route path="/login" component={Login} />
        <Route path="/iframedemo" component={IframeDemo} />
      </Router>
    </AppContextProvider>
  );
}
