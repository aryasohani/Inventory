import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { suppliersApi, productsApi, purchaseOrdersApi } from "@/app/services/api";
import { PageHeader } from "@/app/components/PageHeader";
import { StatusPill } from "@/app/components/StatusPill";
import { Skeleton } from "@/app/components/Skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Star,
  Clock,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export function SupplierDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const supplier = useQuery({
    queryKey: ["suppliers", id],
    queryFn: () => suppliersApi.get(id),
  });

  const products = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.list,
  });

  const orders = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: purchaseOrdersApi.list,
  });

  const deleteMut = useMutation({
    mutationFn: () => suppliersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier removed");
      navigate("/suppliers");
    },
  });

  if (supplier.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!supplier.data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Supplier not found</h2>
          <p className="text-muted-foreground mt-2">The supplier you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link to="/suppliers">Back to Suppliers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const s = supplier.data;
  const supplierProducts = (products.data ?? []).filter(p => p.supplierId === s.id);
  const supplierOrders = (orders.data ?? []).filter(o => o.supplierId === s.id);
  const totalValue = supplierProducts.reduce((sum, p) => sum + (p.stock * p.price), 0);

  return (
    <div className="space-y-6 max-w-6xl">
      <Button asChild variant="ghost" size="sm" className="text-muted-foreground -ml-2">
        <Link to="/suppliers">
          <ArrowLeft className="size-4 mr-1.5" /> Back to suppliers
        </Link>
      </Button>

      <PageHeader
        title={s.name}
        description={`Supplier details and performance metrics`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link to={`/suppliers/${s.id}/edit`}>
                <Pencil className="size-4 mr-1.5" /> Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => {
                if (confirm("Remove supplier?")) deleteMut.mutate();
              }}
            >
              <Trash2 className="size-4 mr-1.5" /> Delete
            </Button>
          </>
        }
      />

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Products</p>
              <p className="font-semibold text-lg">{supplierProducts.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="size-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Value</p>
              <p className="font-semibold text-lg">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ShoppingCart className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Orders</p>
              <p className="font-semibold text-lg">{supplierOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Clock className="size-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Lead Time</p>
              <p className="font-semibold text-lg">{s.leadTimeDays}d</p>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display font-semibold mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted-foreground" />
              <span>{s.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-4 text-muted-foreground" />
              <span>{s.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="size-4 text-warning fill-current" />
              <span>{s.rating} rating · {s.totalOrders} total orders</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display font-semibold mb-4">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {s.categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Products from this supplier */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold">Supplied Products</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {supplierProducts.length} products currently in inventory
          </p>
        </div>
        {supplierProducts.length > 0 ? (
          <div className="divide-y divide-border">
            {supplierProducts.map((product) => (
              <div key={product.id} className="p-4 hover:bg-accent/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      to={`/products/${product.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      SKU: {product.sku} · Stock: {product.stock} · ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <StatusPill status={product.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Package className="size-8 mx-auto mb-2 opacity-50" />
            <p>No products from this supplier</p>
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold">Recent Purchase Orders</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {supplierOrders.length} orders placed with this supplier
          </p>
        </div>
        {supplierOrders.length > 0 ? (
          <div className="divide-y divide-border">
            {supplierOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 hover:bg-accent/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      to={`/purchase-orders/${order.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      PO {order.id.toUpperCase()}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.itemCount} items · ${order.total.toFixed(2)} · {order.status}
                    </p>
                  </div>
                  <StatusPill status={order.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <ShoppingCart className="size-8 mx-auto mb-2 opacity-50" />
            <p>No purchase orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}