import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import {
  CheckCircle2,
  Users,
  BarChart3,
  Download,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Up — EMS",
  description: "Create your EMS account",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#11110f] flex overflow-hidden">

      {/* ── Left panel ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden">

        {/* Ambient glows */}
        <div
          className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 right-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #fdba74, transparent 70%)" }}
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
              Set up in under 5 minutes
            </div>

            <h1 className="text-4xl font-semibold text-white leading-[1.1] tracking-tight mb-5">
              Everything you need
              <br />
              to run your team
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #fdba74 100%)",
                }}
              >
                from day one.
              </span>
            </h1>

            <p className="text-slate-400 text-[15px] leading-relaxed mb-10">
              Create your account, seed the database, and your full
              HR dashboard is live — complete with employees, departments,
              and analytics.
            </p>

            {/* Feature checklist */}
            <ul className="space-y-3">
              {[
                { icon: Users, text: "Full employee lifecycle management" },
                { icon: BarChart3, text: "Real-time workforce analytics" },
                { icon: Download, text: "CSV export and advanced filters" },
                { icon: ShieldCheck, text: "Role-based access control" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <span className="text-slate-400 text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What's included card */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm">
            <p className="text-xs font-medium text-slate-500 mb-4 uppercase tracking-wider">
              Included out of the box
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                "20 seeded employees",
                "7 departments",
                "Live dashboard charts",
                "Dark & light mode",
                "Skeleton loaders",
                "Error boundaries",
                "Prisma + PostgreSQL",
                "Clerk authentication",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-brand-400 flex-shrink-0" />
                  <span className="text-[11px] text-slate-500">{item}</span>
                </div>
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

        {/* Subtle glow */}
        <div
          className="absolute top-1/3 right-0 w-80 h-80 opacity-10 pointer-events-none"
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
              Create your account
            </h2>
            <p className="text-slate-500 text-sm">
              Set up EMS for your organisation in minutes.
            </p>
          </div>

          {/* Clerk SignUp */}
          <SignUp
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
                formFieldRow: "gap-3",

                formFieldInput: [
                  "w-full h-11 px-4 rounded-xl text-sm",
                  "bg-white/[0.04] border border-white/10",
                  "text-white placeholder:text-slate-600",
                  "hover:border-white/20 focus:border-brand-500/60",
                  "focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                  "transition-all duration-200",
                ].join(" "),
                formFieldInputShowPasswordButton:
                  "text-slate-500 hover:text-slate-300",

                formButtonPrimary: [
                  "w-full h-11 rounded-xl font-medium text-sm",
                  "bg-brand-500 hover:bg-brand-400",
                  "text-white shadow-lg shadow-brand-500/25",
                  "hover:shadow-brand-500/40 hover:-translate-y-px",
                  "transition-all duration-200",
                ].join(" "),

                footerActionLink:
                  "text-brand-400 hover:text-brand-300 font-medium transition-colors",
                footerActionText: "text-slate-500 text-sm",
                footer: "mt-6",

                identityPreviewText: "text-slate-300",
                identityPreviewEditButton:
                  "text-brand-400 hover:text-brand-300",

                otpCodeFieldInput: [
                  "w-12 h-12 rounded-xl text-center text-base font-semibold",
                  "bg-white/[0.04] border border-white/10",
                  "text-white focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20",
                  "transition-all duration-200",
                ].join(" "),

                alertText: "text-red-400 text-sm",
                alert:
                  "bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4",

                formResendCodeLink:
                  "text-brand-400 hover:text-brand-300 text-sm font-medium",
                backLink:
                  "text-slate-500 hover:text-slate-300 text-sm transition-colors",

                alternativeMethodsBlockButton: [
                  "w-full h-11 rounded-xl border border-white/10 bg-white/[0.04]",
                  "hover:bg-white/[0.08] text-slate-300 text-sm font-medium transition-all",
                ].join(" "),

                phoneNumberPrimaryButton: [
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