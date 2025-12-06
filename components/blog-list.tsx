"use client";

import { BlogPost } from "@/lib/types";
import { BlogCard } from "./blog-card";
import { PaginationControls } from "./pagination-controls";
import { Card, CardContent } from "@/components/ui/card";

interface BlogListProps {
  posts: BlogPost[];
  currentPage: number;
  searchQuery?: string;
}

const POSTS_PER_PAGE = 7;

export function BlogList({ posts, currentPage, searchQuery }: BlogListProps) {
  // Filter posts by search query (case-insensitive)
  const filteredPosts = searchQuery
    ? posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  if (filteredPosts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchQuery
                ? `No posts found matching "${searchQuery}"`
                : "No posts available"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-1">
        {paginatedPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      {totalPages > 1 && (
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}

