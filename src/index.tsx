/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import "./index.css";
import App from "./App";

const root = document.getElementById("root");

render(
  () => (
    <Router>
      <Route path="/:map?" component={App} />
    </Router>
  ),
  root!
);
