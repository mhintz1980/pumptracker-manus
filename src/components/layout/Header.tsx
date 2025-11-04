import { BarChart3, Calendar, Layout, Package } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export type AppView = "dashboard" | "kanban" | "scheduling";

interface HeaderProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const NAV_ITEMS: Array<{
  id: AppView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "kanban", label: "Kanban", icon: Layout },
  { id: "scheduling", label: "Scheduling", icon: Calendar },
];

export function Header({ currentView, onChangeView }: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground border-b border-primary/20 sticky top-0 z-50 shadow-layer-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-white/20 p-1.5 shadow-layer-sm">
            <Package className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              PumpTracker <span className="font-normal opacity-80">Lite</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/80">
              Production Management
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              onClick={() => onChangeView(id)}
              className={cn(
                "h-8 rounded-full px-3 text-[11px] font-semibold transition-all shadow-sm hover:-translate-y-[1px] hover:bg-white/15 hover:shadow-md",
                currentView === id
                  ? "bg-white/20 text-white shadow-md"
                  : "text-white/80"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
