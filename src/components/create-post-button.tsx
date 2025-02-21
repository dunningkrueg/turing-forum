"use client"

import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import Link from "next/link"

export function CreatePostButton() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link
        href="/create-post"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
      >
        <PencilSquareIcon className="h-4 w-4" />
        Create Post
      </Link>
    </motion.div>
  )
} 