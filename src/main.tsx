import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const THEME_STORAGE_KEY = "pt-theme";

function bootstrapTheme() {
  const root = document.documentElement;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const mode =
    stored === "light" || stored === "dark"
      ? stored
      : prefersDark
      ? "dark"
      : "light";

  root.classList.remove("light", "dark");
  root.classList.add(mode);
}

bootstrapTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
