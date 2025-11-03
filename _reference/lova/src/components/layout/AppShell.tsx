import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";

/**
 * AppShell - Main application layout wrapper
 * Provides persistent header, toolbar, and content area for all routes
 */
export const AppShell = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <Toolbar />
      <main className="flex-1 layer-l3 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
