"use client"

import { motion } from "framer-motion"
import { FireIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

const trendingTopics = [
  {
    id: "1",
    title: "Next.js 14 vs Remix: A Deep Dive Comparison",
    views: 1234,
    category: "Web Development",
  },
  {
    id: "2",
    title: "The Future of AI in Software Development",
    views: 987,
    category: "AI & ML",
  },
  {
    id: "3",
    title: "Rust vs Go: System Programming in 2024",
    views: 856,
    category: "Programming",
  },
  {
    id: "4",
    title: "DevOps Best Practices with Kubernetes",
    views: 743,
    category: "DevOps",
  },
  {
    id: "5",
    title: "Breaking into Tech: A Complete Guide",
    views: 654,
    category: "Career",
  },
]

export function TrendingTopics() {
  return (
    <div className="space-y-4">
      {trendingTopics.map((topic, index) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link
            href={`/post/${topic.id}`}
            className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20">
              <FireIcon className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h3 className="line-clamp-2 text-sm font-medium group-hover:text-primary">
                {topic.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{topic.category}</span>
                <span>•</span>
                <span>{topic.views.toLocaleString()} views</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
} 