import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const entries = [
  { name: "Aarav Patel", type: "Morning check-in", status: "On time", time: "08:45" },
  { name: "Sana Khan", type: "Remote login", status: "Approved", time: "09:02" },
  { name: "Mina Chen", type: "Late arrival", status: "Flagged", time: "09:18" },
];

export function AttendanceTimeline() {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Today’s attendance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-foreground">{entry.name}</p>
              <p className="text-xs text-muted-foreground">{entry.type}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-foreground">{entry.time}</p>
              <Badge
                variant={entry.status === "Flagged" ? "destructive" : entry.status === "Approved" ? "secondary" : "outline"}
                className="mt-1"
              >
                {entry.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
