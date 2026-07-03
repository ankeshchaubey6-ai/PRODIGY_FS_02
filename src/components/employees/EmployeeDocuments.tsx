"use client";

import { FileText, Upload, Download, Trash2, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

// Placeholder document type — extend when storage is integrated
interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: Date;
  url: string;
}

interface EmployeeDocumentsProps {
  employeeId: string;
  // In a real integration, documents would come from DB/storage
  documents?: Document[];
}

const PLACEHOLDER_DOCUMENTS: Document[] = [
  {
    id: "1",
    name: "Offer Letter.pdf",
    type: "PDF",
    size: "245 KB",
    uploadedAt: new Date("2024-01-15"),
    url: "#",
  },
  {
    id: "2",
    name: "Employment Contract.pdf",
    type: "PDF",
    size: "1.2 MB",
    uploadedAt: new Date("2024-01-15"),
    url: "#",
  },
  {
    id: "3",
    name: "ID Proof.jpg",
    type: "Image",
    size: "890 KB",
    uploadedAt: new Date("2024-01-16"),
    url: "#",
  },
];

export function EmployeeDocuments({
  employeeId,
  documents = PLACEHOLDER_DOCUMENTS,
}: EmployeeDocumentsProps) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Documents</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() =>
              alert(
                "Document upload requires a file storage provider (e.g. UploadThing or AWS S3) to be configured."
              )
            }
          >
            <Upload className="w-3 h-3" />
            Upload
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              No documents yet
            </p>
            <p className="text-xs text-muted-foreground">
              Upload contracts, IDs, or other documents for this employee.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors group"
              >
                {/* File icon */}
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <File className="w-4 h-4 text-primary" />
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {doc.type} · {doc.size} · {formatDate(doc.uploadedAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    aria-label="Download document"
                    asChild
                  >
                    <a href={doc.url} download={doc.name}>
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    aria-label="Delete document"
                    onClick={() =>
                      alert(
                        "Document deletion requires storage integration to be configured."
                      )
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}