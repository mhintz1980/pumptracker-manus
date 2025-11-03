import { NavLink } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Package, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Header - Persistent navigation bar with branding and main navigation
 * Primary color background with navigation links
 */
export const Header = () => {
  const { theme, setTheme } = useTheme();
  return (
    <motion.header 
      className="bg-primary text-primary-foreground border-b border-primary/20 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        duration: 0.32,
        ease: [0.2, 0.8, 0.2, 1]
      }}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <Package className="w-7 h-7" strokeWidth={2.5} />
          <h1 className="text-xl font-bold tracking-tight">
            PumpTracker <span className="font-normal opacity-80">Lite</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <NavLink to="/dashboard" end>
            {({ isActive }) => (
              <motion.div
                whileHover={{ y: -1, scale: 1.005 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`
                    text-primary-foreground hover:bg-white/10 transition-colors shadow-sm hover:shadow-md
                    ${isActive ? 'bg-white/20 font-semibold shadow-md' : 'font-medium'}
                  `}
                >
                  📊 Dashboard
                </Button>
              </motion.div>
            )}
          </NavLink>
          <NavLink to="/kanban">
            {({ isActive }) => (
              <motion.div
                whileHover={{ y: -1, scale: 1.005 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`
                    text-primary-foreground hover:bg-white/10 transition-colors shadow-sm hover:shadow-md
                    ${isActive ? 'bg-white/20 font-semibold shadow-md' : 'font-medium'}
                  `}
                >
                  🗂️ Kanban
                </Button>
              </motion.div>
            )}
          </NavLink>
          <NavLink to="/scheduling">
            {({ isActive }) => (
              <motion.div
                whileHover={{ y: -1, scale: 1.005 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`
                    text-primary-foreground hover:bg-white/10 transition-colors shadow-sm hover:shadow-md
                    ${isActive ? 'bg-white/20 font-semibold shadow-md' : 'font-medium'}
                  `}
                >
                  📅 Scheduling
                </Button>
              </motion.div>
            )}
          </NavLink>

          {/* Theme Toggle */}
          <motion.div
            whileHover={{ y: -1, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2 text-primary-foreground hover:bg-white/10 shadow-sm hover:shadow-md"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
};
