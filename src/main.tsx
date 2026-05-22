import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import CollegiumApp from "./collegium/CollegiumApp";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CollegiumApp />
  </StrictMode>
);
