import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function truncateContent(content: string, maxLength: number = 150): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trim() + "...";
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-xl font-semibold hover:underline">
              {post.title}
            </h3>
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{formatDate(post.createdAt)}</span>
          {post.updatedAt && (
            <>
              <span>•</span>
              <span>Updated {formatDate(post.updatedAt)}</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          {truncateContent(post.content)}
        </p>
        <Badge variant="secondary">{post.averageReadTime}</Badge>
      </CardContent>
      <CardFooter>
        <Link
          href={`/blog/${post.slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Read more →
        </Link>
      </CardFooter>
    </Card>
  );
}

