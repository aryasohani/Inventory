import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Package,
  AlertTriangle,
  Clock,
  Users,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ShoppingCart,
} from "lucide-react";
import { productsApi, suppliersApi, purchaseOrdersApi } from "@/app/services/api";
import { StatCard } from "@/app/components/StatCard";
import { StatusPill } from "@/app/components/StatusPill";
import { Skeleton } from "@/app/components/Skeleton";
import { PageHeader } from "@/app/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/app/store/uiStore";
import { useAuthStore } from "@/app/store/authStore";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";

export function DashboardPage() {
  const { user } = useAuthStore();
  const { setChatOpen } = useUiStore();

  const products = useQuery({ queryKey: ["products"], queryFn: productsApi.list });
  const suppliers = useQuery({ queryKey: ["suppliers"], queryFn: suppliersApi.list });
  const orders = useQuery({ queryKey: ["purchase-orders"], queryFn: purchaseOrdersApi.list });

  const productList = products.data ?? [];
  const lowStock = productList
    .filter((p) => p.status !== "ok")
    .sort((a, b) => a.stock / a.reorderLevel - b.stock / b.reorderLevel);
  const expiring = [...productList]
    .filter((p) => new Date(p.expiryDate).getTime() - Date.now() < 30 * 86400000)
    .sort((a, b) => +new Date(a.expiryDate) - +new Date(b.expiryDate));
  const fastMovers = [...productList].sort((a, b) => b.velocity - a.velocity).slice(0, 5);
  const recentOrders = (orders.data ?? []).slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Operator"}`}
        description="Here's what's happening across your inventory and supply chain today."
        actions={
          <Button
            onClick={() => setChatOpen(true)}
            className="bg-gradient-gold text-primary-foreground shadow-glow"
          >
            <Sparkles className="size-4 mr-1.5" /> Ask AI Assistant
          </Button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={products.isLoading ? "—" : productList.length}
          delta="+12 this month"
          trend="up"
          icon={<Package className="size-5" />}
          accent="primary"
        />
        <StatCard
          label="Low Stock Alerts"
          value={products.isLoading ? "—" : lowStock.length}
          delta={lowStock.filter((p) => p.status === "critical").length + " critical"}
          trend="down"
          icon={<AlertTriangle className="size-5" />}
          accent="danger"
        />
        <StatCard
          label="Expiring Soon"
          value={
            products.isLoading
              ? "—"
              : expiring.filter((p) => +new Date(p.expiryDate) - Date.now() < 14 * 86400000).length
          }
          hint="in next 14 days"
          icon={<Clock className="size-5" />}
          accent="warning"
        />
        <StatCard
          label="Active Suppliers"
          value={
            suppliers.isLoading
              ? "—"
              : (suppliers.data ?? []).filter((s) => s.status === "active").length
          }
          hint={`${suppliers.data?.length ?? 0} total`}
          icon={<Users className="size-5" />}
          accent="success"
        />
      </div>

      {/* AI insights banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-primary/30 p-8 glass"
      >
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 size-80 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center gap-8">
          <div className="size-16 rounded-2xl bg-gradient-gold grid place-items-center shadow-[0_0_40px_rgba(234,179,8,0.4)] shrink-0">
            <Sparkles className="size-8 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[11px] uppercase tracking-[0.25em] text-primary font-bold">
                Predictive Intelligence
              </div>
              <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-bold">
                Live
              </div>
            </div>
            <p className="text-lg text-white/90 leading-relaxed font-medium">
              <strong className="text-primary">{lowStock.length} SKUs</strong> are projected to stock out within{" "}
              <strong className="text-primary font-bold">5 days</strong>. Automated procurement suggests drafting POs to{" "}
              <span className="underline decoration-primary/40 underline-offset-4 decoration-2">Aurora Wholesale</span> and 1 other supplier.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-glow h-14 px-8 rounded-xl font-bold"
            onClick={() => setChatOpen(true)}
          >
            Review Procurement
            <ArrowUpRight className="size-5 ml-2" />
          </Button>
        </div>
      </motion.div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low stock */}
        <Panel
          title="Stock Alerts"
          subtitle="Priority focus based on lead times"
          actions={
            <Link
              to="/products"
              className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10"
            >
              Intelligence View <ArrowUpRight className="size-3.5" />
            </Link>
          }
        >
          {products.isLoading ? (
            <ListSkeleton />
          ) : (
            <div className="space-y-1 mt-4">
              {lowStock.slice(0, 5).map((p, i) => {
                const days = Math.max(0, Math.ceil(p.stock / Math.max(1, p.velocity)));
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={p.id}
                  >
                    <Link
                      to={`/products/${p.id}`}
                      className="flex items-center gap-4 py-4 px-4 hover:bg-white/[0.03] border border-transparent hover:border-white/5 rounded-2xl transition-all group"
                    >
                      <div className="size-11 rounded-xl bg-white/5 border border-white/5 grid place-items-center shrink-0 group-hover:scale-110 transition-transform">
                        <Package className="size-5 text-primary/80" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {p.sku} · {p.category}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <div className="text-sm font-bold tabular-nums">
                          {p.stock}{" "}
                          <span className="text-muted-foreground/50 font-normal">
                            / {p.reorderLevel}
                          </span>
                        </div>
                        <div className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                          days <= 2 ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-white/5 text-white/50 border-white/10"
                        )}>
                          {days}d cover
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
              {lowStock.length === 0 && (
                <div className="py-12 text-sm text-center text-muted-foreground border border-dashed border-white/10 rounded-2xl">
                  Inventory levels are optimal
                </div>
              )}
            </div>
          )}
        </Panel>

        {/* Expiry */}
        <Panel title="Risk Management" subtitle="Expiring and shelf-life alerts">
          {products.isLoading ? (
            <ListSkeleton />
          ) : (
            <div className="space-y-1 mt-4">
              {expiring.slice(0, 5).map((p, i) => {
                const days = Math.max(
                  0,
                  Math.ceil((+new Date(p.expiryDate) - Date.now()) / 86400000),
                );
                const urgent = days < 7;
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={p.id}
                  >
                    <Link
                      to={`/products/${p.id}`}
                      className="flex items-center gap-4 py-4 px-4 hover:bg-white/[0.03] border border-transparent hover:border-white/5 rounded-2xl transition-all group"
                    >
                      <div
                        className={cn(
                          "size-11 rounded-xl border grid place-items-center shrink-0 transition-transform group-hover:scale-110",
                          urgent ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        )}
                      >
                        <Clock className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Shelf-life: {format(new Date(p.expiryDate), "MMM d, yyyy")}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "tabular-nums text-sm font-bold px-3 py-1 rounded-lg border",
                          urgent ? "text-rose-400 border-rose-500/30 bg-rose-500/10" : "text-amber-400 border-amber-500/30 bg-amber-500/10"
                        )}
                      >
                        {days}d
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
              {expiring.length === 0 && (
                <div className="py-12 text-sm text-center text-muted-foreground border border-dashed border-white/10 rounded-2xl">
                  No shelf-life risks detected
                </div>
              )}
            </div>
          )}
        </Panel>

        {/* Top fast movers */}
        <Panel title="Market Velocity" subtitle="Highest demand SKUs">
          {products.isLoading ? (
            <ListSkeleton />
          ) : (
            <div className="space-y-6 mt-6">
              {fastMovers.map((p, idx) => {
                const max = fastMovers[0].velocity || 1;
                const pct = (p.velocity / max) * 100;
                return (
                  <Link key={p.id} to={`/products/${p.id}`} className="block group">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] font-bold text-primary/40 w-5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-bold flex-1 truncate group-hover:text-primary transition-colors">
                        {p.name}
                      </span>
                      <span className="text-xs tabular-nums font-bold text-primary flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10">
                        <TrendingUp className="size-3.5" /> {p.velocity} u/d
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden ml-8">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "circOut", delay: idx * 0.1 }}
                        className="h-full bg-gradient-gold rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </motion.div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Panel>

        {/* Recent POs */}
        <Panel
          title="Procurement Activity"
          subtitle="Recent supply chain events"
          actions={
            <Link
              to="/purchase-orders"
              className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10"
            >
              Order Management <ArrowUpRight className="size-3.5" />
            </Link>
          }
        >
          {orders.isLoading ? (
            <ListSkeleton />
          ) : (
            <div className="space-y-1 mt-4">
              {recentOrders.map((po, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={po.id}
                  className="flex items-center gap-4 py-4 px-4 hover:bg-white/[0.03] border border-transparent hover:border-white/5 rounded-2xl transition-all group"
                >
                  <div className="size-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 grid place-items-center shrink-0">
                    <ShoppingCart className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                      {po.supplierName}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {po.id.toUpperCase()} · {formatDistanceToNow(new Date(po.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm tabular-nums font-bold">
                      ${po.total.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {po.itemCount} units
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-8 rounded-3xl group">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-display font-bold text-xl bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">{title}</h3>
          {subtitle && <p className="text-[13px] text-muted-foreground font-medium mt-1">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}
