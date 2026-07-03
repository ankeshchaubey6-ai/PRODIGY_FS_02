import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — EMS",
  description: "Sign in to your EMS account",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#11110f] flex overflow-hidden">

      {/* ── Left panel ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden">

        {/* Ambient glows */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #fb923c, transparent 70%)" }}
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-14 py-12">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm tracking-widest">EMS</p>
              <p className="text-brand-300/70 text-[10px] leading-none tracking-wider">WORKFORCE</p>
            </div>
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center max-w-sm">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-200 text-xs font-medium px-3 py-1.5 rounded-full mb-8 w-fit tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Modern HR operations
            </div>

            <h1 className="text-4xl font-semibold text-white leading-[1.1] tracking-tight mb-5">
              Your people,
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #fdba74 100%)",
                }}
              >
                perfectly organised.
              </span>
            </h1>

            <p className="text-slate-400 text-[15px] leading-relaxed mb-10">
              A complete HR dashboard for managing employees,
              departments, and workforce analytics — all in one place.
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              {[
                { value: "20+", label: "Employees" },
                { value: "7", label: "Departments" },
                { value: "100%", label: "Secure" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-xl font-semibold text-white">{value}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mini dashboard preview */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-slate-400">Dashboard overview</p>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-slate-600">Live</span>
              </div>
            </div>

            {/* Mini stat cards */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Total", value: "20", color: "text-brand-400", bg: "bg-brand-500/10" },
                { label: "Active", value: "17", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { label: "New", value: "3", color: "text-violet-400", bg: "bg-violet-500/10" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                  <p className="text-[10px] text-slate-500 mb-1">{s.label}</p>
                  <p className={`text-lg font-semibold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Mini chart bars */}
            <div className="flex items-end gap-1 h-10">
              {[40, 55, 45, 65, 58, 72, 68, 80, 75, 88, 82, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background:
                      i === 11
                        ? "linear-gradient(to top, #6366f1, #818cf8)"
                        : "rgba(99,102,241,0.2)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-slate-700 text-xs mt-8">
            © {new Date().getFullYear()} EMS. Built with Next.js & Prisma.
          </p>
        </div>
      </div>

      {/* ── Right panel — form ───────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">

        {/* Subtle right-side glow */}
        <div
          className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }}
        />

        <div className="w-full max-w-[400px] relative z-10">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">E</span>
            </div>
            <span className="text-white font-semibold text-sm tracking-widest">EMS</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm">
              Sign in to access your HR dashboard.
            </p>
          </div>

          {/* Clerk form */}
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none",
                card: "shadow-none p-0 bg-transparent gap-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                header: "hidden",

                socialButtonsBlockButton: [
                  "w-full h-11 rounded-xl border border-white/10 bg-white/[0.04]",
                  "hover:bg-white/[0.08] hover:border-white/20",
                  "text-slate-300 text-sm font-medium transition-all duration-200",
                ].join(" "),
                socialButtonsBlockButtonText: "text-sm font-medium text-slate-300",
                socialButtonsBlockButtonArrow: "hidden",

                dividerRow: "my-5",
                dividerLine: "bg-white/[0.08]",
                dividerText: "text-slate-600 text-xs px-3",

                formFieldLabel: "text-xs font-medium text-slate-400 mb-1.5 block",
                formFieldLabelRow: "mb-1.5",
                formField: "mb-4",
                formFieldRow: "gap-4",

                formFieldInput: [
                  "w-full h-11 px-4 rounded-xl text-sm",
                  "bg-white/[0.04] border border-white/10",
                  "text-white placeholder:text-slate-600",
                  "hover:border-white/20 focus:border-brand-500/60",
                  "focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                  "transition-all duration-200",
                ].join(" "),
                formFieldInputShowPasswordButton: "text-slate-500 hover:text-slate-300",

                formButtonPrimary: [
                  "w-full h-11 rounded-xl font-medium text-sm",
                  "bg-brand-500 hover:bg-brand-400",
                  "text-white shadow-lg shadow-brand-500/25",
                  "hover:shadow-brand-500/40 hover:-translate-y-px",
                  "transition-all duration-200",
                ].join(" "),

                footerActionLink: "text-brand-400 hover:text-brand-300 font-medium transition-colors",
                footerActionText: "text-slate-500 text-sm",
                footer: "mt-6",

                identityPreviewText: "text-slate-300",
                identityPreviewEditButton: "text-brand-400 hover:text-brand-300",

                otpCodeFieldInput: [
                  "w-12 h-12 rounded-xl text-center text-base font-semibold",
                  "bg-white/[0.04] border border-white/10",
                  "text-white focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20",
                  "transition-all duration-200",
                ].join(" "),

                alertText: "text-red-400 text-sm",
                alert: "bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4",

                formResendCodeLink: "text-brand-400 hover:text-brand-300 text-sm font-medium",
                backLink: "text-slate-500 hover:text-slate-300 text-sm transition-colors",

                alternativeMethodsBlockButton: [
                  "w-full h-11 rounded-xl border border-white/10 bg-white/[0.04]",
                  "hover:bg-white/[0.08] text-slate-300 text-sm font-medium transition-all",
                ].join(" "),
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false,
                logoPlacement: "none",
              },
            }}
          />

          {/* Back to home */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <Link
              href="/"
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}