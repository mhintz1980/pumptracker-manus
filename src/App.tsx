// src/App.tsx
import { useEffect, useState } from "react";
import { useApp } from "./store";
import { FilterBar } from "./components/toolbar/FilterBar";
import { AddPoButton } from "./components/toolbar/AddPoButton";
import { AddPoModal } from "./components/toolbar/AddPoModal";
import { KpiStrip } from "./components/dashboard/KpiStrip";
import { Donuts } from "./components/dashboard/Donuts";
import { BuildTimeTrend } from "./components/dashboard/BuildTimeTrend";
import { ValueBreakdown } from "./components/dashboard/ValueBreakdown";
import { OrderTable } from "./components/dashboard/OrderTable";
import { KanbanBoard } from "./components/kanban/KanbanBoard";
import { SchedulingView } from "./components/scheduling/SchedulingView";
import { Toaster } from "sonner";
import { Pump } from "./types";
import { Package, BarChart3, Layout, Calendar } from "lucide-react";
import { Button } from "./components/ui/Button";

type View = "dashboard" | "kanban" | "scheduling";

function App() {
  const { load, filtered, loading } = useApp();
  const [isAddPoModalOpen, setIsAddPoModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedPump, setSelectedPump] = useState<Pump | null>(null);

  const navButtonClasses = (view: View) =>
    `h-10 rounded-full border px-4 text-sm font-medium transition-all ${
      currentView === view
        ? "border-white/25 bg-white/20 text-white shadow-glow"
        : "border-white/10 bg-white/10 text-white/70 hover:text-white hover:bg-white/15"
    }`;

  useEffect(() => {
    load();
  }, [load]);

  const filteredPumps = filtered();

  return (
    <div className="min-h-screen bg-background bg-app-gradient text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-[#0d5bff] via-[#1e72ff] to-[#39a3ff] shadow-glow">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/15 p-2 shadow-glass">
                <Package className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">PumpTracker Lite</h1>
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">Production Management System</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <Button
                variant="ghost"
                size="default"
                className={navButtonClasses("dashboard")}
                onClick={() => setCurrentView("dashboard")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="default"
                className={navButtonClasses("kanban")}
                onClick={() => setCurrentView("kanban")}
              >
                <Layout className="h-4 w-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant="ghost"
                size="default"
                className={navButtonClasses("scheduling")}
                onClick={() => setCurrentView("scheduling")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Scheduling
              </Button>
              <AddPoButton onClick={() => setIsAddPoModalOpen(true)} />
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <FilterBar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10 space-y-6">
        {currentView === "dashboard" ? (
          <>
            <KpiStrip pumps={filteredPumps} />
            <Donuts pumps={filteredPumps} />
            <BuildTimeTrend pumps={filteredPumps} />
            <ValueBreakdown pumps={filteredPumps} />
            <OrderTable pumps={filteredPumps} onRowClick={setSelectedPump} />
          </>
        ) : currentView === "kanban" ? (
          <KanbanBoard pumps={filteredPumps} onCardClick={setSelectedPump} />
        ) : (
          loading ? <div>Loading...</div> : <SchedulingView />
        )}
      </main>

      {/* Modals */}
      <AddPoModal
        isOpen={isAddPoModalOpen}
        onClose={() => setIsAddPoModalOpen(false)}
      />

      {/* Pump Details Modal */}
      {selectedPump && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={() => setSelectedPump(null)}
        >
          <div
            className="surface-elevated shadow-frame border border-white/10 rounded-2xl w-full max-w-md p-6 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Pump Details</h2>
                <p className="text-sm text-foreground/70">Serial #{selectedPump.serial}</p>
              </div>
              <button
                onClick={() => setSelectedPump(null)}
                className="text-foreground/60 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 p-3 surface-panel rounded-xl border border-white/10">
                <div>
                  <p className="text-xs text-foreground/60 mb-1">PO Number</p>
                  <p className="font-medium text-white">{selectedPump.po}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Customer</p>
                  <p className="font-medium text-white">{selectedPump.customer}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 surface-panel rounded-xl border border-white/10">
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Model</p>
                  <p className="font-medium text-white">{selectedPump.model}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Stage</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white">
                    {selectedPump.stage}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 surface-panel rounded-xl border border-white/10">
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Priority</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    selectedPump.priority === "Urgent" || selectedPump.priority === "Rush"
                      ? "bg-red-500/15 text-red-300"
                      : selectedPump.priority === "High"
                      ? "bg-orange-500/15 text-orange-200"
                      : "bg-white/10 text-foreground/70"
                  }`}>
                    {selectedPump.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Value</p>
                  <p className="font-medium text-white">${selectedPump.value.toLocaleString()}</p>
                </div>
              </div>

              {selectedPump.powder_color && (
                <div className="p-3 surface-panel rounded-xl border border-white/10">
                  <p className="text-xs text-foreground/60 mb-1">Powder Coat Color</p>
                  <p className="font-medium text-white">{selectedPump.powder_color}</p>
                </div>
              )}

              {selectedPump.scheduledEnd && (
                <div className="p-3 surface-panel rounded-xl border border-white/10">
                  <p className="text-xs text-foreground/60 mb-1">Scheduled End Date</p>
                  <p className="font-medium text-white">
                    {new Date(selectedPump.scheduledEnd).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              <div className="p-3 surface-panel rounded-xl border border-white/10">
                <p className="text-xs text-foreground/60 mb-1">Last Updated</p>
                <p className="font-medium text-white">
                  {new Date(selectedPump.last_update).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedPump(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
