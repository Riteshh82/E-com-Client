import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@coppera.in");
  const [password, setPassword] = useState("admin123");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate("/admin");
    } else {
      setError("Invalid credentials. Try admin@coppera.in / admin123");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — branding panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-charcoal-950 p-12 lg:flex">
        {/* Decorative */}
        <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-copper-400/8 blur-[80px]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <img src="/logo.png" alt="Next Steel Innovation Logo" className="h-11 w-11 rounded-full object-cover" />
          <span className="font-display text-2xl tracking-wide text-cream-50">NEXT STEEL INNOVATION</span>
        </div>

        {/* Center content */}
        <div className="relative">
          <h1 className="font-display text-5xl leading-tight text-cream-50">
            Admin
            <br />
            <span className="copper-gradient-text">Dashboard</span>
          </h1>
          <p className="mt-4 max-w-xs text-stone-400">
            Manage products, handle bulk orders, track messages and configure your store.
          </p>

          <div className="mt-10 space-y-3">
            {["Products & Collections", "Bulk Order Management", "Contact Messages", "Site Settings"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-stone-400">
                <span className="h-1.5 w-1.5 rounded-full bg-copper-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-cream-50/8 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <img
                  src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=80&q=80"
                  alt="Copper tile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-cream-50">Hammered Copper Panel</p>
                <p className="mt-0.5 text-xs text-stone-500">New bulk inquiry from Studio Mehta</p>
                <p className="mt-1 text-xs text-copper-400">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-cream-50 px-6 py-12 lg:w-1/2">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-2.5 lg:hidden">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-950 font-display text-base text-copper-300">
            C
          </span>
          <span className="font-display text-xl tracking-wide text-charcoal-950">NEXT STEEL INNOVATION</span>
        </div>

        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl text-charcoal-950">Welcome back</h2>
          <p className="mt-1.5 text-sm text-stone-500">Sign in to Next Steel Innovation admin panel.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal-900">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-charcoal-950/12 bg-white py-3 pl-11 pr-4 text-sm text-charcoal-950 outline-none transition-all focus:border-copper-500 focus:ring-2 focus:ring-copper-500/15"
                  placeholder="admin@coppera.in"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-charcoal-900">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-charcoal-950/12 bg-white py-3 pl-11 pr-11 text-sm text-charcoal-950 outline-none transition-all focus:border-copper-500 focus:ring-2 focus:ring-copper-500/15"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-charcoal-950"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
                <input type="checkbox" className="rounded accent-copper-500" />
                Remember me
              </label>
              <button type="button" className="text-sm font-medium text-copper-600 hover:text-copper-700">
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-up">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal-950 py-3.5 text-sm font-semibold text-cream-50 transition-all hover:bg-copper-600 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream-50/30 border-t-cream-50" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-copper-500/20 bg-copper-50 px-4 py-3">
            <p className="text-xs text-stone-600">
              <span className="font-semibold">Demo credentials:</span>{" "}
              admin@coppera.in / admin123
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-stone-400">
            <Link to="/" className="font-medium text-copper-600 hover:text-copper-700">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
