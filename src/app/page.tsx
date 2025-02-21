import { PostList } from "@/components/post-list"
import { TopNavigation } from "@/components/top-navigation"
import { CategoryList } from "@/components/category-list"
import { TrendingTopics } from "@/components/trending-topics"
import { CreatePostButton } from "@/components/create-post-button"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <TopNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <CategoryList />
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-4xl font-bold">Recent Discussions</h1>
              <CreatePostButton />
            </div>
            <PostList />
          </div>
          
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Welcome to Turing Forum</h2>
                <p className="mb-4 text-muted-foreground">
                  Join our community of developers to discuss, learn, and share knowledge.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>1,234 members online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>10,234 total members</span>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Trending Topics</h2>
                <TrendingTopics />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
