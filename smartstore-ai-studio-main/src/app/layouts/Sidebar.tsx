import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Workflow,
  BarChart3,
  Sparkles,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";
import { useUiStore } from "@/app/store/uiStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const nav: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: ReadonlyArray<"admin" | "staff">;
}[] = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "staff"] },
    { to: "/products", label: "Products", icon: Package, roles: ["admin", "staff"] },
    { to: "/suppliers", label: "Suppliers", icon: Users, roles: ["admin"] },
    {
      to: "/purchase-orders",
      label: "Purchase Orders",
      icon: ShoppingCart,
      roles: ["admin", "staff"],
    },
    { to: "/invoices", label: "Invoice OCR", icon: FileText, roles: ["admin"] },
    { to: "/automation", label: "Automation", icon: Workflow, roles: ["admin"] },
    { to: "/reports", label: "Reports", icon: BarChart3, roles: ["admin"] },
  ];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const role = user?.role ?? "staff";

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed ? 72 : 248,
          x: (mobileSidebarOpen || window.innerWidth >= 1024) ? 0 : -280,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 h-screen border-r border-sidebar-border bg-sidebar flex flex-col transition-all duration-300",
          "lg:sticky lg:top-0 lg:translate-x-0 lg:z-0",
          !mobileSidebarOpen && "hidden lg:flex"
        )}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-sidebar-border">
          <div className="size-9 rounded-xl bg-gradient-gold grid place-items-center shadow-glow shrink-0">
            <Sparkles className="size-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="font-display font-bold text-base tracking-tight">SmartStore AI</span>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin space-y-6">
          <div>
            <div
              className={cn(
                "text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 px-4 mb-4 font-bold",
                sidebarCollapsed && "sr-only",
              )}
            >
              Main Menu
            </div>
            <ul className="space-y-1.5">
              {nav
                .filter((n) => n.roles.includes(role))
                .map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                          "text-muted-foreground hover:text-foreground hover:bg-white/5",
                          isActive && "bg-white/5 text-foreground ring-1 ring-white/10",
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId="nav-indicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                            />
                          )}
                          <item.icon
                            className={cn(
                              "size-[18px] shrink-0 transition-all duration-300",
                              isActive ? "text-primary scale-110" : "group-hover:text-primary/70",
                            )}
                          />
                          {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border bg-black/20 backdrop-blur-md">
          {!sidebarCollapsed && user && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-white/5 border border-white/5">
              <div className="size-9 rounded-full bg-gradient-gold grid place-items-center text-xs font-bold text-primary-foreground shadow-glow">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{user.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-primary font-bold">{user.role}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            >
              <LogOut className="size-4 shrink-0" />
              {!sidebarCollapsed && <span>Sign out</span>}
            </button>
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center rounded-xl p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft
                className={cn("size-4 transition-transform duration-300", sidebarCollapsed && "rotate-180")}
              />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
