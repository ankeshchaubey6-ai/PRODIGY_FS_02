"use client";

import { FileText, ShieldCheck, FolderOpen, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModuleStatCard } from "@/components/dashboard/ModuleStatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const documentStats = [
  {
    title: "Stored files",
    value: "132",
    description: "Employee and policy documents",
    icon: FolderOpen,
    accentClassName: "bg-primary/10 text-primary",
  },
  {
    title: "Compliance pending",
    value: "4",
    description: "Needs review this week",
    icon: ShieldCheck,
    accentClassName: "bg-amber-500/10 text-amber-600",
  },
  {
    title: "Latest uploads",
    value: "9",
    description: "Added in the last 24 hours",
    icon: FileText,
    accentClassName: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Auto-tagged",
    value: "87%",
    description: "Documents organised by type",
    icon: Sparkles,
    accentClassName: "bg-violet-500/10 text-violet-600",
  },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Keep contracts, compliance files, and employee records organised and searchable."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {documentStats.map((item) => (
          <ModuleStatCard key={item.title} {...item} />
        ))}
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Document library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Employee handbook", type: "Policy", sharedBy: "HR Ops" },
            { name: "Offer letter template", type: "Template", sharedBy: "People Team" },
            { name: "Compliance checklist", type: "Audit", sharedBy: "Operations" },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.type} • {item.sharedBy}</p>
              </div>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
