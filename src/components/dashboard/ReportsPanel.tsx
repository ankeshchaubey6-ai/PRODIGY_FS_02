import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reports = [
  { title: "Monthly headcount report", cadence: "Scheduled • 1st of month", status: "Ready" },
  { title: "Department utilization", cadence: "Weekly digest", status: "Queued" },
  { title: "Compliance checklist", cadence: "Quarterly", status: "Draft" },
];

export function ReportsPanel() {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reports.map((report) => (
          <div key={report.title} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-foreground">{report.title}</p>
              <p className="text-xs text-muted-foreground">{report.cadence}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{report.status}</Badge>
              <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
                Run
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
