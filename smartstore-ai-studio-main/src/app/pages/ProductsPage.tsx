import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/app/services/api";
import { PageHeader } from "@/app/components/PageHeader";
import { StatusPill } from "@/app/components/StatusPill";
import { Skeleton } from "@/app/components/Skeleton";
import { EmptyState } from "@/app/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Plus, Search, Package, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "ok", label: "In Stock" },
  { value: "low", label: "Low" },
  { value: "critical", label: "Critical" },
] as const;

export function ProductsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["products"], queryFn: productsApi.list });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]["value"]>("all");
  const [view, setView] = useState<"table" | "grid">("table");

  const categories = useMemo(() => {
    const set = new Set((data ?? []).map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [data]);

  const filtered = useMemo(() => {
    return (data ?? []).filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (status !== "all" && p.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [data, category, status, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage SKUs, monitor stock health, and inspect AI-driven demand forecasts."
        actions={
          <Button asChild className="bg-gradient-gold text-primary-foreground shadow-glow h-11 px-6 rounded-xl">
            <Link to="/products/new">
              <Plus className="size-4 mr-2" /> Add Product
            </Link>
          </Button>
        }
      />

      {/* Filters bar */}
      <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-4 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center shadow-premium">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/30 group-focus-within:text-primary transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKUs, names, categories..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-sm outline-none transition-all placeholder:text-white/20"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 px-4 rounded-2xl bg-white/[0.03] border border-white/5 text-sm outline-none focus:border-primary/50 cursor-pointer min-w-[180px] hover:bg-white/[0.05] transition-colors"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-[#0a0a0a]">
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
          
          <div className="flex rounded-2xl border border-white/5 bg-white/[0.02] p-1 gap-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatus(f.value)}
                className={cn(
                  "px-4 h-10 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300",
                  status === f.value
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-white/40 hover:text-white hover:bg-white/5",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex rounded-2xl border border-white/5 bg-white/[0.02] p-1 gap-1">
            <button
              onClick={() => setView("table")}
              className={cn(
                "size-10 grid place-items-center rounded-xl transition-all",
                view === "table" ? "bg-white/10 text-white border border-white/10" : "text-white/30 hover:text-white",
              )}
              aria-label="Table view"
            >
              <List className="size-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={cn(
                "size-10 grid place-items-center rounded-xl transition-all",
                view === "grid" ? "bg-white/10 text-white border border-white/10" : "text-white/30 hover:text-white",
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="glass-card p-8 space-y-4 rounded-3xl">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-3xl overflow-hidden py-20">
          <EmptyState
            icon={<Package className="size-10 text-white/20" />}
            title="No Results Found"
            description="Adjust your filters or search terms to find what you're looking for."
            action={
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/products/new">
                  <Plus className="size-4 mr-2" /> Add new product
                </Link>
              </Button>
            }
          />
        </div>
      ) : view === "table" ? (
        <div className="glass-card rounded-3xl overflow-hidden shadow-premium">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                  <Th className="pl-8">
                    Identity <ArrowUpDown className="size-3 inline ml-2 opacity-30" />
                  </Th>
                  <Th>Serial / SKU</Th>
                  <Th>Classification</Th>
                  <Th className="text-right">Inventory</Th>
                  <Th className="text-right">Unit Price</Th>
                  <Th>Shelf Life</Th>
                  <Th className="pr-8">Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map((p, idx) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.01 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <Td className="pl-8 py-5">
                      <Link to={`/products/${p.id}`} className="flex items-center gap-4 group/item">
                        <div className="size-11 rounded-xl bg-white/5 border border-white/5 grid place-items-center shrink-0 group-hover/item:scale-110 group-hover/item:border-primary/30 transition-all duration-300">
                          <Package className="size-5 text-white/40 group-hover/item:text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover/item:text-primary transition-colors text-base">
                            {p.name}
                          </div>
                        </div>
                      </Link>
                    </Td>
                    <Td>
                      <code className="text-[11px] font-mono text-white/40 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                        {p.sku}
                      </code>
                    </Td>
                    <Td>
                      <span className="text-white/50 font-medium">{p.category}</span>
                    </Td>
                    <Td className="text-right tabular-nums">
                      <span className="font-bold text-white text-base">{p.stock}</span>
                      <span className="text-white/20 font-medium ml-1">
                        / {p.reorderLevel}
                      </span>
                    </Td>
                    <Td className="text-right tabular-nums font-bold text-white text-base">
                      ${p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Td>
                    <Td className="text-white/40 font-medium">
                      {format(new Date(p.expiryDate), "MMM dd, yyyy")}
                    </Td>
                    <Td className="pr-8">
                      <StatusPill status={p.status} />
                    </Td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
            >
              <Link
                to={`/products/${p.id}`}
                className="block glass-card p-6 rounded-3xl hover:border-primary/40 transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="size-14 rounded-2xl bg-white/5 border border-white/5 grid place-items-center group-hover:scale-110 group-hover:border-primary/20 transition-all duration-300">
                    <Package className="size-7 text-white/30 group-hover:text-primary" />
                  </div>
                  <StatusPill status={p.status} />
                </div>
                
                <div className="relative z-10">
                  <div className="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-1">
                    {p.name}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-white/30 mt-1 font-bold">
                    {p.sku} · {p.category}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-white/20 font-bold mb-1">
                        Inventory
                      </div>
                      <div className="font-bold text-white tabular-nums flex items-end gap-1">
                        <span className="text-xl">{p.stock}</span>
                        <span className="text-[11px] text-white/20 pb-0.5">/ {p.reorderLevel}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-white/20 font-bold mb-1">
                        Price
                      </div>
                      <div className="font-bold text-white tabular-nums text-xl">
                        ${p.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("text-left font-bold py-4 px-4", className)}>{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("py-4 px-4", className)}>{children}</td>;
}
