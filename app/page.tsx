import { SidebarProfile } from "@/components/sidebar-profile";
import { SearchBar } from "@/components/search-bar";
import { BlogList } from "@/components/blog/BlogList";
import { getPosts } from "@/lib/blog-api";

interface HomeProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const searchQuery = params.q || "";

  // Fetch posts from API (backend already sorts by CreatedAt desc)
  const posts = await getPosts().catch(() => []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - 25% width on desktop */}
          <aside className="lg:w-1/4">
            <div className="sticky top-8">
              <SidebarProfile />
            </div>
          </aside>

          {/* Main Content - 75% width on desktop */}
          <main className="lg:w-3/4 space-y-6">
            <div className="space-y-4">
              <SearchBar />
            </div>
            <BlogList
              posts={posts}
              currentPage={currentPage}
              searchQuery={searchQuery}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
