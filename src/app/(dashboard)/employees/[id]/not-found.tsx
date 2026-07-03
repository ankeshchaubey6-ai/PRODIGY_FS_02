import Link from "next/link";
import { UserX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmployeeNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <UserX className="w-7 h-7 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Employee not found
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        This employee record doesn&apos;t exist or may have been removed
        from the system.
      </p>
      <Button asChild className="gap-2">
        <Link href="/employees">
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </Link>
      </Button>
    </div>
  );
}