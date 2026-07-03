"use client";

import { useState, useEffect } from "react";

/**
 * Returns true when the viewport matches the given CSS media query.
 * Safely handles SSR by defaulting to false until mounted.
 *
 * @param query - A CSS media query string e.g. "(min-width: 768px)"
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);

    return () => mql.removeEventListener("change", handler);
  }, [query]);

  // Avoid hydration mismatch — return false until mounted
  if (!mounted) return false;
  return matches;
}

/**
 * Preset breakpoint hooks matching Tailwind's default breakpoints.
 */
export function useIsMobile(): boolean {
  return !useMediaQuery("(min-width: 768px)");
}

export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px)") &&
    !useMediaQuery("(min-width: 1024px)");
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}