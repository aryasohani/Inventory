import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store/authStore";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Lock, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function LoginPage() {
  const { isAuthenticated, login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string; email?: string } };

  const [email, setEmail] = useState(location.state?.email ?? "admin@smartstore.ai");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Identity Verified", { description: "Welcome back to SmartStore Intelligence." });
      navigate(location.state?.from ?? "/dashboard");
    } catch {
      toast.error("Authentication Failed", { description: "Please check your operator credentials." });
    } finally {
      setLoading(false);
    }
  };

  const quick = (e: string) => {
    setEmail(e);
    setPassword("demo1234");
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-[#050505]">
      {/* Cinematic Left Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(234,179,8,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-gradient-gold grid place-items-center shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-transform hover:scale-110">
              <Sparkles className="size-6 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <div className="font-display font-bold text-2xl tracking-tight text-white">SmartStore AI</div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <h1 className="text-6xl xl:text-7xl font-display font-bold leading-[0.95] tracking-tighter text-white">
              Inventory that <br />
              <span className="text-gradient-gold">thinks ahead.</span>
            </h1>
            <p className="text-white/50 mt-8 text-xl leading-relaxed font-medium">
              Predictive demand forecasting and automated supply chain intelligence. Built for the next generation of logistics.
            </p>

            <div className="mt-12 space-y-6">
              {[
                { k: "94%", v: "Average forecast accuracy across SKUs" },
                { k: "12hr", v: "Mean reduction in stockout latency" },
                { k: "8.5×", v: "Efficiency gain in procurement workflows" },
              ].map((s, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  key={s.k}
                  className="flex items-center gap-6 group"
                >
                  <div className="text-4xl font-display font-bold text-primary w-24 group-hover:scale-110 transition-transform duration-300">
                    {s.k}
                  </div>
                  <div className="text-sm text-white/40 font-medium tracking-wide uppercase">{s.v}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="text-xs text-white/20 font-medium tracking-widest uppercase">
            © 2026 SmartStore AI · Enterprise Protocol v4.0
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 -right-32 size-64 bg-primary/10 blur-[120px] rounded-full" />
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative">
        <div className="lg:hidden absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(234,179,8,0.1),transparent_50%)]" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-4 mb-12 justify-center">
            <div className="size-12 rounded-2xl bg-gradient-gold grid place-items-center shadow-glow">
              <Sparkles className="size-6 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="font-display font-bold text-2xl text-white">SmartStore AI</div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-display font-bold tracking-tight text-white">Welcome back</h2>
            <p className="text-white/40 mt-3 text-lg">Initialize operator session to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Field icon={<Mail className="size-5" />} label="Identity Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-base outline-none placeholder:text-white/20 text-white py-1"
                placeholder="operator@smartstore.ai"
              />
            </Field>

            <Field icon={<Lock className="size-5" />} label="Security Key">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-transparent text-base outline-none placeholder:text-white/20 text-white py-1"
                placeholder="••••••••"
              />
            </Field>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_30px_rgba(234,179,8,0.2)] font-bold text-lg rounded-2xl"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="size-5 animate-spin" /> Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign in to Studio <ArrowRight className="size-5" />
                  </div>
                )}
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              className="w-full h-14 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
              onClick={() => navigate("/signup")}
            >
              Request new access credentials
            </Button>
          </form>

          {/* Quick Access */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/30 mb-4 flex items-center gap-2 font-bold justify-center lg:justify-start">
              <ShieldCheck className="size-4" /> Trusted Nodes
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "System Admin", email: "admin@smartstore.ai" },
                { name: "Logistics Staff", email: "staff@smartstore.ai" }
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => quick(acc.email)}
                  className="text-left rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:border-primary/40 hover:bg-white/[0.04] transition-all group"
                >
                  <div className="text-xs font-bold text-white/70 group-hover:text-primary transition-colors">{acc.name}</div>
                  <div className="text-[10px] text-white/30 mt-1 truncate font-medium">{acc.email}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block group">
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2.5 font-bold ml-1 transition-colors group-focus-within:text-primary">
        {label}
      </div>
      <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/10 bg-white/[0.03] focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
        <span className="text-white/30 group-focus-within:text-primary transition-colors">{icon}</span>
        {children}
      </div>
    </label>
  );
}