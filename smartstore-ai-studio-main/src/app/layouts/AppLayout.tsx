import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AiChatDock } from "@/app/features/ai/AiChatDock";
import { motion, AnimatePresence } from "framer-motion";

export function AppLayout() {
  const location = useLocation();
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full max-w-[1600px] mx-auto scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <AiChatDock />
    </div>
  );
}
