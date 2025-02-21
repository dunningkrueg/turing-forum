"use client"

import { ChatBubbleLeftIcon, HeartIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

type Post = {
  id: string
  title: string
  author: {
    name: string
    image: string
    role: string
  }
  createdAt: string
  commentCount: number
  likeCount: number
}

const dummyPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with TypeScript and React",
    author: {
      name: "John Doe",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      role: "RESPECTED",
    },
    createdAt: "2024-03-20T10:00:00Z",
    commentCount: 5,
    likeCount: 12,
  },
  {
    id: "2",
    title: "Best Practices for Modern Web Development",
    author: {
      name: "Jane Smith",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      role: "ENTHUSIAST",
    },
    createdAt: "2024-03-19T15:30:00Z",
    commentCount: 3,
    likeCount: 8,
  },
]

export function PostList() {
  return (
    <div className="space-y-4">
      {dummyPosts.map((post) => (
        <article
          key={post.id}
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
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ChatBubbleLeftIcon className="h-4 w-4" />
              {post.commentCount} comments
            </div>
            <div className="flex items-center gap-1">
              <HeartIcon className="h-4 w-4" />
              {post.likeCount} likes
            </div>
          </div>
        </article>
      ))}
    </div>
  )
} 