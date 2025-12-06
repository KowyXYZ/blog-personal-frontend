"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={isFirstPage}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Newer posts
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={isLastPage}
      >
        Older posts
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

