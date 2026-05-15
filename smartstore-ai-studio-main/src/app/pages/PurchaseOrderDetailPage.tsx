import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseOrdersApi } from "@/app/services/api";
import { PageHeader } from "@/app/components/PageHeader";
import { StatusPill } from "@/app/components/StatusPill";
import { Skeleton } from "@/app/components/Skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Send,
  ArrowRight,
  Mail,
  Calendar,
  Truck,
  DollarSign,
  Package,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { POStatus } from "@/app/services/types";

const FLOW: POStatus[] = ["draft", "sent", "acknowledged", "received"];

export function PurchaseOrderDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const po = useQuery({
    queryKey: ["purchase-orders", id],
    queryFn: () => purchaseOrdersApi.get(id),
  });

  const updateStatus = useMutation({
    mutationFn: (status: POStatus) => purchaseOrdersApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success("Status updated");
    },
  });

  const sendEmail = useMutation({
    mutationFn: () => purchaseOrdersApi.sendEmail(id),
    onSuccess: () => {
      toast.success("Email sent to supplier");
    },
  });

  if (po.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!po.data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">PO not found</h2>
          <p className="text-muted-foreground mt-2">The purchase order you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link to="/purchase-orders">Back to POs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const idx = FLOW.indexOf(po.data.status);
  const next = idx >= 0 && idx < FLOW.length - 1 ? FLOW[idx + 1] : null;

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title={`PO ${po.data.id.toUpperCase()}`}
        description={`Purchase order from ${po.data.supplierName}`}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/purchase-orders">
                <ArrowLeft className="size-4 mr-1.5" />
                Back
              </Link>
            </Button>
            {po.data.status === "draft" && (
              <Button
                onClick={() => sendEmail.mutate()}
                disabled={sendEmail.isPending}
                className="bg-gradient-gold text-primary-foreground"
              >
                <Mail className="size-4 mr-1.5" />
                {sendEmail.isPending ? "Sending..." : "Send to Supplier"}
              </Button>
            )}
            {next && (
              <Button
                onClick={() => updateStatus.mutate(next)}
                disabled={updateStatus.isPending}
                className="bg-primary text-primary-foreground"
              >
                {next}
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            )}
          </div>
        }
      />

      {/* Status and key info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
              <StatusPill status={po.data.status} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <DollarSign className="size-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
              <p className="font-semibold text-lg">${po.data.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Calendar className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Created</p>
              <p className="font-medium">{format(new Date(po.data.createdAt), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Truck className="size-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Expected</p>
              <p className="font-medium">{format(new Date(po.data.expectedAt), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold">Line Items</h3>
          <p className="text-sm text-muted-foreground mt-1">{po.data.itemCount} items</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="text-left py-3 px-5">Product</th>
              <th className="text-left py-3 px-5">SKU</th>
              <th className="text-right py-3 px-5">Qty</th>
              <th className="text-right py-3 px-5">Unit Price</th>
              <th className="text-right py-3 px-5">Total</th>
            </tr>
          </thead>
          <tbody>
            {po.data.items.map((item) => (
              <tr key={item.productId} className="border-b border-border last:border-0">
                <td className="py-3 px-5 font-medium">{item.productName}</td>
                <td className="py-3 px-5 text-muted-foreground">{item.sku || "—"}</td>
                <td className="py-3 px-5 text-right tabular-nums">{item.qty}</td>
                <td className="py-3 px-5 text-right tabular-nums">${item.unitPrice.toFixed(2)}</td>
                <td className="py-3 px-5 text-right tabular-nums font-semibold">
                  ${(item.qty * item.unitPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Workflow */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display font-semibold text-sm mb-4">Workflow Progress</h3>
        <div className="flex items-center gap-4">
          {FLOW.map((status, i) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  i <= idx
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm capitalize ${
                  i <= idx ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {status}
              </span>
              {i < FLOW.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${
                    i < idx ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}