import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { LoginPage } from "@/app/pages/LoginPage";
import { SignupPage } from "@/app/pages/SignupPage";
import { ProtectedRoute } from "@/app/auth/ProtectedRoute";
import { AppLayout } from "@/app/layouts/AppLayout";
import { DashboardPage } from "@/app/pages/DashboardPage";
import { ProductsPage } from "@/app/pages/ProductsPage";
import { ProductDetailPage } from "@/app/pages/ProductDetailPage";
import { ProductFormPage } from "@/app/pages/ProductFormPage";
import { SuppliersPage } from "@/app/pages/SuppliersPage";
import { SupplierFormPage } from "@/app/pages/SupplierFormPage";
import { PurchaseOrdersPage } from "@/app/pages/PurchaseOrdersPage";
import { PurchaseOrderFormPage } from "@/app/pages/PurchaseOrderFormPage";
import { PurchaseOrderDetailPage } from "@/app/pages/PurchaseOrderDetailPage";
import { SupplierDetailPage } from "@/app/pages/SupplierDetailPage";
import { InvoiceOcrPage } from "@/app/pages/InvoiceOcrPage";
import { AutomationPage } from "@/app/pages/AutomationPage";
import { ReportsPage } from "@/app/pages/ReportsPage";
import { NotFoundPage } from "@/app/pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient ? <>{children}</> : (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 rounded-2xl bg-gradient-gold grid place-items-center shadow-glow animate-pulse">
          <div className="size-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold animate-pulse">
          Initializing Studio
        </div>
      </div>
    </div>
  );
}

export function AppRoot() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={150}>
        <div className="dark">
          <ClientOnly>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/new" element={<ProductFormPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/products/:id/edit" element={<ProductFormPage />} />
                    <Route path="/suppliers" element={<SuppliersPage />} />
                    <Route path="/suppliers/new" element={<SupplierFormPage />} />
                    <Route path="/suppliers/:id" element={<SupplierDetailPage />} />
                    <Route path="/suppliers/:id/edit" element={<SupplierFormPage />} />
                    <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
                    <Route path="/purchase-orders/new" element={<PurchaseOrderFormPage />} />
                    <Route path="/purchase-orders/:id" element={<PurchaseOrderDetailPage />} />
                    <Route path="/invoices" element={<InvoiceOcrPage />} />
                    <Route path="/automation" element={<AutomationPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </ClientOnly>
          <Toaster position="top-right" expand={false} richColors />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
