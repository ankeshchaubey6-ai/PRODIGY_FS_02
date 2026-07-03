"use client";

import { useState, useEffect } from "react";

/**
 * Delays updating a value until the user stops typing.
 * Useful for search inputs to avoid firing on every keystroke.
 *
 * @param value  - The value to debounce
 * @param delay  - Delay in milliseconds (default: 350ms)
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}