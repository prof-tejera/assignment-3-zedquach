import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { WorkoutProvider } from "./context/WorkoutProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WorkoutProvider>
      <App />
    </WorkoutProvider>
  </React.StrictMode>
);
