import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SessionContextProvider } from "./contexts/SessionContext";

ReactDOM.render(
  <React.StrictMode>
    <SessionContextProvider>
      <App />
    </SessionContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
