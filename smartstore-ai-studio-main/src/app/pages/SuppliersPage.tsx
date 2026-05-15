import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { suppliersApi } from "@/app/services/api";
import { PageHeader } from "@/app/components/PageHeader";
import { StatusPill } from "@/app/components/StatusPill";
import { Skeleton } from "@/app/components/Skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Phone, Star, Trash2, Pencil, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function SuppliersPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["suppliers"], queryFn: suppliersApi.list });
  const del = useMutation({
    mutationFn: (id: string) => suppliersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Vendor Decommissioned", { description: "The supplier record has been removed from the registry." });
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Suppliers"
        description="Manage vendor relationships, lead times, and intelligence metrics."
        actions={
          <Button asChild className="bg-gradient-gold text-primary-foreground shadow-glow h-11 px-6 rounded-xl">
            <Link to="/suppliers/new">
              <Plus className="size-4 mr-2" />
              Add Supplier
            </Link>
          </Button>
        }
      />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(data ?? []).map((s, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={s.id}
              className="glass-card p-6 rounded-3xl hover:border-primary/40 transition-all group relative overflow-hidden flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="size-14 rounded-2xl bg-gradient-gold grid place-items-center text-primary-foreground font-bold text-xl shadow-glow group-hover:scale-110 transition-transform">
                  {s.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <StatusPill status={s.status} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl text-white group-hover:text-primary transition-colors">{s.name}</h3>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-amber-400">
                  <Star className="size-3.5 fill-current" /> {s.rating} ·{" "}
                  <span className="text-white/40 font-medium uppercase tracking-wider">{s.totalOrders} total orders</span>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-white/50 font-medium">
                    <div className="size-8 rounded-lg bg-white/5 grid place-items-center shrink-0">
                      <Mail className="size-4" />
                    </div>
                    {s.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/50 font-medium">
                    <div className="size-8 rounded-lg bg-white/5 grid place-items-center shrink-0">
                      <Phone className="size-4" />
                    </div>
                    {s.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/50 font-medium">
                    <div className="size-8 rounded-lg bg-white/5 grid place-items-center shrink-0">
                      <Clock className="size-4 text-primary" />
                    </div>
                    <span className="text-white/80 font-bold">{s.leadTimeDays} Day</span> Lead Time
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  {s.categories.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-white/40 border border-white/5 font-bold uppercase tracking-wider"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                <Button asChild size="sm" variant="outline" className="flex-1 h-10 rounded-xl bg-white/[0.02] border-white/10 hover:bg-white/5 text-xs font-bold uppercase tracking-wider">
                  <Link to={`/suppliers/${s.id}`}>
                    Intel
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1 h-10 rounded-xl bg-white/[0.02] border-white/10 hover:bg-white/5 text-xs font-bold uppercase tracking-wider">
                  <Link to={`/suppliers/${s.id}/edit`}>
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="size-10 shrink-0 rounded-xl bg-rose-500/5 border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30"
                  onClick={() => {
                    if (confirm("Decommission this supplier node?")) del.mutate(s.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              {/* Background gradient */}
              <div className="absolute -bottom-10 -right-10 size-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
