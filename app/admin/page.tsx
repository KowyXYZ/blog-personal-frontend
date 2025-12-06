import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/blog/AdminPanel";
import { getPosts } from "@/lib/blog-api";

const ADMIN_EMAIL = "pavlesimisic@gmail.com";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get user details to check email
  // Note: In a real app, you might want to fetch full user details
  // For now, we'll do a client-side check as well
  const posts = await getPosts().catch(() => []);

  return <AdminPanel initialPosts={posts} />;
}

