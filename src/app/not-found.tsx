import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="relative mb-8 inline-block">
          <div className="w-32 h-32 rounded-3xl bg-muted flex items-center justify-center mx-auto">
            <span className="text-6xl font-bold text-muted-foreground/30 select-none">
              404
            </span>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/30" />
          <div className="absolute -bottom-3 -left-3 w-5 h-5 rounded-full bg-brand-300/30 border border-brand-300/40" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Page not found
        </h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Check the URL or head back to the dashboard.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button asChild variant="outline" className="gap-2">
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4" />
              Go back
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/dashboard">
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}