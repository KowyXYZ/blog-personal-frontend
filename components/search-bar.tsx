"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [localValue, setLocalValue] = useState(searchParams.get("q") || "");
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Sync local state with URL params when they change externally
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== localValue) {
      setLocalValue(urlQuery);
    }
  }, [searchParams]);

  const handleSearch = useCallback(
    (value: string) => {
      setLocalValue(value);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounce URL update
      timeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (value.trim()) {
          params.set("q", value.trim());
          params.set("page", "1"); // Reset to page 1 on search
        } else {
          params.delete("q");
        }

        startTransition(() => {
          router.replace(`/?${params.toString()}`, { scroll: false });
        });
      }, 300); // 300ms debounce
    },
    [router, searchParams]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search posts..."
        value={localValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
        disabled={isPending}
      />
    </div>
  );
}

