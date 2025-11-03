import type { ReactNode } from "react";
import { Header, type AppView } from "./Header";
import { Toolbar } from "./Toolbar";

interface AppShellProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onOpenAddPo: () => void;
  children: ReactNode;
}

export function AppShell({
  currentView,
  onChangeView,
  onOpenAddPo,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background bg-app-gradient text-foreground">
      <Header currentView={currentView} onChangeView={onChangeView} />
      <Toolbar onOpenAddPo={onOpenAddPo} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
