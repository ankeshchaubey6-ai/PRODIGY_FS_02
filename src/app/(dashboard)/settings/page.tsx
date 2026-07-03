"use client";

import { useUser } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Moon,
  Sun,
  Monitor,
  Bell,
  Shield,
  Palette,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { isAuthEnabled } from "@/lib/auth-mode";

type ThemeOption = "light" | "dark" | "system";

const themeOptions: {
  value: ThemeOption;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
    description: "Always use light mode",
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
    description: "Always use dark mode",
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
    description: "Follow system preference",
  },
];

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center",
              isActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40 hover:bg-muted/30"
            )}
          >
            <Icon
              className={cn(
                "w-5 h-5",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            />
            <div>
              <p
                className={cn(
                  "text-xs font-medium",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {option.label}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
                {option.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function AuthSettingsPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "notifications" | "security">(
    "profile"
  );

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "appearance" as const, label: "Appearance", icon: Palette },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "security" as const, label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences."
      />

      <div className="flex flex-col sm:flex-row gap-6">
        {/* ── Sidebar tabs ─────────────────────── */}
        <nav className="sm:w-48 flex-shrink-0">
          <ul className="flex sm:flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id} className="flex-1 sm:flex-none">
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Tab content ──────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Profile tab — Clerk UserProfile */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">
                    Account Profile
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Manage your Clerk account details, email, and password.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {isLoaded && user ? (
                    <div className="space-y-4">
                      {/* Current user summary */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <img
                          src={user.imageUrl}
                          alt={user.fullName ?? "User"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.fullName ?? "No name set"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.emailAddresses[0]?.emailAddress}
                          </p>
                        </div>
                      </div>

                      {/* Clerk UserProfile widget */}
                      <div className="overflow-hidden rounded-lg">
                        <UserProfile
                          appearance={{
                            elements: {
                              rootBox: "w-full",
                              card: "shadow-none border-0 p-0 bg-transparent",
                              navbar: "hidden",
                              pageScrollBox: "p-0",
                              profileSectionPrimaryButton:
                                "text-primary hover:text-primary/80",
                              formButtonPrimary:
                                "bg-primary hover:bg-primary/90 text-primary-foreground",
                              formFieldInput:
                                "border-border bg-background text-foreground",
                              headerTitle: "text-foreground text-sm font-semibold",
                              headerSubtitle: "text-muted-foreground text-xs",
                            },
                          }}
                          routing="hash"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appearance tab */}
          {activeTab === "appearance" && (
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Appearance
                </CardTitle>
                <CardDescription className="text-xs">
                  Customise how EMS looks on your device.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-6">
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    Theme
                  </p>
                  <ThemeSelector />
                </div>

                <Separator />

                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Interface Density
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Control the spacing of the interface elements.
                  </p>
                  <div className="flex gap-2">
                    {["Comfortable", "Compact"].map((density) => (
                      <Button
                        key={density}
                        variant="outline"
                        size="sm"
                        className={cn(
                          density === "Comfortable" &&
                            "border-primary text-primary bg-primary/5"
                        )}
                      >
                        {density}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications tab */}
          {activeTab === "notifications" && (
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Notifications
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure how you receive alerts and updates.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 divide-y divide-border">
                <SettingRow
                  icon={Bell}
                  title="New employee added"
                  description="Notify when a new employee is created"
                >
                  <ToggleSwitch defaultChecked />
                </SettingRow>
                <SettingRow
                  icon={Bell}
                  title="Employee status changes"
                  description="Notify on termination, leave, or reactivation"
                >
                  <ToggleSwitch defaultChecked />
                </SettingRow>
                <SettingRow
                  icon={Bell}
                  title="Department updates"
                  description="Notify when departments are created or removed"
                >
                  <ToggleSwitch />
                </SettingRow>
                <SettingRow
                  icon={Bell}
                  title="Weekly summary"
                  description="Receive a weekly digest of workforce changes"
                >
                  <ToggleSwitch />
                </SettingRow>
              </CardContent>
            </Card>
          )}

          {/* Security tab */}
          {activeTab === "security" && (
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Security
                </CardTitle>
                <CardDescription className="text-xs">
                  Manage your account security and active sessions.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 divide-y divide-border">
                <SettingRow
                  icon={Shield}
                  title="Two-factor authentication"
                  description="Add an extra layer of security to your account"
                >
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </SettingRow>
                <SettingRow
                  icon={Shield}
                  title="Active sessions"
                  description="View and manage devices signed in to your account"
                >
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </SettingRow>
                <SettingRow
                  icon={Shield}
                  title="Sign out everywhere"
                  description="Immediately sign out of all active sessions"
                >
                  <Button variant="destructive" size="sm">
                    Sign out all
                  </Button>
                </SettingRow>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function DevSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Manage your application preferences in development mode."
      />

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Development Mode</CardTitle>
          <CardDescription className="text-xs">
            Clerk account settings are disabled locally to keep the app usable without authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Theme</p>
            <ThemeSelector />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return isAuthEnabled() ? <AuthSettingsPage /> : <DevSettingsPage />;
}

// ── Simple toggle switch component ───────────────────────
function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => setChecked(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}
