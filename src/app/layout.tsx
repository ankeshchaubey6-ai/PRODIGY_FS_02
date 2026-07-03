import type { Metadata } from "next";
import "@/app/globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: {
    default: "EMS — Employee Management System",
    template: "%s | EMS",
  },
  description:
    "A modern, full-featured Employee Management System for HR teams and administrators.",
  keywords: ["employee management", "HR dashboard", "workforce management"],
  authors: [{ name: "EMS Team" }],
  creator: "EMS",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "EMS — Employee Management System",
    description: "A modern HR dashboard for managing your workforce.",
    siteName: "EMS",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
