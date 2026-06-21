import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldAlert, CheckCircle2, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { ThemeToggle } from "../../components/shared/ThemeToggle";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Mock auth verification (accept any credentials for testing, but check format)
      if (email === "admin@alope.com" && password === "password123") {
        localStorage.setItem("auth_token", "alope_admin_session_token");
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 800);
      } else {
        if (email === "admin@alope.com") {
          throw new Error("Invalid password. Hint: password123");
        } else {
          throw new Error("User not found. Use admin@alope.com / password123");
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-200 overflow-hidden">
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-50 dark:bg-zinc-950 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)]" />

      {/* Floating abstract premium design blobs in background */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[80px] -z-10 dark:bg-blue-500/5 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] -z-10 dark:bg-indigo-500/5 pointer-events-none" />

      {/* Top Bar with Theme Toggle */}
      <header className="absolute top-0 right-0 p-6 flex justify-end w-full">
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl p-1 shadow-sm">
          <ThemeToggle />
        </div>
      </header>

      {/* Login Card */}
      <div className="w-full max-w-[440px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="bg-white/80 dark:bg-zinc-900/85 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">

          <div className="p-8 pb-6 text-center">
            {/* Logo container */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 mb-4 shadow-md shadow-zinc-900/10 dark:shadow-none transition-transform duration-300 hover:scale-105">
              <GraduationCap className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Alope Admin
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
              Welcome back! Please enter your details.
            </p>
          </div>

          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Alert Message */}
              {error && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  <CheckCircle2 className="w-5 h-5 shrink-0 animate-bounce" />
                  <span className="font-medium">Login successful! Redirecting...</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@alope.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || success}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all duration-200 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block"
                  >
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => { e.preventDefault(); setError("Mock recovery email triggered."); }}
                    className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || success}
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all duration-200 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || success}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Keep Me Logged In */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-800 text-zinc-900 focus:ring-zinc-900 dark:focus:ring-zinc-100/10 focus:ring-offset-0 bg-zinc-50 dark:bg-zinc-950/50 cursor-pointer"
                  defaultChecked
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-zinc-500 dark:text-zinc-400 font-medium cursor-pointer select-none"
                >
                  Keep me signed in
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || success}
                className="w-full mt-2 h-11 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 rounded-xl font-semibold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>

            {/* Test credentials display card */}
            <div className="mt-6 p-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 text-center">
              <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                Test Credentials
              </span>
              <code className="text-xs text-zinc-600 dark:text-zinc-400 block mt-1">
                admin@alope.com / password123
              </code>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-6 select-none">
          &copy; 2026 Alope Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
