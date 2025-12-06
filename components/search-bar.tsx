"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

interface SearchBarProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  initialValue,
  onSearch,
  placeholder = "Search posts... (Press Enter to search)",
}: SearchBarProps) {
  // Hooks must always be called, but we'll conditionally use them
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Use initialValue if provided (for admin), otherwise use URL params (for home page)
  const getInitialValue = () => {
    if (initialValue !== undefined) return initialValue;
    if (searchParams) return searchParams.get("q") || "";
    return "";
  };

  const [localValue, setLocalValue] = useState(() => {
    if (initialValue !== undefined) return initialValue;
    if (searchParams) return searchParams.get("q") || "";
    return "";
  });

  // Sync local state with URL params when they change externally (only for URL-based search)
  useEffect(() => {
    if (onSearch) return; // Skip URL sync if using callback-based search
    const urlQuery = searchParams?.get("q") || "";
    if (urlQuery !== localValue) {
      setLocalValue(urlQuery);
    }
  }, [searchParams, onSearch]);

  // Sync with initialValue prop changes (for admin)
  useEffect(() => {
    if (initialValue !== undefined && initialValue !== localValue) {
      setLocalValue(initialValue);
    }
  }, [initialValue]);

  // Update URL only when user explicitly searches (Enter key or button click)
  const performSearch = useCallback(
    (value: string) => {
      if (onSearch) {
        // Use callback if provided (for admin)
        onSearch(value.trim());
      } else {
        // Use URL params (for home page)
        const params = new URLSearchParams(searchParams?.toString() || "");

        if (value.trim()) {
          params.set("q", value.trim());
          params.set("page", "1"); // Reset to page 1 on search
        } else {
          params.delete("q");
        }

        startTransition(() => {
          router?.replace(`/?${params.toString()}`, { scroll: false });
        });
      }
    },
    [router, searchParams, onSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch(localValue);
      }
    },
    [localValue, performSearch]
  );

  const handleSearchClick = useCallback(() => {
    performSearch(localValue);
  }, [localValue, performSearch]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-10 pr-10"
        disabled={isPending}
      />
      <button
        onClick={handleSearchClick}
        disabled={isPending}
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
}
