import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug } from "@/lib/blog-api";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>Published {formatDate(post.createdAt)}</span>
                {post.updatedAt && (
                  <>
                    <span>•</span>
                    <span>Updated {formatDate(post.updatedAt)}</span>
                  </>
                )}
                <Badge variant="secondary" className="ml-auto">
                  {post.averageReadTime}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-7">
                {post.content}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

