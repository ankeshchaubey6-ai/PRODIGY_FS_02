import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const requests = [
  { employee: "Lina Gomez", type: "Annual leave", days: 3, status: "Pending" },
  { employee: "Ravi Rao", type: "Sick leave", days: 1, status: "Approved" },
  { employee: "Maya Singh", type: "Parental leave", days: 10, status: "Review" },
];

export function LeaveRequestsList() {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Leave requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.map((request) => (
          <div key={request.employee} className="rounded-lg border border-border/70 bg-background/70 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{request.employee}</p>
                <p className="text-xs text-muted-foreground">{request.type} • {request.days} day{request.days > 1 ? "s" : ""}</p>
              </div>
              <Badge
                variant={request.status === "Approved" ? "secondary" : request.status === "Pending" ? "outline" : "destructive"}
              >
                {request.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
