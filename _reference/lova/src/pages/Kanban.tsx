import { motion } from "framer-motion";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

/**
 * Kanban Board Page - Drag and drop pump tracking through production stages
 */
const Kanban = () => {
  const collapsedCards = useStore(state => state.collapsedCards);
  const toggleCollapsedCards = useStore(state => state.toggleCollapsedCards);
  return <motion.div className="container mx-auto px-4 py-4 h-[calc(100vh-80px)]" initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.32,
    ease: [0.2, 0.8, 0.2, 1]
  }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          
          <p className="text-sm text-muted-foreground">
            Drag pumps between stages to update their status
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={toggleCollapsedCards}>
          {collapsedCards ? <>
              <Maximize2 className="h-4 w-4 mr-2" />
              Expand Cards
            </> : <>
              <Minimize2 className="h-4 w-4 mr-2" />
              Collapse Cards
            </>}
        </Button>
      </div>

      <KanbanBoard />
    </motion.div>;
};
export default Kanban;