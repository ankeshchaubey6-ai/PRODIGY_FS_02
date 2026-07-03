"use client";

import { UserButton } from "@clerk/nextjs";

export default function AuthUserButton() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-8 h-8",
          userButtonPopoverCard: "shadow-lg border border-border",
          userButtonPopoverActionButton:
            "text-foreground hover:bg-muted",
          userButtonPopoverActionButtonText: "text-sm",
          userButtonPopoverFooter: "hidden",
        },
      }}
      afterSignOutUrl="/sign-in"
    />
  );
}
