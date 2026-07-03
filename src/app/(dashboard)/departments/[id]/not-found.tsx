import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DepartmentNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Building2 className="w-7 h-7 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Department not found
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        This department doesn&apos;t exist or may have been removed.
      </p>
      <Button asChild className="gap-2">
        <Link href="/departments">
          <ArrowLeft className="w-4 h-4" />
          Back to Departments
        </Link>
      </Button>
    </div>
  );
}