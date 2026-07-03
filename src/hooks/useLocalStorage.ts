"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Persists a value in localStorage, kept in sync across tabs.
 *
 * @param key          - localStorage key
 * @param initialValue - Value to use if key doesn't exist yet
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Write to localStorage whenever value changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      console.warn(`useLocalStorage: failed to write key "${key}"`);
    }
  }, [key, storedValue]);

  // Listen for changes in other tabs
  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleStorageEvent(e: StorageEvent) {
      if (e.key !== key) return;
      if (e.newValue === null) {
        setStoredValue(initialValue);
      } else {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // ignore malformed values
        }
      }
    }

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) =>
        typeof value === "function"
          ? (value as (prev: T) => T)(prev)
          : value
      );
    },
    []
  );

  const removeValue = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}