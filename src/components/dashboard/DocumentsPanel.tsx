import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const documents = [
  { name: "Employment contract", owner: "Aarav Patel", category: "HR", status: "Signed" },
  { name: "ID verification", owner: "Sana Khan", category: "Compliance", status: "Pending" },
  { name: "Offer letter", owner: "Mina Chen", category: "Recruiting", status: "Ready" },
];

export function DocumentsPanel() {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Recent documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {documents.map((document) => (
          <div key={document.name} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-foreground">{document.name}</p>
              <p className="text-xs text-muted-foreground">{document.owner} • {document.category}</p>
            </div>
            <Badge variant="outline">{document.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
