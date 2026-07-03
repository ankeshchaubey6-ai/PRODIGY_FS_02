import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Users,
  BarChart3,
  Building2,
  ShieldCheck,
  Download,
  Search,
  TrendingUp,
  CheckCircle2,
  Star,
  Zap,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";

async function getAuthStatus() {
  try {
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const userId = await getAuthStatus();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#11110f] text-white overflow-x-hidden">

      {/* ── Ambient background ──────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Primary glow — top left */}
        <div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          }}
        />
        {/* Secondary glow — bottom right */}
        <div
          className="absolute -bottom-60 -right-60 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #818cf8 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <span className="text-white font-bold text-base tracking-tight">E</span>
          </div>
          <div>
            <span className="text-white font-semibold text-sm tracking-widest">EMS</span>
            <span className="text-brand-300/70 text-[10px] block leading-none tracking-wider">
              WORKFORCE
            </span>
          </div>
        </div>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Dashboard", "Security"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* CTA group */}
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-medium bg-brand-500 hover:bg-brand-400 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-px"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative z-10 pt-20 pb-28 px-6 max-w-7xl mx-auto text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-200 text-xs font-medium px-4 py-2 rounded-full mb-10 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Built for modern HR teams
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.08] tracking-tight text-white max-w-4xl mx-auto mb-6">
          Your people,
          <br />
          <span className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #a78bfa 100%)",
            }}
          >
            perfectly organised.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-12 leading-relaxed">
          EMS brings employee records, departments, and HR workflows into one
          clean dashboard — so your team can focus on people, not paperwork.
        </p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2.5 bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium px-8 py-4 rounded-xl transition-all duration-200 shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5"
          >
            Start for free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200"
          >
            Sign in to dashboard
          </Link>
        </div>

        {/* Social proof strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          {[
            { value: "20+", label: "Employees tracked" },
            { value: "7", label: "Departments" },
            { value: "100%", label: "Data ownership" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-semibold text-white">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-amber-400 text-amber-400"
              />
            ))}
            <span className="text-xs text-slate-500 ml-1">
              Loved by HR teams
            </span>
          </div>
        </div>
      </section>

      {/* ── Dashboard preview ───────────────────────────────── */}
      <section className="relative z-10 px-6 max-w-6xl mx-auto mb-32">
        {/* Glow under card */}
        <div
          className="absolute inset-x-20 top-8 h-48 opacity-30 blur-3xl rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)",
          }}
        />

        {/* Dashboard mockup card */}
        <div className="relative rounded-2xl border border-white/10 bg-[#0D1117] overflow-hidden shadow-2xl shadow-black/60">
          {/* Fake browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            <div className="flex-1 mx-4">
              <div className="bg-white/5 rounded-md h-5 w-48 mx-auto flex items-center justify-center">
                <span className="text-[10px] text-slate-500">
                  ems.app/dashboard
                </span>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="flex h-[420px]">
            {/* Fake sidebar */}
            <div className="w-14 lg:w-52 border-r border-white/5 bg-white/[0.015] p-3 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-brand-500/80 flex items-center justify-center mb-6 mx-auto lg:mx-0">
                <span className="text-white font-bold text-xs">E</span>
              </div>
              {[
                { icon: BarChart3, label: "Dashboard", active: true },
                { icon: Users, label: "Employees", active: false },
                { icon: Building2, label: "Departments", active: false },
                { icon: ShieldCheck, label: "Settings", active: false },
              ].map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 px-2 py-2 rounded-lg mb-1 transition-colors ${
                    active
                      ? "bg-brand-500/20 text-brand-200"
                      : "text-slate-600 hover:text-slate-400"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-medium hidden lg:block">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-5 overflow-hidden">
              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Total Employees", value: "20", trend: "+2", color: "text-brand-400", bg: "bg-brand-500/10" },
                  { label: "Active", value: "17", trend: "+1", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { label: "Departments", value: "7", trend: "0", color: "text-sky-400", bg: "bg-sky-500/10" },
                  { label: "New This Month", value: "3", trend: "+3", color: "text-violet-400", bg: "bg-violet-500/10" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/[0.03] border border-white/5 rounded-xl p-3"
                  >
                    <p className="text-[10px] text-slate-500 mb-1.5">
                      {stat.label}
                    </p>
                    <div className="flex items-end justify-between">
                      <p className={`text-xl font-semibold ${stat.color}`}>
                        {stat.value}
                      </p>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${stat.bg} ${stat.color}`}
                      >
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts + activity row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Growth chart */}
                <div className="col-span-2 bg-white/[0.03] border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 mb-3">
                    Workforce growth
                  </p>
                  <div className="flex items-end gap-1.5 h-16">
                    {[30, 45, 38, 55, 50, 68, 72, 65, 80, 88, 78, 95].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm opacity-80"
                          style={{
                            height: `${h}%`,
                            background:
                              i === 11
                                ? "linear-gradient(to top, #6366f1, #818cf8)"
                                : "rgba(99,102,241,0.25)",
                          }}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Dept distribution */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 mb-3">
                    By department
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { name: "Engineering", w: "75%", color: "bg-brand-500" },
                      { name: "HR", w: "30%", color: "bg-pink-500" },
                      { name: "Marketing", w: "45%", color: "bg-amber-500" },
                      { name: "Finance", w: "35%", color: "bg-emerald-500" },
                    ].map((d) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-500 w-14 truncate">
                          {d.name}
                        </span>
                        <div className="flex-1 h-1 bg-white/5 rounded-full">
                          <div
                            className={`h-full rounded-full ${d.color}`}
                            style={{ width: d.w }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Employee rows */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
                <div className="grid grid-cols-4 px-3 py-2 border-b border-white/5">
                  {["Employee", "Department", "Status", "Joined"].map((h) => (
                    <span
                      key={h}
                      className="text-[9px] font-medium text-slate-600 uppercase tracking-wider"
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {[
                  { name: "Arjun Sharma", dept: "Engineering", status: "Active", joined: "Jun 2020", color: "bg-brand-500" },
                  { name: "Divya Nair", dept: "HR", status: "Active", joined: "Sep 2018", color: "bg-pink-500" },
                  { name: "Kavya Reddy", dept: "Marketing", status: "On Leave", joined: "Feb 2020", color: "bg-amber-500" },
                ].map((emp) => (
                  <div
                    key={emp.name}
                    className="grid grid-cols-4 px-3 py-2 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full ${emp.color} flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0`}
                      >
                        {emp.name[0]}
                      </div>
                      <span className="text-[10px] text-slate-300 truncate">
                        {emp.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 self-center">
                      {emp.dept}
                    </span>
                    <span
                      className={`text-[9px] self-center px-1.5 py-0.5 rounded-full w-fit font-medium ${
                        emp.status === "Active"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {emp.status}
                    </span>
                    <span className="text-[10px] text-slate-600 self-center">
                      {emp.joined}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section id="features" className="relative z-10 px-6 max-w-7xl mx-auto mb-32">
        <div className="text-center mb-16">
          <p className="text-xs text-brand-400 font-medium tracking-widest uppercase mb-4">
            What's inside
          </p>
          <h2 className="text-4xl font-semibold text-white tracking-tight mb-4">
            Everything HR actually needs
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-base leading-relaxed">
            No bloat, no buried settings. Just the tools your team opens
            every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Users,
              title: "Full employee profiles",
              description:
                "Every record includes contact info, job details, salary, emergency contacts, manager, and a timeline — all in one place.",
              accent: "from-brand-500/20 to-transparent",
              iconBg: "bg-brand-500/15",
              iconColor: "text-brand-400",
            },
            {
              icon: Search,
              title: "Search and filters",
              description:
                "Find anyone instantly by name, email, ID, or designation. Filter by department, status, type, or gender in seconds.",
              accent: "from-violet-500/20 to-transparent",
              iconBg: "bg-violet-500/15",
              iconColor: "text-violet-400",
            },
            {
              icon: Building2,
              title: "Department management",
              description:
                "Create departments with custom colours, assign team members, and see headcount and reporting structure at a glance.",
              accent: "from-sky-500/20 to-transparent",
              iconBg: "bg-sky-500/15",
              iconColor: "text-sky-400",
            },
            {
              icon: TrendingUp,
              title: "Live analytics",
              description:
                "Track headcount growth, new hires per month, department distribution, and active-to-total ratios on one dashboard.",
              accent: "from-emerald-500/20 to-transparent",
              iconBg: "bg-emerald-500/15",
              iconColor: "text-emerald-400",
            },
            {
              icon: Download,
              title: "One-click CSV export",
              description:
                "Export any filtered view to a CSV file instantly — with all columns, ready for payroll, audits, or reporting.",
              accent: "from-amber-500/20 to-transparent",
              iconBg: "bg-amber-500/15",
              iconColor: "text-amber-400",
            },
            {
              icon: ShieldCheck,
              title: "Secure by default",
              description:
                "Clerk-powered authentication with role-based access. Only the right people see the right records.",
              accent: "from-pink-500/20 to-transparent",
              iconBg: "bg-pink-500/15",
              iconColor: "text-pink-400",
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl p-6 transition-all duration-300"
              >
                {/* Gradient accent top */}
                <div
                  className={`absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r ${feature.accent}`}
                />

                <div
                  className={`w-10 h-10 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section id="dashboard" className="relative z-10 px-6 max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs text-brand-400 font-medium tracking-widest uppercase mb-4">
              How it works
            </p>
            <h2 className="text-4xl font-semibold text-white tracking-tight mb-6">
              From sign-up to running in under 5 minutes.
            </h2>
            <p className="text-slate-400 leading-relaxed mb-10">
              No lengthy onboarding, no IT tickets. Sign in, seed the database,
              and your HR dashboard is live — complete with 20 sample employees
              across 7 departments.
            </p>

            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Create your account",
                  description:
                    "Sign up with email or OAuth. Clerk handles auth so you never store passwords.",
                },
                {
                  step: "02",
                  title: "Add your team",
                  description:
                    "Create employee records manually or use the seed script to populate sample data instantly.",
                },
                {
                  step: "03",
                  title: "Manage from your dashboard",
                  description:
                    "Search, filter, export, and update records from one clean interface — on any device.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-brand-400 font-mono">
                      {item.step}
                    </span>
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-semibold text-white mb-1">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack card */}
          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-[#0D1117] p-8">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-6">
                Built with
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Next.js 14", desc: "App Router", color: "border-slate-700" },
                  { name: "Prisma ORM", desc: "PostgreSQL", color: "border-slate-700" },
                  { name: "Clerk Auth", desc: "Secure sign-in", color: "border-brand-500/40" },
                  { name: "Tailwind CSS", desc: "Styling", color: "border-slate-700" },
                  { name: "Shadcn UI", desc: "Components", color: "border-slate-700" },
                  { name: "Recharts", desc: "Analytics", color: "border-slate-700" },
                  { name: "Zod", desc: "Validation", color: "border-slate-700" },
                  { name: "TypeScript", desc: "Type-safe", color: "border-slate-700" },
                ].map((tech) => (
                  <div
                    key={tech.name}
                    className={`bg-white/[0.03] border ${tech.color} rounded-xl p-3`}
                  >
                    <p className="text-xs font-semibold text-white mb-0.5">
                      {tech.name}
                    </p>
                    <p className="text-[10px] text-slate-600">{tech.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-500">
                  Production-grade stack. Portfolio-ready from day one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Everything included ─────────────────────────────── */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto mb-32">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs text-brand-400 font-medium tracking-widest uppercase mb-4">
                Everything included
              </p>
              <h2 className="text-4xl font-semibold text-white tracking-tight mb-4">
                A complete system, not a starter kit.
              </h2>
              <p className="text-slate-400 leading-relaxed">
                EMS ships with every module wired up — auth, CRUD, filters,
                pagination, export, dark mode, and error boundaries. Open the
                repo and run.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Employee CRUD (create, read, update, delete)",
                "Department management",
                "Advanced search and multi-filter",
                "Paginated employee table",
                "Sortable columns",
                "CSV export of any filtered view",
                "Profile image upload",
                "Dark and light mode",
                "Role-based auth via Clerk",
                "Dashboard with live charts",
                "Skeleton loaders everywhere",
                "Mobile-responsive layout",
                "Error boundaries per route",
                "Seeded with 20 real employees",
                "Zod validation front and back",
                "REST API with Prisma + PostgreSQL",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-400 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto mb-24">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)",
            }}
          />
          {/* Orb */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-40 blur-3xl"
            style={{
              background: "radial-gradient(circle, #6366f1, transparent)",
            }}
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative px-10 py-20 text-center">
            <h2 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight mb-4">
              Ready to manage your team?
            </h2>
            <p className="text-brand-100/70 text-lg mb-10 max-w-md mx-auto">
              Set up your dashboard in minutes. No credit card, no catch.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2.5 bg-white text-brand-900 font-semibold text-sm px-8 py-4 rounded-xl hover:bg-brand-50 transition-all duration-200 shadow-xl hover:-translate-y-0.5"
              >
                Create your account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center text-sm text-brand-100/70 hover:text-white transition-colors px-6 py-4"
              >
                Already have an account? Sign in →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">E</span>
            </div>
            <span className="text-sm font-medium text-slate-400">EMS</span>
            <span className="text-slate-700 text-sm">·</span>
            <span className="text-xs text-slate-600">
              © {new Date().getFullYear()} Built with Next.js & Prisma
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {[
              { label: "Sign in", href: "/sign-in" },
              { label: "Sign up", href: "/sign-up" },
              { label: "Dashboard", href: "/dashboard" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}