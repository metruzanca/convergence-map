/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import "./index.css";
import App from "./App";
import Login from "./routes/Login";

const root = document.getElementById("root");

render(
  () => (
    <Router>
      <Route path="/:map?" component={App} />
      <Route path="/login" component={Login} />
    </Router>
  ),
  root!
);
