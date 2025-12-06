"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogList } from "./BlogList";
import { CreatePostSheet } from "./CreatePostSheet";
import { EditPostSheet } from "./EditPostSheet";
import { DeletePostDialog } from "./DeletePostDialog";
import { BlogPost } from "@/lib/types";
import { getPosts } from "@/lib/blog-api";
import { Plus } from "lucide-react";
import Link from "next/link";

interface AdminPanelProps {
  initialPosts: BlogPost[];
}

const ADMIN_EMAIL = "pavlesimisic@gmail.com";

export function AdminPanel({ initialPosts }: AdminPanelProps) {
  const { user, isLoaded } = useUser();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthorized =
    isLoaded && user && user.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const refreshPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setEditSheetOpen(true);
  };

  const handleDelete = (post: BlogPost) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    refreshPosts();
  };

  const handleEditSuccess = () => {
    refreshPosts();
  };

  const handleDeleteSuccess = () => {
    refreshPosts();
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto mt-20">
            <CardHeader>
              <CardTitle>Not Authorized</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You do not have permission to access this page.
              </p>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - 25% width on desktop */}
          <aside className="lg:w-1/4">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <Link href="/">← Back to Home</Link>
                  <CardTitle>Admin Panel</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setCreateSheetOpen(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Post
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content - 75% width on desktop */}
          <main className="lg:w-3/4 space-y-6">
            <BlogList
              posts={posts}
              currentPage={currentPage}
              searchQuery={searchQuery}
              isAdmin={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>

      <CreatePostSheet
        open={createSheetOpen}
        onOpenChange={setCreateSheetOpen}
        onSuccess={handleCreateSuccess}
      />

      <EditPostSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        post={selectedPost}
        onSuccess={handleEditSuccess}
      />

      <DeletePostDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        post={selectedPost}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
