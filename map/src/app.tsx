import { MetaProvider, Title } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import "./app.css";
import Login from "./routes/Login";
import Map from "./routes/Map";

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
      <Route path="/:map?" component={Map} />
      <Route path="/login" component={Login} />
    </Router>
  );
}
