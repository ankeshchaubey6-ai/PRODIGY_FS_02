export function isAuthEnabled() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return Boolean(publishableKey && publishableKey.startsWith("pk_"));
}

export function isDevAuthBypassed() {
  return !isAuthEnabled();
}
