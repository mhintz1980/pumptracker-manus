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
import { Toaster } from "sonner";
import { Pump } from "./types";
import { Package, BarChart3, Layout } from "lucide-react";
import { Button } from "./components/ui/Button";

type View = "dashboard" | "kanban";

function App() {
  const { load, filtered } = useApp();
  const [isAddPoModalOpen, setIsAddPoModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedPump, setSelectedPump] = useState<Pump | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  const filteredPumps = filtered();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">PumpTracker Lite</h1>
                <p className="text-xs text-muted-foreground">Production Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={currentView === "dashboard" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("dashboard")}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Dashboard
              </Button>
              <Button
                variant={currentView === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("kanban")}
              >
                <Layout className="h-4 w-4 mr-1" />
                Kanban
              </Button>
              <AddPoButton onClick={() => setIsAddPoModalOpen(true)} />
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <FilterBar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {currentView === "dashboard" ? (
          <>
            <KpiStrip pumps={filteredPumps} />
            <Donuts pumps={filteredPumps} />
            <BuildTimeTrend pumps={filteredPumps} />
            <ValueBreakdown pumps={filteredPumps} />
            <OrderTable pumps={filteredPumps} onRowClick={setSelectedPump} />
          </>
        ) : (
          <KanbanBoard pumps={filteredPumps} onCardClick={setSelectedPump} />
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedPump(null)}
        >
          <div
            className="bg-card rounded-lg shadow-xl w-full max-w-md p-6 m-4 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">Pump Details</h2>
                <p className="text-sm text-muted-foreground">Serial #{selectedPump.serial}</p>
              </div>
              <button
                onClick={() => setSelectedPump(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">PO Number</p>
                  <p className="font-medium">{selectedPump.po}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Customer</p>
                  <p className="font-medium">{selectedPump.customer}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Model</p>
                  <p className="font-medium">{selectedPump.model}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Stage</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {selectedPump.stage}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Priority</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    selectedPump.priority === "Urgent" || selectedPump.priority === "Rush"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : selectedPump.priority === "High"
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                  }`}>
                    {selectedPump.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Value</p>
                  <p className="font-medium">${selectedPump.value.toLocaleString()}</p>
                </div>
              </div>

              {selectedPump.powder_color && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Powder Coat Color</p>
                  <p className="font-medium">{selectedPump.powder_color}</p>
                </div>
              )}

              {selectedPump.scheduledEnd && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Scheduled End Date</p>
                  <p className="font-medium">
                    {new Date(selectedPump.scheduledEnd).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                <p className="font-medium">
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

