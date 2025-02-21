"use client"

import { motion } from "framer-motion"
import {
  CodeBracketIcon,
  CommandLineIcon,
  CpuChipIcon,
  CubeIcon,
  RocketLaunchIcon,
  ServerIcon,
  WindowIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"

const categories = [
  {
    name: "Web Development",
    icon: WindowIcon,
    href: "/category/web-development",
    color: "bg-blue-500/10 text-blue-500",
    count: 234,
  },
  {
    name: "Mobile Development",
    icon: CubeIcon,
    href: "/category/mobile-development",
    color: "bg-purple-500/10 text-purple-500",
    count: 156,
  },
  {
    name: "DevOps & Cloud",
    icon: ServerIcon,
    href: "/category/devops",
    color: "bg-orange-500/10 text-orange-500",
    count: 189,
  },
  {
    name: "AI & Machine Learning",
    icon: CpuChipIcon,
    href: "/category/ai-ml",
    color: "bg-green-500/10 text-green-500",
    count: 145,
  },
  {
    name: "Programming Languages",
    icon: CodeBracketIcon,
    href: "/category/programming",
    color: "bg-red-500/10 text-red-500",
    count: 278,
  },
  {
    name: "Tools & Resources",
    icon: CommandLineIcon,
    href: "/category/tools",
    color: "bg-yellow-500/10 text-yellow-500",
    count: 167,
  },
  {
    name: "Career & Growth",
    icon: RocketLaunchIcon,
    href: "/category/career",
    color: "bg-pink-500/10 text-pink-500",
    count: 123,
  },
]

export function CategoryList() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
      {categories.map((category, index) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link
            href={category.href}
            className="group flex flex-col items-center rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg"
          >
            <div className={`mb-2 rounded-full p-2 ${category.color}`}>
              <category.icon className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-medium">{category.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{category.count} discussions</p>
          </Link>
        </motion.div>
      ))}
    </div>
  )
} 