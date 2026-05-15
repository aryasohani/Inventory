import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseOrdersApi } from "@/app/services/api";
import { PageHeader } from "@/app/components/PageHeader";
import { StatusPill } from "@/app/components/StatusPill";
import { Skeleton } from "@/app/components/Skeleton";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Search, FileText, Calendar, DollarSign, Layers } from "lucide-react";
import { format } from "date-fns";
import type { POStatus } from "@/app/services/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const FLOW: POStatus[] = ["draft", "sent", "acknowledged", "received"];

export function PurchaseOrdersPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: purchaseOrdersApi.list,
  });
  const [search, setSearch] = useState("");

  const advance = useMutation({
    mutationFn: ({ id, status }: { id: string; status: POStatus }) =>
      purchaseOrdersApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success("Workflow Advanced", { description: "The purchase order has moved to the next lifecycle phase." });
    },
  });

  const filtered = useMemo(
    () =>
      (data ?? []).filter(
        (p) =>
          !search ||
          p.id.includes(search.toLowerCase()) ||
          p.supplierName.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Purchase Orders"
        description="Monitor procurement lifecycles and advance supplier supply chains."
        actions={
          <Button asChild className="bg-gradient-gold text-primary-foreground shadow-glow h-11 px-6 rounded-xl">
            <Link to="/purchase-orders/new">
              <Plus className="size-4 mr-2" />
              New PO
            </Link>
          </Button>
        }
      />

      <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-4 flex items-center shadow-premium">
        <div className="relative max-w-md w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/30 group-focus-within:text-primary transition-colors" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search PO ID or supplier node..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-sm outline-none transition-all placeholder:text-white/20"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card p-8 space-y-4 rounded-3xl">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden shadow-premium">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                  <Th className="pl-8">PO ID</Th>
                  <Th>Supplier Entity</Th>
                  <Th>Registry Date</Th>
                  <Th>Estimated Arrival</Th>
                  <Th className="text-right">Unit Count</Th>
                  <Th className="text-right">Total Valuation</Th>
                  <Th>Workflow Stage</Th>
                  <Th className="pr-8 text-right">Operations</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map((p, idx) => {
                  const flowIdx = FLOW.indexOf(p.status);
                  const next = flowIdx >= 0 && flowIdx < FLOW.length - 1 ? FLOW[flowIdx + 1] : null;
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.01 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <Td className="pl-8 py-5">
                        <Link
                          to={`/purchase-orders/${p.id}`}
                          className="flex items-center gap-3 group/link"
                        >
                          <div className="size-9 rounded-lg bg-white/5 border border-white/5 grid place-items-center group-hover/link:border-primary/30 transition-all">
                            <FileText className="size-4 text-white/40 group-hover/link:text-primary" />
                          </div>
                          <span className="font-bold text-white group-hover/link:text-primary transition-colors uppercase tracking-wider">
                            {p.id.slice(0, 8)}
                          </span>
                        </Link>
                      </Td>
                      <Td className="font-bold text-white/80">{p.supplierName}</Td>
                      <Td className="text-white/40 font-medium">
                        {format(new Date(p.createdAt), "MMM dd, yyyy")}
                      </Td>
                      <Td className="text-white/40 font-medium">
                        {format(new Date(p.expectedAt), "MMM dd, yyyy")}
                      </Td>
                      <Td className="text-right tabular-nums text-white/60 font-bold">{p.itemCount}</Td>
                      <Td className="text-right tabular-nums font-bold text-white text-base">
                        ${p.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Td>
                      <Td>
                        <StatusPill status={p.status} />
                      </Td>
                      <Td className="pr-8 text-right">
                        {next && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                            onClick={() => advance.mutate({ id: p.id, status: next })}
                          >
                            Advance to {next}
                            <ArrowRight className="size-3 ml-2" />
                          </Button>
                        )}
                      </Td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Workflow legend */}
      <div className="glass-card rounded-3xl p-8 shadow-premium relative overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center">
            <Layers className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">System Workflow</h3>
            <p className="text-white/30 text-xs font-medium uppercase tracking-wider">Purchase Order Lifecycle States</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap relative z-10">
          {FLOW.map((s, i) => (
            <div key={s} className="flex items-center gap-4">
              <div
                className={cn(
                  "px-5 py-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 bg-white/[0.02] border-white/5 hover:border-white/20 group/stage",
                )}
              >
                <div className="size-7 rounded-full bg-white/5 border border-white/10 grid place-items-center text-[10px] font-bold text-white/40 group-hover/stage:text-primary transition-colors">
                  {i + 1}
                </div>
                <StatusPill status={s} />
              </div>
              {i < FLOW.length - 1 && (
                <div className="flex flex-col items-center opacity-20">
                   <ArrowRight className="size-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Decorative glow */}
        <div className="absolute top-1/2 -right-16 size-48 bg-primary/5 blur-3xl rounded-full" />
      </div>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("text-left font-bold py-4 px-4", className)}>{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("py-4 px-4", className)}>{children}</td>;
}
