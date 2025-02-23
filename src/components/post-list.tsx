"use client"

import { ChatBubbleLeftIcon, HeartIcon, TagIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Post = {
  id: string
  title: string
  content: string
  category: string
  tags: Array<{
    name: string
    slug: string
  }>
  author: {
    name: string
    image: string
    role: string
  }
  createdAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  isLiked?: boolean
}

type PostListProps = {
  category?: string
  tag?: string
  sort?: "newest" | "popular" | "trending" | "oldest"
}

export function PostList({ category, tag, sort = "newest" }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [category, tag, sort, page])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sort,
        ...(category && { category }),
        ...(tag && { tag }),
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?${params}`)
      const data = await response.json()

      if (page === 1) {
        setPosts(data.posts)
      } else {
        setPosts((prev) => [...prev, ...data.posts])
      }

      setHasMore(data.posts.length === 10)
      setError("")
    } catch (err) {
      console.error("Failed to fetch posts:", err)
      setError("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/like`, {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
                  isLiked: !post.isLiked,
                }
              : post
          )
        )
      }
    } catch (err) {
      console.error("Failed to like post:", err)
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-destructive/10 p-4 text-destructive">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.image}
                  alt={post.author.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">
                    <Link href={`/post/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Posted by {post.author.name}{" "}
                    <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {post.author.role}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleLike(post.id)}
                className={`rounded-full p-2 transition-colors ${
                  post.isLiked
                    ? "text-red-500 hover:bg-red-500/10"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {post.isLiked ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.content}</div>

            {post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs text-accent-foreground transition-colors hover:bg-accent/80"
                  >
                    <TagIcon className="h-3 w-3" />
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ChatBubbleLeftIcon className="h-4 w-4" />
                {post.commentCount} comments
              </div>
              <div className="flex items-center gap-1">
                <HeartIcon className="h-4 w-4" />
                {post.likeCount} likes
              </div>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </motion.article>
        ))}
      </AnimatePresence>

      {loading && (
        <div className="flex justify-center p-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!loading && hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="w-full rounded-lg border bg-accent p-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/80"
        >
          Load More
        </button>
      )}
    </div>
  )
}